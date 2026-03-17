import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../constants/agregar-destinatario.enum';
import { Tramite240112Store } from '../../estados/tramite240112Store.store';
import { Tramite240112Query } from '../../estados/tramite240112Query.query';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

/**
 * Componente contenedor para agregar destinatarios finales.
 *
 * Este componente actúa como un contenedor para el componente `AgregarDestinatarioFinalComponent`,
 * gestionando la interacción con el store del trámite y emitiendo eventos para cerrar el componente.
 *
 * @componente
 * @selector app-agregar-destinatario-final-contenedora
 * @template ./agregar-destinatario-final-contenedora.component.html
 * @estilo ./agregar-destinatario-final-contenedora.component.scss
 * @standalone
 * @importa AgregarDestinatarioFinalComponent
 *
 * @notas
 * Utiliza el store `Tramite240112Store` para administrar el estado de los destinatarios finales.
 */
@Component({
  selector: 'app-agregar-destinatario-final-contenedora',
  templateUrl: './agregar-destinatario-final-contenedora.component.html',
  styleUrl: './agregar-destinatario-final-contenedora.component.scss',
  standalone: true,
  imports: [CommonModule, AgregarDestinatarioFinalComponent]
})
export class AgregarDestinatarioFinalContenedoraComponent {
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
   * @readonly
   * @description Obtiene el identificador del procedimiento actual.
   * @remarks
   * Esta propiedad es de solo lectura y almacena el valor constante de `ID_PROCEDIMIENTO`.
   * 
   * @returns El identificador único del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240111Store} tramiteStore - Store que administra el estado del trámite.
   * @returns {void}
   */
  constructor(public tramiteStore: Tramite240112Store, public tramiteQuery: Tramite240112Query) { }

  /**
   * Actualiza la lista de destinatarios finales en el store del trámite.
   *
   * @method updateDestinatarioFinalTablaDatos
   * @param {DestinoFinal[]} event - Lista de destinatarios finales actualizada.
   * @returns {void}
   */
  updateDestinatarioFinalTablaDatos(event: DestinoFinal[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
    this.cerrar.emit();
  }

  /**
* @method ngOnInit
* @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
* @command Este método asigna un observable `terechosDatos$` con los datos obtenidos desde `tramiteQuery`.
*/
  ngOnInit(): void {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }

  /**
 * Maneja el evento para cerrar la acción actual.
 * Limpia los datos de terceros del store de trámite.
 */
  cerrarEvent(): void {
    this.tramiteStore.clearTercerosDatos();
  }
}
