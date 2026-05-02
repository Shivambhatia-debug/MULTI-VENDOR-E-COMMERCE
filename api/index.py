import os
import sys

# Add the project root to the path so we can import from the backend folder
# Vercel's current working directory is the root of the project
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.main import app

# This is for Vercel to handle the app correctly
app.root_path = "/_backend"
