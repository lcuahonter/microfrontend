import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240102Store } from '../../estados/tramite240102Store.store';

/**
 * @component AgregarProveedorContenedoraComponent
 * @description
 * Componente contenedor encargado de gestionar la lógica del componente visual `AgregarProveedorComponent`,
 * incluyendo la actualización de datos en el store y la emisión del evento de cierre.
 *
 * @summary
 * Contenedor para agregar un proveedor en el contexto del trámite 240102.
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
   * @event cerrar
   * @description Evento emitido para indicar que se debe cerrar el componente.
   * @remarks
   * Este evento no envía ningún valor, simplemente notifica a los componentes padres que se debe realizar la acción de cierre.
   * 
   * @type {EventEmitter<void>}
   * @memberof AgregarProveedorContenedoraComponent
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite240102Store` para gestionar el estado del trámite.
   *
   * @param {Tramite240102Store} tramite240102Store - Store que administra el estado del trámite 240102.
   * @memberof AgregarProveedorContenedoraComponent
   */
  constructor(public tramite240102Store: Tramite240102Store) {}

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite y emite el evento de cierre.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void}
   * @memberof AgregarProveedorContenedoraComponent
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240102Store.updateProveedorTablaDatos(event);
    this.cerrar.emit();
  }
}
