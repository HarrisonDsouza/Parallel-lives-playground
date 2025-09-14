"""
AWS API client for registering users with the external service.
"""

import requests
import json
import os

AWS_API_ENDPOINT = "https://2dcq63co40.execute-api.us-east-1.amazonaws.com/dev/client/register"

def register_client_with_aws(client_data):
    """
    Register a client with the AWS API endpoint.
    
    Args:
        client_data (dict): Client data including name, email, cashAmount, portfolios, etc.
        
    Returns:
        dict: Response from AWS API or error information
    """
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
        
        response = requests.post(
            AWS_API_ENDPOINT,
            json=client_data,
            headers=headers,
            timeout=30
        )
        
        print(f"AWS API Response Status: {response.status_code}")
        
        if response.status_code == 200 or response.status_code == 201:
            try:
                response_data = response.json()
                print(f"AWS API Success: {response_data}")
                return {
                    'success': True,
                    'data': response_data,
                    'status_code': response.status_code
                }
            except json.JSONDecodeError:
                return {
                    'success': True,
                    'data': {'message': 'Registration successful'},
                    'status_code': response.status_code
                }
        else:
            error_message = f"AWS API Error: {response.status_code}"
            try:
                error_data = response.json()
                error_message = error_data.get('message', error_message)
            except json.JSONDecodeError:
                error_message = response.text or error_message
                
            print(f"AWS API Error: {error_message}")
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
