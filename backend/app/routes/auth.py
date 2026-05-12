from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import EmailStr
from typing import Optional
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from app.config import settings
from app.database import get_database
from app.models.user import UserCreate, UserOut, UserInDB
from app.utils.auth import get_password_hash, verify_password, create_access_token
from app.utils.email import send_otp_email
from datetime import datetime, timedelta
import random
import string
from bson import ObjectId

router = APIRouter(tags=["auth"], redirect_slashes=False)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError as e:
        print(f"DEBUG AUTH: JWT DECODE ERROR - {str(e)}")
        raise credentials_exception
    
    db = await get_database()
    user = await db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

@router.post("/send-otp")
async def send_otp(email: EmailStr = Query(...)):
    otp = generate_otp()
    db = await get_database()
    
    # Store OTP in DB with expiration (10 mins)
    expire_at = datetime.utcnow() + timedelta(minutes=10)
    await db.otps.update_one(
        {"email": email},
        {"$set": {"otp": otp, "expire_at": expire_at}},
        upsert=True
    )
    
    # Send Email
    success = send_otp_email(email, otp)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send OTP email")
        
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp")
async def verify_otp(email: EmailStr = Query(...), otp: str = Query(...)):
    db = await get_database()
    otp_record = await db.otps.find_one({"email": email})
    
    if not otp_record:
        raise HTTPException(status_code=400, detail="No OTP record found for this email")
        
    if otp_record["otp"] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    if datetime.utcnow() > otp_record["expire_at"]:
        raise HTTPException(status_code=400, detail="OTP expired")
        
    # Mark as verified or just return success
    # Optionally, we could delete the OTP record here, or keep it for the next step (reset password/register)
    return {"message": "OTP verified successfully"}

@router.post("/forgot-password")
async def forgot_password(email: EmailStr = Query(...)):
    db = await get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return await send_otp(email)

@router.post("/reset-password")
async def reset_password(email: EmailStr = Query(...), otp: str = Query(...), new_password: str = Query(...)):
    # First verify OTP
    await verify_otp(email, otp)
    
    db = await get_database()
    hashed_password = get_password_hash(new_password)
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"password_hash": hashed_password}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update password")
        
    # Delete OTP after successful reset
    await db.otps.delete_one({"email": email})
    
    return {"message": "Password reset successfully"}

@router.post("/register", response_model=UserOut)
@router.post("/register/", response_model=UserOut)
async def register(user_in: UserCreate, otp: str, business_name: Optional[str] = None):
    try:
        # Verify OTP first
        await verify_otp(user_in.email, otp)
        
        db = await get_database()
        if await db.users.find_one({"email": user_in.email}):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_dict = user_in.dict()
        password = user_dict.pop("password")
        user_dict["password_hash"] = get_password_hash(password)
        user_dict["created_at"] = datetime.utcnow()
        
        # Add 15-day free trial for merchants
        if user_dict.get("role") == "merchant":
            user_dict["trial_start"] = datetime.utcnow()
            user_dict["trial_end"] = datetime.utcnow() + timedelta(days=15)
            user_dict["subscription_status"] = "trial"
        
        result = await db.users.insert_one(user_dict)
        user_id = str(result.inserted_id)
        user_dict["id"] = user_id

        # Create Merchant Profile if role is merchant
        if user_dict["role"] == "merchant" and business_name:
            merchant_dict = {
                "user_id": user_id,
                "name": business_name,
                "email": user_dict["email"],
                "status": "Active",
                "stores": 0,
                "revenue": "0 QAR",
                "plan": user_dict["plan"],
                "joined": datetime.utcnow().strftime("%Y-%m-%d"),
                "category": "Uncategorized"
            }
            await db.merchants.insert_one(merchant_dict)
        
        # Pop _id if it exists to avoid serialization issues
        user_dict.pop("_id", None)
        
        return user_dict
    except Exception as e:
        print(f"REGISTRATION ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
@router.post("/login/")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        db = await get_database()
        user = await db.users.find_one({"email": form_data.username})
        
        if not user:
            print(f"LOGIN FAILED: User {form_data.username} not found")
            raise HTTPException(status_code=401, detail="Incorrect email or password")
            
        password_hash = user.get("password_hash")
        if not password_hash:
            # Fallback for old schema where it might be just 'password'
            password_hash = user.get("password")
            
        if not password_hash or not verify_password(form_data.password, password_hash):
            print(f"LOGIN FAILED: Password mismatch for {form_data.username}")
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        
        access_token = create_access_token(data={"sub": user["email"]})
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"LOGIN CRITICAL ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    # Create a copy to avoid mutating the cached object if any
    user_data = current_user.copy()
    user_data["id"] = str(user_data["_id"])
    user_data.pop("_id", None)
    return user_data
