from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

def analyze_user_intent(user_message):
    """Kept for testing endpoint but not used for actual chat"""
    message = user_message.lower().strip()
    greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']
    if message in greetings or len(message) <= 3:
        return "brief"
    
    
    brief_indicators = [
        'yes or no', 'quickly', 'briefly', 'short answer', 'simple',
        'can i', 'is it', 'does it', 'will it', 'should i', 'how to', 'explain', 'what is', 'why', 'process', 'steps', 
        'guide', 'tutorial', 'detailed', 'comprehensive', 'complete',
        'tell me about', 'walk me through', 'show me', 'teach me',
        'what are the benefits', 'what should i do'
    ]
    if any(indicator in message for indicator in detail_indicators):
        return "detailed"
    if any(indicator in message for indicator in brief_indicators):
        return "brief"
    return "moderate"

def create_smart_prompt(user_message, response_type, lang="en"):
    """Create a context-aware prompt based on user intent"""
    if user_message.lower().strip() in ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']:
        return f"You are a friendly waste management expert. Greet the user warmly and briefly introduce how you can help with waste management, recycling, and sustainability questions. Keep it to 1-2 sentences. User said: {user_message}"
    
    base_prompts = {
        "en": {
            "brief": """You are a waste management expert. Give a concise, direct answer in 1-2 sentences maximum. Be helpful but brief.

Rules:
- Maximum 2 sentences
- Direct and to the point
- Focus on the most important information
- Use simple language""",
        },
        "hi": {
            "brief": "आप एक कचरा प्रबंधन विशेषज्ञ हैं। अधिकतम 1-2 वाक्यों में संक्षिप्त, सीधा उत्तर दें।",
        },
        "es": {
            "brief": "Eres un experto en gestión de residuos. Da una respuesta concisa y directa en máximo 1-2 oraciones.",
        }
    }

    topic_focus = """

Focus areas:
- Waste reduction and recycling
- Composting and organic waste
- Environmental sustainability
- Practical home/office solutions
- Local waste management practices

"""
    prompt_base = base_prompts.get(lang, base_prompts["en"])["brief"]
    return f"{prompt_base}{topic_focus}\nUser question: {user_message}"

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message", "")
    lang = data.get("lang", "en")

    if not user_message.strip():
        return jsonify({"response": "Please ask me something about waste management!"}), 400

    print(f"Received message: {user_message}")

    try:
        # FORCE BRIEF RESPONSE TYPE
        response_type = "brief"
        print("Forced response type: brief")

        # Create smart prompt
        smart_prompt = create_smart_prompt(user_message, response_type, lang)
        print(f"Generated prompt for type '{response_type}'")

        ollama_config = {
            "model": "phi3:mini",
            "prompt": smart_prompt,
            "stream": False,
            "options": {
                "temperature": 0.5,
                "top_p": 0.8,
                "max_tokens": 30
            }
        }

        response = requests.post(
            "http://localhost:11434/api/generate",
            json=ollama_config,
            headers={"Content-Type": "application/json"},
            timeout=60
        )

        print(f"Ollama response status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            ai_response = result.get('response', 'No response from model').strip()

            # Ensure response is brief (max 2 sentences)
            sentences = ai_response.split('. ')
            if len(sentences) > 2:
                ai_response = '. '.join(sentences[:2]) + '.'

            print(f"Final response: {ai_response}")
            return jsonify({
                "response": ai_response,
                "response_type": response_type
            })
        else:
            print(f"Ollama API error: {response.status_code} - {response.text}")
            return jsonify({"response": "Sorry, there was an error with the AI service."}), 500

    except requests.exceptions.ConnectionError:
        print("Connection error: Could not connect to Ollama API")
        return jsonify({"response": "Could not connect to AI service. Please check if Ollama is running."}), 500
    except requests.exceptions.Timeout:
        print("Request timeout")
        return jsonify({"response": "Request timed out. Please try again with a simpler question."}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"response": "Sorry, there was an unexpected error."}), 500

@app.route('/health', methods=['GET'])
def health():
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json()
            return jsonify({
                "status": "healthy", 
                "available_models": [model['name'] for model in models.get('models', [])],
                "timestamp": "2025-06-22"
            })
        else:
            return jsonify({"status": "unhealthy", "error": "Could not connect to Ollama"}), 500
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

@app.route('/test-intents', methods=['POST'])
def test_intents():
    data = request.json
    test_messages = data.get("messages", [])
    
    results = []
    for msg in test_messages:
        intent = analyze_user_intent(msg)
        results.append({
            "message": msg,
            "detected_intent": intent,
            "message_length": len(msg)
        })

    return jsonify({"results": results})

if __name__ == '__main__':
    print("Starting Smart Waste Management Chatbot Backend...")
    print("Available endpoints:")
    print("- POST /chat - Main chat endpoint (brief answers only)")
    print("- GET /health - Health check")
    print("- POST /test-intents - Intent test (for analysis)")
    app.run(port=5001, debug=True)
