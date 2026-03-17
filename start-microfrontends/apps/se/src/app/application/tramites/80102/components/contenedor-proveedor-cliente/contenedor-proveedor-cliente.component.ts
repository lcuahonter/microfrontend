import {
  AnexoDosEncabezado,
  AnexoUnoEncabezado,
  ProveedorClienteTabla,
} from '../../../../shared/models/nuevo-programa-industrial.model';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProveedorClienteComponent } from '../../../../shared/components/proveedor-cliente/proveedor-cliente.component';
import { Tramite80102Query } from '../../estados/tramite80102.query';

@Component({
  selector: 'app-contenedor-proveedor-cliente',
  standalone: true,
  imports: [CommonModule, ProveedorClienteComponent],
  templateUrl: './contenedor-proveedor-cliente.component.html',
  styleUrl: './contenedor-proveedor-cliente.component.scss',
})

/**
 * @component
 * @name ContenedorProveedorClienteComponent
 * @description Componente encargado de gestionar los datos de proveedores y clientes en el trámite 80102.
 * Este componente permite visualizar y manejar los datos de los proveedores y clientes, así como sus encabezados.
 *
 * @usageNotes
 * Este componente utiliza servicios de consulta (`Tramite80102Query`) para manejar y observar los datos 
 * relacionados con los proveedores y clientes. Además, implementa el ciclo de vida de Angular para limpiar 
 * las suscripciones al destruirse.
 */
export class ContenedorProveedorClienteComponent implements OnDestroy, OnInit {
  /**
   * Datos de la tabla de fracciones.
   * @type {AnexoUnoEncabezado | AnexoDosEncabezado}
   */
  fraccionTablaDatos!: AnexoUnoEncabezado | AnexoDosEncabezado;
  
  /**
   * Datos del proveedor.
   * @type {ProveedorClienteTabla[]}
   */
  datosDelProveedor: ProveedorClienteTabla[] = [];

  /**
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   *
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$: Subject<void> = new Subject();

/**
 * Evento que se emite para cerrar el popup.
 */
  @Output() cerrarPopup = new EventEmitter<void>();

   /**
   * Emisor de eventos para los datos actualizados de proveedores y clientes.
   * @type {EventEmitter<ProveedorClienteTabla[]>}
   */
  @Output() public datosActualizadosProveedorClient = new EventEmitter<
    ProveedorClienteTabla[]
  >();
 @Input() proveedorClienteDatosTabla!: ProveedorClienteTabla[];

  /**
   * Constructor de la clase ContenedorProveedorClienteComponent.
   * @param {Tramite80102Query} query - Servicio para consultar el estado del trámite.
   */
  constructor(private query: Tramite80102Query) {
    //El constructor requiere inyección de dependencias, pero se ha mantenido vacío debido a una regla de ESLint.
  }

/**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al observable de datos para navegar.
   * @method ngOnInit
*/
  ngOnInit(): void {
    this.query.selectDatosParaNavegar$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosParaNavegar) => {
        this.fraccionTablaDatos = datosParaNavegar;
      });
  }

/**
 * Actualiza los datos del proveedor y cliente.
 * @param {ProveedorClienteTabla[]} $event - Evento que contiene la lista de proveedores y clientes actualizados.
 * @returns {void}
 */
  public datosActualizadosProveedorCliente(
    $event: ProveedorClienteTabla[]
  ): void {
    this.datosDelProveedor = $event;
        this.datosActualizadosProveedorClient.emit(this.datosDelProveedor);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
