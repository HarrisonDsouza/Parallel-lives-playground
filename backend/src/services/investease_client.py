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
            print(
                f"Creating Investease client: {client_data.get('name', 'Unknown')}")

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
                print(
                    f"✅ Client created successfully: {client_result.get('id', 'unknown')}")
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
            print(
                f"Creating {portfolio_type} portfolio for client {client_id} with ${initial_amount}")

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
                print(
                    f"✅ {portfolio_type} portfolio created: {portfolio_result.get('id', 'unknown')}")
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
        Simulate all portfolios for a client using RBC Investease API
        POST /client/{clientId}/simulate
        """
        try:
            # Enhanced logging for hackathon demo - show RBC API integration
            print(f"\n🏦 ===== RBC INVESTEASE SIMULATION API CALL =====")
            print(
                f"🔗 Endpoint: POST {self.base_url}/client/{client_id}/simulate")
            print(f"🏢 Provider: RBC Investease Financial Services")
            print(
                f"📊 Simulating portfolios for client {client_id} over {months} months")
            print(f"⏰ Timestamp: {self._get_timestamp()}")

            payload = {
                'months': min(months, 12)  # API limit is 12 months
            }

            print(f"📤 Request payload: {payload}")
            print(f"🔑 Using JWT authentication for RBC API")

            response = requests.post(
                f"{self.base_url}/client/{client_id}/simulate",
                json=payload,
                headers=self.headers,
                timeout=30
            )

            print(f"📥 RBC API Response: {response.status_code}")

            if response.status_code == 200:
                simulation_result = response.json()
                results_count = len(simulation_result.get('results', []))
                print(f"✅ RBC INVESTEASE SIMULATION COMPLETED SUCCESSFULLY")
                print(
                    f"📈 Retrieved simulation data for {results_count} portfolios")
                print(f"💰 Real financial projections calculated by RBC systems")
                print(f"🏦 ===============================================\n")

                return {
                    'success': True,
                    'data': simulation_result,
                    'status_code': response.status_code,
                    'rbc_api_metadata': {
                        'endpoint': f"POST /client/{client_id}/simulate",
                        'provider': 'RBC Investease',
                        'timestamp': self._get_timestamp(),
                        'portfolios_simulated': results_count,
                        'simulation_months': months
                    }
                }
            else:
                error_data = self._parse_error(response)
                print(f"❌ RBC Portfolio simulation failed: {error_data}")
                print(f"🏦 ===============================================\n")
                return {
                    'success': False,
                    'error': error_data,
                    'status_code': response.status_code
                }

        except Exception as e:
            print(f"❌ Exception during RBC API simulation call: {str(e)}")
            print(f"🏦 ===============================================\n")
            return self._handle_exception(e, "simulate_client_portfolios")

    def list_clients(self):
        """
        List all clients in the team
        GET /clients
        """
        try:
            response = requests.get(
                f"{self.base_url}/clients",
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
            return self._handle_exception(e, "list_clients")

    def find_client_by_email(self, email):
        """
        Find an existing client by email address
        Returns the client data if found, None if not found
        """
        try:
            print(f"🔍 Looking for existing client with email: {email}")

            clients_response = self.list_clients()
            if not clients_response['success']:
                print(
                    f"❌ Failed to list clients: {clients_response.get('error', 'Unknown error')}")
                return None

            clients = clients_response['data']

            # Handle both list format and object format responses
            if isinstance(clients, dict) and 'clients' in clients:
                clients = clients['clients']
            elif isinstance(clients, dict) and 'data' in clients:
                clients = clients['data']

            if not isinstance(clients, list):
                print(
                    f"⚠️ Unexpected clients response format: {type(clients)}")
                return None

            for client in clients:
                if client.get('email') == email:
                    print(
                        f"✅ Found existing client: {client.get('name', 'Unknown')} (ID: {client.get('id')})")
                    return client

            print(f"📭 No existing client found with email: {email}")
            return None

        except Exception as e:
            print(f"❌ Error searching for client by email: {str(e)}")
            return None

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

    def update_client_cash(self, client_id, new_cash_amount):
        """
        Update client's cash amount
        PUT /clients/{clientId}
        """
        try:
            print(f"💰 Updating client {client_id} cash to ${new_cash_amount}")

            payload = {
                'cash': new_cash_amount
            }

            response = requests.put(
                f"{self.base_url}/clients/{client_id}",
                json=payload,
                headers=self.headers,
                timeout=30
            )

            print(f"Update client cash response: {response.status_code}")

            if response.status_code == 200:
                return {
                    'success': True,
                    'data': response.json(),
                    'status_code': response.status_code
                }
            else:
                error_data = self._parse_error(response)
                print(f"❌ Client cash update failed: {error_data}")
                return {
                    'success': False,
                    'error': error_data,
                    'status_code': response.status_code
                }

        except Exception as e:
            return self._handle_exception(e, "update_client_cash")

    def create_complete_client_with_portfolios(self, client_data, portfolio_configs=None):
        """
        Complete pipeline: Find existing client OR create new + portfolios + simulate
        This method now checks for existing clients by email to avoid duplicates
        """
        try:
            print(f"=== COMPLETE INVESTEASE CLIENT PIPELINE ===")
            print(
                f"Processing client: {client_data.get('name', 'Unknown')} ({client_data.get('email', 'no-email')})")

            # Step 1: Check for existing client by email
            email = client_data.get('email')
            existing_client = None
            client_id = None

            if email:
                existing_client = self.find_client_by_email(email)

            if existing_client:
                # Use existing client
                client_id = existing_client['id']
                client_info = existing_client
                print(f"🔄 Reusing existing client with ID: {client_id}")

                # Update client cash if needed for demo purposes
                new_cash = client_data.get(
                    'cash', client_data.get('cashAmount', 1000))
                current_cash = client_info.get('cash', 0)
                if new_cash > current_cash:
                    print(
                        f"💰 Updating client cash from ${current_cash} to ${new_cash} for demo")
                    update_result = self.update_client_cash(
                        client_id, new_cash)
                    if update_result['success']:
                        client_info = update_result['data']
                        print(f"✅ Client cash updated successfully")
                    else:
                        print(
                            f"⚠️ Failed to update client cash: {update_result['error']}")
            else:
                # Create new client
                print(f"➕ Creating new client...")
                client_result = self.create_client(client_data)
                if not client_result['success']:
                    return client_result

                client_info = client_result['data']
                client_id = client_info['id']
                print(f"✅ New client created with ID: {client_id}")

            # Step 2: Create portfolios based on user data or defaults
            if portfolio_configs is None:
                # Get available cash from the actual client (after potential update)
                available_cash = client_info.get(
                    'cash', 5000)  # Higher default for demo
                requested_cash = client_data.get(
                    'cash', client_data.get('cashAmount', 1000))

                print(
                    f"💰 Available cash: ${available_cash}, Requested: ${requested_cash}")

                # For demo purposes, use smaller amounts if cash update failed
                if available_cash < 100:
                    print(
                        f"⚠️ Using minimal portfolio amounts due to low cash (${available_cash})")
                    # Create minimal portfolios that fit available cash
                    if available_cash >= 10:
                        portfolio_configs = [
                            {'type': 'conservative', 'amount': max(
                                1, int(available_cash * 0.6))},  # 60%
                            {'type': 'balanced', 'amount': max(
                                1, int(available_cash * 0.4))}       # 40%
                        ]
                    else:
                        portfolio_configs = [
                            {'type': 'conservative', 'amount': max(
                                1, available_cash)}  # Use all available
                        ]
                else:
                    # Use requested amounts
                    total_cash = requested_cash
                    portfolio_configs = [
                        {'type': 'conservative', 'amount': int(
                            total_cash * 0.5)},  # 50% conservative
                        {'type': 'balanced', 'amount': int(
                            total_cash * 0.3)},     # 30% balanced
                        {'type': 'growth', 'amount': int(
                            total_cash * 0.2)}        # 20% growth
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
                        print(
                            f"✅ {config['type']} portfolio created: ${config['amount']}")
                    else:
                        print(
                            f"❌ Failed to create {config['type']} portfolio: {portfolio_result['error']}")

            # Step 3: Simulate portfolios using RBC Investease API
            simulation_result = self.simulate_client_portfolios(
                client_id, months=12)
            simulation_data = None
            rbc_api_metadata = None
            if simulation_result['success']:
                simulation_data = simulation_result['data']
                rbc_api_metadata = simulation_result.get('rbc_api_metadata')
                print(f"✅ RBC Portfolio simulation completed successfully")
            else:
                print(
                    f"❌ RBC Portfolio simulation failed: {simulation_result['error']}")

            # Step 4: Translate RBC simulation to kid-friendly adventures (if simulation succeeded)
            kid_adventures = None
            if simulation_data and client_data:
                try:
                    from src.services.data_transformer import DataTransformer
                    translator = DataTransformer()
                    kid_adventures = translator.translate_rbc_simulation_to_kid_adventures(
                        simulation_data, client_data
                    )
                    print(f"🎨 Successfully translated RBC data to kid adventures")
                except Exception as e:
                    print(f"⚠️ Could not translate to kid adventures: {e}")
                    kid_adventures = None

            # Step 5: Get updated client info with portfolios
            updated_client_result = self.get_client(client_id)
            final_client_data = updated_client_result['data'] if updated_client_result['success'] else client_info

            return {
                'success': True,
                'data': {
                    'client': final_client_data,
                    'portfolios_created': portfolios_created,

                    # RBC Technical Data (for judges/technical demo)
                    'rbc_simulation_results': simulation_data,
                    'rbc_api_metadata': rbc_api_metadata,

                    # Kid-Friendly Data (for educational demo)
                    'kid_adventures': kid_adventures,

                    'client_id': client_id
                },
                'status_code': 200,
                'message': f'Complete Investease setup completed for {client_data.get("name", "Unknown")}'
            }

        except Exception as e:
            return self._handle_exception(e, "create_complete_client_with_portfolios")

    def _get_timestamp(self):
        """Get formatted timestamp for API logging"""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")

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
