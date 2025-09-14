"""
Data transformation service using Cohere AI for kids' financial education
Handles Frontend → Cohere pipeline transformation for children's profiles
"""
import random
import json
import cohere
from src.config import Config

class DataTransformer:
    def __init__(self):
        self.cohere_client = None
        if Config.COHERE_API_KEY:
            self.cohere_client = cohere.Client(Config.COHERE_API_KEY)

    def transform_user_to_client_data(self, user_data):
        """
        Transform basic kid user data into age-appropriate financial profile for educational simulation
        Frontend → Cohere enhancement for children's financial learning
        """
        if not self.cohere_client:
            return self._generate_mock_kid_client_data(user_data)

        try:
            name = user_data.get('name', 'Young Learner')
            email = user_data.get('email', 'parent@example.com')  # Parent email
            allowance = user_data.get('cashAmount', 50)  # Kid's allowance/savings
            portfolios = user_data.get('portfolios', [])

            prompt = f"""Create an age-appropriate financial learning profile for a child using this educational app. Generate realistic but kid-friendly data for financial education simulation.

Child Info:
- Name: {name}
- Parent Email: {email}
- Allowance/Savings: ${allowance}
- Learning Portfolios: {portfolios}

Generate child-appropriate fields in JSON format:
- age: child age (8-17)
- parentPhone: parent contact number
- address: family address
- gradeLevel: school grade level
- learningStyle: "visual", "hands-on", or "analytical"
- financialGoals: array of 2-3 age-appropriate goals like ["save for bike", "college fund"]
- timeHorizon: learning timeline in years (1-10)

Response format:
{{
  "age": 12,
  "parentPhone": "+1-555-123-4567",
  "address": "123 Maple St, Hometown, State 12345",
  "gradeLevel": "7th Grade",
  "learningStyle": "visual",
  "financialGoals": ["save for bike", "college fund"],
  "timeHorizon": 5
}}"""

            response = self.cohere_client.generate(
                model=Config.COHERE_MODEL,
                prompt=prompt,
                max_tokens=200,
                temperature=0.5
            )

            result_text = response.generations[0].text.strip()
            generated_data = json.loads(result_text)

            # Combine user data with AI-generated data for Investease API
            # Primary fields required by Investease API
            client_data = {
                'name': name,
                'email': email,
                'cash': allowance,  # Investease API expects "cash" field
                'portfolios': portfolios,  # Will be empty initially, portfolios created separately

                # Enhanced fields from AI - stored but not sent to Investease create client endpoint
                **generated_data
            }

            return client_data

        except json.JSONDecodeError:
            return self._generate_mock_kid_client_data(user_data)
        except Exception as e:
            print(f"Cohere API error in transform_user_to_client_data: {e}")
            return self._generate_mock_kid_client_data(user_data)

    def analyze_profile_text(self, profile_text):
        """
        Analyze child's profile text and extract learning traits and interests for financial education
        """
        if not self.cohere_client or not profile_text:
            return self._mock_analyze_kid_profile(profile_text)

        try:
            prompt = f"""Analyze this child's profile for a financial education app. Extract personality traits and interests that would help personalize their financial learning experience. Return in JSON format.

Child Profile: {profile_text}

Response format:
{{"tags": ["curious", "creative"], "summary": "Brief description focusing on learning style and interests for financial education."}}"""

            response = self.cohere_client.generate(
                model=Config.COHERE_MODEL,
                prompt=prompt,
                max_tokens=150,
                temperature=0.3
            )

            result_text = response.generations[0].text.strip()
            result = json.loads(result_text)

            if 'tags' in result and 'summary' in result:
                return result

            return self._extract_tags_from_text(result_text)

        except json.JSONDecodeError:
            return self._extract_tags_from_text(result_text)
        except Exception as e:
            print(f"Cohere API error in analyze_profile_text: {e}")
            return self._mock_analyze_kid_profile(profile_text)

    def _generate_mock_kid_client_data(self, user_data):
        """Generate mock client data for kids when Cohere API is not available"""
        name = user_data.get('name', 'Young Learner')
        email = user_data.get('email', 'parent@example.com')
        allowance = user_data.get('cashAmount', 50)
        portfolios = user_data.get('portfolios', [])

        grade_levels = ['3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade']
        learning_styles = ['visual', 'hands-on', 'analytical']
        kid_goals = ['save for bike', 'college fund', 'new video game', 'help family', 'start small business', 'buy art supplies']

        return {
            # Primary fields for Investease API
            'name': name,
            'email': email,
            'cash': allowance,  # Investease API expects "cash"
            'portfolios': portfolios,  # Empty initially

            # Enhanced fields for educational features
            'age': random.randint(8, 17),
            'parentPhone': f"+1-555-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
            'address': f"{random.randint(100, 999)} {random.choice(['Maple', 'Oak', 'Pine', 'Elm', 'Cherry'])} St, Hometown, State {random.randint(10000, 99999)}",
            'gradeLevel': random.choice(grade_levels),
            'learningStyle': random.choice(learning_styles),
            'financialGoals': random.sample(kid_goals, 2),
            'timeHorizon': random.randint(2, 8)
        }

    def _mock_analyze_kid_profile(self, profile_text):
        """Return mock analysis for kids when Cohere API is not available"""
        kid_friendly_tags = [
            'curious', 'creative', 'artistic', 'sporty',
            'tech-savvy', 'animal-lover', 'science-minded', 'storyteller',
            'musical', 'builder', 'helper', 'entrepreneur'
        ]
        shuffled = kid_friendly_tags.copy()
        random.shuffle(shuffled)
        tags = shuffled[:2]

        return {
            'tags': tags,
            'summary': f"This young learner shows {' and '.join(tags)} traits, perfect for personalized financial education!"
        }

    def _extract_tags_from_text(self, text):
        """Extract learning-focused tags from unstructured text response"""
        tags = []
        summary = text

        # Kid-focused keyword extraction
        if 'curious' in text.lower():
            tags.append('curious')
        if 'creative' in text.lower() or 'artistic' in text.lower():
            tags.append('creative')
        if 'active' in text.lower() or 'sports' in text.lower():
            tags.append('sporty')
        if 'tech' in text.lower() or 'computer' in text.lower():
            tags.append('tech-savvy')
        if 'music' in text.lower():
            tags.append('musical')
        if 'help' in text.lower():
            tags.append('helper')

        if not tags:
            tags = ['curious', 'creative']

        return {
            'tags': tags[:3],
            'summary': summary[:200] if len(summary) > 200 else summary
        }