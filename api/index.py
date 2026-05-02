import os
import sys

# Add the project root to the path so we can import from the backend folder
path = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(path, "..", "backend"))

from app.main import app
