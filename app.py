from flask import Flask, request, jsonify, send_from_directory
import requests
import json
import os
from flask_cors import CORS
import subprocess
import uuid
import tempfile
import re
from gtts import gTTS
import argparse
import logging  # Add logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

app = Flask(__name__)
CORS(app)

# OpenRouter API configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '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')
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Debug: Log API configuration
logging.info(f"OpenRouter API URL: {OPENROUTER_API_URL}")
if OPENROUTER_API_KEY and OPENROUTER_API_KEY != "PLEASE_SET_YOUR_OPENROUTER_API_KEY":
    logging.info(f"OpenRouter API key configured (length: {len(OPENROUTER_API_KEY)})")
    logging.info(f"API key starts with: {OPENROUTER_API_KEY[:10]}...")
else:
    logging.error("OpenRouter API key not configured! Please get a new API key from https://openrouter.ai/keys")
    logging.error("Set it as environment variable OPENROUTER_API_KEY or update the code directly")

# Ensure static directory exists
os.makedirs('static/audio', exist_ok=True)

# Adding manual CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Check if API key is configured
        if not OPENROUTER_API_KEY:
            return jsonify({"error": "OpenRouter API key not configured"}), 500
        
        # Get the user message and profile data from request
        user_message = request.json.get('message', '')
        response_format = request.json.get('responseFormat', 'standard')
        user_name = request.json.get('userName', '')
        user_role = request.json.get('userRole', '')
        user_bio = request.json.get('userBio', '')
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        logging.info(f"Processing chat request: format={response_format}")
        
        try:    
            # Adjust prompt based on response format
            format_instructions = {
                'simple': """Format your responses in a clear, simple way using markdown:
- Use basic vocabulary and short sentences
- Explain concepts in simple terms without jargon
- Use bullet points for lists
- Keep explanations brief and direct
- Use examples that are easy to understand
- Organize information in a readable manner""",
                
                'standard': """Format your responses in a clear, structured way using markdown:
- Use ## headers for main sections
- Use ### subheaders for subsections
- Use bullet points for lists
- Use numbered lists for steps or processes
- Always start with a brief introduction
- End with a concise conclusion or summary
- Organize information in a readable, hierarchical manner""",
                
                'advanced': """Format your responses in a comprehensive, detailed way using markdown:
- Use ## headers for main sections
- Use ### subheaders for subsections
- Begin with a brief introduction of the topic
- Include in-depth explanations with nuanced details
- Use bullet points for lists
- Reference advanced concepts and make connections between ideas
- Provide thorough analysis with supporting evidence
- End with a concise conclusion or summary"""
            }
            
            # Default to standard if invalid format is provided
            selected_format = format_instructions.get(response_format, format_instructions['standard'])
            
            # Build user profile context
            user_profile = ""
            if user_name or user_role or user_bio:
                user_profile = "User Profile Information:\n"
                if user_name:
                    user_profile += f"Name: {user_name}\n"
                if user_role:
                    user_profile += f"Role: {user_role}\n"
                if user_bio:
                    user_profile += f"Background: {user_bio}\n"
            
            # Prepare the system message and user message
            system_message = f"""You are an AI teacher helping students learn. 
{selected_format}

IMPORTANT FORMATTING INSTRUCTIONS:
1. Structure your response with clear sections using markdown headers (##)
2. Each section should be focused on a specific aspect of the answer
3. Use bullet points or numbered lists for clarity
4. DO NOT use asterisks (*) for emphasis - use simple, clear language instead
5. Make your response visually organized and easy to scan
6. Provide examples when appropriate

{user_profile}"""
            
            # Prepare the OpenRouter request
            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "meta-llama/llama-3.1-8b-instruct:free",
                "messages": [
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ]
            }
            
            # Debug: Log request details
            logging.info("Sending request to OpenRouter API")
            logging.info(f"Request URL: {OPENROUTER_API_URL}")
            logging.info(f"Model: {data['model']}")
            logging.info(f"Authorization header: Bearer {OPENROUTER_API_KEY[:20]}...")
            logging.info(f"Full headers: {headers}")
            response = requests.post(
                OPENROUTER_API_URL,
                headers=headers,
                json=data,
                timeout=30
            )
            
            # Check if request was successful
            if response.status_code != 200:
                logging.error(f"OpenRouter API error: {response.text}")
                return jsonify({"error": f"OpenRouter API error: {response.text}"}), 500
            
            # Get the AI response text
            response_data = response.json()
            ai_response = response_data['choices'][0]['message']['content']
            
            if not ai_response:
                logging.error(f"No response from OpenRouter API: {response_data}")
                return jsonify({"error": "No response from OpenRouter API"}), 500
            
            # Generate audio from the response text
            audio_path = generate_audio(ai_response)
            
            # Return the text response and audio path
            return jsonify({
                "message": ai_response,
                "formatted": True,
                "audio_url": audio_path
            })
            
        except requests.exceptions.ConnectionError:
            logging.error("Failed to connect to OpenRouter service")
            return jsonify({
                "error": "Failed to connect to OpenRouter API",
                "message": "Connection to OpenRouter service failed. Please check your internet connection."
            }), 500
        except Exception as e:
            logging.error(f"Error communicating with OpenRouter: {str(e)}")
            return jsonify({
                "error": f"Error communicating with OpenRouter: {str(e)}",
                "message": "There was a problem with the OpenRouter service."
            }), 500
            
    except Exception as e:
        logging.error(f"Server error: {str(e)}")
        return jsonify({"error": str(e), "message": "Server error occurred"}), 500

import hashlib
import time

# TTS rate limiting and caching
last_tts_request = 0
TTS_RATE_LIMIT = 2  # seconds between requests
audio_cache = {}  # Simple in-memory cache

def generate_audio(text):
    """Generate audio from text using multiple TTS services with rate limiting and caching"""
    global last_tts_request
    
    try:
        # Clean the text for better TTS
        cleaned_text = re.sub(r'##+\s+', '', text)  # Remove headers
        cleaned_text = re.sub(r'\*\*?(.*?)\*\*?', r'\1', cleaned_text)  # Remove bold/italic
        cleaned_text = re.sub(r'`.*?`', '', cleaned_text)  # Remove code
        cleaned_text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', cleaned_text)  # Simplify links
        cleaned_text = re.sub(r'^\s*[-*+]\s+', '• ', cleaned_text, flags=re.MULTILINE)  # Convert list items
        cleaned_text = re.sub(r'^\s*\d+\.\s+', '', cleaned_text, flags=re.MULTILINE)  # Remove numbered list markers
        cleaned_text = re.sub(r'\n\n+', '. ', cleaned_text)  # Replace multiple newlines with periods
        cleaned_text = re.sub(r'\n', '. ', cleaned_text)  # Replace single newlines with periods
        cleaned_text = re.sub(r'\.{2,}', '.', cleaned_text)  # Replace multiple periods with single
        cleaned_text = re.sub(r'\s{2,}', ' ', cleaned_text)  # Replace multiple spaces with single
        
        # Limit text length for better TTS performance
        if len(cleaned_text) > 500:
            # Split into sentences and take first few
            sentences = cleaned_text.split('. ')
            cleaned_text = '. '.join(sentences[:3]) + '.'
        
        # Check cache first
        text_hash = hashlib.md5(cleaned_text.encode()).hexdigest()[:8]
        if text_hash in audio_cache:
            logging.info(f"Using cached audio for text hash: {text_hash}")
            return audio_cache[text_hash]
        
        # Rate limiting
        current_time = time.time()
        time_since_last = current_time - last_tts_request
        if time_since_last < TTS_RATE_LIMIT:
            sleep_time = TTS_RATE_LIMIT - time_since_last
            logging.info(f"Rate limiting: sleeping for {sleep_time:.2f} seconds")
            time.sleep(sleep_time)
        
        # Generate a unique filename
        filename = f"answer_{text_hash}.mp3"
        filepath = os.path.join("static/audio", filename)
        
        # Skip if file already exists
        if os.path.exists(filepath):
            audio_url = f"/static/audio/{filename}"
            audio_cache[text_hash] = audio_url
            logging.info(f"Audio file already exists: {filename}")
            return audio_url
        
        # Try multiple TTS services with longer delays between attempts
        tts_success = False
        
        # Method 1: Try gTTS with longer delays
        for attempt, (tld, name) in enumerate([('com.au', 'Australian'), ('com', 'US'), ('co.uk', 'UK')]):
            try:
                if attempt > 0:
                    delay = 5 * attempt  # Increasing delay: 5s, 10s
                    logging.info(f"Waiting {delay}s before trying {name} TTS...")
                    time.sleep(delay)
                
                logging.info(f"Trying {name} gTTS...")
                tts = gTTS(text=cleaned_text, lang='en', tld=tld, slow=False)
                tts.save(filepath)
                tts_success = True
                logging.info(f"Successfully generated audio with {name} gTTS")
                break
            except Exception as e:
                logging.warning(f"{name} gTTS failed: {str(e)}")
                continue
        
        # Method 2: Fallback to pyttsx3 (offline TTS) if gTTS fails
        if not tts_success:
            try:
                logging.info("Trying offline pyttsx3 TTS...")
                import pyttsx3
                engine = pyttsx3.init()
                engine.setProperty('rate', 150)  # Speed
                engine.setProperty('volume', 0.9)  # Volume
                
                # Convert to WAV first, then to MP3 if possible
                wav_filepath = filepath.replace('.mp3', '.wav')
                engine.save_to_file(cleaned_text, wav_filepath)
                engine.runAndWait()
                
                # Try to convert WAV to MP3 using ffmpeg if available
                try:
                    import subprocess
                    subprocess.run(['ffmpeg', '-i', wav_filepath, '-codec:a', 'mp3', filepath], 
                                 check=True, capture_output=True)
                    os.remove(wav_filepath)  # Remove WAV file
                    tts_success = True
                    logging.info("Successfully generated audio with pyttsx3 + ffmpeg")
                except (subprocess.CalledProcessError, FileNotFoundError):
                    # If ffmpeg not available, use WAV file directly
                    os.rename(wav_filepath, filepath.replace('.mp3', '.wav'))
                    filename = filename.replace('.mp3', '.wav')
                    filepath = filepath.replace('.mp3', '.wav')
                    tts_success = True
                    logging.info("Successfully generated audio with pyttsx3 (WAV format)")
            except ImportError:
                logging.warning("pyttsx3 not available")
            except Exception as e:
                logging.warning(f"pyttsx3 TTS failed: {str(e)}")
        
        # Method 3: Create a simple text-to-speech placeholder
        if not tts_success:
            logging.info("All TTS methods failed, creating placeholder response")
            # Return None to indicate no audio available
            return None
        
        last_tts_request = time.time()
        audio_url = f"/static/audio/{filename}"
        audio_cache[text_hash] = audio_url
        logging.info(f"Generated audio file: {filename}")
        return audio_url
        
    except Exception as e:
        logging.error(f"Error generating audio: {str(e)}")
        return None

@app.route('/api/speech-to-text', methods=['POST'])
def speech_to_text():
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
            
        audio_file = request.files['audio']
        
        # Save the uploaded audio to a temporary file
        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        audio_file.save(temp_audio.name)
        temp_audio.close()
        
        try:
            # Use Whisper with simplified settings for better compatibility
            result = subprocess.run(
                ["whisper", temp_audio.name, "--model", "small", "--output_format", "txt", "--language", "en"],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Clean up the temporary file
            os.unlink(temp_audio.name)
            
            # Get the transcript (should be in a .txt file with same name as input)
            transcript_file = temp_audio.name.replace('.wav', '.txt')
            
            transcript = ""
            if os.path.exists(transcript_file):
                with open(transcript_file, 'r', encoding='utf-8') as f:
                    transcript = f.read().strip()
                os.unlink(transcript_file)
            else:
                transcript = result.stdout.strip()
            
            # Clean up timestamp markers and other artifacts
            transcript = re.sub(r'\[\d+:\d+\.\d+ --> \d+:\d+\.\d+\]', '', transcript)
            transcript = re.sub(r'\(.*?\)', '', transcript)  # Remove parenthetical content
            transcript = re.sub(r'\s+', ' ', transcript)  # Replace multiple spaces with single space
            transcript = transcript.strip()
            
            # If transcript is too short, it might be noise
            if len(transcript) < 2:
                return jsonify({"error": "Could not understand audio clearly", "transcript": ""})
                
            logging.info(f"Transcribed audio: {transcript}")
            return jsonify({"transcript": transcript})
        
        except subprocess.SubprocessError as e:
            logging.error(f"Whisper subprocess error: {str(e)}")
            return jsonify({"error": f"Speech-to-text failed: {str(e)}", "message": "Could not process audio"}), 500
            
    except Exception as e:
        logging.error(f"Speech-to-text error: {str(e)}")
        return jsonify({"error": str(e), "message": "Server error while processing audio"}), 500

# Add a simple test endpoint
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({
        "status": "ok", 
        "message": "API is working",
        "api_key_present": bool(OPENROUTER_API_KEY),
        "api_key_prefix": OPENROUTER_API_KEY[:10] if OPENROUTER_API_KEY else "None"
    })

# Debug endpoint to check environment
@app.route('/api/debug', methods=['GET'])
def debug():
    return jsonify({
        "openrouter_key_set": "OPENROUTER_API_KEY" in os.environ,
        "openrouter_key_length": len(OPENROUTER_API_KEY) if OPENROUTER_API_KEY else 0,
        "python_unbuffered": os.environ.get("PYTHONUNBUFFERED", "not_set")
    })

# Serve React frontend static files (JS, CSS, etc.)
@app.route('/static/js/<filename>')
def serve_js(filename):
    logging.info(f"Serving JS file: {filename}")
    try:
        return send_from_directory('frontend/build/static/js', filename)
    except Exception as e:
        logging.error(f"JS file not found: {filename}, error: {str(e)}")
        return "File not found", 404

@app.route('/static/css/<filename>')
def serve_css(filename):
    logging.info(f"Serving CSS file: {filename}")
    try:
        return send_from_directory('frontend/build/static/css', filename)
    except Exception as e:
        logging.error(f"CSS file not found: {filename}, error: {str(e)}")
        return "File not found", 404

@app.route('/static/media/<filename>')
def serve_media(filename):
    logging.info(f"Serving media file: {filename}")
    try:
        return send_from_directory('frontend/build/static/media', filename)
    except Exception as e:
        logging.error(f"Media file not found: {filename}, error: {str(e)}")
        return "File not found", 404

# Serve audio files
@app.route('/static/audio/<filename>')
def serve_audio(filename):
    return send_from_directory('static/audio', filename)

# Serve favicon and other root files
@app.route('/favicon.ico')
def serve_favicon():
    return send_from_directory('frontend/build', 'favicon.ico')

@app.route('/manifest.json')
def serve_manifest():
    return send_from_directory('frontend/build', 'manifest.json')

# Serve React frontend
@app.route('/')
def serve_frontend():
    try:
        logging.info("Serving frontend index.html")
        return send_from_directory('frontend/build', 'index.html')
    except Exception as e:
        logging.error(f"Error serving frontend: {str(e)}")
        # Check if the file exists
        import os
        index_path = os.path.join('frontend/build', 'index.html')
        if os.path.exists(index_path):
            logging.error(f"index.html exists at {index_path}")
        else:
            logging.error(f"index.html NOT found at {index_path}")
        return jsonify({"error": "Frontend not available", "message": "Please check if frontend is built"}), 500

# Catch all other routes and serve React frontend (for React Router)
@app.route('/<path:path>')
def catch_all(path):
    # If it's an API route, return 404
    if path.startswith('api/'):
        return jsonify({"error": "API endpoint not found"}), 404
    
    # Check if it's a static file request and serve it
    if path.startswith('static/'):
        try:
            return send_from_directory('frontend/build', path)
        except Exception as e:
            logging.error(f"Static file not found: {path}")
            return "File not found", 404
    
    # Otherwise serve the React app
    try:
        return send_from_directory('frontend/build', 'index.html')
    except Exception as e:
        logging.error(f"Error serving frontend for path {path}: {str(e)}")
        return jsonify({"error": "Frontend not available"}), 500

if __name__ == '__main__':
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Run the AI Teacher Flask app')
    parser.add_argument('--port', type=int, default=int(os.environ.get('PORT', 8000)), help='Port to run the server on')
    parser.add_argument('--prod', action='store_true', help='Run in production mode')
    args = parser.parse_args()
    
    port = args.port
    
    if args.prod:
        # Production mode
        logging.info(f"Starting server in PRODUCTION mode on port {port}")
        from waitress import serve
        serve(app, host='0.0.0.0', port=port)
    else:
        # Development mode
        logging.info(f"Starting server in DEVELOPMENT mode on port {port}")
        app.run(debug=True, host='0.0.0.0', port=port)
