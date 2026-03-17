import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ID_PROCEDIMIENTO } from '../../enums/domicilio-del-establecimiento.enum';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260912Store } from '../../estados/tramite-260912.store';


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
   * Identificador numérico del procedimiento actual.
   * Se inicializa con el valor constante `ID_PROCEDIMIENTO`.
   * 
   * @remarks
   * Este campo se utiliza para asociar el proveedor con el procedimiento correspondiente
   * dentro del componente AgregarProveedorContenedora.
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;
  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260203Store` para gestionar el estado del trámite.
   *
   * @param tramite260912Store - Store que administra el estado del trámite 260912.
   */
  constructor(public tramite260912Store: Tramite260912Store) {}

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite260912Store.updateProveedorTablaDatos(event);
  }
}
