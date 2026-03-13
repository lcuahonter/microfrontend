import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240305Store } from '../../estados/tramite240305Store.store';
import { Observable } from 'rxjs';
import { ID_PROCEDIMIENTO } from '../../constants/permiso-ordinario-importacion-substancias-quimicas.enum';
import { Tramite240305Query } from '../../estados/tramite240305Query.query';

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
       * @property terechosDatos$
       * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
       * @description Observable que emite datos relacionados con el destino final o proveedor.
       * Puede ser un objeto de tipo `DestinoFinal`, `Proveedor`, `null` o `undefined`.
       * @command Este observable se utiliza para gestionar y observar los datos de los proveedores o destinos finales en el componente.
       */
  terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
* Observable que expone la lista de destinatarios finales almacenados en el estado.
* 
* Se utiliza para obtener y reaccionar a los cambios de los datos mostrados
* en la tabla de destinatarios dentro del flujo del trámite.
*/
  destinatariosTablaDatos$ = this.tramiteQuery.getDestinatarioFinalTablaDatos$;

  /**
  * Evento que se emite para cerrar el modal de agregar destinatario final.
  *
  * @event cerrar
  * @type {EventEmitter<void>}
  */
  @Output() cerrar = new EventEmitter<void>();

  /**
    * Identificador del procedimiento.
    * @property {number} idProcedimiento
    */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
  * Constructor del componente.
  *
  * @method constructor
  * @param {Tramite240305Store} tramite240305Store - Store que administra el estado del trámite.
  * @returns {void}
  */
  constructor(public tramite240305Store: Tramite240305Store, private tramiteQuery: Tramite240305Query) { }

  /**
  * Actualiza la lista de destinatarios finales en el store del trámite.
  *
  * @method updateDestinatarioFinalTablaDatos
  * @param {DestinoFinal[]} event - Lista de destinatarios finales actualizada.
  * @returns {void}
  */
  updateDestinatarioFinalTablaDatos(event: DestinoFinal[]): void {
    this.tramite240305Store.updateDestinatarioFinalTablaDatos(event);
    this.cerrar.emit();
  }

  /**
   * Maneja el evento para cerrar la acción actual.
   * Limpia los datos de terceros del store de trámite.
   */
  cerrarEvent(): void {
    this.tramite240305Store.clearTercerosDatos();
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
