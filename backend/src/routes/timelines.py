"""
Timelines router (server-side persistence for sharing / visiting).
This simple implementation keeps timelines in memory for the hackathon.
For production, replace with DB persistence.
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
from src.services.market_simulator import simulate_timeline
from src.services.cohere import analyze_profile, generate_client_data
from src.services.aws_client import register_client_with_aws

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

@timelines_bp.route('/create-with-registration', methods=['POST'])
def create_timeline_with_registration():
    """
    Create a timeline with client registration to AWS API
    Body: { name, email, cashAmount, portfolios, profileText }
    """
    try:
        print("=== Timeline Creation with Registration Request ===")
        data = request.get_json()
        print(f"Received data: {data}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Extract required user data
        user_data = {
            'name': data.get('name', ''),
            'email': data.get('email', ''),
            'cashAmount': data.get('cashAmount', 10000),
            'portfolios': data.get('portfolios', [])
        }
        
        # Validate required fields
        if not user_data['name'] or not user_data['email']:
            return jsonify({'error': 'Name and email are required'}), 400
        
        print(f"User data: {user_data}")
        
        # Generate enhanced client data using Cohere AI
        print("Generating client data with Cohere AI...")
        client_data = generate_client_data(user_data)
        print(f"Generated client data: {client_data}")
        
        # Register client with AWS API
        print("Registering client with AWS API...")
        aws_response = register_client_with_aws(client_data)
        print(f"AWS response: {aws_response}")
        
        if not aws_response['success']:
            return jsonify({
                'error': 'Failed to register client with AWS API',
                'details': aws_response['error']
            }), aws_response['status_code']
        
        # Create timeline with the enhanced data
        timeline_id = str(uuid.uuid4())
        profile_text = data.get('profileText', f"User profile for {user_data['name']}")
        
        # Analyze profile
        print("Analyzing profile...")
        analysis = analyze_profile(profile_text)
        print(f"Profile analysis: {analysis}")
        
        # Simulate timeline (using empty choices for now)
        choices = data.get('choices', [])
        simulation = simulate_timeline(timeline_id, choices)
        
        timeline = {
            'id': timeline_id,
            'owner': user_data['name'],
            'name': f"{user_data['name']}'s Financial Timeline",
            'choices': choices,
            'profileText': profile_text,
            'createdAt': datetime.now().isoformat(),
            'clientData': client_data,
            'awsRegistration': aws_response['data'],
            'analysis': analysis,
            'simulated': simulation
        }
        
        timelines[timeline_id] = timeline
        print(f"Timeline created successfully: {timeline_id}")
        
        return jsonify({
            'success': True,
            'timeline': timeline,
            'message': 'Timeline created and client registered successfully!'
        })
        
    except Exception as e:
        print(f"Error creating timeline with registration: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'server error: {str(e)}'}), 500

@timelines_bp.route('/<timeline_id>', methods=['GET'])
def get_timeline(timeline_id):
    """Get single timeline"""
    timeline = timelines.get(timeline_id)
    if not timeline:
        return jsonify({'error': 'not found'}), 404
    return jsonify(timeline)