/**
 * @fileoverview
 * El `AgregarProveedorContenedoraComponent` es un componente de Angular diseñado para gestionar la funcionalidad relacionada con los proveedores.
 * Este componente utiliza el componente `AgregarProveedorComponent` y se conecta al estado del trámite 260216 a través del store `Tramite260216Store`.
 * 
 * @module AgregarProveedorContenedoraComponent
 * @description
 * Este componente actúa como un contenedor para gestionar la funcionalidad de agregar proveedores y permite actualizar los datos en el store del trámite.
 */

import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260216Store } from '../../estados/tramite260216Store.store';

/**
 * @component
 * @name AgregarProveedorContenedoraComponent
 * @description
 * Componente de Angular que actúa como un contenedor para gestionar la funcionalidad relacionada con los proveedores.
 * Permite actualizar los datos de la tabla de proveedores en el store del trámite 260216.
 *
 * @selector app-agregar-proveedor-contenedora
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./agregar-proveedor-contenedora.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./agregar-proveedor-contenedora.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - AgregarProveedorComponent: Componente reutilizable para gestionar la funcionalidad de agregar proveedores.
 */
@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent {
  /**
   * Constructor del componente.
   * @constructor
   * @description Constructor que inyecta el store `Tramite260216Store` para gestionar el estado del trámite.
   *
   * @param {Tramite260216Store} tramite260216Store - Store que administra el estado del trámite 260216.
   */
  constructor(public tramite260216Store: Tramite260216Store) {}

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * const nuevosProveedores: Proveedor[] = [
   *   { id: 1, nombre: 'Proveedor 1' },
   *   { id: 2, nombre: 'Proveedor 2' },
   * ];
   * this.updateProveedorTablaDatos(nuevosProveedores);
   * ```
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite260216Store.updateProveedorTablaDatos(event);
  }
}