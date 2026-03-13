import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SeleccionTramiteComponent } from './seleccion-tramite/seleccion-tramite.component';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'seleccion-tramite' },
  {
    path: 'seleccion-tramite',
    component: SeleccionTramiteComponent,
  },
  {
    path: 'flora-fauna',
    loadChildren: () =>
      import('./tramites/250101/flora-fauna.module').then(
        (m) => m.FloraFaunaModule
      ),
  },
  {
    path: 'flora-fauna-silvestre',
    loadChildren: () =>
      import('./tramites/250102/flora-fauna.module').then(
        (m) => m.FloraFaunaModule
      ),
  },
  {
    path: 'embalaje-de-madera',
    loadChildren: () =>
      import('./tramites/250103/embalaje-de-madera.module').then(
        (m) => m.EmbalajeDeMaderaModule
     ),
  },
  {
    path: 'evaluar',
    loadComponent: () =>
      import('./evaluar/evaluar.component').then(
        (m) => m.EvaluarComponent
     ),
  },
  {
    path: 'autorizar',
    loadComponent: () =>
      import('./autorizar/autorizar.component').then(
        (m) => m.AutorizarComponent
      ),
  },
  {
    path: 'subsecuentes',
    loadComponent: () =>
      import(
        './subsecuentes/acuses-y-resoluciones-folio-del-tramite-detalles-contenedor/acuses-y-resoluciones-folio-del-tramite-detalles-contenedor.component'
      ).then(
        (m) => m.AcusesYResolucionesFolioDelTramiteDetallesContenedorComponent
      ),
  },
  {
    path: 'proceso-requerimiento',
    loadComponent: () =>
      import('./proceso-requerimiento/proceso-requerimiento.component').then(
        (m) => m.ProcesoRequerimientoComponent
      ),
  },
  {
    path: 'verificar-dictamen',
    loadComponent: () =>
      import('./verificar-dictamen/verificar-dictamen.component').then((m) => m.VerificarDictamenComponent),
  },
  {
    path: 'detalle-v-dictamen',
    loadComponent: () =>
      import('./detalle-v-dictamen/detalle-v-dictamen.component').then((m) => m.DetalleVDictamenComponent),
  },
  {
    path: 'datos-generales-tramite',
    loadComponent: () =>
      import('./datos-generales-tramite/datos-generales-tramite.component').then((m) => m.DatosGeneralesTramiteComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
