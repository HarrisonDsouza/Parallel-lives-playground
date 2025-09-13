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