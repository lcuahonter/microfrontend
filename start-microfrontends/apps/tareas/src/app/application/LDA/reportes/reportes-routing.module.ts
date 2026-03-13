import { ConsultarDetalleAutorizacionesComponent } from './consultar-detalle-autorizaciones/components/inicio.component';
import { ConsultarUbicacionAutorizacionesComponent } from './consultar-ubicacion-autorizaciones/components/inicio.component';
import { InicioComponent } from './consultar-total-de-autorizaciones/inicio.component';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { Routes } from '@angular/router';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'consultar-total-autoridades' },
  {
    path: 'consultar-total-autoridades',
    component: InicioComponent,
  },
  {
    path: 'consultar-detalle-autorizaciones',
    component: ConsultarDetalleAutorizacionesComponent
  },
  {
    path: 'consultar-ubicacion-autorizaciones',
    component: ConsultarUbicacionAutorizacionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ReportesModule {}