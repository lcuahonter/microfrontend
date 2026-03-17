import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarProveedorCustomComponent } from '../../../../shared/components/agregar-proveedor-custom/agregar-proveedor-custom.component';
import { CommonModule } from '@angular/common';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240117Store } from '../../estados/tramite240117Store.store';
import { Observable } from 'rxjs';
import { Tramite240117Query } from '../../estados/tramite240117Query.query';

/**
 * @component
 * @name AgregarProveedorContenedoraComponent
 * @description Componente encargado de gestionar la funcionalidad relacionada con la adición de proveedores
 * en el trámite 240117. Este componente es independiente y utiliza el `Tramite240117Store` para manejar
 * el estado del trámite.
 *
 * @selector app-agregar-proveedor-contenedora
 * @standalone true
 * @imports CommonModule, AgregarProveedorCustomComponent
 * @templateUrl ./agregar-proveedor-contenedora.component.html
 * @styleUrl ./agregar-proveedor-contenedora.component.scss
 *
 * @property {number} idProcedimiento - Identificador único del procedimiento asociado al trámite 240117.
 *
 * @constructor
 * @param {Tramite240117Store} tramite240117Store - Store que administra el estado del trámite 240117.
 *
 * @method updateProveedorTablaDatos
 * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
 * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
 * @returns {void} Este método no retorna ningún valor.
 */
@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorCustomComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent {
  /**
  * Evento que notifica al componente padre
  * el cierre del componente.
  */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * @property {boolean} estaOculto - Indica si el elemento está oculto o visible.
   * @remarks Este valor determina la visibilidad del componente en la interfaz de usuario.
   * @command Cambiar el valor de esta propiedad para alternar la visibilidad.
   */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240117;

  /**
* Observable que proporciona los datos de la tabla de proveedores.
* Se obtiene desde `tramiteQuery` y puede ser usado para renderizar
* la tabla o reaccionar a cambios en los datos.
*
* @type {Observable<Proveedor[]>}
*/
  proveedoresTablaDatos$ = this.tramiteQuery.getProveedorTablaDatos$;

  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260117Store` para gestionar el estado del trámite.
   *
   * @param tramite240117Store - Store que administra el estado del trámite 260214.
   */
  // eslint-disable-next-line no-empty-function
  constructor(public tramite240117Store: Tramite240117Store, public tramiteQuery: Tramite240117Query) { }

  /**
    * @property terechosDatos$
    * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
    * @description Observable que emite datos relacionados con el destino final o proveedor.
    * Puede ser un objeto de tipo `DestinoFinal`, `Proveedor`, `null` o `undefined`.
    * @command Este observable se utiliza para gestionar y observar los datos de los proveedores o destinos finales en el componente.
    */
  terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240117Store.updateProveedorTablaDatos(event);
    this.cerrar.emit();
  }

  /**
 * Actualiza los datos del destinatario final existente
 * en la tabla del trámite y emite el evento de cierre.
 *
 * @param event Lista actualizada de destinatarios finales.
 */
  actualizaExistenteEnProveedorDatos(event: Proveedor[]): void {
    this.tramite240117Store.updateProveedorTablaDatos(event);
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
}
