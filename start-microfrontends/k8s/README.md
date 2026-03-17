# Documentación de Manifiestos Kubernetes para Arquitectura de Microfrontends

## Estructura general

Este repositorio contiene los manifiestos de Kubernetes necesarios para desplegar una arquitectura de microfrontends. Cada microfrontend está compuesto por tres manifiestos principales:

1. **Deployment (nombre-microfront-deployment-dev.yaml)**: Define la creación y configuración de los pods que ejecutan cada microfrontend.
2. **Service (nombre-microfront-service-dev.yaml)**: Expone los deployments como servicios dentro del clúster.
3. **Ingress (nombre-microfront-ingress-dev.yaml)**: Configura las reglas de enrutamiento para que el tráfico externo llegue a los servicios.

## Organización del repositorio

```
microfront_deployment_service_ingressV2.0/
├── [microfrontend-name]/
│   ├── [microfrontend-name]-deployment-dev.yaml  # Deployment
│   ├── [microfrontend-name]-service-dev.yaml     # Service
│   ├── [microfrontend-name]-ingress-dev.yaml     # Ingress
├── README.md
└── rename_files.sh
```

Los directorios y microfrontends incluidos son:
- aga-microfront
- agace-microfront
- agricultura-microfront
- amecafe-microfront
- cofepris-microfront
- dashboard
- funcionario-microfront
- inbal-microfront
- login-microfront
- se-microfront
- sedena-microfront
- semarnat-microfront

## Convenciones de nomenclatura

### Deployments
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: modulefederation-{microfrontend}-deployment-dev
spec:
  replicas: 1
  selector:
    matchLabels:
      app: modulefederation-{microfrontend}-dev
  template:
    metadata:
      labels:
        app: modulefederation-{microfrontend}-dev
    spec:
      containers:
      - name: front-vucem30-container-dev
        image: ghcr.io/vucem30/dockerized-modulefederation-{microfrontend}:latest
        ports:
        - containerPort: 80
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: dev
      imagePullSecrets:
      - name: vucem30registrykey
```

### Services
```yaml
apiVersion: v1
kind: Service
metadata:
  name: modulefederation-{microfrontend}-service-dev
spec:
  selector:
    app: modulefederation-{microfrontend}-dev
  ports:
    - protocol: TCP
      port: {port-number}
      targetPort: 80
  type: NodePort
```

### Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: modulefederation-{microfrontend}-ingress-dev
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  rules:
  - host: front.v30.ultrasist.net
    http:
      paths:
      - path: /{microfrontend}
        pathType: Prefix
        backend:
          service:
            name: modulefederation-{microfrontend}-service-dev
            port:
              number: {port-number}
  tls:
  - hosts:
    - front.v30.ultrasist.net
    secretName: v30certs
```

## Puertos asignados

| Microfrontend | Puerto |
|---------------|--------|
| dashboard     | 4200   |
| login         | 4201   |
| aga           | 4202   |
| agricultura   | 4204   |
| se            | 4205   |
| semarnat      | 4206   |
| agace         | 4209   |
| funcionario   | 4210   |
| cofepris      | 4211   |
| amecafe       | 4212   |
| inbal         | 4218   |
| sedena        | 4219   |

## Despliegue

Para desplegar los manifiestos en un clúster de Kubernetes, siga estos pasos:

1. Asegúrese de tener acceso al clúster de Kubernetes y kubectl configurado.
2. Aplique los manifiestos en el siguiente orden para cada microfrontend:
   ```bash
   kubectl apply -f [microfrontend-name]/[microfrontend-name]-deployment-dev.yaml
   kubectl apply -f [microfrontend-name]/[microfrontend-name]-service-dev.yaml
   kubectl apply -f [microfrontend-name]/[microfrontend-name]-ingress-dev.yaml
   ```

También puede aplicar todos los manifiestos de una vez con:
```bash
kubectl apply -f microfront_deployment_service_ingressV2.0/
```

## Consideraciones importantes

1. **Registro de Contenedores**:
   - Todas las imágenes se extraen de `ghcr.io/vucem30/`
   - Se utiliza `vucem30registrykey` como secreto para la autenticación

2. **TLS/SSL**:
   - Todos los ingresos utilizan el secreto `v30certs` para la terminación TLS
   - El host para todos los microfrontends es `front.v30.ultrasist.net`

3. **Enrutamiento**:
   - Cada microfrontend es accesible a través de una URL con el patrón `front.v30.ultrasist.net/{microfrontend}`

4. **Configuración del contenedor**:
   - Todos los contenedores exponen el puerto 80
   - Todos utilizan el perfil de Spring `dev`

## Verificación del despliegue

Para verificar que los microfrontends se han desplegado correctamente:

1. Compruebe el estado de los pods:
   ```bash
   kubectl get pods
   ```

2. Compruebe el estado de los servicios:
   ```bash
   kubectl get services
   ```

3. Compruebe el estado de los ingresos:
   ```bash
   kubectl get ingress
   ```

4. Acceda a los microfrontends a través de sus respectivas URLs:
   ```
   https://front.v30.ultrasist.net/{microfrontend}
   ```