import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { SolicitudeComponent } from './pages/solicitude/solicitude.component';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'SolicitudePage' },
  {
    path: 'SolicitudePage',
    component: SolicitudeComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260603',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AvisoDeImportacionRoutingModule {}
