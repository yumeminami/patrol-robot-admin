FROM node:latest

# Create app directory
WORKDIR /patrol-robot-admin
COPY . /patrol-robot-admin

# Install app dependencies
RUN npm install --force --slient

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]