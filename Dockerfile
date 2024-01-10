# Start with Node.js base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the application on port 3000
EXPOSE 3000

# Command to create the database tables and run the server
CMD npm run create-db && npm start
