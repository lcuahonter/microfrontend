#!/bin/bash
# Script para probar GitHub Actions usando act en un Mac M1
# Autor: Claude

# Colores para una mejor visualización
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}Prueba de GitHub Actions con act para Microfrontends${NC}"
echo -e "${BLUE}==============================================${NC}"

# Verificar si act está instalado
if ! command -v act &> /dev/null; then
    echo -e "${RED}Error: act no está instalado.${NC}"
    echo -e "${YELLOW}Instalando act con Homebrew...${NC}"
    brew install act
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error instalando act, intenta manualmente:${NC}"
        echo -e "${YELLOW}brew install act${NC}"
        exit 1
    fi
fi

# Verificar que Docker esté instalado y funcionando
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker no está instalado.${NC}"
    echo -e "${YELLOW}Por favor, instala Docker Desktop para Mac:${NC}"
    echo -e "${YELLOW}https://www.docker.com/products/docker-desktop${NC}"
    exit 1
fi

# Verificar que Docker esté corriendo
if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker no está corriendo.${NC}"
    echo -e "${YELLOW}Por favor, inicia Docker Desktop y vuelve a intentar.${NC}"
    exit 1
fi

echo -e "${YELLOW}Verificando ambiente:${NC}"
echo -e "act: $(act --version)"
echo -e "Docker: $(docker --version)"

# Crear archivo de variables para simular el workflow_dispatch
echo -e "${YELLOW}Creando archivo de variables para act...${NC}"
cat > act-vars.json << EOL
{
  "inputs": {
    "deploymentEnv": "dev",
    "deploymentMode": "selected",
    "selectedApps": "dashboard,login",
    "appGroup1": "true",
    "appGroup2": "false",
    "appGroup3": "false",
    "appGroup4": "false"
  }
}
EOL

echo -e "${GREEN}Variables configuradas:${NC}"
cat act-vars.json

echo -e "${YELLOW}Ejecutando GitHub Action localmente con act (modo dry-run)...${NC}"
echo -e "${YELLOW}Esto puede tomar varios minutos la primera vez que se ejecuta.${NC}"

# Ejecutar el workflow con act en modo dryrun (solo simula la ejecución)
act workflow_dispatch \
  --eventpath act-vars.json \
  --container-architecture linux/amd64 \
  --bind \
  -j setup \
  --workflows ./.github/workflows/deploy-vucem30-front.yml \
  --dryrun

echo ""
echo -e "${YELLOW}Para ejecutar la acción sin requerir GITHUB_TOKEN, puedes usar:${NC}"
echo -e "${GREEN}act workflow_dispatch --eventpath act-vars.json --container-architecture linux/amd64 --bind -j setup --workflows ./.github/workflows/deploy-vucem30-front.yml${NC}"

echo -e "${BLUE}==============================================${NC}"
echo -e "${YELLOW}IMPORTANTE: Para ejecuciones reales, primero ejecuta en modo dry-run como se muestra arriba${NC}"
echo -e "${BLUE}==============================================${NC}

# En lugar de depender de GitHub CLI, vamos a ejecutar el script de simulación
echo -e "${BLUE}Ejecutando simulación básica del workflow...${NC}"
./test-workflow-locally.sh