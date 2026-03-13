import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';

export const MODIFICACION_DONACIONES_IMMEX: Routes = [
  {
    path: 'solicitante',
    component: SolicitantePageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'acuses-y-resoluciones-folio-del-tramite',
  },
];

@NgModule({
  imports: [RouterModule.forChild(MODIFICACION_DONACIONES_IMMEX)],
  exports: [RouterModule],
})
export class ModificacionDonacionesImmexRoutingModule {}
