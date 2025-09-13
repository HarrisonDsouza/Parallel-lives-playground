from flask import Blueprint, request, jsonify, current_app
import cohere

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")

@ai_bp.route("/generate", methods=["POST"])
def generate():
    """
    POST body example:
    {
      "content": "Tell me a joke about programmers."
    }
    """
    body = request.get_json()
    if not body or "content" not in body:
        return jsonify({"error": "content required"}), 400

    user_content = body["content"]

    try:
        client = cohere.ClientV2(current_app.config["COHERE_API_KEY"])
        resp = client.chat(
            model="command-a-03-2025",  # hardcoded model
            messages=[
                {"role": "system", "content": "You are a helpful financial assistant there to guide children to prepare for their future."},
                {"role": "user", "content": user_content},
            ],
            temperature=0.7,   # hardcoded
            max_tokens=150     # hardcoded
        )
        text = resp.message.content[0].text
        return jsonify({"response": text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
