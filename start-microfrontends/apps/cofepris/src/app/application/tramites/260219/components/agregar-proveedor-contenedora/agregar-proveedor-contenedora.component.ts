/**
 * @fileoverview
 * El `AgregarProveedorContenedoraComponent` es un componente de Angular que actúa como contenedor para gestionar
 * la funcionalidad relacionada con los proveedores en el trámite 260219. Este componente utiliza el componente
 * `AgregarProveedorComponent` y se comunica con el estado del trámite a través del store `Tramite260219Store`.
 *
 * @module AgregarProveedorContenedoraComponent
 * @description
 * Este componente permite agregar y actualizar los datos de los proveedores en el flujo del trámite 260219.
 */

import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ID_PROCEDIMIENTO } from '../../constants/remedios-herbolarios.enum';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260219Store } from '../../estados/tramite260219Store.store';

/**
 * @component
 * @name AgregarProveedorContenedoraComponent
 * @description
 * Componente contenedor que utiliza el componente `AgregarProveedorComponent` 
 * para gestionar la funcionalidad relacionada con los proveedores. 
 * Este componente interactúa con el estado del trámite a través del store `Tramite260219Store`.
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
 * - AgregarProveedorComponent: Componente compartido para gestionar la funcionalidad de agregar proveedores.
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
   * @property {string} idProcedimiento
   * @description
   * Identificador único del procedimiento, utilizado para la gestión del trámite.
   * Esta propiedad es de solo lectura y se inicializa con el valor constante `ID_PROCEDIMIENTO`.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260219Store` para gestionar el estado del trámite.
   *
   * @param {Tramite260219Store} tramite260219Store - Store que administra el estado del trámite 260219.
   */
  constructor(public tramite260219Store: Tramite260219Store) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * @method updateProveedorTablaDatos
   * @description
   * Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * const proveedores = [
   *   { nombre: 'Proveedor 1', rfc: 'RFC123' },
   *   { nombre: 'Proveedor 2', rfc: 'RFC456' },
   * ];
   * this.updateProveedorTablaDatos(proveedores);
   * ```
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite260219Store.updateProveedorTablaDatos(event);
  }
}