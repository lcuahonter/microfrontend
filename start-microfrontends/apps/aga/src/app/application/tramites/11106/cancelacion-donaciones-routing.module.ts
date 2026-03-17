import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PaginaDosAcusesYResolucionesDetallesComponent } from './pages/pagina-dos-acuses-y-resoluciones-detalles/pagina-dos-acuses-y-resoluciones-detalles.component';
import { PaginaUnoAcusesYResolucionesBusquedaComponent } from './pages/pagina-uno-acuses-y-resoluciones-busqueda/pagina-uno-acuses-y-resoluciones-busqueda.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';

export const ROUTES_CANCELACION_DONACIONES: Routes = [
  {
    path: 'solicitante',
    component: SolicitantePageComponent,
  },
  {
    path: 'pagina-uno-acuses-y-resoluciones-busqueda',
    component: PaginaUnoAcusesYResolucionesBusquedaComponent,
  },

  {
    path: 'pagina-dos-acuses-y-resoluciones-detalles',
    component: PaginaDosAcusesYResolucionesDetallesComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitante',
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES_CANCELACION_DONACIONES),
  ],
  exports: [RouterModule],
})
export class CancelacionDonacionesRoutingModule {}
