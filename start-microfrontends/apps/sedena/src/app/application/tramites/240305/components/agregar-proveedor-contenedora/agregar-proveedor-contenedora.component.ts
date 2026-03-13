import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240305Store } from '../../estados/tramite240305Store.store';
import { Observable } from 'rxjs';
import { ID_PROCEDIMIENTO } from '../../constants/permiso-ordinario-importacion-substancias-quimicas.enum';
import { Tramite240305Query } from '../../estados/tramite240305Query.query';

@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent {
  /**
   * Evento de salida que emite una señal para cerrar el componente actual.
   * Se emite sin valor (`void`), indicando que no se necesita información adicional.
   *
   * @type {EventEmitter<void>}
   * @memberof NombreDelComponente
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
* Observable que expone la lista de proveedores obtenida desde el estado del trámite.
* 
* Se utiliza para mostrar y reaccionar a los cambios en la tabla de proveedores
* dentro del flujo del proceso.
*/
  proveedoresTablaDatos$ = this.tramiteQuery.getProveedorTablaDatos$;

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
* @constructor
* @description Constructor que inyecta el store `Tramite260214Store` para gestionar el estado del trámite.
*
* @param tramite240305Store - Store que administra el estado del trámite 240305.
*/
  constructor(public tramite240305Store: Tramite240305Store, private tramiteQuery: Tramite240305Query) { }

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240305Store.updateProveedorTablaDatos(event);
    this.cerrar.emit()
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
