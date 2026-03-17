import { NgModule } from '@angular/core';
import { RegistroModificacionComponent } from './components/registro-modificacion/registro-modificacion.component';
import { RouterModule, } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
const ROUTES_CONTENEDOR: Routes = [
  {
    component: SolicitudPageComponent,
    path: 'solicitud',
  },
  {
    component: RegistroModificacionComponent,
    path: 'registro-modificacion',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitante',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_CONTENEDOR)],
  exports: [RouterModule],
})
export class ImmexModificacionCambioDeSectorRoutingModule { }
