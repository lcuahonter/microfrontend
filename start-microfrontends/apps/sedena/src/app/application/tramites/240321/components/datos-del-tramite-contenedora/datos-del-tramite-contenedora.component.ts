import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  DatosDelTramiteFormState,
  JustificacionTramiteFormState,
  MercanciaDetalle
} from '../../../../shared/models/datos-del-tramite.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosMercanciaContenedoraComponent } from '../datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { Tramite240321Query } from '../../estados/tramite240321Query.query';
import { Tramite240321Store } from '../../estados/tramite240321Store.store';

/**
 * @title Datos del Trámite Contenedora
 * @description Componente contenedor que se encarga de enlazar el estado del trámite con el componente de datos del trámite.
 * @summary Maneja la suscripción al estado y propaga los cambios a través del store.
 */

@Component({
  selector: 'app-datos-del-tramite-contenedora',
  standalone: true,
  imports: [CommonModule, DatosDelTramiteComponent,ModalComponent],
  templateUrl: './datos-del-tramite-contenedora.component.html',
  styleUrl: './datos-del-tramite-contenedora.component.scss',
})
export class DatosDelTramiteContenedoraComponent implements OnInit, OnDestroy {
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
   * Observable para limpiar suscripciones activas al destruir el componente.
   * @property {Subject<void>} unsubscribe$
   */
  private unsubscribe$ = new Subject<void>();

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
   * @property {JustificacionTramiteFormState} justificacionTramiteFormState
   * Estado actual del formulario de justificación del trámite.
   * Contiene los datos capturados en el formulario de justificación.
   */
  public justificacionTramiteFormState!: JustificacionTramiteFormState;

  /**
   * @property {number} idProcedimiento
   * Identificador numérico del procedimiento asociado al trámite.
   * En este caso, corresponde al trámite 240321.
   */
  idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240321;

    /**
   * Indica si se deben usar botones personalizados en el componente.
   * Cuando es `true`, el componente mostrará botones personalizados en lugar de los predeterminados.
   */
  usarBotonesPersonalizados: boolean = true;

    /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   *
   * @type {boolean}
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   * @see https://compodoc.app/
   */
  esFormularioSoloLectura:boolean=false;
  
  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240321Query} tramiteQuery - Query de Akita para obtener el estado actual del trámite.
   * @param {Tramite240321Store} tramiteStore - Store de Akita para actualizar el estado del trámite.
   * @param {ConsultaioQuery} consultaioQuery - Query para obtener el estado de la sección de consulta.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240321Query,
    private tramiteStore: Tramite240321Store,
    private readonly consultaioQuery:ConsultaioQuery
  ) {}

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los observables del estado para mostrar los datos en la vista.
   *
   * @method ngOnInit
   * @returns {void}
   */
   ngOnInit(): void {
    this.tramiteQuery.getMercanciaTablaDatos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datosMercanciaTabla = data;
      });

    this.tramiteQuery.getDatosDelTramite$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datosDelTramiteFormState = data;
      });

    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.unsubscribe$),
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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
  * @method updateJustificacionFormulario
  * @description Actualiza el estado del formulario de justificación del trámite en el store.
  * Permite guardar los datos capturados en el formulario de justificación.
  *
  * @param {JustificacionTramiteFormState} event - Estado actualizado del formulario de justificación.
  * @returns {void}
  */
  updateJustificacionFormulario(event: JustificacionTramiteFormState): void {
    this.tramiteStore.updateJustificacionFormulario(event);
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
}
