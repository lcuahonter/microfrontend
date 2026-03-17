import { Routes } from '@angular/router';
import { OtrasAreasPage } from '@/store-front/pages/otras-areas-page/otras-areas.page';
import { OTRAS_AREAS_ROUTES } from './otras-areas.routes.constants';

export const otrasAreasRoutes: Routes = [
  {
    path: '',
    component: OtrasAreasPage,
  },
  {
    path: OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
    loadChildren: () => import('./registro-guias/registro-guias.routes'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default otrasAreasRoutes;
