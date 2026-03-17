# Guía de Despliegue en Kubernetes

Este documento describe el proceso de despliegue de la aplicación en Kubernetes, incluyendo las mejoras realizadas para garantizar un despliegue correcto y actualizado.

## Arquitectura de Despliegue

La aplicación está basada en una arquitectura de microfrontends utilizando Module Federation. Cada microfrontend se despliega como un contenedor separado, pero todos se exponen a través de un único Ingress.

### Componentes

- **Dashboard**: Aplicación shell que integra a todos los microfrontends
- **Microfrontends**: Aplicaciones independientes para cada módulo (login, aga, agace, etc.)
- **Manifests de Kubernetes**: Describen los deployments, services e ingress
- **Scripts de Despliegue**: Automatizan el proceso de despliegue

## Cambios Realizados

### 1. Corrección del Template de Kubernetes (`vucem-microfrontends.yaml`)

Se realizaron los siguientes cambios en el template:

- **Estandarización de nombres**: Todos los recursos ahora siguen el mismo patrón de nomenclatura `modulefederation-[nombre]-[tipo]-[env]`
- **Separación en deployments individuales**: Cada microfrontend ahora tiene su propio deployment
- **Configuración de services**: Se actualizaron los servicios para apuntar a los deployments correctos
- **Corrección de ingress**: Se aseguró que el ingress apunte a los servicios correctos
- **Variables de entorno**: Se utilizan variables como `${ENV}`, `${REGISTRY}` y `${TAG}` para facilitar el despliegue en diferentes entornos

### 2. Mejoras en el Script de Despliegue (`deploy_commands.sh`)

- **Manejo de secretos mejorado**: Se implementó una mejor detección y creación del secret para el pull de imágenes
- **Procesamiento de manifiestos**: Se añadió un preprocesamiento del manifiesto para eliminar anotaciones conflictivas
- **Lista completa de microfrontends**: Se actualizó para incluir todos los microfrontends disponibles
- **Reinicio explícito de deployments**: Se asegura que todos los pods se reinicien con la última versión

### 3. Script de Parche (`script_patch.sh`)

Se creó un script de parche que modifica `deploy_commands.sh` en tiempo de ejecución para:

- Corregir el manejo de secretos
- Añadir el preprocesamiento de manifiestos
- Actualizar la lista de microfrontends
- Corregir problemas de sintaxis

## Proceso de Despliegue

El despliegue sigue estos pasos:

1. **Preparación**: Se genera el archivo de manifiesto a partir del template, reemplazando variables
2. **Validación**: Se verifica que los recursos en el manifiesto sean válidos
3. **Creación de secretos**: Se asegura que el secret para pull de imágenes exista
4. **Aplicación del manifiesto**: Se aplica el manifiesto al cluster
5. **Reinicio de deployments**: Se reinician explícitamente los deployments para asegurar que usen las últimas imágenes
6. **Verificación**: Se verifica el estado de los pods, servicios e ingress

## Nombres de los Recursos

### Deployments
```
modulefederation-dashboard-deployment-${ENV}
modulefederation-login-microfront-deployment-${ENV}
modulefederation-aga-microfront-deployment-${ENV}
modulefederation-agricultura-microfront-deployment-${ENV}
modulefederation-se-microfront-deployment-${ENV}
modulefederation-semarnat-microfront-deployment-${ENV}
modulefederation-agace-microfront-deployment-${ENV}
modulefederation-funcionario-microfront-deployment-${ENV}
modulefederation-cofepris-microfront-deployment-${ENV}
modulefederation-amecafe-microfront-deployment-${ENV}
modulefederation-sener-microfront-deployment-${ENV}
modulefederation-inbal-microfront-deployment-${ENV}
modulefederation-sedena-microfront-deployment-${ENV}
modulefederation-profepa-microfront-deployment-${ENV}
modulefederation-crt-microfront-deployment-${ENV}
modulefederation-inah-microfront-deployment-${ENV}
modulefederation-bandejas-microfront-deployment-${ENV}
modulefederation-stps-microfront-deployment-${ENV}
```

### Services
```
modulefederation-dashboard-service-${ENV}
modulefederation-login-microfront-service-${ENV}
modulefederation-aga-microfront-service-${ENV}
modulefederation-agricultura-microfront-service-${ENV}
modulefederation-se-microfront-service-${ENV}
modulefederation-semarnat-microfront-service-${ENV}
modulefederation-agace-microfront-service-${ENV}
modulefederation-funcionario-microfront-service-${ENV}
modulefederation-cofepris-microfront-service-${ENV}
modulefederation-amecafe-microfront-service-${ENV}
modulefederation-sener-microfront-service-${ENV}
modulefederation-inbal-microfront-service-${ENV}
modulefederation-sedena-microfront-service-${ENV}
modulefederation-profepa-microfront-service-${ENV}
modulefederation-crt-microfront-service-${ENV}
modulefederation-inah-microfront-service-${ENV}
modulefederation-bandejas-microfront-service-${ENV}
modulefederation-stps-microfront-service-${ENV}
```

### Ingress
```
modulefederation-vucem-frontend-ingress-${ENV}
```

## Problemas Conocidos y Soluciones

### 1. Ingress Annotation Conflict

**Problema**: La anotación `kubernetes.io/ingress.class` entraba en conflicto con el uso de `ingressClassName`.

**Solución**: Se elimina automáticamente la anotación conflictiva durante el preprocesamiento del manifiesto.

### 2. Pods No Actualizados

**Problema**: A veces los pods no se actualizaban con nuevas imágenes a pesar de aplicar el manifiesto.

**Solución**: Se realiza un reinicio explícito de cada deployment para forzar la actualización.

### 3. Secreto de ImagePullSecret

**Problema**: Error en la creación o actualización del secreto para pull de imágenes.

**Solución**: Proceso mejorado para detectar y crear el secreto si no existe.

## Solución de Problemas

Si el despliegue falla, revise los siguientes puntos:

1. **Logs de despliegue**: Verificar los logs en `/home/[usuario]/v30/deployment-logs/`
2. **Estado de pods**: `kubectl get pods -n default | grep modulefederation`
3. **Estado de services**: `kubectl get services -n default | grep modulefederation` 
4. **Estado de ingress**: `kubectl get ingress -n default`
5. **Logs de pods**: `kubectl logs [nombre-del-pod] -n default`
6. **Eventos del cluster**: `kubectl get events -n default`

## Recomendaciones

1. **Actualización de configuración**: Siempre actualizar las configuraciones de despliegue en los archivos de template, no directamente en el cluster.
2. **Pruebas locales**: Probar localmente las aplicaciones antes de desplegar.
3. **Control de versiones**: Usar tags específicos para las imágenes, no "latest".
4. **Monitoreo**: Implementar monitoreo de los pods desplegados.