import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PaginaDosAcusesYResolucionesDetallesComponent } from './pages/pagina-dos-acuses-y-resoluciones-detalles/pagina-dos-acuses-y-resoluciones-detalles.component';
import { PaginaUnoAcusesYResolucionesBusquedaComponent } from './pages/pagina-uno-acuses-y-resoluciones-busqueda/pagina-uno-acuses-y-resoluciones-busqueda.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';

export const ROUTES_RETIRADA_DE_LA_AUTORIZACION_DE_DONACIONES: Routes = [
  {
    path: 'solicitud',
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
    redirectTo: 'acuses-y-resoluciones-folio-del-tramite',
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES_RETIRADA_DE_LA_AUTORIZACION_DE_DONACIONES),
  ],
  exports: [RouterModule],
})
export class RetiradaDeLaAutorizacionDeDonacioneRoutingModule {}
