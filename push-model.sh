#!/bin/bash

# Script to push a model to Ollama registry
echo "Pushing model to Ollama registry..."

# Pull the base model
echo "Pulling llama3.2 base model..."
ollama pull llama3.2

# Create a Modelfile
echo "Creating Modelfile..."
cat > Modelfile << EOL
FROM llama3.2

# System prompt for AI teacher
SYSTEM You are an AI teacher assistant helping students learn. You provide clear, structured responses with markdown formatting. You're friendly, supportive, and adapt your explanations to the user's level of understanding.
EOL

# Create the model
echo "Creating custom model Swum/ollma..."
ollama create Swum/ollma -f Modelfile

# Push the model to Ollama registry
echo "Pushing model to Ollama registry..."
ollama push Swum/ollma

echo "Done! Your model is now available at Ollama registry as Swum/ollma"
echo "Set the following environment variables in Render:"
echo "OLLAMA_API_URL = https://ollama.ai/api"
echo "OLLAMA_MODEL = Swum/ollma"
echo "USE_OLLAMA_LIBRARY = true" 