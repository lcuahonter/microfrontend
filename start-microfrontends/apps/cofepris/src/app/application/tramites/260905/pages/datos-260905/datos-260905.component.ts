import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { Subject,forkJoin,takeUntil } from 'rxjs';
import { DatosDelSolicitudModificacionComponent } from '../../../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DatosSolicitudFormState } from '../../../../shared/models/datos-solicitud.model';
import { DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { GuardarAdapter_260905 } from '../../adapters/guardar-payload.adapter';
import { ManifiestosComponent } from '../../../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { RepresentanteLegalComponent } from '../../../../shared/components/representante-legal/representante-legal.component';
import { Solocitud260905Service } from '../../services/service260905.service';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260905Store } from '../../estados/tramite260905Store.store';

/**
 * @descripción
 * Componente `Datos260905Component` encargado de manejar las pestañas (tabs) 
 * en la interfaz de usuario. Proporciona la funcionalidad de selección de pestañas.
 */
@Component({
  selector: 'app-datos-260905',
  templateUrl: './datos-260905.component.html',
})
export class Datos260905Component implements OnInit, OnChanges {
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
   * Holds the current radio value for tipoTramite, used for child component binding.
   */
  public tipoTramite: string = '';

   /**
     * showPreFillingOptions
     * Indica si se deben mostrar las opciones de prellenado.
     */
  showPreFillingOptions: boolean = false; 

   /**
   * Indica si se están mostrando los datos de respuesta.
   */
  public esDatosRespuesta: boolean = false;
  /**
   * Estado actual de la consulta.
   */
  public consultaState!: ConsultaioState;
  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
 * Índice de la pestaña actualmente seleccionada.
 * Inicializado a 1 por defecto.
 */
  indice = 1;

/**
 * Identificador del procedimiento asociado.
 * Valor por defecto: `260905`.
 */
  public idProcedimiento: number = 260905;
  
    /**
   * Constructor del componente.
   * 
   * @param consultaQuery Servicio para consultar el estado de la solicitud.
   * @param solocitud220401Service Servicio para manejar operaciones relacionadas con el trámite 260402.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solocitud220401Service: Solocitud260905Service,
    public registroSolicitudService: RegistroSolicitudService,
    private tramiteStore:Tramite260905Store,
    private manifestoStore: DatosDomicilioLegalStore,
    private domicilioStore: DomicilioStore,
    private datosDelSolicituteSeccionStore: DatosDelSolicituteSeccionStateStore,
  ) {}
  

    /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de consulta y, dependiendo de si hay una actualización,
   * guarda los datos del formulario o muestra la respuesta.
   */
  ngOnInit(): void {
   this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.consultaState = seccionState;
        if (this.consultaState.update) {
          this.guardarDatosFormulario(this.consultaState.id_solicitud,this.consultaState.procedureId);
        } else {
          this.esDatosRespuesta = true;
          this.guardarDatosFormulario('203056926', '260205');
        }
      })
  }

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
 * Invoca al método `validarContenedor()` del componente hijo
 * `ContenedorDeDatosSolicitudComponent` para comprobar si los
 * datos del formulario son correctos.
 *
 * En caso de que el componente hijo no esté disponible o
 * retorne `null/undefined`, se devuelve `false` por defecto.
 *
 * @returns {boolean}
 * - `true`: si el contenedor y su formulario interno son válidos.
 * - `false`: si el contenedor no es válido o no está disponible.
 */
  validarPasoUno(): boolean {
    const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
    const ESTERCEROS_VALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
    return (DATOS_SOLICITUD_VALIDO && MANIFIESTOS_VALIDO && ESTERCEROS_VALIDO) ? true : false;
  }

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
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param {DatosSolicitudFormState} event - Nuevo estado del formulario de datos de la solicitud.
  */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramiteStore.updateDatosSolicitudFormState(event);
  }

  /**
   * Método para guardar los datos del formulario.
   * Realiza llamadas a los servicios para obtener los datos de registro y pago de derechos,
   * y actualiza el estado del formulario según la respuesta.
   */
    guardarDatosFormulario(ID_SOLICITUD: string, PROCEDURE_ID: string): void {
      this.registroSolicitudService.parcheOpcionesPrellenadas(
        Number(PROCEDURE_ID),
        Number(ID_SOLICITUD)
      ).subscribe((res: any) => {
        if (res && res.datos) {
        GuardarAdapter_260905.patchToStore(res.datos, this.tramiteStore);
        GuardarAdapter_260905.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicituteSeccionStore);
        GuardarAdapter_260905.patchToStoreManifestos(res.datos, this.manifestoStore);
        GuardarAdapter_260905.patchToStoreDomicilio(res.datos, this.domicilioStore);
        }
      });
  
    }
}
