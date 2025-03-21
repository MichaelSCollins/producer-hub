# postgres

A Digital Audio Workstation (DAW) web application for music production.

## Architecture

The application consists of three main components:

1. Frontend (app-shell-ui)
   - React application
   - Port: 3000
   - Provides the user interface for the DAW

2. Project Storage Service (project-storage-api)
   - Spring Boot application
   - Port: 8081
   - Manages project metadata, channels, and tracks
   - Uses PostgreSQL for storage

3. Audio Storage Service (sample-storage-api)
   - Spring Boot application
   - Port: 8080
   - Manages audio file uploads and downloads
   - Uses S3 for file storage and PostgreSQL for metadata

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Java 17+ (for local development)
- PostgreSQL (for local development)
- AWS account with S3 access (or use LocalStack for development)

## Running with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd postgres
   ```

2. Create a `.env` file in the root directory:
   ```bash
   # For development with LocalStack
   AWS_ACCESS_KEY=test
   AWS_SECRET_KEY=test
   ```

3. Start all services:
   ```bash
   docker-compose up --build
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Project Storage API: http://localhost:8081
- Audio Storage API: http://localhost:8080

## Development Setup

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd app-shell-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Project Storage Service

1. Navigate to the project storage directory:
   ```bash
   cd project-storage-api
   ```

2. Start PostgreSQL:
   ```bash
   docker-compose up -d project-db
   ```

3. Run the application:
   ```bash
   ./gradlew bootRun
   ```

### Audio Storage Service

1. Navigate to the audio storage directory:
   ```bash
   cd sample-storage-api
   ```

2. Start PostgreSQL and LocalStack:
   ```bash
   docker-compose up -d audio-db localstack
   ```

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

## Testing

Each service includes its own test suite. To run tests:

- Frontend: `npm test`
- Project Storage: `./gradlew test`
- Audio Storage: `./mvnw test`

## API Documentation

### Project Storage API

- `POST /api/projects` - Create a new project
- `GET /api/projects/{id}` - Get project by ID
- `GET /api/projects` - List user's projects
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/{id}/channels` - Add channel to project
- `PUT /api/projects/{id}/channels/{channelId}` - Update channel
- `DELETE /api/projects/{id}/channels/{channelId}` - Delete channel

### Audio Storage API

- `POST /api/audio` - Upload audio file
- `GET /api/audio/{id}` - Download audio file
- `GET /api/audio` - List all audio files
- `GET /api/audio/search` - Search audio files
- `DELETE /api/audio/{id}` - Delete audio file 