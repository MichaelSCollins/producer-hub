FROM node:18-alpine

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
# RUN npm run build

# Expose port
EXPOSE 7777

# Start the applicationw
CMD ["npm", "run", "start"] 