import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240311Store } from '../../estados/tramite240311Store.store';
import { Tramite240311Query } from '../../estados/tramite240311Query.query';
import { ID_PROCEDIMIENTO } from '../../constants/solicitude-de-artificios-pirotecnicos.enum';
import { Observable } from 'rxjs';

/**
 * Componente contenedor que gestiona la integración del componente de destinatario final con el store.
 * Encapsula el componente de agregar destinatario final y propaga los datos al estado global.
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
   * Evento que se emite para cerrar el componente contenedor.
   * Se utiliza para notificar al componente padre que se debe cerrar la ventana/modal de agregar destinatario final.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
  * Observable que proporciona los datos de la tabla de destinatarios finales.
  * Se obtiene desde `tramiteQuery` y se puede suscribir para renderizar
  * la tabla o reaccionar a cambios en los datos.
  *
  * @type {Observable<Destinatario[]>}
  */
  destinatariosTablaDatos$ = this.tramiteQuery.getDestinatarioFinalTablaDatos$;

  /**
     * @property terechosDatos$
     * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
     * @description Observable que emite datos relacionados con el destino final o proveedor.
     * Puede ser un objeto de tipo `DestinoFinal`, `Proveedor`, `null` o `undefined`.
     * @command Este observable se utiliza para gestionar y observar los datos de los proveedores o destinos finales en el componente.
     */
  terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
     * Identificador del procedimiento.
     * @property {number} idProcedimiento
     */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Constructor del componente.
   * Recibe el store que administra el estado del trámite.
   * tramiteStore: instancia del store para manipular el estado de destinatarios finales.
   * tramiteQuery: instancia del query para obtener datos del estado de destinatarios finales.
   */
  constructor(public tramiteStore: Tramite240311Store, public tramiteQuery: Tramite240311Query) { }

  /**
   * Actualiza la lista de destinatarios finales en el store del trámite.
   * Recibe una lista de destinatarios finales y la envía al store para su actualización.
   * event: lista de destinatarios finales actualizada.
   */
  updateDestinatarioFinalTablaDatos(event: DestinoFinal[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
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
* @method ngOnInit
* @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
* @command Este método asigna un observable `terechosDatos$` con los datos obtenidos desde `tramiteQuery`.
*/
  ngOnInit(): void {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }
}