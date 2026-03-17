import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitudPasoComponent } from './pages/solicitud-paso/solicitud-paso.component';

export const ROUTES_SOLICITUDES: Routes = [
  {
    path: 'solicitud',
    component: SolicitudPasoComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_SOLICITUDES)],
  exports: [RouterModule],
})
export class ImportadorYOExportadorRoutingModule {}
