FROM python:3.9-slim

WORKDIR /app

# Install system dependencies including ffmpeg for audio processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    git \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install whisper models to avoid download delays in production
RUN python -c "import whisper; whisper.load_model('base')"

# Copy application code
COPY . .

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
  CMD curl -f http://localhost:8000/api/test || exit 1

# Command to run the application
CMD ["python", "app.py", "--port", "8000", "--prod"] 