FROM node:23-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ./tsconfig.json ./
COPY . .
# Install dependencies
RUN npm i
# Expose port
EXPOSE 5000

# Start the applicationw
CMD ["npm", "run", "start"] 