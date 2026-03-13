/**
 * @fileoverview
 * El `AgregarDestinatarioFinalContenedoraComponent` es un componente de Angular que actúa como contenedor para gestionar
 * la funcionalidad relacionada con los destinatarios finales en el trámite 260219. Este componente utiliza el componente
 * `AgregarDestinatarioFinalComponent` y se comunica con el estado del trámite a través del store `Tramite260219Store`.
 *
 * @module AgregarDestinatarioFinalContenedoraComponent
 * @description
 * Este componente permite agregar y actualizar los datos de los destinatarios finales en el flujo del trámite 260219.
 */

import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../constants/remedios-herbolarios.enum';
import { Tramite260219Store } from '../../estados/tramite260219Store.store';

/**
 * @component
 * @name AgregarDestinatarioFinalContenedoraComponent
 * @description
 * Componente contenedor que utiliza el componente `AgregarDestinatarioFinalComponent` 
 * para gestionar la funcionalidad relacionada con los destinatarios finales. 
 * Este componente interactúa con el estado del trámite a través del store `Tramite260219Store`.
 *
 * @selector app-agregar-destinatario-final-contenedora
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./agregar-destinatario-final-contenedora.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./agregar-destinatario-final-contenedora.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - AgregarDestinatarioFinalComponent: Componente compartido para gestionar la funcionalidad de agregar destinatarios finales.
 */
@Component({
  selector: 'app-agregar-destinatario-final-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarDestinatarioFinalComponent],
  templateUrl: './agregar-destinatario-final-contenedora.component.html',
  styleUrl: './agregar-destinatario-final-contenedora.component.scss',
})
export class AgregarDestinatarioFinalContenedoraComponent {
  /**
   * @property {string} idProcedimiento
   * @description
   * Identificador del procedimiento, utilizado para la gestión del trámite.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260219Store` para gestionar el estado del trámite.
   *
   * @param {Tramite260219Store} tramiteStore - Store que administra el estado del trámite 260219.
   */
  constructor(public tramiteStore: Tramite260219Store) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * @method updateDestinatarioFinalTablaDatos
   * @description
   * Actualiza los datos de la tabla de destinatarios finales en el store del trámite.
   *
   * @param {Destinatario[]} event - Lista de destinatarios finales que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * const destinatarios = [
   *   { nombre: 'Destinatario 1', direccion: 'Dirección 1' },
   *   { nombre: 'Destinatario 2', direccion: 'Dirección 2' },
   * ];
   * this.updateDestinatarioFinalTablaDatos(destinatarios);
   * ```
   */
  updateDestinatarioFinalTablaDatos(event: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
  }
}