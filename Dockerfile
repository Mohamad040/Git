FROM node:18

# Set working directory
WORKDIR /

# Copy only dependency files first
COPY package*.json ./
COPY my-react-app/package*.json ./my-react-app/
COPY server/package*.json ./server/

# Install root deps (for concurrently)
RUN npm install

# Install backend and frontend deps
WORKDIR /server
RUN npm install

WORKDIR /my-react-app
RUN npm install

# Copy the rest of the code
WORKDIR /
COPY . .

# Expose ports
EXPOSE 8000 3000

# Start both servers
CMD ["npm", "start"]
