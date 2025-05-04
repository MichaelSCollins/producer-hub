FROM node:23-alpine



WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
# RUN npm run build

# Expose port
EXPOSE 4444

# Start the applicationw
CMD ["npm", "start"] 