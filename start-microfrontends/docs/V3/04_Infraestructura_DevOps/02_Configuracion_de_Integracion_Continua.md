# Documentación de la Configuración de Integración Continua (CI/CD) para el Proyecto VUCEM

## Introducción

Este documento detalla la configuración del sistema de integración continua y despliegue continuo (CI/CD) implementado para el proyecto VUCEM. La infraestructura de CI/CD permite automatizar los procesos de validación, construcción y despliegue del código, garantizando la calidad del software y agilizando el ciclo de desarrollo.

## Estructura de la Configuración

La configuración CI/CD está dividida en dos flujos de trabajo principales:

1. **Validación de Código (Validate Code)**: Se ejecuta automáticamente con cada Pull Request hacia las ramas `develop` y `main`, o manualmente mediante la opción `workflow_dispatch`.

2. **Despliegue del Código (CI/CD VUCEM Microfrontends)**: Se ejecuta automáticamente cuando se realizan cambios en el código en las ramas `develop` y `main`, o manualmente mediante la opción `workflow_dispatch`.

## Flujo de Trabajo de Validación de Código

### Activadores

- Pull Requests hacia las ramas `develop` y `main`
- Cambios en las rutas: `apps/**`, `libs/**`, `package.json`, `nx.json`, `.eslintrc.json`
- Ejecución manual (`workflow_dispatch`)

### Entorno

- Node.js versión: 22.14.0
- NX versión: 19.3.1

### Trabajos

#### 1. Lint y Calidad de Código

Este trabajo realiza verificaciones de estilo y calidad de código:

- **Checkout del repositorio**: Obtiene el código fuente.
- **Configuración de Node.js**: Instala la versión especificada de Node.js.
- **Caché de módulos de Node.js**: Implementa caché para mejorar el tiempo de construcción.
- **Instalación de dependencias**: Instala las dependencias del proyecto.
- **Instalación global de NX**: Instala la herramienta NX globalmente.
- **Detección de proyectos modificados**: Identifica automáticamente los proyectos afectados por los cambios.
- **Lint de proyectos afectados**: Ejecuta verificaciones de estilo en los proyectos afectados.
- **Verificación de TypeScript**: Comprueba la correcta tipificación en los proyectos afectados.

#### 2. Pruebas Unitarias

Este trabajo ejecuta las pruebas unitarias:

- **Checkout y configuración**: Similar al trabajo anterior.
- **Detección de proyectos modificados**: Identifica los proyectos afectados.
- **Ejecución de pruebas unitarias**: Ejecuta pruebas unitarias en todos los proyectos afectados.

#### 3. Verificación de Construcción

Este trabajo verifica la correcta construcción del proyecto:

- **Checkout y configuración**: Similar a los trabajos anteriores.
- **Detección de proyectos modificados**: Identifica los proyectos afectados.
- **Verificación de construcción**: Construye al menos uno de los proyectos afectados para verificar que el proceso de construcción funcione correctamente.

## Flujo de Trabajo de Despliegue

### Activadores

- Cambios en las ramas `develop` y `main`
- Cambios en las rutas: `apps/**`, `libs/**`, `docker/**`, `package.json`, `nx.json`, `.github/workflows/**`
- Ejecución manual (`workflow_dispatch`)

### Variables de Entorno

- Node.js versión: 20
- NX versión: 16.10.0
- Registro de Docker: ghcr.io
- Aplicaciones disponibles: dashboard, login, aga, agricultura, se, semarnat, agace, funcionario, cofepris, amecafe, sener, inbal
- Variables para control de NX: NX_SKIP_NX_CACHE=true, NX_NATIVE_BINDINGS=false

### Trabajos

#### 1. Configuración y Verificación del Entorno

Este trabajo prepara el entorno y determina qué aplicaciones se deben construir y desplegar:

- **Checkout del repositorio**: Obtiene el código fuente.
- **Configuración del entorno**: Establece el entorno (dev, staging, prod).
- **Detección de cambios**: Identifica las aplicaciones que han cambiado desde la última ejecución.
- **Determinación de aplicaciones a desplegar**: Define las aplicaciones finales a construir según el modo seleccionado (changed, selected, all).
- **Preparación de matriz**: Crea una matriz de aplicaciones para construcciones paralelas.

#### 2. Construcción de Microfrontends

Este trabajo construye las aplicaciones determinadas en el paso anterior:

- **Checkout y configuración**: Similar a los trabajos anteriores.
- **Instalación de dependencias de construcción**: Instala las dependencias del sistema necesarias.
- **Configuración de variables de entorno**: Establece variables de entorno para npm y NX.
- **Caché de módulos de Node.js**: Implementa caché para mejorar el tiempo de construcción.
- **Instalación de dependencias**: Instala las dependencias del proyecto.
- **Construcción de la aplicación**: Construye la aplicación específica asignada a esta instancia.
- **Verificación de salida de construcción**: Verifica que la construcción se haya completado correctamente.
- **Configuración de Docker Buildx**: Configura Docker para la construcción de imágenes.
- **Inicio de sesión en GitHub Container Registry**: Autentica con el registro de contenedores.
- **Extracción de metadatos para Docker**: Prepara los metadatos para las imágenes.
- **Construcción y publicación de imagen Docker**: Construye y publica la imagen de Docker.

#### 3. Despliegue de Microfrontends

Este trabajo despliega las aplicaciones construidas:

- **Checkout del repositorio**: Obtiene el código fuente para los manifiestos de Kubernetes.
- **Creación de manifiestos de Kubernetes**: Genera los manifiestos necesarios para el despliegue.
- **Ejecución del despliegue remoto**: Ejecuta comandos remotamente para aplicar los manifiestos y reiniciar el despliegue.

## Manifiestos de Kubernetes

Los manifiestos de Kubernetes generados durante el proceso de despliegue incluyen:

- **Deployment**: Define los contenedores para cada microfrontend con sus respectivas configuraciones de recursos, sondas de salud y políticas de imágenes.
- **Service**: Expone los contenedores dentro del clúster Kubernetes.
- **Ingress**: Proporciona acceso externo a las aplicaciones.

### Ubicación de los Manifiestos

Los manifiestos se guardan en la siguiente ruta en el servidor remoto:
```
/home/ubuntu/v30/k8s-[env]/vucem-microfrontends.yaml
```
Donde `[env]` es el entorno de despliegue (dev, staging, prod).

## Conclusión

La configuración CI/CD implementada proporciona un flujo automatizado para validar, construir y desplegar las aplicaciones del proyecto VUCEM. Este proceso garantiza la calidad del código y agiliza el ciclo de desarrollo, permitiendo entregas rápidas y confiables.