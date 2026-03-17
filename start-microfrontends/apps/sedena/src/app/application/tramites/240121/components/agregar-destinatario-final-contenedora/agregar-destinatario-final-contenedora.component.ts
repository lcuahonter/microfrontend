import { Component, EventEmitter, Output } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { AgregarDestinatarioCustomComponent } from '../../../../shared/components/agregar-destinatario-custom/agregar-destinatario-custom.component';
import { CommonModule } from '@angular/common';
import { ID_PROCEDIMIENTO } from '../../constantes/exportacion-armas-explosivo.enum';
import { Observable } from 'rxjs';
import { Tramite240121Query } from '../../estados/tramite240121Query.query';
import { Tramite240121Store } from '../../estados/tramite240121Store.store';

/**
 * @title Agregar Destinatario Final Contenedora
 * @description Componente contenedor que gestiona la integración del componente de destinatario final con el store.
 * @summary Encapsula el componente de agregar destinatario final y propaga los datos al estado global.
 */

/**
 * Componente que representa la contenedora para agregar destinatarios finales.
 * 
 * @selector app-agregar-destinatario-final-contenedora
 * @standalone true
 * @imports CommonModule, AgregarDestinatarioCustomComponent
 * @templateUrl ./agregar-destinatario-final-contenedora.component.html
 * @styleUrl ./agregar-destinatario-final-contenedora.component.scss
 * 
 * @remarks
 * Este componente se utiliza para gestionar la interfaz de usuario relacionada con
 * la adición de destinatarios finales en el contexto de un trámite específico.
 */
@Component({
  selector: 'app-agregar-destinatario-final-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarDestinatarioCustomComponent],
  templateUrl: './agregar-destinatario-final-contenedora.component.html',
  styleUrl: './agregar-destinatario-final-contenedora.component.scss',
})
export class AgregarDestinatarioFinalContenedoraComponent {
  /**
 * Observable que emite la lista de destinatarios finales desde el store `Tramite240121Query`.
 * Se utiliza para proporcionar datos reactivos al componente hijo.
 */
  destinatariosTablaDatos$ = this.tramiteQuery.getDestinatarioFinalTablaDatos$;

  /**
   * @event cerrar
   * @description Evento emitido para indicar que se debe cerrar el componente.
   * @remarks
   * Este evento no envía ningún valor, simplemente notifica a los componentes padres que se debe realizar la acción de cierre.
   * 
   * @eventType void
   * @es
   * Evento que se dispara para cerrar el componente actual.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Identificador único del procedimiento asociado al componente.
   * 
   * @constant
   * @type {number}
   * @readonly
   * 
   * @remarks
   * Este valor se utiliza para identificar el procedimiento actual en el contexto
   * de la aplicación.
   */
  public readonly idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * Observable que emite información sobre el destino final, proveedor o un valor nulo/indefinido.
   * 
   * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
   * 
   * @remarks
   * Este observable se utiliza para gestionar los datos relacionados con los derechos
   * y destinatarios finales en el contexto de la aplicación.
   */
  public terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
   * Constructor del componente.
   *
   * @constructor
   * @param {Tramite240121Store} tramiteStore - Store que administra el estado del trámite.
   * @param {Tramite240121Query} tramiteQuery - Query para obtener datos relacionados con el trámite.
   * 
   * @remarks
   * Inicializa el observable `terechosDatos$` con los datos obtenidos desde el query.
   */
  constructor(public tramiteStore: Tramite240121Store, public tramiteQuery: Tramite240121Query) { }

  /**
   * Actualiza la lista de destinatarios finales en el store del trámite.
   *
   * @method updateDestinatarioFinalTablaDatos
   * @param {DestinoFinal[]} event - Lista de destinatarios finales actualizada.
   * @returns {void}
   * 
   * @remarks
   * Este método se utiliza para sincronizar los datos de destinatarios finales
   * con el estado global del trámite.
   */
  updateDestinatarioFinalTablaDatos(event: DestinoFinal[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
    this.cerrar.emit();
  }

  /**
 * Actualiza la información del destinatario existente en el estado del trámite
 * y emite el evento de cierre del componente.
 *
 * @param event Lista de destinatarios finales seleccionados.
 */
  actualizaExistenteEnDestinatarioDatos(event: DestinoFinal[]): void {
    if (event?.length) {
      this.tramiteStore.actualizarDatosDestinatario(event[0]);
    }
    this.cerrar.emit();
  }

  /**
  * Maneja el evento para cerrar la acción actual.
  * Limpia los datos de terceros del store de trámite.
  */
  cerrarEvent(): void {
    this.tramiteStore.clearTercerosDatos();
  }

  /**
 * Inicializa el componente asignando el observable
 * de datos de terceros desde el query del trámite.
 */
  ngOnInit(): void {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }
}
