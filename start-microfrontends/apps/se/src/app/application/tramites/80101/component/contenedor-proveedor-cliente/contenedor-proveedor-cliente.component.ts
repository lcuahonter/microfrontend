import { AnexoUnoEncabezado, ProveedorClienteTabla } from '../../../../shared/models/nuevo-programa-industrial.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedorClienteComponent } from '../../../../shared/components/proveedor-cliente/proveedor-cliente.component';

/**
 * Componente Angular para el contenedor de proveedor y cliente del trámite 80101.
 * Este componente se encarga de gestionar y mostrar la información relacionada
 * con los proveedores y clientes asociados al trámite.
 * 
 * @remarks
 * Este componente es autónomo y utiliza el módulo `CommonModule` y el componente `ProveedorClienteComponent`.
 */
@Component({
  selector: 'app-contenedor-proveedor-cliente',
  standalone: true,
  imports: [CommonModule,ProveedorClienteComponent],
  templateUrl: './contenedor-proveedor-cliente.component.html',
  styleUrl: './contenedor-proveedor-cliente.component.scss',
})
export class ContenedorProveedorClienteComponent {
  /**
   * Propiedad que representa los datos de la tabla de fracciones 
   * asociados al encabezado del Anexo Uno.
   * 
   * @type {AnexoUnoEncabezado}
   */
  fraccionTablaDatos!:AnexoUnoEncabezado;
  /**
   * Arreglo que almacena los datos del proveedor en forma de objetos de tipo ProveedorClienteTabla.
   * Este arreglo se utiliza para gestionar y mostrar la información relacionada con los proveedores.
   */
  datosDelProveedor:ProveedorClienteTabla[]=[];

  @Input() proveedorClienteDatosTabla!: ProveedorClienteTabla[];

  /**
   * Evento que se emite para cerrar el popup actual.
   * 
   * Notifica al componente padre que se debe cerrar el popup.
   * No envía ningún dato, solo indica la acción de cierre.
   */
  @Output() cerrarPopup = new EventEmitter<void>();

  /**
   * Emisor de eventos para los datos actualizados de proveedores y clientes.
   * @type {EventEmitter<ProveedorClienteTabla[]>}
   */
  @Output() public datosActualizadosProveedorClient = new EventEmitter<
    ProveedorClienteTabla[]
  >();

  /**
   * Método que actualiza los datos del proveedor o cliente con la información proporcionada.
   * 
   * @param $event - Arreglo de objetos de tipo `ProveedorClienteTabla` que contiene los datos actualizados.
   */
  public datosActualizadosProveedorCliente($event: ProveedorClienteTabla[]): void {
    this.datosDelProveedor = $event;
    this.datosActualizadosProveedorClient.emit(this.datosDelProveedor);
  }

}
