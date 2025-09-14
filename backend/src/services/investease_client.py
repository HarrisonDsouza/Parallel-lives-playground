"""
Complete Investease API client for portfolio simulation and management
Handles all Investease API endpoints for kids' financial education

Based on the API documentation:
- POST /clients - Create clients
- POST /clients/{clientId}/portfolios - Create portfolios
- POST /client/{clientId}/simulate - Simulate portfolios
- GET /clients/{clientId} - Get client details
"""

import requests
import json
from src.config import Config

class InvesteaseClient:
    def __init__(self):
        self.base_url = Config.INVESTEASE_API_ENDPOINT.replace('/clients', '')
        self.jwt_token = Config.AWS_JWT_TOKEN
        self.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f'Bearer {self.jwt_token}' if self.jwt_token else None
        }

    def create_client(self, client_data):
        """
        Create a new client in Investease API
        POST /clients
        """
        try:
            print(f"Creating Investease client: {client_data.get('name', 'Unknown')}")

            if not self.jwt_token:
                return {
                    'success': False,
                    'error': 'JWT token required but not configured',
                    'status_code': 401
                }

            # Prepare client data for Investease API
            api_payload = {
                'name': client_data.get('name', 'Unknown'),
                'email': client_data.get('email', 'user@example.com'),
                'cash': client_data.get('cash', client_data.get('cashAmount', 10000)),
                'portfolios': client_data.get('portfolios', [])
            }

            print(f"Investease API Request: POST {self.base_url}/clients")
            print(f"Payload: {json.dumps(api_payload, indent=2)}")

            response = requests.post(
                f"{self.base_url}/clients",
                json=api_payload,
                headers=self.headers,
                timeout=30
            )

            print(f"Create client response: {response.status_code}")

            if response.status_code in [200, 201]:
                client_result = response.json()
                print(f"✅ Client created successfully: {client_result.get('id', 'unknown')}")
                return {
                    'success': True,
                    'data': client_result,
                    'status_code': response.status_code
                }
            else:
                error_data = self._parse_error(response)
                print(f"❌ Client creation failed: {error_data}")
                return {
                    'success': False,
                    'error': error_data,
                    'status_code': response.status_code
                }

        except Exception as e:
            return self._handle_exception(e, "create_client")

    def create_portfolio(self, client_id, portfolio_type="balanced", initial_amount=1000):
        """
        Create a portfolio for a client
        POST /clients/{clientId}/portfolios
        Available types: aggressive_growth, growth, balanced, conservative, very_conservative
        """
        try:
            print(f"Creating {portfolio_type} portfolio for client {client_id} with ${initial_amount}")

            payload = {
                'type': portfolio_type,
                'initialAmount': initial_amount
            }

            response = requests.post(
                f"{self.base_url}/clients/{client_id}/portfolios",
                json=payload,
                headers=self.headers,
                timeout=30
            )

            print(f"Create portfolio response: {response.status_code}")

            if response.status_code in [200, 201]:
                portfolio_result = response.json()
                print(f"✅ {portfolio_type} portfolio created: {portfolio_result.get('id', 'unknown')}")
                return {
                    'success': True,
                    'data': portfolio_result,
                    'status_code': response.status_code
                }
            else:
                error_data = self._parse_error(response)
                print(f"❌ Portfolio creation failed: {error_data}")
                return {
                    'success': False,
                    'error': error_data,
                    'status_code': response.status_code
                }

        except Exception as e:
            return self._handle_exception(e, "create_portfolio")

    def simulate_client_portfolios(self, client_id, months=12):
        """
        Simulate all portfolios for a client
        POST /client/{clientId}/simulate
        """
        try:
            print(f"Simulating portfolios for client {client_id} for {months} months")

            payload = {
                'months': min(months, 12)  # API limit is 12 months
            }

            response = requests.post(
                f"{self.base_url}/client/{client_id}/simulate",
                json=payload,
                headers=self.headers,
                timeout=30
            )

            print(f"Simulation response: {response.status_code}")

            if response.status_code == 200:
                simulation_result = response.json()
                print(f"✅ Portfolio simulation completed: {len(simulation_result.get('results', []))} portfolios")
                return {
                    'success': True,
                    'data': simulation_result,
                    'status_code': response.status_code
                }
            else:
                error_data = self._parse_error(response)
                print(f"❌ Portfolio simulation failed: {error_data}")
                return {
                    'success': False,
                    'error': error_data,
                    'status_code': response.status_code
                }

        except Exception as e:
            return self._handle_exception(e, "simulate_client_portfolios")

    def get_client(self, client_id):
        """
        Get client details with portfolios
        GET /clients/{clientId}
        """
        try:
            response = requests.get(
                f"{self.base_url}/clients/{client_id}",
                headers=self.headers,
                timeout=30
            )

            if response.status_code == 200:
                return {
                    'success': True,
                    'data': response.json(),
                    'status_code': response.status_code
                }
            else:
                error_data = self._parse_error(response)
                return {
                    'success': False,
                    'error': error_data,
                    'status_code': response.status_code
                }

        except Exception as e:
            return self._handle_exception(e, "get_client")

    def create_complete_client_with_portfolios(self, client_data, portfolio_configs=None):
        """
        Complete pipeline: Create client + portfolios + simulate
        This is the main method for the full Investease integration
        """
        try:
            print(f"=== COMPLETE INVESTEASE CLIENT CREATION ===")
            print(f"Creating client and portfolios for: {client_data.get('name', 'Unknown')}")

            # Step 1: Create client
            client_result = self.create_client(client_data)
            if not client_result['success']:
                return client_result

            client_info = client_result['data']
            client_id = client_info['id']
            print(f"✅ Client created with ID: {client_id}")

            # Step 2: Create portfolios based on user data or defaults
            if portfolio_configs is None:
                # Create portfolios based on user preferences or defaults
                total_cash = client_data.get('cash', client_data.get('cashAmount', 1000))

                # Educational portfolios for kids - distribute cash across different risk levels
                portfolio_configs = [
                    {'type': 'conservative', 'amount': int(total_cash * 0.5)},  # 50% conservative
                    {'type': 'balanced', 'amount': int(total_cash * 0.3)},     # 30% balanced
                    {'type': 'growth', 'amount': int(total_cash * 0.2)}        # 20% growth
                ]

            portfolios_created = []
            for config in portfolio_configs:
                if config['amount'] > 0:  # Only create if amount > 0
                    portfolio_result = self.create_portfolio(
                        client_id,
                        config['type'],
                        config['amount']
                    )
                    if portfolio_result['success']:
                        portfolios_created.append(portfolio_result['data'])
                        print(f"✅ {config['type']} portfolio created: ${config['amount']}")
                    else:
                        print(f"❌ Failed to create {config['type']} portfolio: {portfolio_result['error']}")

            # Step 3: Simulate portfolios
            simulation_result = self.simulate_client_portfolios(client_id, months=12)
            simulation_data = None
            if simulation_result['success']:
                simulation_data = simulation_result['data']
                print(f"✅ Portfolio simulation completed")
            else:
                print(f"❌ Portfolio simulation failed: {simulation_result['error']}")

            # Step 4: Get updated client info with portfolios
            updated_client_result = self.get_client(client_id)
            final_client_data = updated_client_result['data'] if updated_client_result['success'] else client_info

            return {
                'success': True,
                'data': {
                    'client': final_client_data,
                    'portfolios_created': portfolios_created,
                    'simulation_results': simulation_data,
                    'client_id': client_id
                },
                'status_code': 200,
                'message': f'Complete Investease setup completed for {client_data.get("name", "Unknown")}'
            }

        except Exception as e:
            return self._handle_exception(e, "create_complete_client_with_portfolios")

    def _parse_error(self, response):
        """Parse error response from API"""
        try:
            error_data = response.json()
            return error_data.get('message', str(error_data))
        except json.JSONDecodeError:
            return response.text or f"HTTP {response.status_code}"

    def _handle_exception(self, exception, method_name):
        """Handle exceptions consistently"""
        if isinstance(exception, requests.exceptions.Timeout):
            return {
                'success': False,
                'error': 'Investease API request timed out',
                'status_code': 408
            }
        elif isinstance(exception, requests.exceptions.ConnectionError):
            return {
                'success': False,
                'error': 'Failed to connect to Investease API',
                'status_code': 503
            }
        else:
            return {
                'success': False,
                'error': f'Error in {method_name}: {str(exception)}',
                'status_code': 500
            }


# Global instance
investease_client = InvesteaseClient()

# Main function for timeline service integration
def register_client_with_investease(client_data):
    """
    Complete Investease client creation with portfolios and simulation
    This matches the original function signature but now uses the full API
    """
    return investease_client.create_complete_client_with_portfolios(client_data)