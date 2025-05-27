# Deployment Guide for Testing

This guide covers deploying the AI Teacher application for testing purposes.

## Prerequisites

- Docker and Docker Compose installed
- SSL certificates (for production deployment)
- Domain name configured (for production deployment)

## Deployment Options

### 1. Local Testing with Docker Compose

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-teacher
   ```

2. Pull the LLaMA 3 model (first time only):
   ```bash
   docker-compose up ollama -d
   docker exec -it ollama-service ollama pull llama3
   ```

3. Start all services:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000/api/test

### 2. Production Deployment

#### Configuration Setup

1. Update the domain names in `frontend/nginx.conf` to match your actual domain.

2. Place your SSL certificates in the `ssl` directory:
   ```bash
   mkdir -p ssl
   # Copy your certificate files to the ssl directory
   cp your-cert.crt ssl/aiteacher-app.com.crt
   cp your-key.key ssl/aiteacher-app.com.key
   ```

3. Update the API URL in the frontend Dockerfile to match your domain:
   ```
   # In frontend/Dockerfile
   RUN REACT_APP_API_URL=https://your-api-domain.com npm run build
   ```

#### Server Setup

1. Set up a server with Docker and Docker Compose installed.

2. Configure DNS to point your domain to the server's IP address.

3. Deploy with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Set up the LLaMA 3 model:
   ```bash
   docker exec -it ollama-service ollama pull llama3
   ```

## Monitoring and Logs

- View application logs:
  ```bash
  # Backend logs
  docker logs ai-teacher-backend
  # or
  cat app.log
  
  # Frontend logs
  docker logs ai-teacher-frontend
  
  # Ollama logs
  docker logs ollama-service
  ```

## Troubleshooting

1. **Backend not starting**: Check app.log for errors.

2. **Ollama connection issues**: Ensure the model is properly pulled:
   ```bash
   docker exec -it ollama-service ollama list
   ```

3. **Frontend not connecting to backend**: Verify the API_URL configuration.

4. **SSL certificate issues**: Verify certificate paths and permissions.

## Updating the Application

1. Pull the latest code:
   ```bash
   git pull
   ```

2. Rebuild and restart the services:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

## Security Considerations

- The default setup exposes the Ollama API on port 11434. In a production environment, consider using a firewall to restrict access.
- Regularly update the Docker images and dependencies.
- Review and strengthen the nginx security configurations for production use. 