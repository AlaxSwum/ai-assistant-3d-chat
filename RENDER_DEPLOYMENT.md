# AI Teacher - Render Deployment Guide

This guide will help you deploy the AI Teacher application to Render with OpenRouter.ai integration.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **OpenRouter API Key**: You already have: `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`

## Quick Deployment (Option 1: Using render.yaml)

1. **Push to GitHub**: Make sure all your code is committed and pushed to GitHub

2. **Connect to Render**: 
   - Go to [render.com](https://render.com) 
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file and set up both services

3. **That's it!** Render will automatically:
   - Deploy the backend with OpenRouter integration
   - Deploy the frontend with proper API URL configuration
   - Set up persistent storage for audio files

## Manual Deployment (Option 2: Step by Step)

### Step 1: Deploy Backend

1. **Create Web Service**:
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Name**: `ai-teacher-backend`
     - **Runtime**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `python app.py --prod --port $PORT`

2. **Environment Variables**:
   ```
   OPENROUTER_API_KEY = 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
   PYTHONUNBUFFERED = 1
   ```

3. **Add Persistent Disk** (Optional for audio storage):
   - Name: `audio-storage`
   - Mount Path: `/app/static/audio`
   - Size: 1 GB

### Step 2: Deploy Frontend

1. **Create Static Site**:
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Use these settings:
     - **Name**: `ai-teacher-frontend`
     - **Root Directory**: `frontend`
     - **Build Command**: `npm ci && npm run build`
     - **Publish Directory**: `build`

2. **Environment Variables**:
   ```
   REACT_APP_API_URL = https://your-backend-url.onrender.com
   ```
   (Replace with your actual backend URL from Step 1)

## Features Included

✅ **OpenRouter.ai Integration**: Using free Llama 3.1 model  
✅ **Speech Recognition**: Improved Whisper with English language support  
✅ **Text-to-Speech**: Enhanced voice quality with Australian English  
✅ **CORS Configuration**: Properly configured for cross-origin requests  
✅ **Production Logging**: Comprehensive error tracking  
✅ **Audio Storage**: Persistent storage for generated audio files  

## Testing Your Deployment

1. **Backend Health Check**: Visit `https://your-backend-url.onrender.com/api/test`
2. **Frontend**: Visit your frontend URL
3. **Test Chat**: Try asking a question
4. **Test Voice**: Try the voice interface

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in requirements.txt

2. **API Connection Issues**:
   - Verify OPENROUTER_API_KEY is set correctly
   - Check backend logs for OpenRouter API errors

3. **Frontend Can't Connect to Backend**:
   - Verify REACT_APP_API_URL is set to correct backend URL
   - Check CORS configuration

4. **Speech Recognition Issues**:
   - Whisper model downloads on first use (may take time)
   - Check backend logs for Whisper errors

### Monitoring:

- **Backend Logs**: Available in Render dashboard
- **Error Tracking**: Check app.log for detailed error information
- **Performance**: Monitor response times and API usage

## Upgrading Models

To use better AI models (requires OpenRouter credits):

1. Add credits to your OpenRouter account at https://openrouter.ai/settings/credits
2. Update the model in `app.py`:
   ```python
   "model": "anthropic/claude-3-haiku"  # or other models
   ```
3. Redeploy the backend service

## Available Models (with costs):

- `meta-llama/llama-3.1-8b-instruct:free` - **FREE** (currently used)
- `anthropic/claude-3-haiku` - Cheap and fast
- `openai/gpt-3.5-turbo` - Good balance
- `anthropic/claude-3-opus-20240229` - Best quality (expensive)

## Security Notes

- API key is securely stored as environment variable
- CORS is properly configured
- No sensitive data is logged
- Audio files are temporarily stored and managed

## Support

If you encounter issues:
1. Check the Render build/runtime logs
2. Review this deployment guide
3. Check OpenRouter API status
4. Verify all environment variables are set correctly 