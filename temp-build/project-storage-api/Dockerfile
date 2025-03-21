# Build stage
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /build

# Install necessary tools
RUN apk add --no-cache dos2unix

# Copy gradle files first for better layer caching
COPY gradle/ gradle/
COPY gradlew build.gradle.kts settings.gradle.kts ./

# Fix line endings and permissions
RUN dos2unix gradlew && \
    chmod +x gradlew

# Copy source code
COPY src/ src/

# Build
RUN ./gradlew bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /build/build/libs/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java","-jar","app.jar"]