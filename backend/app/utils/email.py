import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

def send_email(to_email: str, subject: str, body: str):
    """Sends an email using the SMTP settings from config."""
    try:
        msg = MIMEMultipart()
        msg['From'] = settings.SMTP_FROM
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'html'))
        
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
            
        return True
    except Exception as e:
        print(f"EMAIL_SEND_ERROR: {str(e)}")
        return False

def send_otp_email(to_email: str, otp: str):
    """Sends a standardized OTP email."""
    subject = "Golalita - Your Verification Code"
    body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 40px; border-radius: 10px;">
                <h2 style="color: #333;">Verify Your Email</h2>
                <p>Hello,</p>
                <p>Thank you for choosing Golalita. Please use the following One-Time Password (OTP) to complete your verification:</p>
                <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">{otp}</span>
                </div>
                <p>This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
                <p>Regards,<br>Team Golalita</p>
            </div>
        </body>
    </html>
    """
    return send_email(to_email, subject, body)
