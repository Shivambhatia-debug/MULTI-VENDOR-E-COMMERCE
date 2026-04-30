from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from ..config import settings
from ..database import get_database
from ..models.user import UserCreate, UserOut, UserInDB
from ..utils.auth import get_password_hash, verify_password, create_access_token
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["auth"], redirect_slashes=False)
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

@router.post("/register", response_model=UserOut)
@router.post("/register/", response_model=UserOut)
async def register(user_in: UserCreate, business_name: Optional[str] = None):
    try:
        db = await get_database()
        if await db.users.find_one({"email": user_in.email}):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_dict = user_in.dict()
        password = user_dict.pop("password")
        user_dict["password_hash"] = get_password_hash(password)
        user_dict["created_at"] = datetime.utcnow()
        
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
    db = await get_database()
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    # Create a copy to avoid mutating the cached object if any
    user_data = current_user.copy()
    user_data["id"] = str(user_data["_id"])
    user_data.pop("_id", None)
    return user_data
