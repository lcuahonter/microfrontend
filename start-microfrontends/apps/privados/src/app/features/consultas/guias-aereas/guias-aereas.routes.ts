import { Routes } from '@angular/router';
import { GUIAS_AEREAS_ROUTES } from './guias-aereas.routes.constants';
import { GuiaAereaDetallesPage } from './pages/guia-aerea-detalles/guia-aerea-detalles.page';

export const guiasAereasRoutes: Routes = [
  {
    path: `${GUIAS_AEREAS_ROUTES.CONSULTA_AEREO_DETALLE}/:idHeader`,
    component: GuiaAereaDetallesPage,
  },
];
