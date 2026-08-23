import sys
import os

# Add the project root to the python path so the backend module can be found
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.main import app
