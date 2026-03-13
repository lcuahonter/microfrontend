import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
  DatosDelTramiteFormState,
  MercanciaDetalle
} from '../../../../shared/models/datos-del-tramite.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosMercanciaContenedoraComponent } from '../datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-municiones.enum';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Tramite240105Query } from '../../estados/tramite240105Query.query';
import { Tramite240105Store } from '../../estados/tramite240105Store.store';

/**
 * @title Datos del Trámite Contenedora
 * @description Componente contenedor que se encarga de enlazar el estado del trámite con el componente de datos del trámite.
 * @summary Maneja la suscripción al estado y propaga los cambios a través del store.
 */
@Component({
  selector: 'app-datos-del-tramite-contenedora',
  standalone: true,
  imports: [CommonModule, DatosDelTramiteComponent, ModalComponent],
  templateUrl: './datos-del-tramite-contenedora.component.html',
  styleUrl: './datos-del-tramite-contenedora.component.scss',
})
export class DatosDelTramiteContenedoraComponent implements OnInit, OnDestroy {

  /**
   * @event cerrar
   * @description Evento emitido para indicar que se debe cerrar el componente.
   * @remarks
   * Este evento no envía ningún valor, simplemente notifica a los componentes padres que se debe realizar la acción de cierre.
   * 
   * @eventType void
   * @es
   * Evento que se dispara para cerrar el componente actual.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * @description Indica si se deben usar botones personalizados en el formulario.
   * @default true
   * @type {boolean}
   */
  usarBotonesPersonalizados: boolean = true;

  /**
   * @description Referencia al componente ModalComponent dentro de la plantilla.
   * Utiliza el decorador ViewChild para acceder a la instancia del modal y manipularlo desde el código TypeScript.
   * @example
   * // Para abrir el modal:
   * this.modalComponent.open();
   * 
   * @see ModalComponent
   * 
   * @es
   * Referencia al componente modal para mostrar u ocultar diálogos modales en la interfaz de usuario.
   */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;

  /**
   * Datos de la tabla de mercancías que se muestran en el formulario.
   * @property {MercanciaDetalle[]} datosMercanciaTabla
   */
  public datosMercanciaTabla: MercanciaDetalle[] = [];

  /**
   * Estado actual del formulario de datos del trámite.
   * @property {DatosDelTramiteFormState} datosDelTramiteFormState
   */
  public datosDelTramiteFormState!: DatosDelTramiteFormState;

  /**
   * Observable adicional para limpieza de suscripciones.
   * @property {Subject<void>} destroy$
   */
  private destroy$ = new Subject<void>();

  /**
   * @description Identificador único del procedimiento asociado a este componente.
   * Este valor es de solo lectura y se utiliza para referenciar el procedimiento específico.
   * @see ID_PROCEDIMIENTO
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   *
   * @type {boolean}
   * @memberof DatosDelTramiteContenedoraComponent
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240105Query} tramiteQuery - Query de Akita para obtener el estado actual del trámite.
   * @param {Tramite240105Store} tramiteStore - Store de Akita para actualizar el estado del trámite.
   * @param {ConsultaioQuery} consultaQuery - Query para obtener el estado de la consulta de usuario.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240105Query,
    private tramiteStore: Tramite240105Store,
    private consultaQuery: ConsultaioQuery,
  ) { }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los observables del estado para mostrar los datos en la vista.
   *
   * @method ngOnInit
   * @returns {void}
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

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Hook del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   *
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Actualiza el estado del formulario de datos del trámite en el store.
   *
   * @method updateDatosDelTramiteFormulario
   * @param {DatosDelTramiteFormState} event - Estado actualizado del formulario.
   * @returns {void}
   */
  updateDatosDelTramiteFormulario(event: DatosDelTramiteFormState): void {
    this.tramiteStore.updateDatosDelTramiteFormState(event);
  }


  /**
    * Abre el modal correspondiente según el nombre del evento recibido.
    *
    * Si el evento es `'Datosmercancia'`, se carga el componente `DatosMercanciaContenedoraComponent`
    * dentro del modal y se le pasa una función de cierre como input.
    *
    * @method openModal
    * @param {string} event - Nombre del evento que indica qué componente se debe mostrar en el modal.
    * @returns {void}
    */
  openModal(event: string): void {
    if (event === 'Datosmercancia') {
      this.modalComponent.abrir(DatosMercanciaContenedoraComponent, {
        cerrarModal: this.cerrarModal.bind(this),
      });
    }
  }

  /**
   * Cierra el modal dinámico actualmente abierto utilizando el método del componente modal.
   *
   * @method cerrarModal
   * @returns {void}
   */
  cerrarModal(): void {
    this.modalComponent.cerrar();
  }

  /**
 * Elimina los datos de una mercancía específica del trámite actual.
 *
 * @param datos - Objeto de tipo `MercanciaDetalle` que contiene la información de la mercancía a eliminar.
 *
 * @remarks
 * Este método verifica si el objeto `datos` es válido y, en caso afirmativo,
 * llama al método `eliminarMercancias` del store para eliminar la mercancía correspondiente.
 *
 * @see TramiteStore.eliminarMercancias
 */
  eliminarMercanciasDatos(datos: MercanciaDetalle): void {
    if (datos) {
      this.tramiteStore.eliminarMercancias(datos);
    }
  }
}
