import { Routes } from '@angular/router';
import { MANIFIESTO_AEREO_ROUTES } from './services/manifiesto-aereo.routes.constants';
import { ManifiestoAereoResultadosPage } from './pages/manifiesto-aereo-resultados/manifiesto-aereo-resultados.page';
import { ManifiestoAereoDetallesPage } from './pages/manifiesto-aereo-detalles/manifiesto-aereo-detalles-page';
import { ManifiestoAereoContactosPage } from './pages/manifiesto-aereo-contactos/manifiesto-aereo-contactos.page';
import { ManifiestoAereoDetalleInformacionPage } from './pages/manifiesto-aereo-detalle-informacion/manifiesto-aereo-detalle-informacion.page';

export const manifiestoAereoRoutes: Routes = [
  {
    path: MANIFIESTO_AEREO_ROUTES.RESULTADOS_MANIFIESTO_AEREO,
    component: ManifiestoAereoResultadosPage,
  },
  {
    path: `${MANIFIESTO_AEREO_ROUTES.DETALLES_MANIFIESTO_AEREO}/:idHeader`,
    component: ManifiestoAereoDetallesPage,
  },
  {
    path: `${MANIFIESTO_AEREO_ROUTES.DETALLES_MANIFIESTO_AEREO}/:idHeader/${MANIFIESTO_AEREO_ROUTES.CONTACTOS}`,
    component: ManifiestoAereoContactosPage,
  },
  {
    path: `${MANIFIESTO_AEREO_ROUTES.DETALLES_MANIFIESTO_AEREO}/:idHeader/${MANIFIESTO_AEREO_ROUTES.DOCUMENTO_TRANSPORTE_DETALLE_INFORMACION}`,
    component: ManifiestoAereoDetalleInformacionPage,
  },
];
