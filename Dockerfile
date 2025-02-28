# Use the official Node.js image from the Docker Hub as a base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /server

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies defined in package.json
RUN npm install

# Copy the entire project directory into the container
COPY . .

# Expose the port 5000 that the server will run on
EXPOSE 5000

# Start the server using nodemon (as defined in your package.json)
CMD ["npm", "start"]
