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
            parent_email = user_data.get('email', 'parent@example.com')
            # Kid's allowance/savings
            allowance = user_data.get('cashAmount', 50)
            portfolios = user_data.get('portfolios', [])

            prompt = f"""Create an age-appropriate financial learning profile for a child using this educational app. Generate realistic but kid-friendly data for financial education simulation.

Child Info:
- Name: {name}
- Parent Email: {parent_email}
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

            # Translate kid-friendly portfolio choices to technical terms
            technical_portfolios = self.translate_kid_portfolios_to_technical(
                portfolios)

            # Combine user data with AI-generated data for Investease API
            # Primary fields required by Investease API
            client_data = {
                'name': name,
                'email': parent_email,  # Use parent email directly for client lookup/reuse
                'cash': allowance,  # Investease API expects "cash" field
                'portfolios': technical_portfolios,  # Translated to technical terms
                'kid_portfolios': portfolios,  # Keep original for reference

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
            prompt = f"""Analyze this child's profile for a financial education app. Extract personality traits and interests that would help personalize their financial learning experience. Return ONLY valid JSON.

Child Profile: {profile_text}

Return exactly this format:
{{"tags": ["curious", "creative"], "summary": "Brief description focusing on learning style and interests for financial education."}}"""

            response = self.cohere_client.generate(
                model=Config.COHERE_MODEL,
                prompt=prompt,
                max_tokens=200,  # Increased token limit
                temperature=0.3
            )

            result_text = response.generations[0].text.strip()
            print(f"🤖 AI Profile Analysis Response: {result_text}")

            # Try to parse the JSON response
            try:
                result = json.loads(result_text)
                if 'tags' in result and 'summary' in result:
                    print(f"✅ Successfully parsed AI profile analysis")
                    return result
                else:
                    print(f"⚠️ JSON missing required fields, using text extraction")
                    return self._extract_tags_from_text(result_text)

            except json.JSONDecodeError as json_error:
                print(f"❌ JSON Parse Error: {json_error}")
                print(f"Raw response: {result_text}")

                # Try to fix incomplete JSON
                fixed_result = self._fix_incomplete_json(result_text)
                if fixed_result:
                    return fixed_result

                # Fallback to text extraction
                return self._extract_tags_from_text(result_text)

        except Exception as e:
            print(f"Cohere API error in analyze_profile_text: {e}")
            return self._mock_analyze_kid_profile(profile_text)

    def _generate_mock_kid_client_data(self, user_data):
        """Generate mock client data for kids when Cohere API is not available"""
        name = user_data.get('name', 'Young Learner')
        parent_email = user_data.get('email', 'parent@example.com')
        allowance = user_data.get('cashAmount', 50)
        portfolios = user_data.get('portfolios', [])

        grade_levels = ['3rd Grade', '4th Grade', '5th Grade',
                        '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade']
        learning_styles = ['visual', 'hands-on', 'analytical']
        kid_goals = ['save for bike', 'college fund', 'new video game',
                     'help family', 'start small business', 'buy art supplies']

        # Translate kid-friendly portfolio choices to technical terms
        technical_portfolios = self.translate_kid_portfolios_to_technical(
            portfolios)

        return {
            # Primary fields for Investease API
            'name': name,
            'email': parent_email,  # Use parent email directly for client lookup/reuse
            'cash': allowance,  # Investease API expects "cash"
            'portfolios': technical_portfolios,  # Translated to technical terms
            'kid_portfolios': portfolios,  # Keep original for reference

            # Enhanced fields for educational features
            'age': random.randint(8, 17),
            'parentPhone': f"+1-555-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
            'address': f"{random.randint(100, 999)} {random.choice(['Maple', 'Oak', 'Pine', 'Elm', 'Cherry'])} St, Hometown, State {random.randint(10000, 99999)}",
            'gradeLevel': random.choice(grade_levels),
            'learningStyle': random.choice(learning_styles),
            'financialGoals': random.sample(kid_goals, 2),
            'timeHorizon': random.randint(2, 8)
        }

    def _fix_incomplete_json(self, text):
        """Try to fix incomplete JSON responses from AI"""
        try:
            # Check if it's a truncated JSON starting with {
            if text.startswith('{') and not text.endswith('}'):
                print(f"🔧 Attempting to fix incomplete JSON...")

                # Try to find where the summary was cut off
                if '"summary":' in text:
                    # Find the last complete quote before truncation
                    parts = text.split('"summary":')
                    if len(parts) >= 2:
                        summary_part = parts[1].strip()

                        # Extract tags if available
                        tags = []
                        if '"tags":' in text:
                            tags_match = text.split('"tags":')[1].split(']')[0]
                            if '[' in tags_match:
                                tags_text = tags_match.split('[')[1]
                                # Try to extract tag strings
                                import re
                                tag_matches = re.findall(
                                    r'"([^"]*)"', tags_text)
                                tags = tag_matches[:3]  # Limit to first 3 tags

                        if not tags:
                            tags = ['curious', 'creative']  # Default fallback

                        # Create a complete response
                        fixed_response = {
                            'tags': tags,
                            'summary': 'This young learner shows great potential for financial education!'
                        }

                        print(f"✅ Fixed incomplete JSON: {fixed_response}")
                        return fixed_response

            return None

        except Exception as e:
            print(f"❌ Error fixing incomplete JSON: {e}")
            return None

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

        # Try to extract from JSON-like text first
        import re

        # Look for tags in JSON format: "tags": ["tag1", "tag2"]
        tags_match = re.search(r'"tags":\s*\[\s*([^]]*)\]', text)
        if tags_match:
            tags_text = tags_match.group(1)
            # Extract quoted strings
            tag_matches = re.findall(r'"([^"]*)"', tags_text)
            if tag_matches:
                tags = tag_matches[:3]  # Limit to 3 tags
                print(f"🏷️ Extracted tags from JSON-like text: {tags}")

        # If no JSON tags found, fall back to keyword extraction
        if not tags:
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

        # Try to extract summary from JSON-like text
        summary_match = re.search(r'"summary":\s*"([^"]*)', text)
        if summary_match:
            summary = summary_match.group(1)
            print(f"📝 Extracted summary from JSON-like text")
        else:
            # Clean up the summary text
            summary = text.replace('"', '').replace(
                '{', '').replace('}', '').strip()
            if len(summary) > 200:
                summary = summary[:200] + "..."

        return {
            'tags': tags[:3],
            'summary': summary
        }

    def translate_kid_portfolios_to_technical(self, kid_portfolios):
        """
        Translate kid-friendly portfolio names to technical Investease API portfolio types
        """
        translation_map = {
            "Safe & Slow (like a piggy bank)": "very_conservative",
            "Medium Risk (like a lemonade stand)": "balanced",
            "Fun & Fast (like collecting trading cards)": "growth",
            "Houses & Buildings": "conservative",  # Real estate-focused
            "Cool Tech Companies": "aggressive_growth",  # High-risk tech stocks
            "Let AI Choose for Me!": "balanced",  # Default to balanced

            # Fallback for any technical terms that might slip through
            "Stocks": "growth",
            "Bonds": "conservative",
            "ETFs": "balanced",
            "Crypto": "aggressive_growth",
            "Real Estate": "conservative",
            "Mutual Funds": "balanced"
        }

        technical_portfolios = []
        for kid_portfolio in kid_portfolios:
            technical_type = translation_map.get(
                kid_portfolio, "balanced")  # Default to balanced
            technical_portfolios.append(technical_type)

        # Remove duplicates while preserving order
        seen = set()
        unique_portfolios = []
        for portfolio in technical_portfolios:
            if portfolio not in seen:
                seen.add(portfolio)
                unique_portfolios.append(portfolio)

        return unique_portfolios
