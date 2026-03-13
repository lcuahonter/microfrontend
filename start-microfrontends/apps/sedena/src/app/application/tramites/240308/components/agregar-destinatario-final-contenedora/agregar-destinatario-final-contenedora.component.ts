/**
 *  Agregar Destinatario Final Contenedora Component
 *  Componente contenedor que integra el componente de agregar destinatario final con el store del trámite 240308.
 */
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240308Store } from '../../../240308/estados/tramite240308Store.store';
import { ID_PROCEDIMIENTO } from '../../constants/solicitude-de-artificios-pirotecnicos.enum';
import { Tramite240308Query } from '../../estados/tramite240308Query.query';
import { Observable } from 'rxjs';

/**
 * @title Agregar Destinatario Final Contenedora
 * @description Componente contenedor que gestiona la integración del componente de destinatario final con el store.
 * @summary Encapsula el componente de agregar destinatario final y propaga los datos al estado global.
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
   * Evento que se emite para cerrar el modal de agregar destinatario final.
   * @property {EventEmitter<void>} cerrar
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
   * Constante que define el ID único del procedimiento actual.
   * 
   * @constant {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
* Constructor del componente.
*
* @method constructor
* @param {Tramite240308Store} tramiteStore - Store que administra el estado del trámite.
* @returns {void}
*/
  // eslint-disable-next-line no-empty-function
  constructor(public tramiteStore: Tramite240308Store, public tramiteQuery: Tramite240308Query) { }

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
