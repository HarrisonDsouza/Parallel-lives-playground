"""
Centralized configuration for Parallel Lives Backend
"""
import os
import secrets
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(32))
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    PORT = int(os.getenv('PORT', 4000))

    # CORS Configuration
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')

    # AI Service Configuration
    COHERE_API_KEY = os.getenv('COHERE_API_KEY')
    COHERE_MODEL = os.getenv('COHERE_MODEL', 'command-light')

    # External API Configuration
    AWS_JWT_TOKEN = os.getenv('AWS_JWT_TOKEN')
    INVESTEASE_API_ENDPOINT = os.getenv(
        'INVESTEASE_API_ENDPOINT',
        'https://2dcq63co40.execute-api.us-east-1.amazonaws.com/dev/clients'
    )

    # Validation
    @classmethod
    def validate_config(cls):
        """Validate required configuration"""
        missing = []

        if not cls.COHERE_API_KEY:
            missing.append('COHERE_API_KEY')
        if not cls.AWS_JWT_TOKEN:
            missing.append('AWS_JWT_TOKEN')

        return missing