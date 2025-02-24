from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask import jsonify

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({
        'error': 'Invalid token',
        'message': str(error)
    }), 401

@jwt.unauthorized_loader
def unauthorized_callback(error):
    return jsonify({
        'error': 'No token provided',
        'message': str(error)
    }), 401 