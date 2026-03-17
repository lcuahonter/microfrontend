import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AgregarProveedorCustomComponent } from '../../../../shared/components/agregar-proveedor-custom/agregar-proveedor-custom.component';
import { CommonModule } from '@angular/common';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240120Query } from '../../estados/tramite240120Query.query';
import { Tramite240120Store } from '../../estados/tramite240120Store.store';

/**
 * Componente contenedor para la gestión de proveedores en el trámite 240120.
 * 
 * Este componente se encarga de interactuar con el store y el query para obtener,
 * actualizar y modificar los datos de los proveedores asociados al trámite.
 * Proporciona métodos para actualizar la tabla de proveedores y para manejar los datos
 * provenientes del componente hijo personalizado de proveedores.
 *
 * @component
 */
@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorCustomComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent implements OnInit, OnDestroy {

 /**
   * @event cerrar
   * @description Evento emitido para indicar que se debe cerrar el componente.
   * @remarks
   * Este evento no envía ningún valor, simplemente notifica a los componentes padres que se debe realizar la acción de cierre.
   * 
   * @eventType void
   * Evento que se dispara para cerrar el componente actual.
   */
  @Output() cerrar = new EventEmitter<void>();
    
  /**
   * Identificador del procedimiento asociado al trámite.
   * @type {number}
   */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240120;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Datos del proveedor obtenidos del store.
   * @type {Proveedor | null | undefined}
   */
  public ProveedorDatos!: Proveedor | null | undefined;

  /**
   * Constructor que inyecta el store y el query para la gestión del estado del trámite.
   * 
   * @param tramite240120Store - Store que administra el estado del trámite 240120.
   * @param tramiteQuery - Query para consultar el estado del trámite 240120.
   */
  constructor(
    public tramite240120Store: Tramite240120Store,
    public tramiteQuery: Tramite240120Query,
  ) { }

  /**
   * Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void}
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240120Store.updateProveedorTablaDatos(event);
    this.cerrar.emit()
  }
/**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al observable `getmodificarProveedorDatos$` para obtener los datos
   * del proveedor y los asigna a la propiedad local. Utiliza `takeUntil`
   * para limpiar la suscripción al destruir el componente.
   *
   * @returns {void}
   */
  
  ngOnInit(): void {
    this.tramiteQuery.getmodificarProveedorDatos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.ProveedorDatos = datos;
      });
  }

   /**
   * Actualiza los datos existentes de proveedores en el store.
   *
   * @param {Proveedor[]} event - Lista de proveedores actualizados.
   * @returns {void}
   */
  actualizaExistenteEnProveedorDatos(event: Proveedor[]): void {
    this.tramite240120Store.actualizaExistenteEnProveedorDatos(event);
  }

  /**
   * Método de ciclo de vida que se ejecuta al destruirse el componente.
   * Se utiliza para completar el notificador y evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
