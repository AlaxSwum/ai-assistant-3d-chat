# Environment Setup

## Required Environment Variables

To run this application locally, you need to set up the following environment variable:

### OpenRouter API Key

1. **Get your API key**: Visit [OpenRouter.ai](https://openrouter.ai/) and create an account
2. **Generate an API key** from your dashboard
3. **Set the environment variable**:

#### Option 1: Using .env file (Recommended for local development)

Create a `.env` file in the project root:

```bash
OPENROUTER_API_KEY=your_api_key_here
```

#### Option 2: Export environment variable

```bash
export OPENROUTER_API_KEY=your_api_key_here
```

#### Option 3: Set in your shell profile

Add to your `~/.bashrc`, `~/.zshrc`, or equivalent:

```bash
export OPENROUTER_API_KEY=your_api_key_here
```

## Security Notes

- ✅ The `.env` file is already included in `.gitignore`
- ✅ Never commit API keys to version control
- ✅ Use environment variables for all sensitive credentials
- ✅ For production deployment, set environment variables in your hosting platform

## Running the Application

After setting up the environment variable:

1. **Backend**: `python app.py`
2. **Frontend**: `cd frontend && npm start`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000