/**
 * Componente contenedor encargado de gestionar y mostrar los datos del trámite,
 * incluyendo la tabla de mercancías y el estado del formulario asociado.
 * 
 * @component
 * 
 * @remarks
 * Este componente utiliza servicios de estado (Akita) para obtener y actualizar
 * la información del trámite, y maneja la apertura de modales para la edición
 * de datos de mercancía.
 * 
 * @example
 * ```html
 * <app-datos-del-tramite-contenedora
 *   [formularioDeshabilitado]="true"
 * ></app-datos-del-tramite-contenedora>
 * ```
 */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DatosDelTramiteFormState, MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Subject, takeUntil } from 'rxjs';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosMercanciaContenedoraComponent } from '../datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { ID_PROCEDIMIENTO } from '../../constants/agregar-destinatario.enum';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Tramite240112Query } from '../../estados/tramite240112Query.query';
import { Tramite240112Store } from '../../estados/tramite240112Store.store';

@Component({
  /**
   * Selector para utilizar el componente en plantillas HTML.
   * 
   * @example
   * <app-datos-del-tramite-contenedora></app-datos-del-tramite-contenedora>
   */
  selector: 'app-datos-del-tramite-contenedora',

  /**
   * Archivo HTML que define la estructura visual del componente.
   */
  templateUrl: './datos-del-tramite-contenedora.component.html',

  /**
   * Archivo SCSS que contiene los estilos del componente.
   */
  styleUrl: './datos-del-tramite-contenedora.component.scss',

  /**
   * Componentes independientes importados para usar en la plantilla.
   */
  standalone: true,
  imports: [DatosDelTramiteComponent, ModalComponent],
})
export class DatosDelTramiteContenedoraComponent implements OnInit, OnDestroy {
  /**
   * Referencia al componente ModalComponent en la plantilla.
   * Permite controlar la apertura y cierre del modal dinámico.
   * 
   * @example
   * this.modalComponent.abrir(...);
   * this.modalComponent.cerrar();
   */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;

  /**
   * Indica si el formulario debe estar deshabilitado (solo lectura).
   * Cuando es `true`, los controles estarán inactivos y no podrán editarse.
   */
  @Input() formularioDeshabilitado: boolean = false;

   /**
   * @description Indica si se deben usar botones personalizados en el formulario.
   * @default true
   * @type {boolean}
   */
  usarBotonesPersonalizados: boolean = true;
 
    @Output() cerrar = new EventEmitter<void>();
  /**
   * Datos de la tabla de mercancías mostrados en el formulario.
   */
  public datosMercanciaTabla: MercanciaDetalle[] = [];

  /**
   * Estado actual del formulario de datos del trámite.
   */
  public datosDelTramiteFormState!: DatosDelTramiteFormState;

  /**
   * Subject para notificar la destrucción y cancelar suscripciones.
   */
  private destroy$ = new Subject<void>();

  /**
   * Identificador del procedimiento actual (constante).
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Constructor que inyecta los servicios para manejar estado y consultas del trámite.
   * 
   * @param tramiteQuery - Query para obtener el estado actual del trámite.
   * @param tramiteStore - Store para actualizar el estado del trámite.
   */
  constructor(
    private tramiteQuery: Tramite240112Query,
    private tramiteStore: Tramite240112Store
  ) {}

  /**
   * Hook de Angular que se ejecuta al inicializar el componente.
   * Se suscribe a los observables para obtener datos de la mercancía y estado del formulario.
   */
  ngOnInit(): void {
    this.tramiteQuery.getMercanciaTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.datosMercanciaTabla = data;
      });

    this.tramiteQuery.getDatosDelTramite$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.datosDelTramiteFormState = data;
      });
  }

  /**
   * Hook de Angular que se ejecuta al destruir el componente.
   * Se utiliza para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Actualiza el estado del formulario de datos del trámite en el store.
   * 
   * @param event - Estado actualizado del formulario de datos del trámite.
   */
  updateDatosDelTramiteFormulario(event: DatosDelTramiteFormState): void {
    this.tramiteStore.updateDatosDelTramiteFormState(event);
  }

  /**
   * Abre el modal correspondiente basado en el evento recibido.
   * Actualmente, si el evento es 'Datosmercancia', abre el modal con el componente
   * DatosMercanciaContenedoraComponent y le pasa una función para cerrar el modal.
   * 
   * @param event - Nombre del evento que indica qué modal abrir.
   */
  openModal(event: string): void {
    if (event === 'Datosmercancia') {
      this.modalComponent.abrir(DatosMercanciaContenedoraComponent, {
        cerrarModal: this.cerrarModal.bind(this),
      });
    }
  }

  /**
   * Cierra el modal dinámico actualmente abierto.
   */
  cerrarModal(): void {
    this.modalComponent.cerrar();
  }

  /**
 * Elimina una mercancía del estado del trámite.
 *
 * @param datos Información de la mercancía a eliminar.
 */
   eliminarMercanciasDatos(datos: MercanciaDetalle): void {
    if (datos) {
      this.tramiteStore.eliminarMercancias(datos);
    }
  }
}
