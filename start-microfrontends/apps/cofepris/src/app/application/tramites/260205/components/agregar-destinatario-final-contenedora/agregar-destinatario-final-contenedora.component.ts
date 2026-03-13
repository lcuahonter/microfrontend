import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260205Store } from '../../estados/stores/tramite260205.store';


/**
 * @component AgregarDestinatarioFinalContenedoraComponent
 * @description Componente que actúa como contenedor para la funcionalidad de agregar destinatarios finales 
 * en el trámite 260205. Este componente utiliza el store `Tramite260205Store` para gestionar el estado 
 * del trámite y actualizar los datos relacionados con los destinatarios finales.
 * 
 * @selector app-agregar-destinatario-final-contenedora
 * @standalone true
 * @imports 
 * - CommonModule: Módulo común de Angular que proporciona directivas y servicios básicos.
 * - AgregarDestinatarioFinalComponent: Componente hijo que contiene la lógica específica para agregar 
 * destinatarios finales.
 * 
 * @templateUrl ./agregar-destinatario-final-contenedora.component.html
 * @styleUrl ./agregar-destinatario-final-contenedora.component.scss
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
   * @constructor
   * @description Constructor que inyecta el store `Tramite260205Store` para gestionar el estado del trámite.
   * 
   * @param tramiteStore - Store que administra el estado del trámite 260214.
   */
  constructor(public tramiteStore: Tramite260205Store) {}

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
