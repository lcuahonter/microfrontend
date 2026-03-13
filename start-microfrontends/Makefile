# Makefile for VUCEM Microfrontends Deployment
# Console message colors
GREEN = \033[0;32m
RED = \033[0;31m
YELLOW = \033[0;33m
NC = \033[0m # No Color

# Common variables
NETWORK_NAME = modulefederation-network
DOCKER_REGISTRY ?= ghcr.io
REPO_OWNER ?= vucem30
ENV ?= dev

.PHONY: help build-all run-all stop-all logs ps clean clean-all build-login run-login build-aga run-aga test lint build-ci deploy-ci

# Help documentation
help:
	@echo "$(GREEN)VUCEM Microfrontends Deployment Makefile$(NC)"
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@echo " make help            - Show this help message"
	@echo " make build-all       - Build all microfrontend containers"
	@echo " make run-all         - Run all microfrontend containers"
	@echo " make stop-all        - Stop all running containers"
	@echo " make logs [app=name] - Display container logs (specify app=name for single container)"
	@echo " make ps              - List running containers"
	@echo " make clean           - Stop and remove all containers"
	@echo " make clean-all       - Remove all containers and images"
	@echo ""
	@echo "$(YELLOW)Microfrontend specific commands:$(NC)"
	@echo " make build-login     - Build login microfrontend"
	@echo " make run-login       - Run login microfrontend (port 4201)"
	@echo " make build-aga       - Build AGA microfrontend"
	@echo " make run-aga         - Run AGA microfrontend (port 4202)"
	@echo " make build-dashboard - Build dashboard (shell) microfrontend"
	@echo " make run-dashboard   - Run dashboard microfrontend (port 4200)"
	@echo ""
	@echo "$(YELLOW)CI/CD commands:$(NC)"
	@echo " make test             - Run all tests"
	@echo " make test app=<name>  - Run tests for specific app"
	@echo " make lint             - Run linting on all apps"
	@echo " make lint app=<name>  - Run linting for specific app"
	@echo " make build-ci         - Build all apps for CI"
	@echo " make build-ci app=<name> - Build specific app for CI"
	@echo " make deploy-ci        - Deploy to Kubernetes (requires env=<dev|staging|prod>)"
	@echo ""
	@echo "$(YELLOW)Examples:$(NC)"
	@echo " make build-login run-login - Build and run just the login microfrontend"
	@echo " make logs app=login        - Show logs for login container"
	@echo " make test app=dashboard    - Run tests for dashboard app"
	@echo " make deploy-ci env=dev     - Deploy to development environment"

# Create network
create-network:
	@docker network create $(NETWORK_NAME) 2>/dev/null || true

# Build all Docker images
build-all:
	@echo "$(GREEN)Building all microfrontend Docker images$(NC)"
	docker-compose -f docker/modulefederation-microfrontends.yml build

# Run all containers
run-all: create-network
	@echo "$(GREEN)Starting all microfrontend containers$(NC)"
	docker-compose -f docker/modulefederation-microfrontends.yml up -d
	@echo "$(GREEN)Applications available at:$(NC)"
	@echo "Dashboard: http://localhost:4200"
	@echo "Login: http://localhost:4201"
	@echo "AGA: http://localhost:4202"
	@echo "Agricultura: http://localhost:4204"
	@echo "SE: http://localhost:4205"
	@echo "SEMARNAT: http://localhost:4206"
	@echo "AGACE: http://localhost:4209"
	@echo "Funcionario: http://localhost:4210"
	@echo "COFEPRIS: http://localhost:4211"
	@echo "AMECAFE: http://localhost:4212"

# Stop all containers
stop-all:
	@echo "$(GREEN)Stopping all containers$(NC)"
	docker-compose -f docker/modulefederation-microfrontends.yml stop

# View container logs
logs:
	@if [ "$(app)" != "" ]; then \
		echo "$(GREEN)Displaying logs for modulefederation-$(app)-microfront$(NC)"; \
		docker logs -f modulefederation-$(app)-microfront; \
	else \
		echo "$(RED)Please specify app name with app=name$(NC)"; \
		echo "Example: make logs app=login"; \
	fi

# List running containers
ps:
	@echo "$(GREEN)Running microfrontend containers:$(NC)"
	docker ps | grep modulefederation || echo "No microfrontend containers currently running"

# Clean - Stop and remove all containers
clean: stop-all
	@echo "$(GREEN)Removing all containers$(NC)"
	docker-compose -f docker/modulefederation-microfrontends.yml rm -f

# Clean all - Remove all containers and images
clean-all: clean
	@echo "$(GREEN)Removing all images$(NC)"
	docker rmi $(shell docker images | grep modulefederation | awk '{print $$1":"$$2}') || true

# Individual microfrontend build and run commands
build-dashboard:
	@echo "$(GREEN)Building Dashboard microfrontend$(NC)"
	docker-compose -f docker/modulefederation-dashboard.yml build

run-dashboard: create-network
	@echo "$(GREEN)Starting Dashboard microfrontend$(NC)"
	docker-compose -f docker/modulefederation-dashboard.yml up -d
	@echo "$(GREEN)Dashboard available at: http://localhost:4200$(NC)"

build-login:
	@echo "$(GREEN)Building Login microfrontend$(NC)"
	docker-compose -f docker/modulefederation-login-microfront.yml build

run-login: create-network
	@echo "$(GREEN)Starting Login microfrontend$(NC)"
	docker-compose -f docker/modulefederation-login-microfront.yml up -d
	@echo "$(GREEN)Login available at: http://localhost:4201$(NC)"

build-aga:
	@echo "$(GREEN)Building AGA microfrontend$(NC)"
	docker-compose -f docker/modulefederation-aga-microfront.yml build

run-aga: create-network
	@echo "$(GREEN)Starting AGA microfrontend$(NC)"
	docker-compose -f docker/modulefederation-aga-microfront.yml up -d
	@echo "$(GREEN)AGA available at: http://localhost:4202$(NC)"

# CI/CD Commands
test:
	@if [ "$(app)" != "" ]; then \
		echo "$(GREEN)Running tests for $(app)$(NC)"; \
		npx nx test $(app) --passWithNoTests; \
	else \
		echo "$(GREEN)Running tests for all apps$(NC)"; \
		npx nx run-many --target=test --all --passWithNoTests; \
	fi

lint:
	@if [ "$(app)" != "" ]; then \
		echo "$(GREEN)Linting $(app)$(NC)"; \
		npx nx lint $(app); \
	else \
		echo "$(GREEN)Linting all apps$(NC)"; \
		npx nx run-many --target=lint --all; \
	fi

build-ci:
	@if [ "$(app)" != "" ]; then \
		echo "$(GREEN)Building $(app) for CI$(NC)"; \
		npx nx build $(app) --configuration=production; \
	else \
		echo "$(GREEN)Building all apps for CI$(NC)"; \
		npx nx run-many --target=build --all --configuration=production --parallel=3; \
	fi

deploy-ci:
	@if [ "$(ENV)" = "dev" ] || [ "$(ENV)" = "staging" ] || [ "$(ENV)" = "prod" ]; then \
		echo "$(GREEN)Deploying to $(ENV) environment$(NC)"; \
		echo "Setting up Kubernetes manifests..."; \
		mkdir -p k8s-deploy; \
		REPLICAS=$$([ "$(ENV)" = "prod" ] && echo "2" || echo "1"); \
		MIN_REPLICAS=$$([ "$(ENV)" = "prod" ] && echo "2" || echo "1"); \
		MAX_REPLICAS=$$([ "$(ENV)" = "prod" ] && echo "5" || echo "3"); \
		TAG=$$([ "$(ENV)" = "prod" ] && echo "latest" || echo "$(ENV)"); \
		sed -e "s|\$${ENV}|$(ENV)|g" \
			-e "s|\$${REPLICAS}|$${REPLICAS}|g" \
			-e "s|\$${MIN_REPLICAS}|$${MIN_REPLICAS}|g" \
			-e "s|\$${MAX_REPLICAS}|$${MAX_REPLICAS}|g" \
			-e "s|\$${REGISTRY}|$(DOCKER_REGISTRY)/$(REPO_OWNER)|g" \
			-e "s|\$${TAG}|$${TAG}|g" \
			k8s/vucem-microfrontends.yaml > k8s-deploy/vucem-microfrontends-$(ENV).yaml; \
		echo "Kubernetes manifest prepared at k8s-deploy/vucem-microfrontends-$(ENV).yaml"; \
		echo "To apply to cluster, run:"; \
		echo "  kubectl apply -f k8s-deploy/vucem-microfrontends-$(ENV).yaml"; \
	else \
		echo "$(RED)Error: Environment not specified or invalid$(NC)"; \
		echo "Usage: make deploy-ci env=<dev|staging|prod>"; \
		exit 1; \
	fi