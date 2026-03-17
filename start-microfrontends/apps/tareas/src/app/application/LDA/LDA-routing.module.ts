import { ConsultaAutorizacionesPorAutoridadComponent } from './consultar-autorizaciones-por-autoridad/consultar-autorizaciones.component';
import { InicioRegistroCuotaPagoDerechoAnualComponent } from './registrar-cuota-pago-derecho-anual/inicio/inicio.component';
import { NgModule } from '@angular/core';
import { PagoDerechoAnualComponent } from './consulta-cumplimiento-pago-derecho-anual/pago-derecho-anual.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'reportes' },
  {
    path: 'reportes',
    loadChildren: () => import('./reportes/reportes-routing.module').then(
      (m) => m.ReportesModule
    )
  },
  {
    path: 'consultar-autorizaciones-por-autoridad',
    component: ConsultaAutorizacionesPorAutoridadComponent
  },
  {
    path: 'registrar-cuota-pago-derecho-anual',
    component: InicioRegistroCuotaPagoDerechoAnualComponent
  },
  {
    path: 'consulta-cumplimiento-pago-derecho-anual',
    component: PagoDerechoAnualComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class LDARoutingModule { }