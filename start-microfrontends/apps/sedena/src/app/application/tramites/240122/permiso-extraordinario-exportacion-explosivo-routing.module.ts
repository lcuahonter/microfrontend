import { RouterModule, Routes } from '@angular/router';
import { AgregarDestinatarioFinalContenedoraComponent } from './components/agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from './components/agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { DatosMercanciaContenedoraComponent } from './components/datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

/**
 * @constant ROUTES
 * @description Define las rutas de navegación para el módulo de permiso extraordinario de exportación de explosivos.
 * 
 * @property {string} path - Ruta de acceso para cada componente.
 * @property {any} component - Componente asociado a la ruta.
 * @property {string} [pathMatch] - Define cómo se debe comparar la ruta (opcional).
 */
const ROUTES: Routes = [
  {
    path: 'contenedor-de-pasos',
    component: SolicitudPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'contenedor-de-pasos',
  },
  {
    path: 'agregar-datos-mercancia',
    component: DatosMercanciaContenedoraComponent,
  },
  {
    path: 'agregar-destino-final',
    component: AgregarDestinatarioFinalContenedoraComponent,
  },
  {
    path: 'agregar-proveedor',
    component: AgregarProveedorContenedoraComponent,
  },
];

/**
 * @module PermisoExtraordinarioExportacionExplosivoRoutingModule
 * @description Módulo de enrutamiento para el trámite de permiso extraordinario de exportación de explosivos.
 * Define las rutas necesarias para navegar entre los diferentes componentes del flujo.
 */
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PermisoExtraordinarioExportacionExplosivoRoutingModule { }
