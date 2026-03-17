import { RouterModule, Routes } from '@angular/router';
import { ComponenteDeActualizacionComponent } from './components/componente-de-actualizacion/componente-de-actualizacion.component';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
const ROUTES: Routes = [
  {
    component: SolicitudPageComponent,
    path: 'solicitud',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud',
  },
  {
    path: 'actualizacion/:id',
    component: ComponenteDeActualizacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ConsultaAvisoAcreditacionRoutingModule {}
