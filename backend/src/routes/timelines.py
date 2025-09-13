"""
Timelines router (server-side persistence for sharing / visiting).
This simple implementation keeps timelines in memory for the hackathon.
For production, replace with DB persistence.
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
from src.services.market_simulator import simulate_timeline
from src.services.cohere import analyze_profile

timelines_bp = Blueprint('timelines', __name__)

# Memory store: { id: { id, owner, name, choices, createdAt, meta, simulated } }
timelines = {}

@timelines_bp.route('/', methods=['POST'])
def create_timeline():
    """
    Create a timeline (also simulates outcome)
    Body: { owner, name, choices: [..], profileText }
    """
    try:
        print("=== Timeline Creation Request ===")
        data = request.get_json()
        print(f"Received data: {data}")
        
        owner = data.get('owner', 'anon') if data else 'anon'
        name = data.get('name', 'Untitled Life') if data else 'Untitled Life'
        choices = data.get('choices', []) if data else []
        profile_text = data.get('profileText', '') if data else ''
        
        print(f"Parsed - Owner: {owner}, Name: {name}, Choices: {choices}")
        
        timeline_id = str(uuid.uuid4())
        seed = timeline_id
        
        print("Starting simulation...")
        simulation = simulate_timeline(seed, choices)
        print(f"Simulation result: {simulation}")
        
        print("Starting profile analysis...")
        analysis = analyze_profile(profile_text)
        print(f"Analysis result: {analysis}")
        
        timeline = {
            'id': timeline_id,
            'owner': owner,
            'name': name,
            'choices': choices,
            'profileText': profile_text,
            'createdAt': datetime.now().isoformat(),
            'simulated': simulation,
            'analysis': analysis
        }
        
        timelines[timeline_id] = timeline
        print(f"Timeline created successfully: {timeline_id}")
        return jsonify(timeline)
        
    except Exception as e:
        print(f"Error creating timeline: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'server error: {str(e)}'}), 500

@timelines_bp.route('/', methods=['GET'])
def list_timelines():
    """List public timelines (all in memory)"""
    timeline_list = [
        {
            'id': t['id'],
            'name': t['name'],
            'owner': t['owner'],
            'createdAt': t['createdAt'],
            'simulated': t['simulated']
        }
        for t in timelines.values()
    ]
    return jsonify(timeline_list)

@timelines_bp.route('/<timeline_id>', methods=['GET'])
def get_timeline(timeline_id):
    """Get single timeline"""
    timeline = timelines.get(timeline_id)
    if not timeline:
        return jsonify({'error': 'not found'}), 404
    return jsonify(timeline)