# Configuración del Cluster de Kubernetes

Este documento describe la configuración actual del cluster de Kubernetes utilizado para el despliegue de microfrontends de Module Federation.

## Estado Actual del Cluster

A continuación se muestra el estado actual de los deployments en el cluster:

```
prometheus-kube-state-metrics                            1/1     1            1           122d
prometheus-prometheus-pushgateway                        1/1     1            1           122d
myapp-deployment-goose-ds                                0/0     0            0           111d
myapp-deployment-goose                                   0/0     0            0           109d
redis-deployment-cli                                     3/3     3            3           33d
prometheus-server                                        1/1     1            1           122d
vucem30-deployment-rabbit                                3/3     3            3           24d
vucem30-deployment-dev                                   2/2     2            2           140d
vucem30-deployment-upload                                1/1     1            1           126d
vucem30-deployment-persistence                           1/1     1            1           26d
front-vucem30-deployment-dev                             2/2     2            2           137d
vucem30-deployment-catalogs                              3/3     3            3           16d
modulefederation-se-microfront-deployment-dev            1/1     1            1           5d18h
modulefederation-semarnat-microfront-deployment-dev      1/1     1            1           5d18h
modulefederation-dashboard-deployment-dev                1/1     1            1           5d18h
modulefederation-login-microfront-deployment-dev         1/1     1            1           5d18h
modulefederation-agace-microfront-deployment-dev         1/1     1            1           5d18h
modulefederation-cofepris-microfront-deployment-dev      1/1     1            1           5d18h
modulefederation-inbal-microfront-deployment-dev         1/1     1            1           5d21h
modulefederation-amecafe-microfront-deployment-dev       1/1     1            1           5d18h
modulefederation-funcionario-microfront-deployment-dev   1/1     1            1           5d18h
modulefederation-agricultura-microfront-deployment-dev   0/1     1            0           5d18h
modulefederation-sedena-microfront-deployment-dev        0/1     1            0           5d18h
vucem30-deployment-aereos                                2/2     2            2           16d
modulefederation-aga-microfront-deployment-dev           0/1     1            0           5d18h
```

## Información General

- **Versión de Kubernetes**: microk8s v1.26.x
- **Cloud Provider**: Self-hosted
- **Namespace Principal**: default

## Estructura de Deployments

El sistema se divide en varias categorías de deployments:

1. **Module Federation Microfrontends**: Deployments con prefijo `modulefederation-*-deployment-dev`
2. **Servicios Backend**: Deployments con prefijo `vucem30-deployment-*`
3. **Servicios de Monitoreo**: Deployments con prefijo `prometheus-*`
4. **Servicios de Infraestructura**: Redis, etc.

### Ejemplo de Deployment

```yaml
Name:                   modulefederation-dashboard-deployment-dev
Namespace:              default
CreationTimestamp:      Tue, 22 Apr 2025 22:09:02 +0000
Labels:                 <none>
Annotations:            deployment.kubernetes.io/revision: 36
Selector:               app=modulefederation-dashboard-dev
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:       app=modulefederation-dashboard-dev
  Annotations:  kubectl.kubernetes.io/restartedAt: 2025-04-28T16:56:34Z
  Containers:
    modulefederation-dashboard-deployment-dev:
      Image:      ghcr.io/vucem30/dockerized-modulefederation-dashboard:1.0.0
      Port:       80/TCP
      Host Port:  0/TCP
      Environment:
        SPRING_PROFILES_ACTIVE:  dev
      Mounts:                    <none>
  Volumes:                     <none>
```

## Recursos del Cluster

### Nodos

El cluster está configurado con múltiples nodos:

- **Rol**: Worker + Control Plane
- **Recursos por nodo**: 
  - CPU: 4 cores
  - Memoria: 8GB
  - Disco: 80GB SSD

### Addons Activados

El cluster tiene los siguientes addons de microk8s activados:

- `dns`: Servidor DNS CoreDNS
- `ingress`: Controlador Ingress NGINX
- `storage`: Clase de almacenamiento predeterminada
- `cert-manager`: Emisor de certificados TLS
- `metrics-server`: Recopilación de métricas para autoescalador horizontal
- `registry`: Registro de contenedores local

## Configuración de Networking

### Ingress Controller

- **Tipo**: NGINX Ingress Controller
- **Clase de Ingress**: `public`
- **Anotaciones comunes**:
  - `nginx.ingress.kubernetes.io/ssl-redirect: "true"`
  - `nginx.ingress.kubernetes.io/use-regex: "true"`
  - `cert-manager.io/cluster-issuer: "letsencrypt-prod"`
  - Configuración CORS personalizada (ver archivo de manifiesto)

### Servicios

- **Tipo**: NodePort (para acceso externo)
- **Puertos**: Configurados individualmente para cada microservicio

## Problemas y Mejoras Implementadas

### 1. Discrepancia en Nombres de Selector

**Problema**: Los deployments tenían selectores que no coincidían con los definidos en los servicios o ingress.

**Solución**: Estandarización de nomenclatura en todos los manifiestos:
- Selector en Deployment: `app=nombre-microfront`
- Mismo selector en Services: `app=nombre-microfront`

### 2. Inconsistencia en Ports/TargetPorts

**Problema**: Algunos servicios tenían configuraciones de puerto incorrectas.

**Solución**: Corrección y estandarización:
- containerPort: 80
- name: http
- targetPort: http

### 3. Problemas con Annotations

**Problema**: Conflicto entre anotaciones y campos del ingress.

**Solución**: Eliminación de la anotación `kubernetes.io/ingress.class` y uso adecuado de `ingressClassName`.

## Recomendaciones para el Mantenimiento

1. **Actualizaciones de Kubernetes**: 
   - Planificar actualizaciones menores (patches) trimestralmente
   - Planificar actualizaciones mayores semestralmente

2. **Backups**:
   - Backups de configuración: Diarios
   - Backups de volúmenes persistentes: Semanales

3. **Seguridad**:
   - Actualizar ImagePullSecrets cuando se renueven los tokens
   - Rotar certificados TLS según sea necesario

4. **Monitoreo de recursos**:
   - Ajustar límites de recursos basados en uso actual
   - Revisar periódicamente los logs para problemas de OOM (Out of Memory)
   
5. **Despliegue y Actualización**:
   - Seguir el proceso documentado en `deploy.md`
   - Asegurar reinicio explícito de deployments tras actualizaciones