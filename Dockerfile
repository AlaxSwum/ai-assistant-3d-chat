# Frontend build stage
FROM node:16-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ .

# Set environment variables for React build
ENV PUBLIC_URL=/
ENV REACT_APP_API_URL=

RUN npm run build

# Backend stage  
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies including ffmpeg for audio processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    git \
    curl \
    espeak-ng \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install whisper models to avoid download delays in production
RUN python -c "import whisper; whisper.load_model('base')"

# Copy backend application code
COPY app.py .
COPY static/ ./static/

# Copy frontend build from previous stage
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Create directory for audio files with proper permissions
RUN mkdir -p static/audio && chmod 755 static/audio

# Create non-root user for security
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/api/test || exit 1

# Command to run the application
# Use PORT environment variable provided by Render, fallback to 8000
CMD ["sh", "-c", "python app.py --port ${PORT:-8000} --prod"]