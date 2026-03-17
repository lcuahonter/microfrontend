import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitudPasoComponent } from './pages/solicitud-paso/solicitud-paso.component';

const ROUTES: Routes = [
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
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class SolicitudDeRegistroInvocarRoutingModule { }
