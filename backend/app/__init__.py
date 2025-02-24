from flask import Flask
from flask_cors import CORS
from config import Config
from app.extensions import db, jwt, bcrypt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    # Import and register blueprints
    from app.routes.auth import auth_bp
    from app.routes.challenges import challenges_bp
    from app.routes.code_execution import code_execution_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(challenges_bp, url_prefix='/api/challenges')
    app.register_blueprint(code_execution_bp, url_prefix='/api')

    # Create database tables
    with app.app_context():
        db.create_all()

    return app 