import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DatosDelTramiteFormState, MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosMercanciaContenedoraComponent } from '../datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-sustancias-quimicas.enum';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Tramite240106Query } from '../../estados/tramite240106Query.query';
import { Tramite240106Store } from '../../estados/tramite240106Store.store';


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
   * Indica si se deben usar botones personalizados en el componente.
   * Cuando es `true`, el componente mostrará y gestionará la lógica de botones personalizados.
   */
  usarBotonesPersonalizados: boolean = true;

  /**
   * Referencia al componente ModalComponent asociado a la plantilla mediante el template variable 'modal'.
   * Permite acceder y controlar el comportamiento del modal desde el componente padre.
   * 
   * @remarks
   * La propiedad se inicializa después de que la vista ha sido renderizada.
   */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;

  /**
   * Evento de salida que se emite cuando se solicita cerrar el componente.
   * Los componentes padres pueden suscribirse a este evento para realizar acciones al cerrar.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Identificador único para el procedimiento actual.
   * 
   * Esta constante se inicializa con el valor de `ID_PROCEDIMIENTO` y se utiliza
   * para referenciar el procedimiento específico que maneja este componente.
   * 
   * @readonly
   * @type {number | string} El tipo depende de la definición de `ID_PROCEDIMIENTO`.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

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
   * @param {Tramite240101Query} tramiteQuery - Query de Akita para obtener el estado actual del trámite.
   * @param {Tramite240101Store} tramiteStore - Store de Akita para actualizar el estado del trámite.
   * @param {ConsultaioQuery} consultaQuery - Query para obtener el estado de la consulta.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240106Query,
    private tramiteStore: Tramite240106Store,
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
 * Actualiza la lista de destinatarios finales en el store del trámite.
 *
 * @method modificarMercanciasDatos
 * @param {MercanciaDetalle[]} event - Lista de destinatarios finales actualizada.
 * @returns {void}
 */
  modificarMercanciasDatos(datos: MercanciaDetalle): void {
    this.tramiteStore.actualizarMercancias(datos);
    this.openModal('Datosmercancia');
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