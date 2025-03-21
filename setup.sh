#!/bin/bash

# Make the script exit on any error
set -e

echo "Setting up postgres services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
# AWS credentials for LocalStack
AWS_ACCESS_KEY=test
AWS_SECRET_KEY=test

# Database credentials
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Service ports
FRONTEND_PORT=3000
PROJECT_STORAGE_PORT=8081
AUDIO_STORAGE_PORT=8080
EOL
fi

# Build and start services
echo "Building and starting services..."
docker compose down -v
docker compose up --build -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "Checking services..."
if docker compose ps | grep -q "Up"; then
    echo "Services are running!"
    echo "Frontend: http://localhost:3000"
    echo "Project Storage API: http://localhost:8081"
    echo "Audio Storage API: http://localhost:8080"
else
    echo "Error: Some services failed to start. Check logs with: docker compose logs"
    exit 1
fi 