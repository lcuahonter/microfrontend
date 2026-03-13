import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'bitacoraprueba' },

  // Manifiestos pedimentos (9 rutas)
  {
    path: 'bitacoraprueba',
    loadComponent: () =>
      import('./pages/bitacora/bitacora.page').then(
        (m) => m.BitacoraPage
      ),
  },
  {
    path: 'house',
    loadComponent: () =>
      import('./pages/house/house.page').then(
        (m) => m.HousePage
      ),
  },
  {
    path: 'contenedores',
    loadComponent: () =>
      import('./pages/contenedores/contenedores.page').then(
        (m) => m.ContenedoresPage
      ),
  },
  {
    path: 'master',
    loadComponent: () =>
      import('./pages/master/master.page').then(
        (m) => m.MasterPage
      ),
  },
  {
    path: 'manifiesto',
    loadComponent: () =>
      import('./pages/manifiesto/manifiesto.page').then(
        (m) => m.ManifiestoPage
      ),
  },
  {
    path: 'movimientos',
    loadComponent: () =>
      import('./pages/movimientos/movimientos.page').then(
        (m) => m.MovimientosPage
      ),
  },
  {
    path: 'isf10',
    loadComponent: () =>
      import('./pages/isf10/isf10.page').then(
        (m) => m.Isf10Page
      ),
  },
  {
    path: 'plus3',
    loadComponent: () =>
      import('./pages/plus3/plus3.page').then(
        (m) => m.Plus3Page
      ),
  },
  {
    path: 'isf5',
    loadComponent: () =>
      import('./pages/isf5/isf5.page').then(
        (m) => m.Isf5Page
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
