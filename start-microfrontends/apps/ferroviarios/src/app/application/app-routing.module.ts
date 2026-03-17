import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'vu-consist' },

  // Ferroviarios (5 rutas)
  {
    path: 'vu-consist',
    loadComponent: () =>
      import('./pages/vu-consist/vu-consist.page').then(
        (m) => m.VuConsistPage
      ),
  },
  {
    path: 'vu-despacho',
    loadComponent: () =>
      import('./pages/vu-despacho/vu-despacho.page').then(
        (m) => m.VuDespachoPage
      ),
  },
  {
    path: 'vu-documento-transporte',
    loadComponent: () =>
      import('./pages/vu-documento-transporte/vu-documento-transporte.page').then(
        (m) => m.VuDocumentoTransportePage
      ),
  },
  {
    path: 'operaciones-contingencia',
    loadComponent: () =>
      import('./pages/operaciones-contingencia/operaciones-contingencia.page').then(
        (m) => m.OperacionesContingenciaPage
      ),
  },
  {
    path: 'lista-detallada',
    loadComponent: () =>
      import('./pages/lista-detallada/lista-detallada.page').then(
        (m) => m.ListaDetalladaPage
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
