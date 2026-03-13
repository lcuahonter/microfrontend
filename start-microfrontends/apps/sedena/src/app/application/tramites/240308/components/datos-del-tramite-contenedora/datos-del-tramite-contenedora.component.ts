/**
 *  datos-del-tramite-contenedora.component.ts
 *  Componente contenedor que maneja el estado del trámite 240308 y enlaza los datos del trámite con la vista.
 */
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@libs/shared/data-access-user/src';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosDelTramiteFormState } from '../../../../shared/models/datos-del-tramite.model';
import { JustificacionTramiteFormState } from '../../../../shared/models/datos-del-tramite.model';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Tramite240308Query } from '../../estados/tramite240308Query.query';
import { Tramite240308Store } from '../../estados/tramite240308Store.store';
import { construirAduanasBotones } from '../../constants/solicitude-de-artificios-pirotecnicos.enum';
import { takeUntil } from 'rxjs';

import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

import { DatosMercanciaContenedoraComponent } from '../datos-mercancia-contenedora/datos-mercancia-contenedora.component';

/**
 *  Datos del Trámite Contenedora
 *  Componente contenedor que se encarga de enlazar el estado del trámite con el componente de datos del trámite.
 *  Maneja la suscripción al estado y propaga los cambios a través del store.
 */

@Component({
  selector: 'app-datos-del-tramite-contenedora',
  standalone: true,
  imports: [CommonModule, DatosDelTramiteComponent, ModalComponent],
  templateUrl: './datos-del-tramite-contenedora.component.html',
  styleUrl: './datos-del-tramite-contenedora.component.scss',
})
export class DatosDelTramiteContenedoraComponent implements OnInit, OnDestroy {

  /** * Componente modal para mostrar información adicional.
   * Se utiliza para abrir el componente de datos de mercancía.
   * @property {ModalComponent} modalComponent
   */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;

  /**
    * Indica si el formulario es de solo lectura.
    * @property {boolean} esSoloLectura
    * @description Esta propiedad se utiliza para determinar si el formulario debe ser editable o no.
    * */
  esSoloLectura!: boolean;

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
   * @description Indica si se deben usar botones personalizados en el formulario.
   * @default true
   * @type {boolean}
   */
  usarBotonesPersonalizados: boolean = true;

  /**
 * Indica si el formulario debe mostrarse en modo solo lectura.
 *
 * @type {boolean}
 * @memberof DatosDelTramiteContenedoraComponent
 * @default false
 */
  esFormularioSoloLectura: boolean = false;

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
   * En este caso, corresponde al trámite 240308.
   */
  idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240308;

  /**
   * Referencia al componente Crosslist para manejar la selección de aduanas.
   */
  @ViewChild(CrosslistComponent) crossList!: CrosslistComponent;

  /**
  * @property {Array<{ btnNombre: string; class: string }>} aduanasBotones
  * Lista de botones configurados para manejar las acciones relacionadas con las aduanas.
  * Cada botón incluye un nombre y una clase CSS para su estilo.
  */
  aduanasBotones: { btnNombre: string; class: string }[] = [];

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
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240308Query} tramiteQuery - Query de Akita para obtener el estado actual del trámite.
   * @param {Tramite240308Store} tramiteStore - Store de Akita para actualizar el estado del trámite.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240308Query,
    private tramiteStore: Tramite240308Store,
    private consultaQuery: ConsultaioQuery
  ) { }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los observables del estado para mostrar los datos en la vista.
   *
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
      })

    this.aduanasBotones = construirAduanasBotones(this);
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

    this.tramiteQuery.getJustificacionTramite$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.justificacionTramiteFormState = data;
      });
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
