#!/bin/bash

# Clean up any previous temp directory
rm -rf ../project-storage-api-temp

# Create a fresh temporary directory
mkdir -p ../project-storage-api-temp

# Copy only necessary files, excluding .git and other unnecessary files
cp -r \
    src \
    gradle \
    build.gradle.kts \
    settings.gradle.kts \
    gradlew \
    gradlew.bat \
    Dockerfile \
    .dockerignore \
    ../project-storage-api-temp/

# Ensure gradlew has the correct line endings and permissions
cd ../project-storage-api-temp
dos2unix gradlew 2>/dev/null || true
chmod +x gradlew

# Build and run
docker build --no-cache -t ph-project-storage-api .
cd ..
docker-compose up -d ph-project-storage-api

# Clean up
rm -rf project-storage-api-temp 