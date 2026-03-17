# Stage 1: Build the Angular app
FROM node:20-alpine AS node
WORKDIR /app

# Instalar glibc en Alpine
RUN apk add --no-cache ca-certificates wget && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.35-r0/glibc-2.35-r0.apk && \
    apk add --allow-untrusted --force-overwrite glibc-2.35-r0.apk && \
    rm glibc-2.35-r0.apk

# Install necessary dependencies for compilation
RUN apk add --no-cache python3 make g++ git

# Configure environment variables for optimal compatibility
ENV LD_LIBRARY_PATH=/usr/glibc-compat/lib
ENV PYTHON=/usr/bin/python3
ENV npm_config_python=/usr/bin/python3
ENV npm_config_build_from_source=false
ENV npm_config_unsafe_perm=true
ENV npm_config_prefer_offline=true

# Configurar variables de entorno para NX
ENV NX_SKIP_NX_CACHE=true
ENV NX_NATIVE_BINDINGS=false
ENV NX_VERBOSE_LOGGING=true
ENV NX_SKIP_POSTINSTALL=1

# Copy package.json and lockfile for dependency installation
COPY package*.json nx.json ./

# Copy configuration files
COPY .eslintrc.json tsconfig*.json ./

# Add workspace configuration early
RUN mkdir -p apps libs
COPY apps/dashboard/project.json apps/dashboard/

# Install NX CLI globally with specific version
RUN npm install -g nx@16.10.0

# Install dependencies
RUN npm ci --legacy-peer-deps --no-audit --no-fund

# Copy the rest of the codebase
COPY . .

# Ensure NX cache is clean
RUN npx nx reset

# Create output directory
RUN mkdir -p /app/dist/apps/dashboard

# Build the application
RUN npx nx build dashboard --configuration=development --skip-nx-cache --verbose

# Verify build success
RUN test -d "/app/dist/apps/dashboard" && test -f "/app/dist/apps/dashboard/index.html" || exit 1

# Stage 2: Serve with Nginx
FROM nginx:alpine-slim
WORKDIR /usr/share/nginx/html

# Copy Nginx configuration
COPY ./apps/dashboard/nginx.conf /etc/nginx/nginx.conf

# Copy built application files
COPY --from=node /app/dist/apps/dashboard .

# Create health check file
RUN echo "OK" > /usr/share/nginx/html/health.txt
RUN echo "OK" > /usr/share/nginx/html/health

# Expose port 80
EXPOSE 80

# Configure health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost/health.txt || wget -q --spider http://localhost/health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
