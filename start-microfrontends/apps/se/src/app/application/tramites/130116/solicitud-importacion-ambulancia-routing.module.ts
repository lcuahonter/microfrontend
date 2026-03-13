import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { SolicitudImportacionAmbulanciaComponent } from './pages/solicitud-importacion-ambulancia/solicitud-importacion-ambulancia.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '130116',
          },
        },
    path: 'reconstruccion-reacondicionamiento',
    component: SolicitudImportacionAmbulanciaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class SolicitudImportacionAmbulanciaRoutingModule { }
