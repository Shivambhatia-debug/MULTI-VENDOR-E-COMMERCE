import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.utils.email import send_otp_email
from app.config import settings

if __name__ == "__main__":
    print(f"DEBUG: Host={settings.SMTP_HOST}, Port={settings.SMTP_PORT}, User={settings.SMTP_USER}")
    print(f"DEBUG: Password length={len(settings.SMTP_PASSWORD)}")
    email = "mavihs04v@gmail.com"
    otp = "123456"
    print(f"Testing email to {email}...")
    success = send_otp_email(email, otp)
    if success:
        print("SUCCESS: Email sent successfully!")
    else:
        print("FAILED: Check your credentials or logs.")
