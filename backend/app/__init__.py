from flask import Flask
from .config import Config
from .routes.ai_api import ai_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.register_blueprint(ai_bp)
    return app
    