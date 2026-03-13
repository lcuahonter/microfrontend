import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-municiones.enum';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240111Store } from '../../estados/tramite240111Store.store';
import { Tramite240111Query } from '../../estados/tramite240111Query.query';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.css',
})
export class AgregarProveedorContenedoraComponent {
  /**
   * Componente contenedor para agregar proveedores en el trámite 240111.
   * Gestiona la interacción con el componente hijo `AgregarProveedorComponent`
   * y comunica los cambios al store correspondiente.
   *
   * @export
   * @class AgregarProveedorContenedoraComponent
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
   * @property {string} idProcedimiento
   * @description Identificador del procedimiento asociado al trámite.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260214Store` para gestionar el estado del trámite.
   *
   * @param tramite260214Store - Store que administra el estado del trámite 260214.
   */
  // eslint-disable-next-line no-empty-function
  constructor(public tramite240111Store: Tramite240111Store, public tramiteQuery: Tramite240111Query) { }

  /**
 * Observable que emite la lista de proveedores
 * registrados en la tabla del trámite.
 */
  proveedoresTablaDatos$ = this.tramiteQuery.getProveedorTablaDatos$

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240111Store.updateProveedorTablaDatos(event);
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
    this.tramite240111Store.clearTercerosDatos();
  }
}
