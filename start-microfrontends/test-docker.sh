#!/bin/bash

# Colores para mensajes en consola
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Iniciando prueba de dockerización ===${NC}"

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker no está instalado${NC}"
    exit 1
fi

# Verificar que el Dockerfile existe
if [ ! -f "./libs/shared/Dockerfile" ]; then
    echo -e "${RED}Error: No se encuentra el Dockerfile en ./libs/shared/Dockerfile${NC}"
    echo -e "${YELLOW}Recomendación: Copia el Dockerfile proporcionado a la ubicación correcta${NC}"
    exit 1
fi

# Verificar que el Makefile existe
if [ ! -f "Makefile" ]; then
    echo -e "${RED}Error: No se encuentra el Makefile en el directorio actual${NC}"
    echo -e "${YELLOW}Recomendación: Copia el Makefile proporcionado al directorio raíz del proyecto${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Archivos de configuración verificados${NC}"

# Limpiar cualquier instancia previa
echo -e "${YELLOW}Limpiando instancias previas...${NC}"
make clean-all

# Construir la imagen
echo -e "${YELLOW}Construyendo la imagen Docker...${NC}"
make build

# Verificar si la construcción fue exitosa
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al construir la imagen Docker${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Imagen Docker construida correctamente${NC}"

# Ejecutar el contenedor
echo -e "${YELLOW}Iniciando el contenedor...${NC}"
make run

# Esperar a que el contenedor esté listo
echo -e "${YELLOW}Esperando a que el contenedor esté listo (5 segundos)...${NC}"
sleep 5

# Verificar el estado del contenedor
CONTAINER_STATUS=$(docker ps -f name=shared-app-container --format "{{.Status}}" | grep -c "Up")

if [ $CONTAINER_STATUS -eq 0 ]; then
    echo -e "${RED}❌ El contenedor no está ejecutándose${NC}"
    docker logs shared-app-container
    make clean-all
    exit 1
fi

echo -e "${GREEN}✓ Contenedor ejecutándose correctamente${NC}"

# Probar la conexión
echo -e "${YELLOW}Probando la conexión a la aplicación...${NC}"
make test

# Mostrar los logs brevemente
echo -e "${YELLOW}Mostrando logs del contenedor (últimas 10 líneas):${NC}"
docker logs shared-app-container | tail -n 10

echo -e "${GREEN}=== Prueba completada ====${NC}"
echo -e "${YELLOW}Para detener y limpiar, ejecuta: make clean-all${NC}"
echo -e "${YELLOW}La aplicación está disponible en: http://localhost:8080${NC}"