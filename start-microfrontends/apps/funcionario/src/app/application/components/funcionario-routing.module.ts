import { RouterModule, Routes } from '@angular/router';
import { AutorizacionMasivaComponent } from './autorizacion-masiva/autorizacion-masiva.component';
import { AutorizarDictamenComponent } from './autorizar/autorizar-dictamen/autorizar-dictamen.component';
import { BandejaPendientesComponent } from './seleccion-modulo/seleccion-modulo.component';
import { BandejaSolicitudesComponent } from './bandeja-solicitudes/bandeja-solicitudes.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { ConsultaTramiteComponent } from './consulta-tramite/consulta-tramite.component';
import { DatosGeneralesTramiteComponent } from './datos-generales-tramite/datos-generales-tramite.component';
import { NgModule } from '@angular/core';
import { ObservacionesDictamenComponent } from './autorizar/observaciones/observaciones-dictamen.component';
import { SolicitudPageComponent } from './evaluar-solicitud/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'seleccion-modulo' },
  {
    path: 'bandeja-pendientes',
    component: BandejaPendientesComponent,
  },
  {
    path: 'evaluar-solicitud',
    component: SolicitudPageComponent,
  },
  {
    path: 'autorizar-dictamen',
    component: AutorizarDictamenComponent,
  },
  {
    path: 'consulta',
    component: ConsultaComponent,
  },
  {
    path: 'observaciones-dictamen',
    component: ObservacionesDictamenComponent,
  },
  {
    path: 'observaciones-dictamen',
    component: ObservacionesDictamenComponent,
  },
  {
    path: 'bandeja-solicitudes',
    component: BandejaSolicitudesComponent,
  },
  {
    path: 'consulta-tramite',
    component: ConsultaTramiteComponent
  },
  {
    path: 'datos-generales-tramite',
    component: DatosGeneralesTramiteComponent
  },
  {
    path: 'autorizacion-masiva',
    component: AutorizacionMasivaComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class FuncionarioRoutingModule { }
