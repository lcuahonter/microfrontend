#!/bin/bash

# Script para iniciar microfrontends específicos para VUCEM
# Creado para facilitar el despliegue y pruebas

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

# Función para mostrar ayuda
show_help() {
  echo -e "${GREEN}Script para iniciar microfrontends VUCEM${NC}"
  echo 
  echo -e "${YELLOW}Uso:${NC} ./start-microfrontends.sh [opciones]"
  echo
  echo -e "${YELLOW}Opciones:${NC}"
  echo "  all       - Inicia todos los microfrontends"
  echo "  dashboard - Inicia solo el dashboard (shell)"
  echo "  login     - Inicia dashboard y login"
  echo "  aga       - Inicia dashboard, login y AGA"
  echo "  privados  - Inicia dashboard, login y Privados"
  echo "  clean     - Detiene y elimina todos los contenedores"
  echo "  status    - Muestra el estado de los contenedores"
  echo "  logs [nombre] - Muestra logs (ej: logs login para ver logs del login)"
  echo
  echo -e "${YELLOW}Ejemplos:${NC}"
  echo "  ./start-microfrontends.sh login    # Inicia dashboard y login"
  echo "  ./start-microfrontends.sh privados # Inicia dashboard, login y privados"
  echo "  ./start-microfrontends.sh logs aga # Muestra logs de AGA"
}

# Función para verificar si Docker está disponible
check_docker() {
  if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker no está instalado o no está en el PATH${NC}"
    exit 1
  fi
  
  if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose no está instalado o no está en el PATH${NC}"
    exit 1
  fi
}

# Función para crear la red de Docker si no existe
create_network() {
  if ! docker network inspect modulefederation-network &> /dev/null; then
    echo -e "${YELLOW}Creando red modulefederation-network...${NC}"
    docker network create modulefederation-network
  fi
}

# Función para iniciar todos los microfrontends
start_all() {
  echo -e "${GREEN}Iniciando todos los microfrontends...${NC}"
  create_network
  docker-compose -f docker/dev/modulefederation-microfrontends.yml up -d
  echo -e "${GREEN}¡Listo! Microfrontends disponibles en:${NC}"
  echo "Dashboard: http://localhost:4200"
  echo "Login: http://localhost:4201"
  echo "AGA: http://localhost:4202"
  echo "Agricultura: http://localhost:4204"
  echo "SE: http://localhost:4205"
  echo "SEMARNAT: http://localhost:4206"
  echo "AGACE: http://localhost:4209"
  echo "Privados: http://localhost:4225"
}

# Función para iniciar solo el dashboard
start_dashboard() {
  echo -e "${GREEN}Iniciando solo el dashboard...${NC}"
  create_network
  docker-compose -f docker/dev/modulefederation-dashboard.yml up -d
  echo -e "${GREEN}¡Listo! Dashboard disponible en: http://localhost:4200${NC}"
}

# Función para iniciar dashboard y login
start_login() {
  echo -e "${GREEN}Iniciando dashboard y login...${NC}"
  create_network
  docker-compose -f docker/dev/modulefederation-dashboard.yml up -d
  docker-compose -f docker/dev/modulefederation-login-microfront.yml up -d
  echo -e "${GREEN}¡Listo! Aplicaciones disponibles en:${NC}"
  echo "Dashboard: http://localhost:4200"
  echo "Login: http://localhost:4201"
}

# Función para iniciar dashboard, login y AGA
start_aga() {
  echo -e "${GREEN}Iniciando dashboard, login y AGA...${NC}"
  create_network
  docker-compose -f docker/dev/modulefederation-dashboard.yml up -d
  docker-compose -f docker/dev/modulefederation-login-microfront.yml up -d
  docker-compose -f docker/dev/modulefederation-aga-microfront.yml up -d
  echo -e "${GREEN}¡Listo! Aplicaciones disponibles en:${NC}"
  echo "Dashboard: http://localhost:4200"
  echo "Login: http://localhost:4201"
  echo "AGA: http://localhost:4202"
}

# Función para iniciar dashboard, login y Privados
start_privados() {
  echo -e "${GREEN}Iniciando dashboard, login y Privados...${NC}"
  create_network
  docker-compose -f docker/dev/modulefederation-dashboard.yml up -d
  docker-compose -f docker/dev/modulefederation-login-microfront.yml up -d
  docker-compose -f docker/dev/modulefederation-privados-microfront.yml up -d
  echo -e "${GREEN}¡Listo! Aplicaciones disponibles en:${NC}"
  echo "Dashboard: http://localhost:4200"
  echo "Login: http://localhost:4201"
  echo "Privados: http://localhost:4225"
}

# Función para limpiar todos los contenedores
clean() {
  echo -e "${YELLOW}Deteniendo y eliminando todos los contenedores...${NC}"
  docker-compose -f docker/dev/modulefederation-microfrontends.yml down
  docker-compose -f docker/dev/modulefederation-dashboard.yml down
  docker-compose -f docker/dev/modulefederation-login-microfront.yml down
  docker-compose -f docker/dev/modulefederation-privados-microfront.yml down
  docker-compose -f docker/dev/modulefederation-aga-microfront.yml down
  echo -e "${GREEN}¡Listo! Todos los contenedores han sido eliminados${NC}"
}

# Función para mostrar el estado de los contenedores
show_status() {
  echo -e "${GREEN}Estado de los contenedores:${NC}"
  docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep modulefederation || echo "No hay contenedores de modulefederation en ejecución"
}

# Función para mostrar logs de un contenedor específico
show_logs() {
  if [ -z "$1" ]; then
    echo -e "${RED}Error: Debe especificar un nombre de microfrontend${NC}"
    echo "Ejemplo: ./start-microfrontends.sh logs login"
    exit 1
  fi
  
  CONTAINER="modulefederation-$1-microfront"
  # Caso especial para dashboard
  if [ "$1" = "dashboard" ]; then
    CONTAINER="modulefederation-dashboard"
  fi
  
  echo -e "${GREEN}Mostrando logs para $CONTAINER...${NC}"
  docker logs -f $CONTAINER
}

# Comprobar Docker
check_docker

# Si no hay argumentos, mostrar ayuda
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

# Procesar argumentos
case "$1" in
  help|--help|-h)
    show_help
    ;;
  all)
    start_all
    ;;
  dashboard)
    start_dashboard
    ;;
  login)
    start_login
    ;;
  aga)
    start_aga
    ;;
  privados)
    start_privados
    ;;
  clean)
    clean
    ;;
  status)
    show_status
    ;;
  logs)
    show_logs "$2"
    ;;
  *)
    echo -e "${RED}Opción no reconocida: $1${NC}"
    show_help
    exit 1
    ;;
esac

exit 0