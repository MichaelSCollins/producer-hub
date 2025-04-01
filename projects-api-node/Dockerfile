FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 8082

ENV NODE_OPTIONS="--experimental-specifier-resolution=node"

CMD ["npm", "run", "dev"] 