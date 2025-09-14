"""
AWS API client for registering users with the external service.
"""

import requests
import json
import os

AWS_API_ENDPOINT = "https://2dcq63co40.execute-api.us-east-1.amazonaws.com/dev/clients"
last_registered_client_id = None
g_client_data = None
simulate_client_data = None


def register_client_with_aws(client_data):
    """
    Register a client with the AWS API endpoint, create a portfolio, 
    and automatically trigger a simulation. Returns simulation output.
    
    Args:
        client_data (dict): Client data including name, email, cashAmount, portfolios, etc.
        
    Returns:
        dict: Simulation API response or error information
    """
    global last_registered_client_id, g_client_data, simulate_client_data
    try:
        print(f"Registering client with AWS API: {client_data['name']}")
        g_client_data = client_data

        jwt_token = os.getenv('AWS_JWT_TOKEN')
        if not jwt_token:
            error_msg = "AWS_JWT_TOKEN environment variable is required but not set"
            print(error_msg)
            return {'success': False, 'error': error_msg, 'status_code': 401}
        
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f'Bearer {jwt_token}'
        }

        # --- Client registration ---
        print(f"=== AWS CLIENT REGISTRATION REQUEST DEBUG ===")
        print(f"URL: {AWS_API_ENDPOINT}")
        print(f"Headers: {headers}")
        print(f"Payload: {json.dumps(client_data, indent=2)}")
        print(f"=== END DEBUG ===")

        response = requests.post(AWS_API_ENDPOINT, json=client_data, headers=headers, timeout=30)
        print(f"AWS API Response Status: {response.status_code}")

        if response.status_code not in (200, 201):
            try:
                error_data = response.json()
                error_message = error_data.get('message', error_data)
            except json.JSONDecodeError:
                error_message = response.text
            return {'success': False, 'error': error_message, 'status_code': response.status_code}

        # --- Parse client registration response ---
        response_data = response.json()
        client_id = response_data.get("id")
        if not client_id:
            return {'success': False, 'error': "No client ID returned from AWS API", 'status_code': 500}
        
        last_registered_client_id = client_id
        print(f"Saved clientId for simulation: {last_registered_client_id}")

        # --- Portfolio creation ---
        portfolio_url = f"{AWS_API_ENDPOINT}/{client_id}/portfolios"
        portfolio_data = {
            "type": "balanced",
            "initialAmount": g_client_data.get("cashAmount", 10000),
        }
        print(f"Creating portfolio for client {client_id}: {json.dumps(portfolio_data, indent=2)}")
        portfolio_resp = requests.post(portfolio_url, json=portfolio_data, headers=headers, timeout=30)
        if portfolio_resp.status_code in (200, 201):
            portfolio_json = portfolio_resp.json()
            print(f"Portfolio creation success: {portfolio_json}")
            response_data['portfolio'] = portfolio_json
        else:
            print(f"Portfolio creation failed: {portfolio_resp.text}")

        # --- Run simulation ---
        simulate_url = f"https://2dcq63co40.execute-api.us-east-1.amazonaws.com/dev/client/{client_id}/simulate"
        simulate_payload = {"months": 12}
        print(f"Triggering simulation for client {client_id}")
        simulate_resp = requests.post(simulate_url, json=simulate_payload, headers=headers, timeout=30)

        if simulate_resp.status_code in (200, 201):
            simulate_data = simulate_resp.json()
            simulate_client_data = simulate_data
            print(f"Simulation success: {simulate_data}")
            return {'success': True, 'data': simulate_data, 'status_code': simulate_resp.status_code}
        else:
            print(f"Simulation failed: {simulate_resp.text}")
            return {'success': False, 'error': simulate_resp.text, 'status_code': simulate_resp.status_code}

    except requests.exceptions.Timeout:
        return {'success': False, 'error': "AWS API request timed out", 'status_code': 408}
    except requests.exceptions.ConnectionError:
        return {'success': False, 'error': "Failed to connect to AWS API", 'status_code': 503}
    except Exception as e:
        return {'success': False, 'error': f"Unexpected error calling AWS API: {str(e)}", 'status_code': 500}

def simulate_client_with_aws():
    global simulate_client_data
    if not simulate_client_data:
        print("No simulation data available")
        return {'success': False, 'error': "No simulation data available", 'status_code': 400}
    # Here you would add the logic to call the AWS API with the simulation data
    return {'success': True, 'data': simulate_client_data}