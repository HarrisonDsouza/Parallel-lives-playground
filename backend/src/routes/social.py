"""
Minimal social routes:
- /api/social/friends -> mock friend list
- /api/social/share/:timelineId -> returns share link (id) for friends
"""

from flask import Blueprint, request, jsonify
import uuid

social_bp = Blueprint('social', __name__)

@social_bp.route('/friends', methods=['GET'])
def get_friends():
    """Return mocked friends for demo. In a real app, wire to accounts."""
    friends = [
        {'id': 'friend-1', 'name': 'Ava'},
        {'id': 'friend-2', 'name': 'Noah'},
        {'id': 'friend-3', 'name': 'Maya'}
    ]
    return jsonify(friends)

@social_bp.route('/share/<timeline_id>', methods=['POST'])
def share_timeline(timeline_id):
    """For demo, sharing just returns the timeline ID (the client will request /api/timelines/:id)"""
    return jsonify({
        'shareId': timeline_id,
        'url': f'/api/timelines/{timeline_id}'
    })