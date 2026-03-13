import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DatosDelTramiteFormState, MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosMercanciaContenedoraComponent } from '../datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { ID_PROCEDIMIENTO } from '../../constantes/exportacion-explosivo-enum';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Tramite240122Query } from '../../estados/tramite240122Query.query';
import { Tramite240122Store } from '../../estados/tramite240122Store.store';

/**
 * @component
 * @name DatosDelTramiteContenedoraComponent
 * @description Componente encargado de gestionar y mostrar los datos del trámite en la interfaz de usuario.
 * Este componente utiliza Akita para manejar el estado del trámite y sus datos asociados.
 * 
 * @selector app-datos-del-tramite-contenedora
 * @standalone true
 * @imports CommonModule, DatosDelTramiteComponent
 * @templateUrl ./datos-del-tramite-contenedora.component.html
 * @styleUrl ./datos-del-tramite-contenedora.component.scss
 * 
 * @class DatosDelTramiteContenedoraComponent
 * @implements OnInit, OnDestroy
 */
@Component({
  selector: 'app-datos-del-tramite-contenedora',
  standalone: true,
  imports: [CommonModule, DatosDelTramiteComponent, ModalComponent],
  templateUrl: './datos-del-tramite-contenedora.component.html',
  styleUrl: './datos-del-tramite-contenedora.component.scss',
})
export class DatosDelTramiteContenedoraComponent implements OnInit, OnDestroy, AfterViewInit {
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
   * Identificador único del procedimiento asociado al trámite.
   * 
   * @property {number} idProcedimiento
   * @remarks Este valor se utiliza para identificar el trámite específico.
   */
  public readonly idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * Observable para limpiar suscripciones activas al destruir el componente.
   * 
   * @property {Subject<void>} unsubscribe$
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Datos de la tabla de mercancías que se muestran en el formulario.
   * 
   * @property {MercanciaDetalle[]} datosMercanciaTabla
   */
  public datosMercanciaTabla: MercanciaDetalle[] = [];

  /**
   * Estado actual del formulario de datos del trámite.
   * 
   * @property {DatosDelTramiteFormState} datosDelTramiteFormState
   */
  public datosDelTramiteFormState!: DatosDelTramiteFormState;

  /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   *
   * @remarks
   * Cuando esta propiedad es `true`, el formulario no permite la edición de sus campos.
   *
   * @compodoc
   * @description
   * Determina si el formulario se presenta únicamente para consulta, deshabilitando la edición de los datos.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240122Query} tramiteQuery - Query de Akita para obtener el estado actual del trámite.
   * @param {Tramite240122Store} tramiteStore - Store de Akita para actualizar el estado del trámite.
   * @param {ActivatedRoute} activatedRoute - Ruta activa para navegar dentro del flujo del trámite.
   * @param {Router} router - Servicio de enrutamiento para navegar a diferentes rutas
   * @param {ConsultaioQuery} consultaioQuery - Query para obtener el estado de la sección de consulta.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240122Query,
    private tramiteStore: Tramite240122Store,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private readonly consultaioQuery: ConsultaioQuery
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
  }
  /**
       * @inheritdoc
       * @description
       * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
       * Suscribe al observable `selectConsultaioState$` para actualizar la propiedad
       * `esFormularioSoloLectura` según el estado de la sección. La suscripción se
       * cancela automáticamente cuando se emite un valor en `destroyNotifier$`.
       *
       * @memberof AgregarProveedorContenedoraComponent
       */
  ngAfterViewInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe()
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
 * Actualiza la lista de destinatarios finales en el store del trámite.
 *
 * @method modificarMercanciasDatos
 * @param {MercanciaDetalle[]} event - Lista de destinatarios finales actualizada.
 * @returns {void}
 */
  modificarMercanciasDatos(datos: MercanciaDetalle): void {
    this.tramiteStore.actualizarMercancias(datos);
    this.irAAcciones();
  }

  /**
* Navega a una ruta relativa dentro del flujo actual.
* @method irAAcciones
* @param {string} accionesPath - Ruta relativa a la que se desea navegar.
* @returns {void}
*/
  irAAcciones(): void {
    this.router.navigate(['../agregar-datos-mercancia'], {
      relativeTo: this.activatedRoute,
    });
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
