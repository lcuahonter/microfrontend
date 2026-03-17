import { Routes } from '@angular/router';
import { APP_ROUTES } from './routes.constants';

export const routes: Routes = [
  {
    path: APP_ROUTES.LOGIN,
    loadComponent: () =>
      import('./features/auth/components/login.component').then((c) => c.LoginComponent),
  },
  {
    path: APP_ROUTES.VUCEM,
    loadChildren: () => import('./store-front/store-front.routes').then(m => m.storeFrontRoutes),
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes').then(m => m.storeFrontRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
