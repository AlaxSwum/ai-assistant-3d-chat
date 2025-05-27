# AI Teacher Assistant with 3D Chat

An interactive AI teacher assistant that uses local LLM (Ollama/LLaMA 3), text-to-speech for voice generation, and Whisper for voice recognition. The application features a responsive design with animated 3D robot visualization.

## Features

- **Text Chat Interface**: Ask questions and receive structured, markdown-formatted responses
- **Voice Interaction**: Talk to the assistant and receive voice responses
- **Responsive Design**: Mobile-first approach with desktop optimization
- **3D Robot Visualization**: Canvas-based animated robot that reacts to speech
- **User Profiles**: Personalize your learning experience with customizable profiles
- **Multiple Response Formats**: Choose between simple, standard, or advanced response styles

## Tech Stack

### Frontend
- React.js with React Router for navigation
- Styled Components for CSS-in-JS styling
- Framer Motion for animations
- Canvas-based 3D visualization
- Responsive design with custom breakpoints

### Backend
- Flask server with RESTful API
- Ollama with LLaMA 3.2 for AI responses
- Google Text-to-Speech (gTTS) for audio generation
- OpenAI Whisper for speech-to-text transcription

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- Ollama with LLaMA 3 model
- Whisper

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlaxSwum/ai-assistant-3d-chat.git
   cd ai-assistant-3d-chat
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Ollama**
   Follow instructions at [Ollama's website](https://ollama.ai/) to install Ollama.
   Then pull the LLaMA 3 model:
   ```bash
   ollama pull llama3
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. **Start the backend server**
   ```bash
   python app.py
   ```
   This will start a Flask server at http://localhost:8000.

2. **Start Ollama** (in another terminal)
   ```bash
   ollama serve
   ```

3. **Start the React frontend** (in another terminal)
   ```bash
   cd frontend
   npm start
   ```
   This will start the React app at http://localhost:3000.

## Usage

1. Type a message in the chat interface and click send
2. Or click the microphone icon to record voice input
3. View structured responses with proper formatting
4. Listen to voice responses while watching the robot animation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Ollama](https://ollama.ai/) for the local LLM implementation
- [OpenAI Whisper](https://github.com/openai/whisper) for speech recognition
- [Google Text-to-Speech](https://pypi.org/project/gTTS/) for audio generation 