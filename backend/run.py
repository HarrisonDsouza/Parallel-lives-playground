#!/usr/bin/env python3

import os
import sys
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Import routes with absolute imports
from src.routes.timelines import timelines_bp
from src.routes.social import social_bp

# Register blueprints
app.register_blueprint(timelines_bp, url_prefix='/api/timelines')
app.register_blueprint(social_bp, url_prefix='/api/social')

@app.route('/health')
def health():
    return {'ok': True}

@app.route('/')
def root():
    return {'message': 'Parallel Lives Backend API', 'status': 'running'}

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
    port = int(os.environ.get('PORT', 4000))
    print(f'Backend + sockets running on {port}')
    socketio.run(app, host='0.0.0.0', port=port, debug=True)
