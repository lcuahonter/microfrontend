import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { DatosDelTramiteFormState, JustificacionTramiteFormState } from '../../../../shared/models/datos-del-tramite.model';
import { Subject, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CrosslistComponent } from '@libs/shared/data-access-user/src';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosMercanciaContenedoraComponent } from '../datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Tramite240305Query } from '../../estados/tramite240305Query.query';
import { Tramite240305Store } from '../../estados/tramite240305Store.store';
import { takeUntil } from 'rxjs';


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
   * Referencia al componente modal.
   *
   * Esta propiedad utiliza el decorador `@ViewChild` para acceder a una instancia del
   * componente `ModalComponent` dentro de la plantilla. Se utiliza cuando se necesita
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
 * Estado del formulario de justificación del trámite.
 * Contiene la información capturada por el usuario.
 */
  public justificacionTramiteFormState!: JustificacionTramiteFormState;

  /**
 * Identificador del procedimiento del trámite.
 * Se utiliza para determinar el tipo de trámite a procesar.
 */
  idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240305;

  /**
 * Indica si el formulario se encuentra en modo solo lectura.
 * Cuando es true, los campos no pueden ser editados.
 */
  esFormularioSoloLectura: boolean = false;

  /**
 * @description Indica si se deben usar botones personalizados en el formulario.
 * @default true
 * @type {boolean}
 */
  usarBotonesPersonalizados: boolean = true;

  /**
  * Referencia al componente Crosslist para manejar la selección de aduanas.
  */
  @ViewChild(CrosslistComponent) crossList!: CrosslistComponent;

  /**
* @property {Array<{ btnNombre: string; class: string }>} aduanasBotones
/**
 * Constructor del componente.
 *
 * @method constructor
 * @param {Tramite240305Query} tramiteQuery - Query de Akita para obtener el estado actual del trámite.
 * @param {Tramite240305Store} tramiteStore - Store de Akita para actualizar el estado del trámite.
 * @returns {void}
 */
  constructor(
    private tramite240305Query: Tramite240305Query,
    private tramite240305Store: Tramite240305Store,
    private consultaQuery: ConsultaioQuery,
  ) {

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los observables del estado para mostrar los datos en la vista.
   *
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite240305Query.getMercanciaTablaDatos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datosMercanciaTabla = data;
      });

    this.tramite240305Query.getDatosDelTramite$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datosDelTramiteFormState = data;
      });
    this.tramite240305Query.getJustificacionTramite$
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
    this.tramite240305Store.updateDatosDelTramiteFormState(event);
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
    this.tramite240305Store.updateJustificacionFormulario(event);
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
      this.tramite240305Store.eliminarMercancias(datos);
    }
  }
}
