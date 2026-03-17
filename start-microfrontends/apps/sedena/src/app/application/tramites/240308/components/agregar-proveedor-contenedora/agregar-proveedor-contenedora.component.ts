/**
 *  Agregar Proveedor Contenedora
 *  Componente contenedor que integra el componente de agregar proveedor con el store del trámite 240308.
 */
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';

import { Component, EventEmitter, Output } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240308Store } from '../../estados/tramite240308Store.store';
import { ID_PROCEDIMIENTO } from '../../constants/solicitude-de-artificios-pirotecnicos.enum';
import { Tramite240308Query } from '../../estados/tramite240308Query.query';
import { Observable } from 'rxjs';
/**
 *  Agregar Proveedor Contenedora
 *  Componente contenedor que gestiona la integración del componente de proveedor con el store.
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
   * Evento que se emite para cerrar el modal de agregar proveedor.
   * @property {EventEmitter<void>} cerrar
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
      * Identificador del procedimiento.
      * Constante que define el ID único del procedimiento actual.
      * 
      * @constant {number} idProcedimiento
      */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @property terechosDatos$
   * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
   * @description Observable que emite datos relacionados con el destino final o proveedor.
   * Puede ser un objeto de tipo `DestinoFinal`, `Proveedor`, `null` o `undefined`.
   * @command Este observable se utiliza para gestionar y observar los datos de los proveedores o destinos finales en el componente.
   */
  terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
* @constructor
* @description Constructor que inyecta el store `Tramite240308Store` para gestionar el estado del trámite.
*
* @param tramite240308Store - Store que administra el estado del trámite 240308.
*/
  // eslint-disable-next-line no-empty-function
  constructor(public tramite240308Store: Tramite240308Store, public tramiteQuery: Tramite240308Query) { }

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240308Store.updateProveedorTablaDatos(event);
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
    this.tramite240308Store.clearTercerosDatos();
  }
}
