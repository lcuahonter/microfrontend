import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitudDespachoExportacionComponent } from './pages/solicitud-despacho-exportacion/solicitud-despacho-exportacion.component';

const ROUTES: Routes = [
    {
      path: 'solicitud',
      component: SolicitudDespachoExportacionComponent,
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'solicitud',
    },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class SolicitudDespachoExportacionRoutingModule { }
