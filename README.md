# ProducerHub

ProducerHub is a modern Digital Audio Workstation (DAW) web application that allows users to create and edit music projects in their browser. It provides a powerful and intuitive interface for audio track management, mixing, and effects processing.

## Project Structure

The project consists of three main components:

- `app-shell-ui`: Next.js frontend application
- `ph-audio-storage-api`: Spring Boot service for audio file storage and management
- `project-storage-api`: Spring Boot service for project data management

## Prerequisites

- Node.js 18+
- Java 17+
- Docker and Docker Compose
- Git

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ProducerHub.git
cd ProducerHub
```

2. Start the development environment:
```bash
# On Windows
./start.bat

# On Unix-like systems
./setup.sh
```

This will:
- Start all required Docker containers
- Install dependencies for the frontend application
- Start the development servers

## Development

The development servers will be available at:

- Frontend: http://localhost:3000
- Audio Storage API: http://localhost:8080
- Project Storage API: http://localhost:8081

## License

This project is licensed under the MIT License - see the LICENSE file for details. 