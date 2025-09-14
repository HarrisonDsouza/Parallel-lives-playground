"""
AWS API client for registering users with the external service.
"""

import requests
import json
import os

AWS_API_ENDPOINT = "https://2dcq63co40.execute-api.us-east-1.amazonaws.com/dev/clients"
last_registered_client_id = None


def register_client_with_aws(client_data):
    """
    Register a client with the AWS API endpoint.
    
    Args:
        client_data (dict): Client data including name, email, cashAmount, portfolios, etc.
        
    Returns:
        dict: Response from AWS API or error information
    """
    global last_registered_client_id
    try:
        print(f"Registering client with AWS API: {client_data['name']}")
        
        # Get JWT token from environment variables
        jwt_token = os.getenv('AWS_JWT_TOKEN')
        
        if not jwt_token:
            error_msg = "AWS_JWT_TOKEN environment variable is required but not set"
            print(error_msg)
            return {
                'success': False,
                'error': error_msg,
                'status_code': 401
            }
        
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f'Bearer {jwt_token}'
        }
        
        print(f"=== AWS API REQUEST DEBUG ===")
        print(f"URL: {AWS_API_ENDPOINT}")
        print(f"Headers: {headers}")
        print(f"JWT Token length: {len(jwt_token)}")
        print(f"JWT Token first 50 chars: {jwt_token[:50]}...")
        print(f"Payload: {json.dumps(client_data, indent=2)}")
        print(f"=== END DEBUG ===")
        
        response = requests.post(
            AWS_API_ENDPOINT,
            json=client_data,
            headers=headers,
            timeout=30
        )
        
        print(f"AWS API Response Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200 or response.status_code == 201:
            try:
                response_data = response.json()
                print(f"AWS API Success: {response_data}")
                
                client_id = response_data.get("id")
                if client_id:
                    last_registered_client_id = client_id
                    print(f"Saved clientId for simulation: {last_registered_client_id}")

                return {
                    'success': True,
                    'data': response_data,
                    'status_code': response.status_code
                }
            except json.JSONDecodeError:
                print(f"Success response but no JSON: {response.text}")
                return {
                    'success': True,
                    'data': {'message': 'Registration successful'},
                    'status_code': response.status_code
                }
        else:
            print(f"Error response body: {response.text}")
            error_message = f"AWS API Error: {response.status_code}"
            try:
                error_data = response.json()
                error_message = error_data.get('message', error_data)
                print(f"Parsed error data: {error_data}")
            except json.JSONDecodeError:
                error_message = response.text or error_message
                print(f"Could not parse error as JSON, using raw text")
                
            print(f"Final error message: {error_message}")
            return {
                'success': False,
                'error': error_message,
                'status_code': response.status_code
            }
            
    except requests.exceptions.Timeout:
        error_msg = "AWS API request timed out"
        print(error_msg)
        return {
            'success': False,
            'error': error_msg,
            'status_code': 408
        }
    except requests.exceptions.ConnectionError:
        error_msg = "Failed to connect to AWS API"
        print(error_msg)
        return {
            'success': False,
            'error': error_msg,
            'status_code': 503
        }
    except Exception as e:
        error_msg = f"Unexpected error calling AWS API: {str(e)}"
        print(error_msg)
        return {
            'success': False,
            'error': error_msg,
            'status_code': 500
        }
        
def simulate_client_with_aws():
    """
    Trigger simulation for a given client ID.

    Args:
        client_id (str): Client UUID returned from registration
        months (int, optional): Number of months to simulate. Default = 12.

    Returns:
        dict: API response
    """
    try:
        jwt_token = os.getenv('AWS_JWT_TOKEN')
        if not jwt_token:
            error_msg = "AWS_JWT_TOKEN environment variable is required but not set"
            print(error_msg)
            return {
                'success': False,
                'error': error_msg,
                'status_code': 401
            }

        url = f"https://2dcq63co40.execute-api.us-east-1.amazonaws.com/dev/client/{last_registered_client_id}/simulate"
        headers = {
           'Content-Type': 'application/json',
            'Authorization': f'Bearer {jwt_token}'
        }
        payload = {"months": 12}

        print("=== AWS SIMULATE DEBUG ===")
        print(f"URL: {url}")
        print(f"Headers: {headers}")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        print("=== END DEBUG ===")

        response = requests.post(url, json=payload, headers=headers)

        if response.status_code in (200, 201):
            return {
                "success": True,
                "data": response.json(),
                "status_code": response.status_code
            }
        else:
            return {
                "success": False,
                "error": response.text,
                "status_code": response.status_code
            }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "status_code": 500
        }