import json
import os
from dotenv import load_dotenv
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from RAG.rag import run_qa_chain_with_context
from flask import Flask, request, jsonify, Blueprint

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
# Initialize Flask app
main_app = Blueprint('main', __name__)


# Route for handling user messages
@main_app.get('/')
def home():
    return 'welcome to promptly api '


@main_app.post('/api/chatbot')
def chatbot():
    try:
        data = request.get_json()
        user_objective = data.get("objective", "")  # Adjust the key based on your actual data structure
        result = run_qa_chain_with_context(user_objective)

        if result is not None:
            return jsonify({"answer": result}), 200
        else:
            return jsonify({"error": "Failed to retrieve answer."}), 500

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500
