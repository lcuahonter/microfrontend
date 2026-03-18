import { Routes } from '@angular/router';

export const USUARIOS_ANGULAR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'registro',
        loadComponent: () => import('./features/registro/registro-wizard/registro-wizard.component').then(m => m.RegistroWizardComponent),
      },
      {
        path: 'roles/asignar',
        loadComponent: () => import('./features/roles/asignar-roles/asignar-roles.component').then(m => m.AsignarRolesComponent),
      },
      {
        path: 'roles/desasignar',
        loadComponent: () => import('./features/roles/desasignar-roles/desasignar-roles.component').then(m => m.DesasignarRolesComponent),
      },
      {
        path: 'password/cambio',
        loadComponent: () => import('./features/password/cambio-password/cambio-password.component').then(m => m.CambioPasswordComponent),
      },
      {
        path: 'password/recuperar',
        loadComponent: () => import('./features/password/recuperar-password/recuperar-password.component').then(m => m.RecuperarPasswordComponent),
      },
      {
        path: 'correo/cambio',
        loadComponent: () => import('./features/correo/cambio-correo/cambio-correo.component').then(m => m.CambioCorreoComponent),
      },
      {
        path: 'accionista/alta',
        loadComponent: () => import('./features/accionista/alta-accionista/alta-accionista.component').then(m => m.AltaAccionistaComponent),
      },
      {
        path: 'capturista/alta',
        loadComponent: () => import('./features/capturista/alta-capturista/alta-capturista.component').then(m => m.AltaCapturistaComponent),
      },
      {
        path: 'persona-oir-recibir',
        loadComponent: () => import('./features/persona-oir-recibir/persona-oir-recibir.component').then(m => m.PersonaOirRecibirComponent),
      },
      {
        path: 'tramites',
        loadComponent: () => import('./features/tramites/tramites.component').then(m => m.TramitesComponent),
      },
      {
        path: 'suplencias',
        loadComponent: () => import('./features/suplencias/gestionar-suplencias/gestionar-suplencias.component').then(m => m.GestionarSuplenciasComponent),
      },
      {
        path: 'funcionarios/modificar',
        loadComponent: () => import('./features/funcionarios/modificar-datos/modificar-datos.component').then(m => m.ModificarDatosComponent),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'seleccion-rol',
    loadComponent: () => import('./features/auth/seleccion-rol/seleccion-rol.component').then(m => m.SeleccionRolComponent),
  },
];
