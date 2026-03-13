import { Component, EventEmitter, Output } from '@angular/core';
import {
  DestinoFinal,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-sustancias-quimicas.enum';
import { Observable } from 'rxjs';
import { Tramite240106Query } from '../../estados/tramite240106Query.query';
import { Tramite240106Store } from '../../estados/tramite240106Store.store';

/**
 * Componente contenedor para agregar proveedores en el trámite 240106.
 *
 * Este componente se encarga de gestionar la visualización y actualización de los datos
 * relacionados con los proveedores y destinatarios finales, utilizando el store y query
 * correspondientes al trámite.
 *
 * @export
 * @class AgregarProveedorContenedoraComponent
 */
@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent {

  /**
 * Observable que proporciona los datos de la tabla de proveedores.
 * Se obtiene desde `tramiteQuery` y puede ser usado para renderizar
 * la tabla o reaccionar a cambios en los datos.
 *
 * @type {Observable<Proveedor[]>}
 */
  proveedoresTablaDatos$ = this.tramiteQuery.getProveedorTablaDatos$;

  /**
   * Evento emitido cuando se solicita cerrar el componente.
   *
   * @type {EventEmitter<void>}
   * @memberof AgregarProveedorContenedoraComponent
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * @property {boolean} estaOculto - Indica si el elemento está oculto o visible.
   * @remarks Este valor determina la visibilidad del componente en la interfaz de usuario.
   * @command Cambiar el valor de esta propiedad para alternar la visibilidad.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Observable que emite información sobre el destino final, proveedor o un valor nulo/indefinido.
   *
   * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
   *
   * @remarks
   * Este observable se utiliza para gestionar los datos relacionados con los derechos
   * y destinatarios finales en el contexto de la aplicación.
   */
  public terechosDatos$!: Observable<
    DestinoFinal | Proveedor | null | undefined>;

  /**
   * Constructor del componente.
   *
   * Inyecta el store y el query para gestionar el estado y la consulta de datos
   * del trámite 240106.
   *
   * @param tramite240106Store Store que administra el estado del trámite 240106.
   * @param tramiteQuery Query para obtener los datos relacionados con terceros.
   */
  constructor(
    public tramite240106Store: Tramite240106Store,
    public tramiteQuery: Tramite240106Query
  ) {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }

  /**
   * Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event Lista de proveedores que se actualizarán en el store.
   * @returns {void}
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240106Store.updateProveedorTablaDatos(event);
    this.cerrar.emit()
  }

  /**
* Maneja el evento para cerrar la acción actual.
* Limpia los datos de terceros del store de trámite.
*/
  cerrarEvent(): void {
    this.tramite240106Store.clearTercerosDatos();
  }
}
