# Módulo Usuarios Angular 18 — VUCEM

Migración del módulo de Usuarios de la Ventanilla Única de Comercio Exterior Mexicana (VUCEM) de Java Spring MVC + JSP a Angular 18.

## Estructura

```
usuarios-angular/
├── core/
│   ├── models/
│   │   ├── usuario.model.ts       # Enums, interfaces, DTOs
│   │   ├── rol.model.ts           # Rol, Dependencia, UnidadAdministrativa
│   │   └── tramite.model.ts       # Tramite, TramiteAsignado
│   ├── services/
│   │   ├── auth.service.ts        # Login, selección de rol, logout (Signals)
│   │   └── usuarios-api.service.ts # Mock API con delay()
│   └── guards/
│       └── auth.guard.ts          # authGuard, noAuthGuard, adminGuard
├── mocks/
│   ├── usuarios.mock.ts           # 5 usuarios de prueba
│   └── catalogos.mock.ts          # Roles, dependencias, unidades, trámites, países
├── shared/
│   ├── components/
│   │   ├── alert/                 # <vuc-alert type="info|success|warning|error">
│   │   ├── stepper/               # <vuc-stepper [pasos] [pasoActual]>
│   │   ├── fiel-signature/        # <vuc-fiel-signature (firmado)>
│   │   ├── rfc-input/             # <vuc-rfc-input> ControlValueAccessor
│   │   ├── user-search/           # <vuc-user-search (seleccionado)>
│   │   └── tramites-list/         # <vuc-tramites-list (seleccionCambiada)>
│   └── index.ts                   # Barrel exports
├── layout/
│   └── shell/shell.component.ts   # Sidenav + Toolbar + RouterOutlet
├── features/
│   ├── auth/login/                # Login con contraseña o e.firma
│   ├── auth/seleccion-rol/        # Selección de rol (múltiples roles)
│   ├── dashboard/                 # KPIs + accesos rápidos + tabla usuarios
│   ├── registro/registro-wizard/  # Wizard 6 pasos: registro nuevo usuario
│   ├── roles/asignar-roles/       # Búsqueda → Rol+Dependencia → Trámites
│   ├── roles/desasignar-roles/    # Búsqueda → Selección roles → Motivo
│   ├── password/cambio-password/  # Cambio con indicador de fuerza
│   ├── password/recuperar-password/ # Por RFC / CURP / e.firma
│   ├── correo/cambio-correo/      # Wizard 3 pasos con e.firma
│   ├── accionista/alta-accionista/ # Wizard 4 pasos PF/PM x MEX/EXT
│   ├── capturista/alta-capturista/ # Wizard 3 pasos con verificación CURP
│   ├── persona-oir-recibir/       # Wizard 4 pasos
│   ├── tramites/                  # Tabs: Asignar / Catálogo
│   ├── suplencias/gestionar-suplencias/ # Tabs: Nueva / Activas
│   └── funcionarios/modificar-datos/   # Búsqueda → Editar → e.firma
└── usuarios-angular.routes.ts     # Rutas lazy loading

## Usuarios de prueba

| RFC              | Tipo       | Estatus           | Roles                    |
|-----------------|------------|-------------------|--------------------------|
| GOMA800101AB1   | PF Mex     | ACTIVO            | Operativo                |
| PERA750605CD2   | PF Mex     | ACTIVO            | Autorizador + Admin      |
| IMPEX001231     | PM Mex     | ACTIVO            | —                        |
| LOHJ901220EF3   | PF Mex     | PENDIENTE_CORREO  | —                        |
| SANM850320GH5   | PF Mex     | BLOQUEADO         | —                        |

## Integración en el módulo usuarios existente

Agrega en `app-routing.module.ts` del módulo `usuarios`:

```typescript
{
  path: 'usuarios-angular',
  loadChildren: () => import('./application/usuarios-angular/usuarios-angular.routes').then(m => m.USUARIOS_ANGULAR_ROUTES)
}
```
