"""
Educational timeline routes for kids' financial learning app
HTTP layer only - business logic delegated to services
"""

from flask import Blueprint, request, jsonify
from src.services.timeline_service import timeline_service

timelines_bp = Blueprint('timelines', __name__)

@timelines_bp.route('/', methods=['POST'])
def create_simple_timeline():
    """
    Create a simple educational timeline for kids
    Body: { name, choices, profileText }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        timeline = timeline_service.create_simple_timeline(data)
        return jsonify(timeline)

    except Exception as e:
        return jsonify({'error': f'Failed to create timeline: {str(e)}'}), 500

@timelines_bp.route('/', methods=['GET'])
def list_timelines():
    """List all educational timelines"""
    timeline_list = timeline_service.list_timelines()
    return jsonify(timeline_list)

@timelines_bp.route('/create-with-registration', methods=['POST'])
def create_timeline_with_registration():
    """
    Create complete educational timeline with Investease registration
    Full pipeline: Frontend → Cohere → Investease
    Body: { name, email, cashAmount, portfolios, profileText, choices }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate required fields for kids' profiles
        if not data.get('name'):
            return jsonify({'error': 'Child\'s name is required'}), 400

        result = timeline_service.create_complete_timeline(data)
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': f'Failed to create educational timeline: {str(e)}'}), 500

@timelines_bp.route('/<timeline_id>', methods=['GET'])
def get_timeline(timeline_id):
    """Get a specific educational timeline"""
    timeline = timeline_service.get_timeline(timeline_id)
    if not timeline:
        return jsonify({'error': 'Timeline not found'}), 404
    return jsonify(timeline)