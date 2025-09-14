#!/usr/bin/env python3
"""
Parallel Lives Backend - Educational Financial App for Kids
Single Flask application entry point with proper security configuration
"""

import os
import sys
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.config import Config

# Validate configuration on startup
missing_config = Config.validate_config()
if missing_config:
    print("⚠️ WARNING: Missing configuration variables:")
    for var in missing_config:
        print(f"   - {var}")
    print("The app will use fallback/mock data for missing services.")
    print()

app = Flask(__name__)
app.config['SECRET_KEY'] = Config.SECRET_KEY

# Configure CORS for kids' app security
CORS(app, origins=Config.CORS_ORIGINS)

# Configure SocketIO with restricted origins
socketio = SocketIO(app, cors_allowed_origins=Config.CORS_ORIGINS)

# Import routes with absolute imports
from src.routes.timelines import timelines_bp
from src.routes.social import social_bp

# Register blueprints
app.register_blueprint(timelines_bp, url_prefix='/api/timelines')
app.register_blueprint(social_bp, url_prefix='/api/social')

@app.route('/health')
def health():
    """Health check endpoint"""
    return {'ok': True, 'service': 'Educational Financial App for Kids'}

@app.route('/')
def root():
    """Root endpoint with app information"""
    return {
        'message': 'Parallel Lives Educational Backend API',
        'status': 'running',
        'description': 'Financial education platform for kids',
        'version': '2.0.0-refactored'
    }

# Socket.IO events
@socketio.on('connect')
def handle_connect():
    print(f'Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join-room')
def handle_join_room(room):
    print(f'Client joined room: {room}')

@socketio.on('spawn-timeline')
def handle_spawn_timeline(data):
    emit('timeline-spawned', data, broadcast=True)

@socketio.on('update-timeline')
def handle_update_timeline(data):
    emit('timeline-updated', data, broadcast=True)

if __name__ == '__main__':
    print("🎓 Starting Parallel Lives Educational Backend")
    print(f"📚 Financial education platform for kids")
    print(f"🔧 Configuration: {len(Config.CORS_ORIGINS)} allowed origins")
    print(f"🚀 Server starting on port {Config.PORT}")

    socketio.run(
        app,
        host='0.0.0.0',
        port=Config.PORT,
        debug=Config.DEBUG
    )
