/**
 * @fileoverview
 * El `AgregarFacturadorContenedoraComponent` es un componente de Angular que actúa como contenedor para gestionar
 * la funcionalidad relacionada con los facturadores en el trámite 260219. Este componente utiliza el componente
 * `AgregarFacturadorComponent` y se comunica con el estado del trámite a través del store `Tramite260219Store`.
 *
 * @module AgregarFacturadorContenedoraComponent
 * @description
 * Este componente permite agregar y actualizar los datos de los facturadores en el flujo del trámite 260219.
 */

import { AgregarFacturadorComponent } from '../../../../shared/components/agregar-facturador/agregar-facturador.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260219Store } from '../../estados/tramite260219Store.store';

/**
 * @component
 * @name AgregarFacturadorContenedoraComponent
 * @description
 * Componente contenedor que utiliza el componente `AgregarFacturadorComponent` 
 * para gestionar la funcionalidad relacionada con los facturadores. 
 * Este componente interactúa con el estado del trámite a través del store `Tramite260219Store`.
 *
 * @selector app-agregar-facturador-contenedora
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./agregar-facturador-contenedora.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./agregar-facturador-contenedora.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - AgregarFacturadorComponent: Componente compartido para gestionar la funcionalidad de agregar facturadores.
 */
@Component({
  selector: 'app-agregar-facturador-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarFacturadorComponent],
  templateUrl: './agregar-facturador-contenedora.component.html',
  styleUrl: './agregar-facturador-contenedora.component.scss',
})
export class AgregarFacturadorContenedoraComponent {
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
   * @method updateFacturadorTablaDatos
   * @description
   * Actualiza los datos de la tabla de facturadores en el store del trámite.
   *
   * @param {Facturador[]} event - Lista de facturadores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * const facturadores = [
   *   { nombre: 'Facturador 1', rfc: 'RFC123' },
   *   { nombre: 'Facturador 2', rfc: 'RFC456' },
   * ];
   * this.updateFacturadorTablaDatos(facturadores);
   * ```
   */
  updateFacturadorTablaDatos(event: Facturador[]): void {
    this.tramite260219Store.updateFacturadorTablaDatos(event);
  }
}