import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260203Store } from '../../estados/stores/tramite260203Store.store';


/**
 * @component AgregarProveedorContenedoraComponent
 * @description Componente Angular que actúa como contenedor para gestionar la funcionalidad de agregar proveedores 
 * en el trámite 260203. Este componente utiliza el store `Tramite260203Store` para manejar el estado del trámite 
 * y delega la lógica de actualización de datos de proveedores.
 *
 * @selector app-agregar-proveedor-contenedora
 * @standalone true
 * @imports CommonModule, AgregarProveedorComponent
 * @templateUrl ./agregar-proveedor-contenedora.component.html
 * @styleUrl ./agregar-proveedor-contenedora.component.scss
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
   * @constructor
   * @description Constructor que inyecta el store `Tramite260203Store` para gestionar el estado del trámite.
   *
   * @param tramite260205Store - Store que administra el estado del trámite 260214.
   */
  constructor(public tramite260205Store: Tramite260203Store) {}

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite260205Store.updateProveedorTablaDatos(event);
  }
}
