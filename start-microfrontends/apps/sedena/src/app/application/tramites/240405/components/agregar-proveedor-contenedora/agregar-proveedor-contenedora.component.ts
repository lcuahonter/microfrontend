import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240405Store } from '../../estados/tramite240405Store.store';

@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent {
  /**
 * Evento de salida que se emite cuando el componente solicita cerrar su vista o flujo.
 * 
 * Puede ser escuchado por el componente padre para ejecutar acciones como ocultar un modal,
 * cambiar de paso en un formulario, o realizar limpieza de datos.
 * 
 * @type {EventEmitter<void>}
 * @memberof NombreDelComponente
 */
   @Output() cerrar = new EventEmitter<void>();
  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260214Store` para gestionar el estado del trámite.
   *
   * @param tramite260214Store - Store que administra el estado del trámite 260214.
   */
  
  constructor(public tramite240405Store: Tramite240405Store) {
    // 
  }

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240405Store.updateProveedorTablaDatos(event);
  }
}
