import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  { path: '', redirectTo: 'funcionario', pathMatch: 'full' },
  {
    path: 'funcionario', loadChildren: () => import('./../application/app.module').then(module => module.AppFuncionarioModule)
  }
];