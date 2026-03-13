import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject,map, takeUntil } from 'rxjs';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { BienFinalComponent } from '../../components/bien-final/bien-final.component';
import { ConsultarCupoComponent } from '../../components/consultar-cupo/consultar-cupo.component';
import { InstrumentoCupoTPLForm } from '../../../120201/models/cupos.model';
import { InsumosComponent } from '../../components/insumos/insumos.component';
import { ProcesoProductivoComponent } from '../../components/proceso-productivo/proceso-productivo.component';
import { RepresentacionFederalComponent } from '../../components/representacion-federal/representacion-federal.component';
import { SolicitudDeRegistroTplService } from '../../services/solicitud-de-registro-tpl.service';
import { Tramite120101Store } from '../../../../estados/tramites/tramite120101.store';
/**
 * @component PasoUnoComponent
 * @description
 * Este componente representa el primer paso del flujo del trámite 120101.
 * @selector paso-uno
 * @templateUrl ./paso-uno.component.html
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

 /**
   * Estado actual de la consulta obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * Identificador numérico de la solicitud actual.
   * 
   * Puede ser un número que representa el ID de la solicitud o `null` si no se ha asignado ninguna solicitud.
   * Este valor es recibido como entrada desde el componente padre.
   */
  @Input() idSolicitud!: number | null;

  /**
   * Evento de salida que se emite cuando se debe guardar la información del formulario.
   * 
   * Los componentes padres pueden suscribirse a este evento para ejecutar acciones
   * personalizadas al momento de guardar.
   */
  @Output() guardarEvent = new EventEmitter<void>();

  /**
 * @Input pestanaDosFormularioValido
 * @description
 * Indica si los formularios asociados a la pestaña dos del wizard son válidos.
 * 
 * Funcionalidad:
 * - Recibe un valor booleano desde el componente padre para determinar la validez de los formularios en la pestaña dos.
 * - Este valor puede ser utilizado para habilitar o deshabilitar acciones relacionadas con la pestaña dos.
 * 
 * @type {boolean}
 * 
 * @example
 * <paso-uno [pestanaDosFormularioValido]="true"></paso-uno>
 */
  @Input() pestanaDosFormularioValido!: boolean;
   /**
   * compo doc
   * Emisor de eventos que notifica el cambio de pestaña.
   * Emite un número correspondiente al índice de la pestaña seleccionada.
   * 
   * @type {EventEmitter<number>}
   * @memberof PasoUnoComponent
   */
   @Output() pestanaCambiado = new EventEmitter<number>();

  /**
   * Índice de la pestaña seleccionada.
   */
  public indice: number = 1;

  /**
 * @property elementoDeTablaSeleccionado
 * @description
 * Almacena el elemento seleccionado de la tabla en el paso uno del flujo del trámite 120101. 
 * @type {InstrumentoCupoTPLForm}
 */
  public elementoDeTablaSeleccionado!: InstrumentoCupoTPLForm;

  /**
   * Referencia al componente hijo `ConsultarCupoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild('consultarCupo') consultarCupo!: ConsultarCupoComponent;

  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild('representacionFederal') representacionFederal!: RepresentacionFederalComponent;

  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild('bienFinal') bienFinal!: BienFinalComponent;

  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild('insumos') insumos!: InsumosComponent;

  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild('procesoProductivo') procesoProductivo!: ProcesoProductivoComponent;

  /**
  * @constructor
  * @description Inicializa una instancia del `DatosComponent`.
  */
  constructor(
    private solicitudRegistroService: SolicitudDeRegistroTplService,
    private consultaQuery: ConsultaioQuery,
    private tramite120101Store: Tramite120101Store,
    private ampliacionServiciosAdapter:AmpliacionServiciosAdapter
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }


    /**
     * Evento de salida que emite un objeto con posibles mensajes de error relacionados con fracciones.
     * 
     * @event
     * @property {string} [fraccionErrorUno] - Mensaje de error para la primera fracción, si existe.
     * @property {string} [fraccionErrorDos] - Mensaje de error para la segunda fracción, si existe.
     */
    @Output() public fraccionErrorEventEmit =
    new EventEmitter<{ fraccionErrorUno?: string; fraccionError?: boolean }>();

    /**
     * Evento de salida que emite un valor booleano para indicar la visibilidad de un elemento.
     * 
     * @event
     * @type {EventEmitter<boolean>}
     * @description Emite `true` o `false` para controlar la visibilidad desde el componente padre.
     */
    @Output() public obtenorVisible =
    new EventEmitter<boolean>();

  /**
   * @method ngOnInit
   * @description
   * Método de inicialización del componente `DatosComponent`.
   * 
   * Detalles:
   * - Se suscribe al observable `selectConsultaioState$` del store `ConsultaioQuery` para obtener el estado actual de la consulta.
   * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   * - Actualiza la propiedad `consultaState` con el estado recibido.
   * - Si la propiedad `update` del estado es verdadera, llama al método `guardarDatosFormulario()`.
   * - Si no, establece la bandera `esDatosRespuesta` en `true` para indicar que se deben mostrar los datos de respuesta.
   * 
   * @example
   * this.ngOnInit();
   * // Inicializa el componente y gestiona el flujo de datos según el estado de la consulta.
   */
  ngOnInit(): void {
      this.consultaQuery.selectConsultaioState$
          .pipe(
            takeUntil(this.destroyNotifier$),
            map((seccionState) => {
              this.consultaState = seccionState;
              if (this.consultaState.update) {
                this.guardarDatosFormulario(this.consultaState?.id_solicitud);
                   this.tramite120101Store.setDynamicFieldValue('idSolicitud', this.consultaState?.id_solicitud);
                   this.idSolicitud=Number(this.consultaState?.id_solicitud);
                  this.esDatosRespuesta = true; 
              } else {
                this.esDatosRespuesta = true;
              }
            })
          )
          .subscribe();
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(idSolicitud: string): void {
    this.solicitudRegistroService
      .getMostrarDatos(idSolicitud).pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.pestanaDosFormularioValido= true;
       const MOSTARDATOS = this.ampliacionServiciosAdapter.reverseMapFromPayload(resp.datos as unknown as Record<string, unknown>);
       const CUERPOTABLA = MOSTARDATOS['cuerpoTabla'];
       this.elementoDeTablaSeleccionado = Array.isArray(CUERPOTABLA) && CUERPOTABLA.length > 0 ? CUERPOTABLA[0] : undefined;       
       this.tramite120101Store.update(MOSTARDATOS);
        }
      });
  }

  /**
   * Selecciona la pestaña especificada.
   * 
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.pestanaCambiado.emit(this.indice);
  }
/**
 * @method archivoHagaClicControlador
 * @description
 * Maneja el evento de clic en un archivo o elemento de la tabla en el paso uno del flujo del trámite 120101.
 * @param {InstrumentoCupoTPLForm} event - El elemento seleccionado de la tabla.
 */
  // eslint-disable-next-line class-methods-use-this
  public archivoHagaClicControlador(event: InstrumentoCupoTPLForm): void {
    if (event) {
      this.elementoDeTablaSeleccionado = event;
    }
  }

  /**
   * Valida los formularios asociados a los diferentes componentes del paso uno.
   * 
   * Llama al método `validarFormulario()` de cada uno de los componentes:
   * - consultarCupo
   * - representacionFederal
   * - bienFinal
   * - insumos
   * - procesoProductivo
   * 
   * Si algún componente no está definido, su validación se omite.
   */
  validarFormularios(): void {
    this.consultarCupo?.validarFormulario();
    this.representacionFederal?.validarFormulario();
    this.bienFinal?.validarFormulario();
    this.insumos?.validarFormulario();
    this.procesoProductivo?.validarFormulario();
  }

/**
 * Emite un evento con información sobre errores relacionados con fracciones.
 *
 * @param event - Objeto que puede contener los mensajes de error para las fracciones uno y dos.
 *   - fraccionErrorUno: Mensaje de error para la primera fracción (opcional).
 *   - fraccionErrorDos: Mensaje de error para la segunda fracción (opcional).
 */
fraccionErrorEvent(event: { fraccionErrorUno?: string; fraccionError?: boolean }): void {
  this.fraccionErrorEventEmit.emit(event);
  }

/**
 * Emite un evento para indicar si el elemento debe ser visible o no.
 *
 * @param event - Valor booleano que representa la visibilidad del elemento.
 */
obtenerVisible(event:boolean):void{
this.obtenorVisible.emit(event);
}


  /**
 * @method ngOnDestroy
 * @description
 * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
 * 
 * Detalles:
 * - Emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores que el componente está siendo destruido.
 * - Completa el observable para liberar recursos y evitar fugas de memoria.
 * 
 * @returns {void} No retorna ningún valor.
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
