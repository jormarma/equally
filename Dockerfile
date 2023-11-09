# Use a specific version to make use of docker build cache
FROM node:20-alpine

# Copy package.json and package-lock.json
WORKDIR /app
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your code
COPY . .

CMD [ "npm", "run", "_test" ]