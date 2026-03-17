#!/bin/bash
# Script para probar GitHub Actions localmente en Mac M1
# Autor: Claude

# Colores para una mejor visualización
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}Prueba local de GitHub Actions para Microfrontends${NC}"
echo -e "${BLUE}==============================================${NC}"

# Directorio de trabajo
REPO_DIR="$(pwd)"
echo -e "${YELLOW}Directorio del repositorio: ${REPO_DIR}${NC}"

# Verificar si jq está instalado
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq no está instalado.${NC}"
    echo -e "${YELLOW}Instalando jq con Homebrew...${NC}"
    brew install jq
fi

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js no está instalado.${NC}"
    echo -e "${YELLOW}Por favor, instala Node.js con: brew install node${NC}"
    exit 1
fi

# Mostrar información del ambiente
echo -e "${YELLOW}Verificando ambiente:${NC}"
echo -e "Node.js: $(node -v)"
echo -e "NPM: $(npm -v)"

# Definir variables de entorno simulando GitHub Actions
echo -e "${YELLOW}Configurando variables de entorno...${NC}"
export NODE_VERSION=$(node -v)
export NX_VERSION="19.3.1"
export DOCKER_REGISTRY="ghcr.io"
export AVAILABLE_APPS="dashboard,login,aga,agricultura,se,semarnat,agace,funcionario,cofepris,amecafe,sener,inbal,sedena,profepa,crt,inah,bandejas,stps"
export NX_SKIP_NX_CACHE=true
export NX_NATIVE_BINDINGS=false

# Definir variables para simular la ejecución
# Puedes modificar estos valores para probar diferentes configuraciones
TEST_ENV="dev"
TEST_MODE="selected"
TEST_SELECTED_APPS="dashboard,login"
TEST_APP_GROUP1="true"
TEST_APP_GROUP2="false"
TEST_APP_GROUP3="false"
TEST_APP_GROUP4="false"

echo -e "${YELLOW}Probando con:${NC}"
echo -e "- Entorno: ${TEST_ENV}"
echo -e "- Modo: ${TEST_MODE}"
echo -e "- Apps seleccionadas: ${TEST_SELECTED_APPS}"
echo -e "- Grupo 1: ${TEST_APP_GROUP1}"
echo -e "- Grupo 2: ${TEST_APP_GROUP2}"
echo -e "- Grupo 3: ${TEST_APP_GROUP3}"
echo -e "- Grupo 4: ${TEST_APP_GROUP4}"

echo -e "${GREEN}Simulando la detección de aplicaciones...${NC}"

# Simular el comportamiento de detección de aplicaciones
CHANGED_APPS=""
DEPLOYMENT_MODE="${TEST_MODE}"

if [[ "${DEPLOYMENT_MODE}" == "selected" ]]; then
    # Check if any specific apps were provided in the selectedApps input
    if [[ -n "${TEST_SELECTED_APPS}" ]]; then
        SELECTED_APPS="${TEST_SELECTED_APPS}"
    else
        SELECTED_APPS=""
        
        # Process app groups
        if [[ "${TEST_APP_GROUP1}" == "true" ]]; then
            if [[ -n "$SELECTED_APPS" ]]; then SELECTED_APPS+=","; fi
            SELECTED_APPS+="dashboard,login,aga,agricultura,se"
        fi
        
        if [[ "${TEST_APP_GROUP2}" == "true" ]]; then
            if [[ -n "$SELECTED_APPS" ]]; then SELECTED_APPS+=","; fi
            SELECTED_APPS+="semarnat,agace,funcionario,cofepris,amecafe"
        fi
        
        if [[ "${TEST_APP_GROUP3}" == "true" ]]; then
            if [[ -n "$SELECTED_APPS" ]]; then SELECTED_APPS+=","; fi
            SELECTED_APPS+="sener,inbal,sedena,profepa,crt"
        fi
        
        if [[ "${TEST_APP_GROUP4}" == "true" ]]; then
            if [[ -n "$SELECTED_APPS" ]]; then SELECTED_APPS+=","; fi
            SELECTED_APPS+="inah,bandejas,stps"
        fi
        
        # If no group was selected, default to dashboard
        if [[ -z "$SELECTED_APPS" ]]; then
            SELECTED_APPS="dashboard"
        fi
    fi
    
    # Remove duplicates from selected apps
    SELECTED_APPS=$(echo "$SELECTED_APPS" | tr ',' '\n' | sort -u | tr '\n' ',' | sed 's/,$//')
    
    CHANGED_APPS="$SELECTED_APPS"
    echo -e "${GREEN}Aplicaciones seleccionadas: ${CHANGED_APPS}${NC}"
elif [[ "${DEPLOYMENT_MODE}" == "all" ]]; then
    # Deploy all apps
    CHANGED_APPS="${AVAILABLE_APPS}"
    echo -e "${GREEN}Desplegando todas las aplicaciones disponibles: ${CHANGED_APPS}${NC}"
fi

echo -e "${GREEN}Creando matriz de construcción...${NC}"
# Get the apps to deploy
APPS_TO_DEPLOY="${CHANGED_APPS}"

if [[ -z "$APPS_TO_DEPLOY" ]]; then
    echo -e "${RED}No hay aplicaciones para desplegar, configurando matriz vacía${NC}"
    MATRIX="{\"app\":[]}"
else
    # Simple approach: directly create a valid JSON array without relying on jq
    # Remove any whitespace and ensure we have valid app names
    CLEAN_APPS=$(echo "$APPS_TO_DEPLOY" | tr -d ' ' | sed 's/,$//')
    
    # Create JSON array directly with proper formatting
    echo -e "${GREEN}Creando matriz de aplicaciones: ${CLEAN_APPS}${NC}"
    
    # Start JSON array
    JSON_ARRAY="["
    
    # Split by comma and add each app with proper JSON formatting
    IFS=',' read -ra APP_ARRAY <<< "$CLEAN_APPS"
    for ((i=0; i<${#APP_ARRAY[@]}; i++)); do
        # Skip empty entries
        if [[ -n "${APP_ARRAY[$i]}" ]]; then
            # Add quotes around the app name
            JSON_ARRAY+="\"${APP_ARRAY[$i]}\""
            
            # Add comma if not the last element
            if [ $i -lt $((${#APP_ARRAY[@]}-1)) ]; then
                JSON_ARRAY+=","
            fi
        fi
    done
    
    # Close JSON array
    JSON_ARRAY+="]"
    
    # Set the matrix output
    MATRIX="{\"app\":$JSON_ARRAY}"
fi

echo -e "${BLUE}Configuración final de la matriz:${NC}"
if command -v jq &> /dev/null; then
    echo $MATRIX | jq
else
    echo $MATRIX
fi

# Simular la ejecución de construcción para cada aplicación
echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}Simulando construcción de aplicaciones${NC}"
echo -e "${BLUE}==============================================${NC}"

# Extraer las aplicaciones de la matriz JSON sin depender de jq
APPS_TO_BUILD=$(echo $MATRIX | sed -n 's/.*\[\([^]]*\)\].*/\1/p' | tr ',' '\n' | tr -d '"' | tr -d ' ')

if [[ -z "$APPS_TO_BUILD" ]]; then
    echo -e "${YELLOW}No hay aplicaciones para construir.${NC}"
else
    for APP in $APPS_TO_BUILD; do
        echo -e "${YELLOW}Simulando construcción de: ${APP}${NC}"
        echo -e "- Comando: npx nx build ${APP} --configuration=${TEST_ENV}"
        
        # Simular comandos npm/nx sin ejecutarlos realmente
        echo -e "${GREEN}✓ Construcción simulada para ${APP}${NC}"
        
        # Si quieres probar las generación de Docker images también
        echo -e "- Construyendo imagen Docker para: ${APP}"
        echo -e "  docker build -f ./apps/${APP}/Dockerfile -t ghcr.io/tu-usuario/vucem-front-${APP}:${TEST_ENV} ."
        echo -e "${GREEN}✓ Imagen Docker simulada para ${APP}${NC}"
    done
fi

echo -e "${BLUE}==============================================${NC}"
echo -e "${GREEN}Prueba local completada exitosamente${NC}"
echo -e "${BLUE}==============================================${NC}"

echo -e "${YELLOW}IMPORTANTE: Este script es solo una simulación y no realiza cambios reales.${NC}"
echo -e "${YELLOW}Para probar la construcción real, modifica el script y descomenta las líneas de comandos.${NC}"