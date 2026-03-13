import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../enums/domicilio-del-establecimiento.enum';
import { Tramite260911Store } from '../../estados/tramite260911.store';



/**
 * @component AgregarDestinatarioFinalContenedoraComponent
 * @description Componente que actúa como contenedor para gestionar la funcionalidad de agregar destinatarios finales 
 * en el trámite 260203. Este componente utiliza el store `Tramite260203Store` para administrar el estado del trámite 
 * y delega la lógica de actualización de datos a través de métodos específicos.
 * 
 * @selector app-agregar-destinatario-final-contenedora
 * @standalone true
 * @imports 
 * - CommonModule: Módulo común de Angular que proporciona directivas y servicios básicos.
 * - AgregarDestinatarioFinalComponent: Componente hijo que contiene la lógica específica para agregar destinatarios finales.
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
     * @description
     * Constructor que inyecta el store `Tramite260214Store` para gestionar el estado del trámite.
     *
     * @param {Tramite260214Store} tramite260214Store - Store que administra el estado del trámite 260214.
     */
  
    idProcedimiento: number = ID_PROCEDIMIENTO;
  

    /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260911Store` para gestionar el estado del trámite.
   * 
   * @param tramiteStore - Store que administra el estado del trámite 260911.
   */
  constructor(public tramiteStore: Tramite260911Store) {}

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
