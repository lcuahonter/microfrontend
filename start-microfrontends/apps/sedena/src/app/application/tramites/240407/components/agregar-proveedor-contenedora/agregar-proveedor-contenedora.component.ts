import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240407Store } from '../../estados/tramite240407Store.store';

/**
 * @component
 * @name AgregarProveedorContenedoraComponent
 * @description
 * Componente contenedor para gestionar la funcionalidad de agregar proveedores.
 * Este componente utiliza el componente `AgregarProveedorComponent` y se conecta al store
 * `Tramite240407Store` para actualizar los datos de los proveedores relacionados con el trámite.
 */
@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent {
   @Output() cerrar = new EventEmitter<void>();
  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite240407Store` para gestionar el estado del trámite.
   *
   * @param {Tramite240407Store} tramite240407Store - Store que administra el estado del trámite 240407.
   */
  constructor(public tramite240407Store: Tramite240407Store) {
    // Constructor vacío
  }

  /**
   * @method updateProveedorTablaDatos
   * @description
   * Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240407Store.updateProveedorTablaDatos(event);
  }
}