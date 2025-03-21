# Clean up any previous temp directory
Remove-Item -Path "../project-storage-api-temp" -Recurse -Force -ErrorAction SilentlyContinue
# Create a fresh temporary directory
New-Item -Path "../project-storage-api-temp" -ItemType Directory -Force

# Copy necessary files
Copy-Item -Path "src", "gradle", "build.gradle.kts", "settings.gradle.kts", "gradlew", "gradlew.bat", "Dockerfile", ".dockerignore" -Destination "../project-storage-api-temp" -Recurse

# Set correct line endings for gradlew
$content = Get-Content "../project-storage-api-temp/gradlew" -Raw
$content = $content -replace "`r`n", "`n"
Set-Content "../project-storage-api-temp/gradlew" -Value $content -NoNewline
# Build and run
Set-Location "../project-storage-api-temp"
docker build --no-cache -t ph-project-storage-api .
Set-Location ".."
docker-compose up -d ph-project-storage-api
