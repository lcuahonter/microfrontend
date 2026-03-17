import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240101Store } from '../../estados/tramite240101Store.store';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-municiones.enum';
import { Tramite240101Query } from '../../estados/tramite240101Query.query';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent {
  /**
   * @event cerrar
   * @description Evento emitido para indicar que se debe cerrar el componente.
   * @remarks
   * Este evento no envía ningún valor, simplemente notifica a los componentes padres que se debe realizar la acción de cierre.
   * 
   * @eventType void
   * Evento que se dispara para cerrar el componente actual.
   */
  @Output() cerrar = new EventEmitter<void>();

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
* Observable que expone la lista de proveedores registrados en el trámite.
* Se obtiene directamente desde el query del store para ser consumido en la vista.
*/
  proveedoresTablaDatos$ = this.tramiteQuery.getProveedorTablaDatos$;

  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260214Store` para gestionar el estado del trámite.
   *
   * @param tramite260214Store - Store que administra el estado del trámite 260214.
   */
  // eslint-disable-next-line no-empty-function
  constructor(public tramite240101Store: Tramite240101Store, private tramiteQuery: Tramite240101Query) { }

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240101Store.updateProveedorTablaDatos(event);
    this.cerrar.emit();
  }

  /**
 * Ejecuta el cierre del flujo actual limpiando los datos de terceros
 * almacenados en el store correspondiente.
 */
  cerrarEvent(): void {
    this.tramite240101Store.clearTercerosDatos();
  }
}
