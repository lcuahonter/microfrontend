# Prueba local de GitHub Actions para Microfrontends

Este documento explica cómo probar los workflows de GitHub Actions localmente en un Mac M1 antes de subirlos al repositorio.

## Enfoque de prueba

Para probar localmente tus GitHub Actions en Mac M1, proporcionamos dos scripts:

1. **Simulación simple** (`test-workflow-locally.sh`): Este es el enfoque recomendado y no requiere Docker. Simula el proceso de selección y construcción de la matriz.

2. **Simulación con act** (`test-workflow-gh-act.sh`): Requiere Docker Desktop y utiliza la herramienta `act` para simular el entorno completo de GitHub Actions.

## Simulación simple (recomendado)

### Requisitos previos
- Node.js y npm
- Homebrew (opcional, para instalar jq)

### Pasos para la prueba

1. Ejecuta el script de simulación simple:

```bash
./test-workflow-locally.sh
```

Este script:
- Verifica tus dependencias
- Configura variables de entorno similares a GitHub Actions
- Simula el proceso de selección de aplicaciones
- Genera la matriz de construcción en formato JSON
- Simula el proceso de construcción para cada aplicación

### Personalización

Puedes modificar las variables en el archivo `test-workflow-locally.sh` para probar diferentes escenarios:

```bash
# Definir variables para simular la ejecución
TEST_ENV="dev"                    # Entorno: dev, staging, prod
TEST_MODE="selected"              # Modo: changed, selected, all
TEST_SELECTED_APPS="dashboard,login"  # Apps específicas
TEST_APP_GROUP1="true"            # Grupo 1: dashboard,login,aga,agricultura,se
TEST_APP_GROUP2="false"           # Grupo 2: semarnat,agace,funcionario,cofepris,amecafe
TEST_APP_GROUP3="false"           # Grupo 3: sener,inbal,sedena,profepa,crt
TEST_APP_GROUP4="false"           # Grupo 4: inah,bandejas,stps
```

## Simulación con act (requiere Docker)

### Requisitos previos
- Docker Desktop instalado y ejecutándose
- Homebrew (para instalar act)

### Instalación de act

```bash
brew install act
```

### Pasos para la prueba

1. Ejecuta el script de simulación con act:

```bash
./test-workflow-gh-act.sh
```

Por defecto, este script ejecuta act en modo "dry-run" para mostrar lo que haría sin ejecutarlo realmente. 

Para ejecutar realmente el workflow:

```bash
act workflow_dispatch \
  --eventpath act-vars.json \
  --container-architecture linux/amd64 \
  --bind \
  -j setup \
  --workflows ./.github/workflows/deploy-vucem30-front.yml
```

### Personalización de la simulación

Puedes modificar el archivo `act-vars.json` generado para cambiar los parámetros:

```json
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
```

## Solución de problemas

### Docker en Mac M1

En Mac M1, es importante usar la arquitectura adecuada:

```
--container-architecture linux/amd64
```

### Error "command not found: gh"

El script de simulación simple no requiere GitHub CLI. Si usas act y ves este error, simplemente elimina la parte `--secret GITHUB_TOKEN=$(gh auth token)` del comando.

### Docker no está corriendo

Asegúrate de iniciar Docker Desktop antes de ejecutar el script con act.

## Consideraciones adicionales

- La simulación simple es más rápida y no requiere Docker.
- La simulación con act es más completa pero requiere más recursos y configuración.
- Ambos enfoques te permiten verificar la lógica del workflow antes de subirlo al repositorio.

## Después de probar

Una vez que hayas verificado que el workflow funciona correctamente, puedes subirlo al repositorio:

```bash
git add .github/workflows/deploy-vucem30-front.yml
git commit -m "Actualizar workflow de despliegue"
git push
```

Esto activará el workflow real en GitHub Actions según las reglas configuradas.