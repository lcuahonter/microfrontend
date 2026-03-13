# Stage 1: Build the Angular app
FROM node:22-slim AS node
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json .
COPY nx.json .
COPY tsconfig.base.json .

# Install dependencies with proper flags
# Using --force since that's what was working in the original Dockerfile
RUN npm install --force --no-audit
RUN npm install -g nx

# Now copy the rest of the project files
COPY . .

# Print diagnostic information for troubleshooting
RUN echo "Project structure:" && ls -la
RUN echo "Shared library structure:" && ls -la libs/shared

# Build the shared library
RUN npx nx build shared --verbose

# Create structured output directory
RUN mkdir -p /app/output/assets

# Copy files to output directory using a more reliable method
RUN sh -c 'if [ -d "/app/dist/libs/shared" ] && [ -n "$(ls -A /app/dist/libs/shared 2>/dev/null)" ]; then \
        cp -r /app/dist/libs/shared/* /app/output/; \
    elif [ -d "/app/libs/shared/data-access-user/src" ] && [ -n "$(ls -A /app/libs/shared/data-access-user/src 2>/dev/null)" ]; then \
        cp -r /app/libs/shared/data-access-user/src/* /app/output/; \
    else \
        echo "<html><head><title>Shared Library</title></head><body><h1>Shared Library</h1><p>This is the shared library component.</p></body></html>" > /app/output/index.html; \
    fi'

# Copy theme assets if they exist
RUN sh -c 'if [ -d "/app/libs/shared/theme/assets" ] && [ -n "$(ls -A /app/libs/shared/theme/assets 2>/dev/null)" ]; then \
        cp -r /app/libs/shared/theme/assets/* /app/output/assets/; \
    fi'

# Stage 2: Serve with Nginx
FROM nginx:alpine-slim

# Add metadata labels
LABEL org.opencontainers.image.title="Shared Library"
LABEL org.opencontainers.image.description="Angular shared component library"
LABEL org.opencontainers.image.version="1.0.0"

# Copy Nginx configuration
COPY ./libs/shared/nginx.conf /etc/nginx/nginx.conf

# Create directory for nginx content
RUN mkdir -p /usr/share/nginx/html/assets

# Copy the build artifacts
COPY --from=node /app/output/ /usr/share/nginx/html/

# Set proper permissions for nginx files
RUN chmod -R 755 /usr/share/nginx/html

# Configure health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Expose port for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]