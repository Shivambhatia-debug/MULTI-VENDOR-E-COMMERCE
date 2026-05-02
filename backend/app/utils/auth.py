from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    try:
        # Bcrypt has a strict 72-byte limit for the plain password.
        # We encode to utf-8 and truncate to 72 bytes.
        if not plain_password:
            return False
            
        password_bytes = plain_password.encode('utf-8')
        safe_password = password_bytes[:72].decode('utf-8', errors='ignore')
        
        print(f"DEBUG: Verifying password (len: {len(password_bytes)} bytes, truncated to 72)")
        return pwd_context.verify(safe_password, hashed_password)
    except Exception as e:
        print(f"VERIFY_PASSWORD_ERROR: {str(e)}")
        # If it still fails, it might be the hashed_password format
        return False

def get_password_hash(password):
    safe_password = password[:72] if password else ""
    return pwd_context.hash(safe_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
