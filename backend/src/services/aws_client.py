"""
Backward compatibility layer for the original AWS client functionality
Now redirects to the full Investease client implementation
"""

from src.services.investease_client import register_client_with_investease
import requests
import json
import os

AWS_API_ENDPOINT = "https://2dcq63co40.execute-api.us-east-1.amazonaws.com/dev/clients"
last_registered_client_id = None
g_client_data = None
simulate_client_data = None


# Backward compatibility aliases
def register_client_with_aws(client_data):
    """Backward compatibility - redirects to full Investease client"""
    return register_client_with_investease(client_data)
