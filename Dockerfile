FROM node:20-alpine AS build

# Set working directory inside container
WORKDIR /app

# Copy package files separately for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the React app
RUN npm run build

# ========================
# Stage 2: Serve with Nginx
# ========================
FROM nginx:alpine

# Copy the build output from Stage 1
COPY --from=build /app/build /usr/share/nginx/html


# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]