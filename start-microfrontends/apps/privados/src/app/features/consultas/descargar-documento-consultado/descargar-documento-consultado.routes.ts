import { Routes } from '@angular/router';
import { DESCARGAR_DOCUMENTO_CONSULTADO_ROUTES } from './descargar-documento-consultado.routes.constants';
import { DocumentoPage } from './pages/documento/documento.page';

export const descargarDocumentoConsultaRoutes: Routes = [
  {
    path: `${DESCARGAR_DOCUMENTO_CONSULTADO_ROUTES.DOCUMENTO}/:idFolio`,
    component: DocumentoPage,
  },
];
