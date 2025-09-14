"""
Timeline service - orchestrates the Frontend → Cohere → Investease pipeline
Business logic for creating educational financial timelines for kids
"""
from datetime import datetime
import uuid
from src.services.data_transformer import DataTransformer
from src.services.investease_client import register_client_with_investease
from src.services.market_simulator import simulate_timeline

class TimelineService:
    def __init__(self):
        self.data_transformer = DataTransformer()
        # In-memory storage for demo - replace with DB in production
        self.timelines = {}

    def create_complete_timeline(self, frontend_data):
        """
        Complete pipeline: Frontend → Cohere → Investease → Timeline
        Creates an educational timeline for kids with AI-enhanced data
        """
        # Step 1: Extract frontend data
        name = frontend_data.get('name', 'Young Learner')
        email = frontend_data.get('email', 'parent@example.com')
        profile_text = frontend_data.get('profileText', f"Profile for {name}")
        choices = frontend_data.get('choices', [])

        print(f"=== Creating Educational Timeline for {name} ===")

        # Step 2: Transform data through Cohere AI
        print("Step 1: Transforming kid's data through Cohere AI...")
        enhanced_client_data = self.data_transformer.transform_user_to_client_data(frontend_data)

        print("Step 2: Analyzing kid's profile...")
        profile_analysis = self.data_transformer.analyze_profile_text(profile_text)

        # Step 3: Register with Investease API - complete portfolio creation and simulation
        print("Step 3: Creating complete Investease profile with portfolios...")
        investease_response = register_client_with_investease(enhanced_client_data)

        if not investease_response['success']:
            raise Exception(f"Failed to register with Investease: {investease_response['error']}")

        investease_data = investease_response['data']

        # Step 4: Create additional educational simulation timeline (our own simulation)
        print("Step 4: Creating educational timeline simulation...")
        timeline_id = str(uuid.uuid4())
        local_simulation = simulate_timeline(timeline_id, choices)

        # Step 5: Create complete timeline record with both simulations
        timeline = {
            'id': timeline_id,
            'owner': name,
            'name': f"{name}'s Financial Learning Journey",
            'choices': choices,
            'profileText': profile_text,
            'createdAt': datetime.now().isoformat(),

            # Frontend expects 'simulated' for the main simulation data
            'simulated': local_simulation,
            'analysis': profile_analysis,

            # Pipeline results - Enhanced data (for backend reference)
            'enhancedProfile': enhanced_client_data,
            'profileAnalysis': profile_analysis,

            # Investease API results (for backend reference)
            'investeaseClient': investease_data['client'],
            'investeasePortfolios': investease_data['portfolios_created'],
            'investeaseSimulation': investease_data['simulation_results'],
            'investeaseClientId': investease_data['client_id'],

            # Educational metadata
            'learningStyle': enhanced_client_data.get('learningStyle', 'visual'),
            'financialGoals': enhanced_client_data.get('financialGoals', []),
            'gradeLevel': enhanced_client_data.get('gradeLevel', 'Unknown'),

            # Summary stats
            'totalPortfoliosCreated': len(investease_data.get('portfolios_created', [])),
            'simulationMonths': 12
        }

        # Store timeline
        self.timelines[timeline_id] = timeline
        print(f"✅ Educational timeline created successfully: {timeline_id}")

        return {
            'success': True,
            'timeline': timeline,
            'message': f'Educational timeline created for {name}! Ready to start learning about money!'
        }

    def create_simple_timeline(self, frontend_data):
        """
        Simple timeline creation without Investease registration
        For basic educational use
        """
        name = frontend_data.get('name', 'Young Learner')
        profile_text = frontend_data.get('profileText', f"Profile for {name}")
        choices = frontend_data.get('choices', [])

        print(f"=== Creating Simple Educational Timeline for {name} ===")

        # Only do AI analysis, no external API calls
        profile_analysis = self.data_transformer.analyze_profile_text(profile_text)

        timeline_id = str(uuid.uuid4())
        simulation = simulate_timeline(timeline_id, choices)

        timeline = {
            'id': timeline_id,
            'owner': name,
            'name': f"{name}'s Learning Timeline",
            'choices': choices,
            'profileText': profile_text,
            'createdAt': datetime.now().isoformat(),
            'simulated': simulation,
            'analysis': profile_analysis
        }

        self.timelines[timeline_id] = timeline
        return timeline

    def get_timeline(self, timeline_id):
        """Get a specific timeline"""
        return self.timelines.get(timeline_id)

    def list_timelines(self):
        """List all educational timelines"""
        return [
            {
                'id': t['id'],
                'name': t['name'],
                'owner': t['owner'],
                'createdAt': t['createdAt'],
                'simulated': t.get('simulated', {'multiplier': 1, 'emotional': 0, 'events': []}),
                'learningStyle': t.get('learningStyle', 'Unknown'),
                'gradeLevel': t.get('gradeLevel', 'Unknown')
            }
            for t in self.timelines.values()
        ]


# Global instance for the demo
timeline_service = TimelineService()