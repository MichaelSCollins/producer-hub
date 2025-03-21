# Build stage
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /build

# Install dos2unix to handle line endings
RUN apk add --no-cache dos2unix

# Copy Gradle files first
COPY gradle ./gradle
COPY build.gradle.kts settings.gradle.kts gradlew gradlew.bat ./

# Fix line endings and make gradlew executable
RUN dos2unix gradlew && chmod +x gradlew

# Copy source code
COPY src ./src

# Build the application
RUN ./gradlew bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /build/build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]