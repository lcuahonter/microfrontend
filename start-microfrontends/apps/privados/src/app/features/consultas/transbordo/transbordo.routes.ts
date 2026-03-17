import { Routes } from '@angular/router';
import { TRANSBORDO_ROUTES } from './transbordo.routes.constants';
import { DetalleTransbordoPage } from './pages/detalle-transbordo/detalle-transbordo.page';

export const transbordoRoutes: Routes = [
  {
    path: TRANSBORDO_ROUTES.TRANSBORDO_DETALLE,
    component: DetalleTransbordoPage,
  },
];
