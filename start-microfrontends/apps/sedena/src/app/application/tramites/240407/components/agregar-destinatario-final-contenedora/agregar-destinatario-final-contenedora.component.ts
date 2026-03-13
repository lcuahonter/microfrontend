import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { DestinoFinal } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240407Store } from '../../../240407/estados/tramite240407Store.store';

/**
 * @component
 * @name AgregarDestinatarioFinalContenedoraComponent
 * @description
 * Componente contenedor para gestionar la funcionalidad de agregar destinatarios finales.
 * Este componente utiliza el componente `AgregarDestinatarioFinalComponent` y se conecta al store
 * `Tramite240407Store` para actualizar los datos de los destinatarios finales relacionados con el trámite.
 */
@Component({
  selector: 'app-agregar-destinatario-final-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarDestinatarioFinalComponent],
  templateUrl: './agregar-destinatario-final-contenedora.component.html',
  styleUrl: './agregar-destinatario-final-contenedora.component.scss',
})
export class AgregarDestinatarioFinalContenedoraComponent {
  @Output() cerrar = new EventEmitter<void>();
  /**
   * @property {Tramite240407Store} tramiteStore
   * @description
   * Instancia del store `Tramite240407Store` que administra el estado del trámite.
   * Este store se utiliza para actualizar los datos de los destinatarios finales.
   */
  constructor(public tramiteStore: Tramite240407Store) {
    // Constructor vacío
  }

  /**
   * @method updateDestinatarioFinalTablaDatos
   * @description
   * Actualiza la lista de destinatarios finales en el store del trámite.
   *
   * @param {DestinoFinal[]} event - Lista de destinatarios finales actualizada.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateDestinatarioFinalTablaDatos(event: DestinoFinal[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
  }
}