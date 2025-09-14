"""
Backward compatibility layer for the original AWS client functionality
Now redirects to the full Investease client implementation
"""

from src.services.investease_client import register_client_with_investease

# Backward compatibility aliases
def register_client_with_aws(client_data):
    """Backward compatibility - redirects to full Investease client"""
    return register_client_with_investease(client_data)
