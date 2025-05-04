FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ./*.ts ./
COPY ./*.mjs ./
COPY ./src ./

# Install dependencies
RUN npm install

# Copy source code

# Expose port
EXPOSE 3000

# Start the applicationw
CMD ["npm", "run", "dev"]