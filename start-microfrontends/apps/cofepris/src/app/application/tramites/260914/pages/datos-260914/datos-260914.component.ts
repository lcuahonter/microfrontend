import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject,forkJoin,takeUntil } from 'rxjs';
import { DatosDelSolicitudModificacionComponent } from '../../../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { DatosSolicitudFormState } from '../../../../shared/models/datos-solicitud.model';
import { ManifiestosComponent } from '../../../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { RepresentanteLegalComponent } from '../../../../shared/components/representante-legal/representante-legal.component';
import { Solocitud260914Service } from '../../services/service260914.service';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260914Store } from '../../estados/tramite260914Store.store';

/**
 * @descripción
 * Componente `Datos260914Component` encargado de manejar las pestañas (tabs) 
 * en la interfaz de usuario. Proporciona la funcionalidad de selección de pestañas.
 */
@Component({
  selector: 'app-datos-260914',
  templateUrl: './datos-260914.component.html',
})
export class Datos260914Component implements OnInit, OnChanges {
  /**
   * @property {number} confirmarSinPagoDeDerechos
   * @description
   * Indica si se ha confirmado la continuación sin pago de derechos.
   */
  @Input() confirmarSinPagoDeDerechos: number = 0;

  /**
   * @property {DatosDelSolicitudModificacionComponent} datosSolicitudComponent
   * @description
   * Referencia al componente hijo `DatosDelSolicitudModificacionComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild('datosdelmodification') datosSolicitudComponent!: DatosDelSolicitudModificacionComponent;

  /**
   * @property {ManifiestosComponent} manifiestosComponent
   * @description
   * Referencia al componente hijo `ManifiestosComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild('manifestosDeclaraciones') manifiestosComponent!: ManifiestosComponent;

  /**
   * @property {RepresentanteLegalComponent} representanteLegalComponent
   * @description
   * Referencia al componente hijo `RepresentanteLegalComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild('representeLegal') representanteLegalComponent!: RepresentanteLegalComponent;

  /**
   * @ViewChild(PagoDeDerechosContenedoraComponent)
   * Referencia al componente hijo `PagoDeDerechosContenedoraComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild('pagoDeDerechosContenedoraComponent') pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;

  /**
   * @ViewChild(TercerosRelacionadosVistaComponent)
   * Referencia al componente hijo `TercerosRelacionadosVistaComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild('tercerosRelacionadosVistaComponent') tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;

  /**
   * @property {string} tipoTramite
   * @description
   * Mantiene el valor actual del radio-button para el tipo de trámite,
   * utilizado para el enlace de datos con componentes hijos.
   */
  public tipoTramite: string = '';

   /**
     * @property {boolean} showPreFillingOptions
     * @description
     * Indica si se deben mostrar las opciones de prellenado.
     */
  showPreFillingOptions: boolean = false; 

   /**
   * @property {boolean} esDatosRespuesta
   * @description
   * Indica si se están mostrando los datos de respuesta.
   */
  public esDatosRespuesta: boolean = false;
  /**
   * @property {ConsultaioState} consultaState
   * @description
   * Estado actual de la consulta.
   */
  public consultaState!: ConsultaioState;
  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
 * @property {number} indice
 * @description
 * Índice de la pestaña actualmente seleccionada.
 * Inicializado a 1 por defecto.
 */
  indice = 1;

/**
 * @property {number} idProcedimiento
 * @description
 * Identificador del procedimiento asociado.
 * Valor por defecto: `260914`.
 */
  public idProcedimiento: number = 260914;

  /**
 * @property {number} idBaseProcedimiento
 * @description
 * Identificador del procedimiento base asociado.
 * Valor por defecto: `260102`.
 */
  public idBaseProcedimiento: number = 260102;
  
    /**
   * @constructor
   * @description
   * Constructor del componente.
   * 
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado de la solicitud.
   * @param {Solocitud260914Service} solocitud220401Service - Servicio para manejar operaciones relacionadas con el trámite.
   * @param {Tramite260914Store} tramiteStore - Store para gestionar el estado del trámite.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solocitud220401Service: Solocitud260914Service,
    private tramiteStore:Tramite260914Store
  ) {}
  

    /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de consulta y, dependiendo de si hay una actualización,
   * guarda los datos del formulario o muestra la respuesta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$))
        .subscribe((seccionState) => {
          this.consultaState = seccionState
          if (this.consultaState.update) {
             this.guardarDatosFormulario()
             } else {
              this.esDatosRespuesta = true;
            }
        })
  }

  /**
   * @method ngOnChanges
   * @description
   * Método del ciclo de vida de Angular que detecta cambios en las propiedades de entrada.
   * 
   * @param {SimpleChanges} changes - Objeto que contiene los cambios en las propiedades.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['confirmarSinPagoDeDerechos'] && !changes['confirmarSinPagoDeDerechos'].firstChange) {
      const CONFIRMAR_VALOR = changes['confirmarSinPagoDeDerechos'].currentValue;
      if (CONFIRMAR_VALOR) {
        this.seleccionaTab(CONFIRMAR_VALOR);
      }
    }
  }

  /**
   * Método para seleccionar una pestaña específica.
   *
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
 * @description
 * Método que se encarga de validar el primer paso del flujo.
 *
 * Invoca a los métodos de validación de los componentes hijos para comprobar 
 * si los datos de los formularios son correctos.
 *
 * @returns {boolean}
 * - `true`: si todos los componentes hijos y sus formularios internos son válidos.
 * - `false`: si alguno de los componentes no es válido o no está disponible.
 */
  validarPasoUno(): boolean {
    const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
    const ESTERCEROS_VALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
    return (DATOS_SOLICITUD_VALIDO && MANIFIESTOS_VALIDO && ESTERCEROS_VALIDO) ? true : false;
  }

  /**
   * @method validarContenedor
   * @description
   * Valida un conjunto específico de componentes del formulario.
   * 
   * @returns {boolean} - `true` si los componentes son válidos, de lo contrario `false`.
   */
  validarContenedor(): boolean {
    const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
    return (
      DATOS_SOLICITUD_VALIDO &&
      MANIFIESTOS_VALIDO
    ) ? true : false;
  }

  /**
   * @method datasolicituActualizar
   * @description
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param {DatosSolicitudFormState} event - Nuevo estado del formulario de datos de la solicitud.
  */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramiteStore.updateDatosSolicitudFormState(event);
  }

    /**
   * @method guardarDatosFormulario
   * @description
   * Método para guardar los datos del formulario.
   * Realiza llamadas a los servicios para obtener los datos de registro y pago de derechos,
   * y actualiza el estado del formulario según la respuesta.
   */
  guardarDatosFormulario(): void {
    forkJoin({
      registro: this.solocitud220401Service.getRegistroTomaMuestrasMercanciasData(),
      permiso: this.solocitud220401Service.getPagoDerechos()
    })
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(({ registro, permiso }) => {
        if (registro) {
          this.esDatosRespuesta = true;
          this.solocitud220401Service.actualizarEstadoFormulario(registro);
        }
        if (permiso) {
          this.solocitud220401Service.actualizarPagoDerechosFormulario(permiso);
        }
      });
  }
}
