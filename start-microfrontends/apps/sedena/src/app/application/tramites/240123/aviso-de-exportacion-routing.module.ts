import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'contenedor-de-pasos',
  },
  {
    path: 'contenedor-de-pasos',
    component: SolicitudPageComponent,
  },

  ];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AvisoDeExportacionRoutingModule { 
  
}
