"""
Cohere integration for analyzing profile text and generating personality insights.
"""

import random
import os
import cohere

MOCK_TAGS = [
    'curious', 'entrepreneurial', 'artistic', 'sports-enthusiast',
    'gamer', 'animal-lover', 'science-curious', 'storyteller'
]

def mock_analyze_profile(profile_text):
    """Return 2 random tags and a short sentence"""
    shuffled = MOCK_TAGS.copy()
    random.shuffle(shuffled)
    tags = shuffled[:2]
    return {
        'tags': tags,
        'summary': f"Kid looks {' and '.join(tags)} (mocked analysis)."
    }

def analyze_profile(profile_text):
    """Analyze profile text using Cohere API or return mock data."""
    cohere_api_key = os.getenv('COHERE_API_KEY')
    
    if not cohere_api_key or not profile_text:
        return mock_analyze_profile(profile_text)
    
    try:
        co = cohere.Client(cohere_api_key)
        
        prompt = f"""Analyze this child's profile and extract personality traits and interests. Return in JSON format with 'tags' (array of 2-3 keywords) and 'summary' (one sentence).

Profile: {profile_text}

Response format:
{{"tags": ["trait1", "trait2"], "summary": "Brief description of the child's personality."}}"""
        
        response = co.generate(
            model='command-light',
            prompt=prompt,
            max_tokens=150,
            temperature=0.3
        )
        
        # Parse the response
        result_text = response.generations[0].text.strip()
        
        # Try to extract JSON-like content
        import json
        try:
            result = json.loads(result_text)
            if 'tags' in result and 'summary' in result:
                return result
        except json.JSONDecodeError:
            pass
            
        # Fallback parsing
        tags = []
        summary = result_text
        
        if 'curious' in result_text.lower():
            tags.append('curious')
        if 'creative' in result_text.lower() or 'artistic' in result_text.lower():
            tags.append('creative')
        if 'active' in result_text.lower() or 'sports' in result_text.lower():
            tags.append('active')
        if 'tech' in result_text.lower() or 'gamer' in result_text.lower():
            tags.append('tech-savvy')
            
        if not tags:
            tags = ['curious', 'creative']
            
        return {
            'tags': tags[:3],
            'summary': summary[:200] if len(summary) > 200 else summary
        }
        
    except Exception as e:
        print(f"Cohere API error: {e}")
        return mock_analyze_profile(profile_text)

def generate_client_data(user_data):
    """Generate enhanced client data using Cohere AI based on user input."""
    cohere_api_key = os.getenv('COHERE_API_KEY')
    
    name = user_data.get('name', 'Anonymous User')
    email = user_data.get('email', 'user@example.com')
    cash_amount = user_data.get('cashAmount', 10000)
    portfolios = user_data.get('portfolios', [])
    
    # Mock data generation if no Cohere API key
    if not cohere_api_key:
        return generate_mock_client_data(user_data)
    
    try:
        co = cohere.Client(cohere_api_key)
        
        prompt = f"""Based on the following user information, generate realistic financial profile data for a client registration system. 

User Info:
- Name: {name}
- Email: {email}
- Cash Amount: ${cash_amount}
- Portfolios: {portfolios}

Generate the following additional fields in JSON format:
- age: realistic age (25-65)
- phone: realistic phone number format
- address: realistic address
- occupation: suitable occupation based on cash amount
- riskTolerance: "conservative", "moderate", or "aggressive"
- investmentGoals: array of 2-3 realistic goals
- timeHorizon: investment time horizon in years (1-30)

Response format:
{{
  "age": 35,
  "phone": "+1-555-123-4567",
  "address": "123 Main St, City, State 12345",
  "occupation": "Software Engineer",
  "riskTolerance": "moderate",
  "investmentGoals": ["retirement", "wealth building"],
  "timeHorizon": 15
}}"""
        
        response = co.generate(
            model='command-light',
            prompt=prompt,
            max_tokens=200,
            temperature=0.5
        )
        
        result_text = response.generations[0].text.strip()
        
        import json
        try:
            generated_data = json.loads(result_text)
            
            # Combine user data with generated data
            client_data = {
                'name': name,
                'email': email,
                'cash': cash_amount,  # API expects "cash" not "cashAmount"
                'portfolios': portfolios,
                **generated_data
            }
            
            return client_data
            
        except json.JSONDecodeError:
            print("Failed to parse Cohere response, using mock data")
            return generate_mock_client_data(user_data)
            
    except Exception as e:
        print(f"Cohere API error in generate_client_data: {e}")
        return generate_mock_client_data(user_data)

def generate_mock_client_data(user_data):
    """Generate mock client data when Cohere API is not available."""
    import random
    
    name = user_data.get('name', 'Anonymous User')
    email = user_data.get('email', 'user@example.com')
    cash_amount = user_data.get('cashAmount', 10000)
    portfolios = user_data.get('portfolios', [])
    
    occupations = ['Software Engineer', 'Teacher', 'Marketing Manager', 'Accountant', 'Designer']
    risk_levels = ['conservative', 'moderate', 'aggressive']
    goals = ['retirement', 'wealth building', 'education fund', 'emergency fund', 'home purchase']
    
    return {
        'name': name,
        'email': email,
        'cash': cash_amount,  # API expects "cash" not "cashAmount"
        'portfolios': portfolios,
        'age': random.randint(25, 65),
        'phone': f"+1-555-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
        'address': f"{random.randint(100, 9999)} {random.choice(['Main', 'Oak', 'Pine', 'Elm'])} St, City, State {random.randint(10000, 99999)}",
        'occupation': random.choice(occupations),
        'riskTolerance': random.choice(risk_levels),
        'investmentGoals': random.sample(goals, 2),
        'timeHorizon': random.randint(5, 25)
    }