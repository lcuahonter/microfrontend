import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-municiones.enum';
import { Observable } from 'rxjs';
import { Tramite240105Query } from '../../estados/tramite240105Query.query';
import { Tramite240105Store } from '../../estados/tramite240105Store.store';

@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent implements OnInit {

  /**
   * @event cerrar
   * @description Evento emitido para indicar que se debe cerrar el componente.
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
  * Constructor del componente/servicio.
  * 
  * @param tramite240105Store - Store para manejar el estado del trámite 240105.
  * @param tramiteQuery - Query para obtener datos reactivos del trámite 240105.
  */
  constructor(
    public tramite240105Store: Tramite240105Store,
    public tramiteQuery: Tramite240105Query
  ) { }

  /**
 * Observable que proporciona los datos de la tabla de proveedores.
 * Se obtiene desde `tramiteQuery` y puede ser usado para renderizar
 * la tabla o reaccionar a cambios en los datos.
 *
 * @type {Observable<Proveedor[]>}
 */
  proveedoresTablaDatos$ = this.tramiteQuery.getProveedorTablaDatos$;

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240105Store.updateProveedorTablaDatos(event);
    this.cerrar.emit()
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
    this.tramite240105Store.clearTercerosDatos();
  }
}
