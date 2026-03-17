import { AgregarDestinatarioCustomComponent } from '../../../../shared/components/agregar-destinatario-custom/agregar-destinatario-custom.component';
import { CommonModule } from '@angular/common';

import { Component, EventEmitter, Output } from '@angular/core';
import { DestinoFinal } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240114Store } from '../../estados/tramite240114Store.store';

/**
 * @title Agregar Destinatario Final Contenedora
 * @description Componente contenedor que gestiona la integración del componente de destinatario final con el store.
 * @summary Encapsula el componente de agregar destinatario final y propaga los datos al estado global.
 */

@Component({
  selector: 'app-agregar-destinatario-final-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarDestinatarioCustomComponent],
  templateUrl: './agregar-destinatario-final-contenedora.component.html',
})
export class AgregarDestinatarioFinalContenedoraComponent {
@Output() cerrar = new EventEmitter<void>();
  /**
   * @property esFormularioSoloLectura
   * @description Indica si el formulario es de solo lectura.
   * @type {boolean}
   */

  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240114Store} tramiteStore - Store que administra el estado del trámite.
   * @returns {void}
   */
  // eslint-disable-next-line no-empty-function
  constructor(public tramiteStore: Tramite240114Store) {}

  /**
   * Actualiza la lista de destinatarios finales en el store del trámite.
   *
   * @method updateDestinatarioFinalTablaDatos
   * @param {DestinoFinal[]} event - Lista de destinatarios finales actualizada.
   * @returns {void}
   */
  updateDestinatarioFinalTablaDatos(event: DestinoFinal[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
  }
}
