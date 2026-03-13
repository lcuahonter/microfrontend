import { Route } from '@angular/router';
import { StoreFrontLayoutTsComponent } from './../store-front/layout/store-front-layout.ts/store-front-layout.ts.component';
import { STORE_FRONT_ROUTES } from './../store-front/store-front.routes.constants';

/**
 * Rutas expuestas del micro-frontend privados.
 * Estas rutas son consumidas por el host (dashboard) mediante Module Federation.
 *
 * IMPORTANTE: Estas rutas se cargan bajo /privados en el dashboard
 *
 * ARQUITECTURA:
 * - path: '' con component (layout wrapper) + children
 * - El layout proporciona el sidebar y estructura común
 * - Las rutas hijas se cargan en el <router-outlet> del layout
 *
 * Rutas resultantes en el dashboard:
 * - /privados → redirect a /privados/home
 * - /privados/home → HomePage (con layout)
 * - /privados/consultas → ConsultasPage (con layout y sus sub-rutas)
 * - /privados/consultas/manifiesto-aereo → ManifiestoAereoPage
 * - /privados/consultas/consultar-documento → DescargarDocumentoPage
 * - /privados/consultas/consulta-guias-aereas → ConsultaGuiasAereasPage
 */
export const REMOTE_ROUTES: Route[] = [
  {
    path: '',
    component: StoreFrontLayoutTsComponent,
    children: [
      {
        path: '',
        redirectTo: STORE_FRONT_ROUTES.HOME,
        pathMatch: 'full'
      },
      {
        path: STORE_FRONT_ROUTES.HOME,
        loadComponent: () => import('./../store-front/pages/home/home.page').then(c => c.HomePage)
      },
      {
        path: STORE_FRONT_ROUTES.CONSULTAS,
        loadChildren: () => import('./../features/consultas/consultas.routes').then(m => m.consultasRoutes)
      },
      {
        path: '**',
        loadComponent: () => import('./../store-front/pages/not-found/not-found.component').then(c => c.NotFoundComponent)
      }
    ]
  }
];
