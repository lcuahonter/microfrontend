import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarProveedorCustomComponent } from '../../../../shared/components/agregar-proveedor-custom/agregar-proveedor-custom.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240122Store } from '../../estados/tramite240122Store.store';

/**
 * @component AgregarProveedorContenedoraComponent
 * @description
 * Componente contenedor encargado de gestionar la adición de proveedores en el flujo del trámite 240122.
 * Se conecta con el store para actualizar los datos y emite un evento al cerrar.
 *
 * @example
 * ```html
 * <app-agregar-proveedor-contenedora (cerrar)="onCerrar()"></app-agregar-proveedor-contenedora>
 * ```
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
   * @description
   * Evento emitido para notificar al componente padre que se debe cerrar esta vista.
   * 
   * @type {EventEmitter<void>}
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Identificador único del procedimiento del trámite.
   * 
   * @readonly
   * @type {number}
   */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240122;

  /**
   * Indica si el formulario debe estar en modo de solo lectura.
   * 
   * @default false
   * @type {boolean}
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Subject para cancelar suscripciones activas al destruir el componente.
   * 
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @description
   * Constructor que inyecta los servicios necesarios para actualizar estado y consultar datos globales.
   * 
   * @param tramite240122Store Store que administra el estado del trámite 240122.
   * @param consultaioQuery Query para obtener el estado de lectura del formulario.
   */
  constructor(
    public tramite240122Store: Tramite240122Store,
    private readonly consultaioQuery: ConsultaioQuery
  ) {}

  /**
   * @method ngOnInit
   * @description
   * Hook de inicialización del componente.
   * Se suscribe al estado global de consulta para actualizar `esFormularioSoloLectura`.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map(seccionState => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * @method updateProveedorTablaDatos
   * @description
   * Actualiza la lista de proveedores en el store del trámite y emite el evento `cerrar`.
   * 
   * @param event Lista de proveedores a guardar.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240122Store.updateProveedorTablaDatos(event);
    this.cerrar.emit();
  }

  /**
   * @method ngOnDestroy
   * @description
   * Hook que se ejecuta justo antes de destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
   onCancelar():void {
    this.tramite240122Store.actualizarDatosProveedor({} as Proveedor);
    this.cerrar.emit();
  }
}
