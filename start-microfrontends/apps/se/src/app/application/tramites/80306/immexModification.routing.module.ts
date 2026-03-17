import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { RegistroModificacionComponent } from './components/registro-modificacion/registro-modificacion.component';
import { RouterModule, } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
const ROUTES_CONTENEDOR: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '80306'
      }
    },
    path: 'registro-modificacion',
    component: RegistroModificacionComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'registro-modificacion',
  },  
  {
    path: 'solicitud',
    component: SolicitudPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_CONTENEDOR)],
  exports: [RouterModule],
})
export class ImmexModificationRoutingModule { }
