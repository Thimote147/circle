# Stage 1: Build the React app
FROM node:20 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (use npm ci for better reliability)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Verify vite is installed (optional for debugging)
RUN ls -la node_modules/.bin/  # This will list executables, including vite

# Build the application
RUN npm run build

# Stage 2: Serve the React app using Nginx
FROM nginx:stable-alpine

# Copy the custom nginx.conf file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built application from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port on which Nginx will serve the app
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]