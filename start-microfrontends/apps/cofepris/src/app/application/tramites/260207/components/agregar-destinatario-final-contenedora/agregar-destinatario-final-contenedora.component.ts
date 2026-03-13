import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../constants/tratamientos-especiales.enum';
import { Tramite260207Store } from '../../estados/tramite260207Store.store';

/**
 * @component AgregarDestinatarioFinalContenedoraComponent
 * @description Componente contenedor que utiliza el componente `AgregarDestinatarioFinalComponent` 
 * para gestionar la funcionalidad relacionada con los destinatarios finales. 
 * Este componente interactúa con el estado del trámite a través del store `Tramite260207Store`.
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
   * @description Identificador del procedimiento, utilizado para la gestión del trámite.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

    /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260207Store` para gestionar el estado del trámite.
   * 
   * @param tramiteStore - Store que administra el estado del trámite 260207.
   */
  constructor(public tramiteStore: Tramite260207Store) {
    // Constructor vacío, se inyecta el store para su uso en el componente.
  }

    /**
   * @method updateDestinatarioFinalTablaDatos
   * @description Actualiza los datos de la tabla de destinatarios finales en el store del trámite.
   * 
   * @param {Destinatario[]} event - Lista de destinatarios finales que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */

  updateDestinatarioFinalTablaDatos(event: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
  }
}
