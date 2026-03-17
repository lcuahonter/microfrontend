import { Route } from '@angular/router';

export const REMOTEROUTES: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login', loadChildren: () => import('../../app/application/app.module').then(module => module.AppLoginModule)
  },
]; 
