from app import create_app
import time
import os
import logging
from sqlalchemy.exc import OperationalError
from flask_sqlalchemy import SQLAlchemy

app = create_app()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Retry database connection if it fails
def connect_to_database():
    max_retries = 5
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            with app.app_context():
                db = SQLAlchemy(app)
                db.engine.connect()
                logger.info("Successfully connected to the database")
                return True
        except OperationalError as e:
            retry_count += 1
            logger.warning(f"Database connection attempt {retry_count} failed: {e}")
            if retry_count < max_retries:
                wait_time = 2 ** retry_count  # Exponential backoff
                logger.info(f"Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                logger.error("Failed to connect to the database after multiple attempts")
                return False

if __name__ == '__main__':
    # Only try to connect to the database if we're running directly
    # (not when imported by a WSGI server)
    if os.environ.get('FLASK_DEBUG') == '1':
        connect_to_database()
    
    app.run(debug=True, host='0.0.0.0') 