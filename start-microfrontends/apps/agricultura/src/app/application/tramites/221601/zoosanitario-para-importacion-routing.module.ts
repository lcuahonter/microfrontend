/**
 * @fileoverview Módulo de enrutamiento para el trámite zoosanitario para importación.
 * Define las rutas específicas para el trámite 221601 del módulo de agricultura.
 * 
 * @description Este módulo configura las rutas de navegación para el proceso de
 * certificado zoosanitario para importación, incluyendo las páginas de solicitante
 * y otros componentes relacionados con el trámite.
 * 
 * @module ZoosanitarioParaImportacionRoutingModule
 * @requires ./pages/zoosanitario-para-importacion/zoosanitario-para-importacion.component
 * @requires @angular/router
 * @requires @angular/core
 * 
 * @author Equipo de desarrollo VUCEM
 * @version 1.0.0
 * @since 2025
 * 
 * @example
 * ```typescript
 * // Importar el módulo en el módulo padre
 * import { ZoosanitarioParaImportacionRoutingModule } from './zoosanitario-para-importacion-routing.module';
 * 
 * @NgModule({
 *   imports: [ZoosanitarioParaImportacionRoutingModule]
 * })
 * export class ParentModule { }
 * ```
 */

import { ZoosanitarioParaImportacionComponent } from './pages/zoosanitario-para-importacion/zoosanitario-para-importacion.component';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

/**
 * Configuración de rutas para el módulo de zoosanitario para importación.
 * Define las rutas disponibles dentro del contexto del trámite 221601.
 * 
 * @description Contiene la definición de todas las rutas que pueden ser
 * navegadas dentro del proceso del certificado zoosanitario para importación.
 * Cada ruta está asociada a un componente específico que maneja la funcionalidad
 * correspondiente.
 * 
 * @type {Routes}
 * @constant
 * @readonly
 * 
 * @example
 * ```typescript
 * // Navegación hacia la ruta del solicitante
 * this.router.navigate(['/zoosanitario/solicitante']);
 * ```
 */
const ROUTES: Routes = [
  {
      /**
       * Ruta para la página del solicitante en el trámite zoosanitario.
       * 
       * @description Esta ruta dirige al usuario hacia el componente principal
       * del trámite donde se capturan los datos del solicitante y se inicia
       * el proceso de certificación zoosanitaria para importación.
       * 
       * @route /solicitante
       * @component ZoosanitarioParaImportacionComponent
       */
      path: 'solicitante',
      component: ZoosanitarioParaImportacionComponent,
    }
];

/**
 * Módulo de enrutamiento para el trámite de certificado zoosanitario para importación.
 * 
 * @description Este módulo Angular configura y exporta las rutas específicas
 * para el trámite 221601, facilitando la navegación entre las diferentes
 * secciones del proceso de solicitud del certificado zoosanitario.
 * 
 * El módulo utiliza RouterModule.forChild() para crear un módulo de enrutamiento
 * secundario que puede ser lazy-loaded, optimizando así el rendimiento de la aplicación.
 * 
 * @class ZoosanitarioParaImportacionRoutingModule
 * @implements {NgModule}
 * 
 * @property {any[]} imports - Importa RouterModule configurado con las rutas hijas
 * @property {any[]} exports - Exporta RouterModule para su uso en otros módulos
 * 
 * @example
 * ```typescript
 * // Uso en el módulo principal del trámite
 * @NgModule({
 *   imports: [
 *     CommonModule,
 *     ZoosanitarioParaImportacionRoutingModule
 *   ],
 *   declarations: [
 *     // componentes del módulo
 *   ]
 * })
 * export class ZoosanitarioParaImportacionModule { }
 * ```
 * 
 * @example
 * ```typescript
 * // Lazy loading desde el módulo padre
 * const routes: Routes = [
 *   {
 *     path: 'zoosanitario',
 *     loadChildren: () => import('./zoosanitario-para-importacion.module')
 *       .then(m => m.ZoosanitarioParaImportacionModule)
 *   }
 * ];
 * ```
 * 
 * @see {@link ZoosanitarioParaImportacionComponent} Componente principal del trámite
 * @see {@link https://angular.io/guide/router} Documentación oficial de Angular Router
 * 
 * @since 1.0.0
 * @author Equipo de desarrollo VUCEM
 */
@NgModule({
  /**
   * Módulos importados necesarios para el funcionamiento del enrutamiento.
   * 
   * @description Importa RouterModule configurado con las rutas hijas (forChild)
   * que permite la navegación dentro del contexto del trámite zoosanitario.
   * 
   * @type {any[]}
   * @memberof ZoosanitarioParaImportacionRoutingModule
   */
  imports: [RouterModule.forChild(ROUTES)],
  
  /**
   * Módulos exportados para su uso en otros módulos de la aplicación.
   * 
   * @description Exporta RouterModule para que pueda ser utilizado por el
   * módulo padre que importe este módulo de enrutamiento.
   * 
   * @type {any[]}
   * @memberof ZoosanitarioParaImportacionRoutingModule
   */
   exports: [RouterModule]
})
export class ZoosanitarioParaImportacionRoutingModule { }
