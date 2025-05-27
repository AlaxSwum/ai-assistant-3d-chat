# Setting Up AI Teacher on Render

This guide will walk you through deploying your AI Teacher application on Render using the hosted Ollama model.

## Step 1: Push Your Model to Ollama

First, push your custom model to Ollama's registry:

```bash
# Make the script executable
chmod +x push-model.sh

# Run the script
./push-model.sh
```

This script will:
1. Pull the llama3.2 base model
2. Create a custom Modelfile with your teacher assistant prompt
3. Create your custom model as "Swum/ollma"
4. Push the model to Ollama's registry

## Step 2: Set Up Render Web Service for Backend

1. Log in to your Render account
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: ai-teacher-backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py --prod`

5. Add the following environment variables:
   - `OLLAMA_API_URL` = `https://ollama.ai/api`
   - `OLLAMA_MODEL` = `Swum/ollma`
   - `USE_OLLAMA_LIBRARY` = `true`
   - `FLASK_ENV` = `production`
   - `LOG_LEVEL` = `INFO`

6. Click "Create Web Service"

## Step 3: Set Up Render Static Site for Frontend

1. Click "New" and select "Static Site"
2. Connect your GitHub repository
3. Configure the site:
   - **Name**: ai-teacher-frontend
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && REACT_APP_API_URL=https://your-backend-url.onrender.com npm run build`
     (replace `your-backend-url` with your actual backend URL)
   - **Publish Directory**: `build`

4. Click "Create Static Site"

## Step 4: Test Your Deployment

1. Once both services are deployed, visit your frontend URL
2. Try asking a question to verify the backend is connecting to Ollama
3. Check the logs in Render if you encounter any issues

## Troubleshooting

- **API Connection Issues**: Make sure your backend URL in the frontend build command is correct
- **Model Not Found**: Verify your model was pushed correctly to Ollama with `ollama list`
- **Server Errors**: Check the Render logs for your backend service

## Maintaining Your Application

To update your application:
1. Push changes to your GitHub repository
2. Render will automatically rebuild and deploy your services 