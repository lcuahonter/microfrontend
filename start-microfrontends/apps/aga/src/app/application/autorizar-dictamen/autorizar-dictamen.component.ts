import { AccuseComponentes, ListaComponentes, Tabulaciones } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { AcusesResolucionResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-acuses-response.model';
import { CapturarRequerimientoComponent } from '@libs/shared/data-access-user/src/tramites/components/capturar-requerimiento/capturar-requerimiento.component';
import { CommonModule } from "@angular/common";
import { DictamenesResponse } from '@libs/shared/data-access-user/src/core/models/shared/dictamenes-response.model';
import { DocumentoSolicitud } from "@libs/shared/data-access-user/src/core/models/shared/consulta-documentos-response.model";
import { EncabezadoRequerimientoComponent } from '@libs/shared/data-access-user/src/tramites/components/encabezado-requerimiento/encabezado-requerimiento.component';
import { EvaluarSolicitudService } from '../core/services/evaluar-tramite/evaluar-solicitud.service';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src/tramites/components/firma-electronica/firma-electronica.component';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenerarDictamenComponent } from '@libs/shared/data-access-user/src/tramites/components/generar-dictamen/generar-dictamen.component';
import { GuardarDictamenRequest } from '../core/models/evaluar/request/guardar-dictamen-request.model';
import { GuardarDictamenService } from '../core/services/evaluar-tramite/guardar-dictamen.service';
import { IniciarService } from '../core/services/evaluar-tramite/iniciar.service';
import { LISTA_TRIMITES } from '../core/enums/lista-trimites.enums';
import { OpcionesEvaluacionRequest } from '../core/models/evaluar/request/opciones-evaluacion.model';
import { RequerimientosResponse } from '@libs/shared/data-access-user/src/core/models/shared/requerimientos-response.model';
import { ReviewersTabsComponent } from '@libs/shared/data-access-user/src/tramites/components/reviewers-tabs/reviewers-tabs.component';
import { Router } from '@angular/router';
import { SolicitarDocumentosEvaluacionComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitar-documentos-evaluacion/solicitar-documentos-evaluacion.component';
import { SolicitarOpinionComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitar-opinion/solicitar-opinion.component';
import { SolicitudRequerimientoQuery } from '@libs/shared/data-access-user/src/core/queries/requerimientos.query';
import { SolicitudRequerimientosState } from '@libs/shared/data-access-user/src/core/estados/requerimientos.store';

import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { TabsSolicitudServiceTsService } from "../core/services/evaluar-tramite/tabs-solicitud.service.ts.service";
import { TareasSolicitud } from "@libs/shared/data-access-user/src/core/models/shared/consulta-tareas-response.model";

import { Component, OnDestroy, OnInit, Type} from "@angular/core";

import { CategoriaMensaje, ConsultaioQuery, ConsultaioState, ConsultaioStore, FECHA_DE_INICIO, Notificacion, NotificacionesComponent, base64ToHex, encodeToISO88591Hex, exportExcelFile, formatFecha, manejarPdf } from '@ng-mf/data-access-user';

import { CriteriosResponse } from '@libs/shared/data-access-user/src/core/models/shared/criterios-response.model';
import { IniciarDictamenResponse } from '@libs/shared/data-access-user/src/core/models/shared/iniciar-dictamen-response.model';
import { IniciarRequerimientoResponse } from '@libs/shared/data-access-user/src/core/models/shared/Iniciar-requerimiento-response.model';
import { SentidosDisponiblesResponse } from '@libs/shared/data-access-user/src/core/models/shared/sentidos-disponibles.model';

import { OpinionResponse } from '@libs/shared/data-access-user/src/core/models/shared/opinion-response.model';

import { EnvioDigitalResponse } from '@libs/shared/data-access-user/src/core/models/shared/envio-digital-response.model';
import { TabsResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-tabs-response.model';

import { GuardarRequerimientoService } from '../core/services/evaluar-tramite/guardarRequerimiento.service';

import { FirmarDictamenService } from '../core/services/evaluar-tramite/firmarDictamen.service';
import { FirmarRequermientoService } from '../core/services/evaluar-tramite/firmarRequermiento.service';



import { EvaluacionOpcionResponse } from '../core/models/evaluar/response/evaluar-estado-evaluacion-response.model';

import { CodigoRespuesta } from '../core/enums/evaluar/codigo-respuesta.enum';

import { IniciarRequerimientoRequest } from '../core/models/evaluar/request/iniciar-requerimiento-request.model';

import { DictamenForm } from '@libs/shared/data-access-user/src/core/models/shared/dictamen-form.model';

import { Firma, FirmarDictamenRequest } from '../core/models/evaluar/request/firmar-dictamen-request.model';

import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';

import { GuardarRequerimiento } from '../core/models/evaluar/request/guardar-requerimiento-request.model';
import { MostrarFirmarRequerimientoRequest } from '../core/models/evaluar/request/firma-mostrar-requerimiento.request.model';

import { IniciarAutorizacionResponse } from '@libs/shared/data-access-user/src/core/models/shared/iniciar-autorizar-dictamen-response.model';

import { TramiteConfig } from '../shared/models/tramite-config.model';

import { BodyTablaResolucion, HeaderTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';

import { CONSULTA_RESOLUCIONES } from '@libs/shared/data-access-user/src/core/enums/consulta-generica.enum';
import { MostrarFirmarResponse } from '../core/models/atender-requerimiento/response/mostrar-firmar-response.model';

import { ModeloConfig, ServiceConfig } from '../shared/models/service-config.model';

import { AutorizarDictamenService } from '../core/services/autorizar-dictamen/autorizar-dictamen.service';

import { AcuseDetalleService } from '@libs/shared/data-access-user/src/core/services/shared/detalleAcuse.service';

import { TramiteConfigService } from '../shared/services/tramiteConfig.service';

import { IniciarAutorizacionRequest } from '../core/models/autorizar-requerimiento/request/autorizar-dictamen-request.model';

import { FirmaAutorizarDictamenRequest } from '../core/models/autorizar-requerimiento/request/firma-autorizar-request.model';
import { MostrarFirmaRequest } from '../core/models/autorizar-requerimiento/request/mostrar-firmar-request.model';
import { ObservacionRequest } from '../core/models/autorizar-requerimiento/request/observacion-guardar-request.model';


/**
 * @component
 * @name EvaluarComponent
 * @description Componente principal para la evaluación de trámites en la aplicación AGA.
 * 
 * Este componente permite gestionar el flujo de evaluación de un trámite, incluyendo la navegación entre pestañas,
 * la visualización y captura de requerimientos, la generación de dictámenes y la firma electrónica.
 * Utiliza servicios y stores para obtener y actualizar el estado del trámite y los requerimientos asociados.
 * 
 * @selector app-evaluar
 * @standalone true
 * @imports
 *  - CommonModule
 *  - ReviewersTabsComponent
 *  - EncabezadoRequerimientoComponent
 *  - FormsModule
 *  - ReactiveFormsModule
 *  - GenerarDictamenComponent
 *  - FirmaElectronicaComponent
 *  - CapturarRequerimientoComponent
 *  - SolicitarDocumentosEvaluacionComponent
 * @templateUrl ./autorizar-dictamen.component.html
 * @styleUrl ./autorizar-dictamen.component.scss
 */
@Component({
  selector: 'app-autorizar-dictamen',
  standalone: true,
  imports: [CommonModule, ReviewersTabsComponent,
    EncabezadoRequerimientoComponent,
    FormsModule, ReactiveFormsModule,
    GenerarDictamenComponent,
    FirmaElectronicaComponent,
    CapturarRequerimientoComponent,
    SolicitarDocumentosEvaluacionComponent,
    SolicitarOpinionComponent, NotificacionesComponent],
  templateUrl: './autorizar-dictamen.component.html',
  styleUrl: './autorizar-dictamen.component.scss',
})
export class AutorizarDictamenComponent implements OnInit, OnDestroy {

  /**
   * @property {IniciarAutorizacionResponse} dataAutorizarDictamen
   * @description Datos obtenidos al iniciar el dictamen de autorización.
   */
  dataAutorizarDictamen!: IniciarAutorizacionResponse;


  /**
  * @property {AccuseComponentes[] } listaTrimites
  * @description Lista de trámites disponibles para evaluación, obtenida de la constante LISTA_TRIMITES.
  */
  listaTrimites = LISTA_TRIMITES;
  /**
   * @property {AccuseComponentes | undefined} slectTramite
   * @description Objeto que representa el trámite seleccionado actualmente.
   */
  slectTramite!: AccuseComponentes | undefined;
  /**
   * @property {Type<unknown>} viewChild
   * @description Referencia dinámica al componente hijo que se carga según la pestaña seleccionada.
   */

  isDictamen: boolean = true;

  /**
   * @property {TramiteConfig} config
   * @description Configuración específica del trámite, obtenida del servicio TramiteConfigService.
  */
  config!: TramiteConfig;

  /**
   * Formulario reactivo para la solicitud de observacion dictamen.
   * @type {FormGroup}
  */
  public observacionForm!: FormGroup;
  /**
   * Encabezado de la tabla de resoluciones.
   * Contiene las columnas que se mostrarán en la tabla de resoluciones.
   * @type {HeaderTablaResolucion[]}
  */
  readonly encabezadoTablaResolucion: HeaderTablaResolucion[] = CONSULTA_RESOLUCIONES.encabezadoTablaResolucion;


  /**
   * @property {boolean} isObservacion
   * @description Indica si se debe la observacion.
  */
  isObservacion: boolean = false;


  /**
   * @property {string} sentidoDictamenSeleccionado
   * @description Sentido del dictamen seleccionado por el usuario.
   *  
   */
  sentidoDictamenSeleccionado: string = '';



  /**
   * @property {boolean} isFirma
   * @description Indica si se debe mostrar la sección de firma electrónica.
  */
  isFirma: boolean = false;

  /**
   * @property {boolean} isDocumento
   * @description Indica si se debe mostrar la sección de firma electrónica.
  */
  isDocumento: boolean = false;

  /** Response del servicio de firmar mostrar */
  mostrarFirmarData!: MostrarFirmarResponse;



  
  viewChild!: Type<unknown>;
  /**
   * @property {number} tramite
   * @description Identificador del trámite seleccionado.
   */
  tramite: number = 0;
  /**
   * @property {number} indice
   * @description Índice de la pestaña principal seleccionada.
   */
  indice: number = 0;
  /**
   * @property {boolean} firmar
   * @description Indica si se debe mostrar la sección de firma electrónica.
   */
  firmar: boolean = false;

  /** ID del requerimiento */
  idRequerimiento!: number;

  /** Justificación del requerimiento */
  justificacion!: string;

  /**
   * @property {string} firmaOficioCadena
   * @description Cadena original del oficio de autorización o rechazo que se va a firmar.
   */
  firmaOficioCadena!: string;

  /**
   * Datos de la tabla de resoluciones.
   * Contiene los registros que se mostrarán en la tabla de resoluciones.
   * @type {BodyTablaResolucion[]}
  */
  datosTablaResolucion: BodyTablaResolucion[] = [];

  /** Datos del dictamen a generar */
  dataIniciarDictamen!: IniciarDictamenResponse;

  /**
   * @property {ConsultaioState} guardarDatos
   * @description Estado actual del trámite consultado.
   */
  guardarDatos!: ConsultaioState;
  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para cancelar las suscripciones y evitar fugas de memoria al destruir el componente.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {number} indiceDictamen
   * @description Índice de la pestaña de dictamen seleccionada.
   */
  indiceDictamen: number = 1;

  /** Cadena original del requerimiento a firmar */
  cadenaOriginalRequerimiento!: string;

  /** Datos de respuesta al iniciar un requerimiento */
  dataIniciarRequerimiento!: IniciarRequerimientoResponse;

  /** Nueva notificación a gestionar */
  nuevaNotificacion!: Notificacion;

  /**
   * @property {SolicitudRequerimientosState} requerimientoState
   * @description Estado actual de los requerimientos asociados al trámite.
   */
  public requerimientoState!: SolicitudRequerimientosState;
  /**
   * Variable para deshabilitar pestaña documento
   */
  deshabilitarSolicitarDocumentos: boolean = false;

  /**
   * @property {string[]} opcionesDisponibles
   * @description Lista de opciones disponibles para la evaluación del trámite.
   */
  opcionesDisponibles: string[] = [];

  /**
   * @property {string} conformidadDictamen
   * @description Texto que representa la conformidad del dictamen, utilizado en el formulario de generación de dictamen.
   */
  conformidadDictamen!: CriteriosResponse;

  /** 
   * @property {GuardarDictamenRequest} guardarDictamenRequest
   * @description Objeto que contiene los datos necesarios para guardar un dictamen.
   */
  opcionesSentidosDispobles: SentidosDisponiblesResponse[] = [];


  /**
   * @property {DocumentoSolicitud[]} documentos
   * @description Documentos de solicitud.
   */
  documentosSolicitud: DocumentoSolicitud[] = [];

  /**
   * @property {TareasSolicitud[]} tareasSolicitud
   * @description Tareas de solicitud.
   */
  tareasSolicitud: TareasSolicitud[] = [];

  /** Listado de opiniones registradas para el trámite. */
  opinion: OpinionResponse[] = [];

  /**
   * @property {AcusesResolucionResponse[]} acusesResolucion
   * @description Acuses de resolución asociados al trámite.
   */
  acusesResolucion!: AcusesResolucionResponse;

  /**
   * @property {EnvioDigitalResponse} envioDigital
   * @description Respuesta del envío digital asociado al trámite.
   */
  envioDigital!: EnvioDigitalResponse;

  /**
   * @property {RequerimientosResponse[]} requerimientosSolicitud
   * @description Requerimientos de solicitud.
   */
  requerimientosSolicitud: RequerimientosResponse[] = [];

  /**
   * @property {DictamenesResponse[]} dictamenesSolicitud
   * @description Dictamenes de solicitud.
   */
  dictamenesSolicitud: DictamenesResponse[] = [];

  /**
   * @property {boolean} yaCargoDocumentos
   * @description Indica si los documentos de la solicitud ya han sido cargados.
   */
  yaCargoDocumentos = false;

  /**
   * @property {boolean} yaCargoTareas
   * @description Indica si las tareas de la solicitud ya han sido cargadas.
   */
  yaCargoTareas = false;

  /**
   * @property {boolean} yaCargoAcuses
   * @description Indica si los acuses de resolución ya han sido cargados.
   */
  yaCargoAcuses = false;

  /**
  * Cadena original generada a partir de los datos del trámite.
  * Esta cadena será firmada con el certificado digital y la llave privada proporcionados.
  */
  cadenaOriginal?: string;

  /**
   * @property {string} sello
   * @description Sello digital del documento.
   */
  sello!: string;

  /**
   * @property {boolean} yaCargoDictamenes
   * @description Indica si los dictamenes ya han sido cargados.
   */
  yaCargoDictamenes = false;

  /**
* Objeto que contiene los datos reales de la firma electrónica generada después del proceso de firma.
* Incluye:
* - firma: Cadena de la firma generada (en base64).
* - certSerialNumber: Número de serie del certificado digital.
* - rfc: RFC extraído del certificado.
* - fechaFin: Fecha de vencimiento del certificado.
*/
  datosFirmaReales!: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  };

  /**
   * @property {boolean} yaCaegoRequerimientos
   * @description Indica si los requerimientos ya han sido cargados.
   */
  yaCargoRequerimientos = false;

  /**
   * @property {boolean} yaCargoEnvioDigital
   * @description Indica si el envío digital ya ha sido cargado.
   */
  yaCargoEnvioDigital = false;

  /** Indica si la opinión ya ha sido cargada. */
  yaCargoOpinion = false;

  /**
   * @property {EvaluacionOpcionResponse} evaluacionTramite
   * @description Almacena la respuesta de evaluación del trámite.
 */
  evaluacionTramite!: EvaluacionOpcionResponse;

  /**
   * @property {TabsResponse} tabs
   * @description Almacena la respuesta de pestañas disponibles.
 */
  tabs!: TabsResponse;

  /**
   * @property {Array<{id: number, nombre: string}>} tabsOpcionEvaluacion
   * @description Almacena las opciones de evaluación disponibles para las pestañas.
 */
  tabsOpcionEvaluacion: { id: number; nombre: string }[] = [];

  /**
  * @property {ServiceConfig} serviceConfig
  * @description Configuración de servicios específicos del trámite, obtenida del servicio TramiteConfigService.
  */
  serviceConfig!: ServiceConfig;

  /**
  * @property {ModeloConfig} serviceConfigModelo
  * @description Configuración de modelo específicos del trámite, obtenida del servicio TramiteConfigService.
  */
  serviceConfigModelo!: ModeloConfig;



  /**
 * @constructor
 * @description Constructor del componente. Inicializa los servicios y suscripciones necesarias para la evaluación del trámite.
 * 
 * - Se suscribe al estado de consulta del trámite mediante `ConsultaioQuery` y actualiza la propiedad `guardarDatos` cada vez que cambia el estado.
 * - Se suscribe al estado de requerimientos mediante `SolicitudRequerimientoQuery` y actualiza la propiedad `requerimientoState` cada vez que cambia el estado.
 * - Inicializa el identificador del trámite (`tramite`) a partir del estado consultado.
 * - Llama al método `solicitanteConsultaio` del store para cargar los datos iniciales del trámite, utilizando el folio, la fecha de inicio y el estado del trámite.
 * 
 * @param {Router} router - Servicio de enrutamiento de Angular para navegación.
 * @param {ConsultaioStore} consultaioStore - Store para gestionar el estado de consulta del trámite.
 * @param {ConsultaioQuery} consultaioQuery - Query para observar el estado de consulta del trámite.
 * @param {SolicitudRequerimientoQuery} solicitudRequerimientoQuery - Query para observar el estado de los requerimientos asociados al trámite.
 */
  constructor(private router: Router,
    private consultaioStore: ConsultaioStore,
    private consultaioQuery: ConsultaioQuery,
    private solicitudRequerimientoQuery: SolicitudRequerimientoQuery,
    private evaluarSolicitudService: EvaluarSolicitudService,
    private tabsSolicitudServiceTsService: TabsSolicitudServiceTsService,
    private iniciarService: IniciarService,
    private guardarService: GuardarDictamenService,
    private guardarRequerimientoService: GuardarRequerimientoService,
    private firmarDictamenService: FirmarDictamenService,
    private firmarRequermientoService: FirmarRequermientoService,
    private autorizarDictamenService: AutorizarDictamenService,
    private acuseDetalleService: AcuseDetalleService,
    private fb: FormBuilder,
    private tramiteConfigService: TramiteConfigService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.guardarDatos = seccionState;
        })
      )
      .subscribe()
    this.tramite = Number(this.guardarDatos?.procedureId);
    this.consultaioStore.solicitanteConsultaio({
      folioDelTramite: this.guardarDatos?.folioTramite,
      fechaDeInicio: FECHA_DE_INICIO,
      estadoDelTramite: this.guardarDatos?.estadoDeTramite,
      tipoDeTramite: this.guardarDatos?.tipoDeTramite
    });

    /** 
      * Formulario reactivo para detalle observacion.
    */
    this.observacionForm = this.fb.group({
      observacion: ['',],
    });

    this.config = this.tramiteConfigService.getConfig(this.tramite);
    this.serviceConfig = this.tramiteConfigService.getServiceConfig(this.tramite);
    this.serviceConfigModelo = this.tramiteConfigService.getModeloConfig(this.tramite);

  }
 
  
  /**
   * @method ngOnInit
   * @description Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Si existe un trámite seleccionado (`this.tramite`), selecciona el trámite y establece el estado de consulta
   * llamando a `establecerConsultaio` en el store con los datos actuales del trámite.
   * Si no existe un trámite seleccionado, redirige al usuario a la pantalla de selección de trámite correspondiente
   * al departamento actual.
   * 
   * @returns {void}
   */
  ngOnInit(): void {
    if (this.tramite) {
      this.selectTramite(this.tramite);
    } else {
      this.router.navigate([`/${this.guardarDatos?.department.toLowerCase()}/seleccion-tramite`]);
    }
    this.iniciarDictamenAutorizar();
    this.getSentidosDisponibles();
    this.getTabs();

  }

    /**
   * @method iniciarDictamen
   * @description Inicia el dictamen del trámite 130118.
   * 
   * Llama al servicio `IniciarService` para iniciar el dictamen con un número de folio predefinido.
   * Muestra un mensaje en la consola si el dictamen se inicia correctamente o si ocurre un error.
   * 
   * @returns {void}
   */
  iniciarDictamenAutorizar(): void {
    const PAYLOAD: IniciarAutorizacionRequest = {
      cve_usuario: this.guardarDatos.current_user,
      id_accion: this.guardarDatos.action_id
    }

    this.autorizarDictamenService.getIniciarDictamen(this.tramite, this.guardarDatos.folioTramite, PAYLOAD).subscribe({
      next: (resp) => {
       
        this.sentidoDictamenSeleccionado = resp.datos?.sentido_dictamen || '';
        if (resp.codigo === CodigoRespuesta.EXITO) {
          this.dataAutorizarDictamen = resp.datos as IniciarAutorizacionResponse;
 
        }

      },
      error: (err) => {
        const MENSAJE = err?.error?.error || 'Error al iniciar la autorización del dictamen';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
  }


  /**
   * @method getTabs
   * @description Obtiene las pestañas disponibles para el trámite
   * 
   * Realiza una petición al servicio para recuperar las pestañas habilitadas
   * para el trámite actual. Asigna las pestañas a la variable tabs si la respuesta
   * es exitosa (código '00'), o muestra un error en caso contrario.
   * 
   * @returns {void}
 */
  getTabs(): void {
    this.tabsSolicitudServiceTsService.getTabs(this.tramite, this.guardarDatos.id_solicitud)
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.tabs = response.datos ?? {} as TabsResponse;
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error en solicitud estado.',
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                'Error en opciones solicitud estado.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: error?.error?.error || 'Error inesperado en solicitud estado.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method getEvaluacionTramite
   * @description Obtiene la evaluación del trámite actual
   * 
   * Realiza una petición al servicio para recuperar el estado de evaluación
   * del trámite. Asigna la evaluación a la variable evaluacionTramite si la respuesta
   * es exitosa (código '00'), o muestra un error en caso contrario.
   * 
   * @returns {void}
 */
  getEvaluacionTramite(): void {
    this.evaluarSolicitudService.getEvaluacionTramite(this.tramite, this.guardarDatos.folioTramite)
      .pipe(
        takeUntil(this.destroyNotifier$)
    ).subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.evaluacionTramite = response.datos ?? {} as EvaluacionOpcionResponse;
            this.opcionesEvaluacion();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error en iniciar evaluar tramite.',
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                'Error en opciones de iniciar evaluar tramite.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: error?.error?.error || 'Error inesperado en iniciar evaluar tramite.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method getPrepararEvaluacion
   * @description Prepara la evaluación del trámite con la opción seleccionada
   * 
   * Realiza una petición al servicio para preparar el proceso de evaluación
   * según la opción especificada. Maneja la respuesta exitosa (código '00')
   * o muestra un error en caso contrario.
   * 
   * @param {string} opcion - Opción de evaluación seleccionada
   * @returns {void}
 */
  getPrepararEvaluacion(opcion: string): void {
    this.evaluarSolicitudService.postPrepararEvaluacion(this.tramite, this.guardarDatos.folioTramite, opcion)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe({
        next: (response) => {
          if (response.codigo !== '00') {

            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error preparar tramite.',
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                'Error en preparar tramite.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: error?.error?.error || 'Error preparar tramite.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method getDocumentosSolicitud
   * @description Método para obtener los documentos asociados a una solicitud.
   * 
   * Realiza una petición al servicio tabsSolicitudServiceTsService para recuperar los documentos
   * vinculados al ID de solicitud proporcionado. Asigna los documentos a la variable documentosSolicitud
   * si la respuesta es exitosa (código '00'), o muestra un error en caso contrario.
   * 
   * @returns {void}
 */
  getDocumentosSolicitud(): void {
    this.tabsSolicitudServiceTsService.getDocumentosSolicitud(this.tramite, this.guardarDatos.id_solicitud)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.documentosSolicitud = response.datos ?? [];
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error en documentos.',
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                'Error en documentos.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: error?.error?.error || 'Error inesperado en documentos.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method getRequerimientos
   * @description Método para obtener los requerimientos asociados a un trámite.
   *
   * Realiza una petición al servicio tabsSolicitudServiceTsService para recuperar los requerimientos
   * vinculados al número de folio proporcionado. Asigna los requerimientos a la variable requerimientosSolicitud
   * si la respuesta es exitosa (código '00'), o muestra un error en caso contrario.
   *
   * @returns {void}
   */
  getRequerimientos(): void {
    this.tabsSolicitudServiceTsService.getRequerimientos(this.tramite, this.guardarDatos.folioTramite)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.requerimientosSolicitud = response.datos ?? [];
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error en requerimientos.',
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                'Error en requerimientos.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: error?.error?.error || 'Error inesperado en requerimientos.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method getDictamenes
   * @description Método para obtener los dictámenes asociados a un trámite.
   *
   * Realiza una petición al servicio tabsSolicitudServiceTsService para recuperar los dictámenes
   * vinculados al número de folio proporcionado. Procesa la respuesta si es exitosa (código '00'),
   * o muestra un error en caso contrario.
   *
   * @returns {void}
   */
  getDictamenes(): void {
    this.tabsSolicitudServiceTsService.getDictamenes(this.tramite, this.guardarDatos.folioTramite)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.dictamenesSolicitud = response.datos ?? [];
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error en dictamenes.',
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                'Error en dictamenes.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: error?.error?.error || 'Error inesperado en dictamenes.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method TareasSolicitud
   * @description Método para obtener las tareas asociadas a una solicitud.
   * 
   * Realiza una petición al servicio tabsSolicitudServiceTsService para recuperar las tareas
   * vinculados al ID de solicitud proporcionado. Asigna las tareas a la variable tareasSolicitud
   * si la respuesta es exitosa (código '00'), o muestra un error en caso contrario.
   * 
   * @returns {void}
 */
  getTareasSolicitud(): void {
    this.tabsSolicitudServiceTsService.getTareasSolicitud(this.tramite, this.guardarDatos.folioTramite)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.tareasSolicitud = response.datos ?? [];
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error en tareas.',
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                'Error en tareas.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: error?.error?.error || 'Error inesperado en tareas.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * Obtiene las opiniones asociadas al trámite actual usando un folio predefinido.
   * Maneja la respuesta del servicio y actualiza la propiedad 'opinion' del componente.
   * En caso de error, lo registra en la consola.
   * 
   * @returns {void}
   */
  getOpiniones(): void {
    this.tabsSolicitudServiceTsService.getOpiniones(this.tramite, this.guardarDatos.folioTramite)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.opinion = response.datos ?? [];
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error en opiniones.',
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                'Error en opiniones.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: error?.error?.error || 'Error inesperado en opiniones.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida que se ejecuta al destruir el componente.
   * 
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   * 
   * @returns {void}
   */
  getAcusesResolucion(): void {
    this.tabsSolicitudServiceTsService.getAcusesResolucion(this.tramite, this.guardarDatos.folioTramite)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.acusesResolucion = response.datos ?? {} as AcusesResolucionResponse;
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error en acuse.',
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                'Error en acuse.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: error?.error?.error || 'Error inesperado en acuse.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }


  /**
   * @method getEnvioDigital
   * @description Método para obtener el envío digital asociado a un trámite.
   */
  getEnvioDigital(): void {
    this.tabsSolicitudServiceTsService.getEnvioDigital(this.tramite, this.guardarDatos.folioTramite)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.envioDigital = response.datos ?? {} as EnvioDigitalResponse;
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error en envio digital',
              mensaje:
                response.causa ||
                response.mensaje ||
                response.error ||
                'Error en envio digital.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: error?.error?.error || 'Error inesperado en envio digital.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida que se ejecuta al destruir el componente.
   * 
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   * 
   * @returns {void}
   */
  onTabSeleccionado(indice: number): void {
    if (indice === 1 && !this.yaCargoDocumentos) {
      this.yaCargoDocumentos = true;
      this.getDocumentosSolicitud();
    }

    if (indice === 6 && !this.yaCargoTareas) {
      this.yaCargoTareas = true;
      this.getTareasSolicitud();
    }

    if (indice === 2 && !this.yaCargoDictamenes) {
      this.yaCargoDictamenes = true;
      this.getDictamenes();
    }

    if (indice === 3 && !this.yaCargoRequerimientos) {
      this.yaCargoRequerimientos = true;
      this.getRequerimientos();
    }

    if (indice === 4 && !this.yaCargoOpinion) {
      this.yaCargoOpinion = true;
      this.getOpiniones();
    }

    if (indice === 7 && !this.yaCargoEnvioDigital) {
      this.yaCargoEnvioDigital = true;
      this.getEnvioDigital();
    }

    if (indice === 5 && !this.yaCargoAcuses) {
      this.yaCargoAcuses = true;
      this.getAcusesResolucion();
    }
  }

  /**
   * @method evaluarSolicitud
   * @description Método para enviar las opciones de evaluación del trámite 130118.
   * 
   * Envía una solicitud al servicio `EvaluarSolicitudService` con el número de folio del trámite y los datos de las opciones de evaluación.
   * Actualiza la lista de opciones disponibles si la respuesta es exitosa, o muestra un error en caso contrario.
   * 
   * @returns {void}
   */
  opcionesEvaluacion(): void {
    
    const PAYLOAD: OpcionesEvaluacionRequest = {
      cve_rol_capturista: this.guardarDatos.current_user,
      considera_capturista: true
    };

    this.evaluarSolicitudService.postOpcionesEvaluacion(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.opcionesDisponibles = response.datos ?? [];
            this.tabsOpcionEvaluacion = this.opcionesDisponibles.map((opcion, i) => ({
              id: i + 1,
              nombre: opcion
            }));
          } else {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || '',
              mensaje:
                response.causa ||
                response.mensaje ||
                '',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          const MENSAJE = error?.error?.error || 'Error inesperado en opciones de evaluación.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }

  /**
   * @method tieneOpcion
   * @description Verifica si una opción específica está disponible en la lista de opciones.
   * 
   * @param {string} opcion - Opción a verificar.
   * @returns {boolean} Retorna true si la opción está disponible, false en caso contrario.
   */
  tieneOpcion(opcion: string): boolean {
    return this.opcionesDisponibles.includes(opcion);
  }

  /**
   * @method loadComponent
   * @description Carga dinámicamente un componente hijo según la ruta especificada en el objeto recibido.
   * @param {ListaComponentes} li - Objeto que contiene la información y la ruta del componente a cargar.
   * @returns {Promise<void>}
   */
  async loadComponent(li: ListaComponentes): Promise<void> {
    if (!li.componentPath) {
      return;
    }
    this.viewChild = await li.componentPath() as Type<unknown>;
  }
  /**
   * @method viewChildcambioDePestana
   * @description Cambia el componente hijo mostrado según la pestaña seleccionada.
   * @param {Tabulaciones} id - Identificador de la pestaña seleccionada.
   * @returns {void}
   */
  viewChildcambioDePestana(id: Tabulaciones): void {
    const LI = this.slectTramite?.listaComponentes.find((v: ListaComponentes) => v.id === id.id);
    if (LI) {
      this.loadComponent(LI);
    }
  }
  /**
   * @method selectTramite
   * @description Selecciona el trámite a evaluar y actualiza la referencia del trámite seleccionado.
   * @param {number} i - Identificador del trámite.
   * @returns {void}
   */
  selectTramite(i: number): void {
    this.tramite = i;
    this.slectTramite = LISTA_TRIMITES.find((v) => v.tramite === i);
  }

  /**
   * @method seleccionaTab
   * @description Cambia la pestaña principal seleccionada.
   * 
   * * Valores posibles del parámetro `i`:
   *  - 1: Pestaña "Dictamen"
   *  - 2: Pestaña "Requerimiento de información"
   *  - 3: Pestaña "Solicitar opinión"
   * 
   * @param {number} i - Índice de la pestaña.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;

    if (i === 1) {
      this.iniciarDictamen();
      this.getPrepararEvaluacion("GENERAR_DICTAMEN");
      this.getSentidosDisponibles();
    } else if (i === 2) {
      this.iniciarRequerimiento();
      this.getPrepararEvaluacion("GENERAR_REQUERIMIENTO");
    } else if (i === 3) {
      this.getPrepararEvaluacion("SOLICITAR_OPINION");
    }
  }

  /**
   * @method iniciarDictamen
   * @description Inicia el dictamen del trámite 130118.
   * 
   * Llama al servicio `IniciarService` para iniciar el dictamen con un número de folio predefinido.
   * Muestra un mensaje en la consola si el dictamen se inicia correctamente o si ocurre un error.
   * 
   * @returns {void}
   */
  iniciarDictamen(): void {
    const PAYLOAD: IniciarRequerimientoRequest = {
      cve_usuario: this.guardarDatos.current_user,
      id_accion: this.guardarDatos.action_id
    };

    this.iniciarService.postIniciarDictamen(this.tramite, this.guardarDatos.folioTramite, PAYLOAD).subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO) {
          this.dataIniciarDictamen = resp.datos ?? {} as IniciarDictamenResponse;          
        }

      },
      error: (err) => {
        const MENSAJE = err?.error?.error || 'Error al obtener los criterios';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
  }

  /**
   * @method iniciarRequerimiento
   * @description Inicia el requerimiento del trámite 130118.
   * 
   * Llama al servicio `IniciarService` para iniciar el requerimiento con un número de folio predefinido.
   * Muestra un mensaje en la consola si el requerimiento se inicia correctamente o si ocurre un error.
   * 
   * @returns {void}
   */
  obtenerCriterios(): void {
    this.guardarService.getCriterios(this.tramite, this.guardarDatos.id_solicitud).subscribe({
      next: (resp) => {
        this.conformidadDictamen = resp.datos ?? {} as CriteriosResponse;
      },
      error: (err) => {
        const MENSAJE = err?.error?.error || 'Error al obtener los criterios';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
  }

  /**
   * @method getSentidosDisponibles
   * @description Obtiene los sentidos disponibles para el dictamen del trámite 130118.
   * Realiza una petición al servicio `GuardarDictamenService` para recuperar los sentidos disponibles.
   */
  getSentidosDisponibles(): void {
    this.guardarService.getSentidosDisponibles(String(this.tramite), String(this.guardarDatos.folioTramite)).subscribe({
      next: (resp) => {
        this.opcionesSentidosDispobles = resp.datos ?? [];
      },
      error: (err) => {
        const MENSAJE = err?.error?.error || 'Error al obtener los criterios';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
  }

  /**
   * @method seleccionaTabRequerimiento
   * @description Cambia la pestaña de dictamen seleccionada.
   * @param {number} i - Índice de la pestaña de dictamen.
   * @returns {void}
   */
  seleccionaTabRequerimiento(i: number): void {
    this.indiceDictamen = i;
  }

  /**
   * @method guardarFirmar
   * @description Activa la sección de firma electrónica.
   * @returns {void}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  guardarDictamen(datosDictamen?: DictamenForm): void {

    if (!datosDictamen) {
      return;
    }

    const PAYLOAD: GuardarDictamenRequest = {
      ide_sentido_dictamen: datosDictamen.cumplimiento,
      justificacion_dictamen: datosDictamen.mensajeDictamen,
      id_accion: this.guardarDatos.action_id,
      cve_usuario: this.guardarDatos.current_user,
      fecha_inicio_vigencia: this.conformidadDictamen?.fecha_inicio ?? null,
      fecha_fin_vigencia: this.conformidadDictamen?.fecha_fin_vigencia ?? null,
      texto_dictamen: this.conformidadDictamen?.texto_dictamen ?? null,
    };

    this.guardarService.postGuadarDictamen(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.EXITO,
              modo: 'action',
              titulo: 'Éxito',
              mensaje: resp.mensaje,
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            this.getTabs();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: resp.error || 'Error preparar tramite.',
              mensaje:
                resp.causa ||
                resp.mensaje ||
                resp.error ||
                'Error en preparar tramite.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: err?.error?.error || 'Error preparar tramite.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }


  /**
   * @method enviarEvento
   * @description Maneja los eventos de guardar y cancelar provenientes de componentes hijos.
   * @param {{ events: string, datos: unknown }} e - Objeto con el tipo de evento y los datos asociados.
   * @returns {void}
   */
  enviarEvento(e: { events: string, datos: DictamenForm }): void {
    switch (e.events) {
      case 'guardar':
        this.guardarDictamen(e.datos);
        break;
      case 'firmar':
       // this.firmarMostrarDictamen(e.datos);
        this.firmar = true;
        break;
      case 'cancelar':
        this.indice = 1;
        break;
      default:
    }
  }

  /**
   * @method continuar
   * @description Controla el flujo de avance entre pestañas y activa la firma si corresponde.
   * @returns {void}
   */
  continuar(): void {
    const DATOS = 3;
    if (this.indiceDictamen === 2 || Number(this.requerimientoState.idTipoRequerimiento) === DATOS) {
      this.guardarDictamen();
    } else {
      this.indiceDictamen = 2;
    }
  }
  
  /**
    * @method obtieneFirma
    * @description Navega a la bandeja de tareas pendientes tras obtener la firma electrónica.
    * @param {string} ev - Cadena que representa la firma obtenida.
    * @returns {void}
    */
  /*obtieneFirma(datos: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  }): void {
    this.datosFirmaReales = datos;
    if (this.indice === 1) {
      this.firmaDictamen(datos.firma);
    } else if (this.indice === 2) {
     this.firmarRequerimiento(datos.firma);
    }

  }*/
  /**
    * @method obtieneFirma
    * @description Navega a la bandeja de tareas pendientes tras obtener la firma electrónica.
    * @param {string} ev - Cadena que representa la firma obtenida.
    * @returns {void}
    */
  obtieneFirma(datos: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  }): void {
    this.datosFirmaReales = datos;
    this.firmaAutorizarDictamen(datos.firma);
  }

    /**
     * @method firmaDictamen
     * @description Firma el dictamen con los datos proporcionados.
     * 
     * Convierte la cadena original y la firma a formato hexadecimal, prepara el payload
     * y envía una solicitud al servicio `FirmarDictamenService` para completar la firma.
     * Maneja la respuesta y muestra notificaciones según el resultado de la operación.
     * 
     * @param {string} firma - Firma en base64 a ser procesada.
     * @returns {void}
     */

  firmaAutorizarDictamen(firma: string): void {
    if (!this.cadenaOriginal || !this.datosFirmaReales) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: CategoriaMensaje.ERROR,
        modo: 'action',
        titulo: 'Error',
        mensaje: 'Faltan datos para completar la firma.',
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
      return;
    }

    const CADENAHEX = encodeToISO88591Hex(this.cadenaOriginal);
    const FIRMAHEX = base64ToHex(firma);
    const NUMFOLIO = this.guardarDatos.folioTramite;
    this.sello = FIRMAHEX;

    const PAYLOAD: FirmaAutorizarDictamenRequest = {
      id_accion: this.guardarDatos.action_id,
      firma: {
        id_solicitud: Number(this.guardarDatos.id_solicitud),
        cadena_original: CADENAHEX,
        cert_serial_number: this.datosFirmaReales.certSerialNumber,
        clave_usuario: this.datosFirmaReales.rfc,
        fecha_firma: formatFecha(new Date()),
        clave_rol: 'Autorizador',
        sello: FIRMAHEX,
        fecha_fin_vigencia: formatFecha(this.datosFirmaReales.fechaFin),
        documentos_requeridos: []
      }
    };


    this.autorizarDictamenService.firmarAutorizar(this.tramite, NUMFOLIO, PAYLOAD)
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((firmaResponse: BaseResponse<null>) => {
  
          if (firmaResponse.codigo !== '00' || !firmaResponse.datos) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error al firmar la solicitud',
              mensaje: firmaResponse.mensaje || firmaResponse.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };

          } else if (firmaResponse.codigo === CodigoRespuesta.EXITO) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.EXITO,
              modo: 'action',
              titulo: 'Firma exitosa',
              mensaje: 'La firma del dictamen se ha realizado correctamente.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            }
            this.isDictamen = false;
            this.isFirma = false;
            this.isDocumento = true;
      
      
    
            if (this.sentidoDictamenSeleccionado === "Aceptado") {
              this.postOficioAutorizacion();
            } else {
              this.postOficioRechazado();
            }

          }

        }),
        catchError((error) => {
          if (!this.nuevaNotificacion) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error inesperado',
              mensaje: error?.error.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
          return of(null);
        })
      )
      .subscribe();
  }


    /**
   * @method postOficioAutorizacion
   * @description Genera y obtiene el oficio de autorización
   * 
   * Realiza una petición al servicio para generar el oficio de autorización
   * para la solicitud actual. Si la respuesta es exitosa (código '00'), 
   * actualiza la tabla de resoluciones con el documento generado.
   * 
   * @returns {void}
 */
  postOficioAutorizacion(): void {

    const PAYLOAD: Firma = {
      cadena_original: encodeToISO88591Hex(this.cadenaOriginal || ''),
      cert_serial_number: this.datosFirmaReales.certSerialNumber,
      clave_usuario: this.datosFirmaReales.rfc,
      fecha_firma: formatFecha(new Date()),
      clave_rol: 'Autorizador',
      sello: this.sello
    }

    const PAYLOADSEND = PAYLOAD;
    this.autorizarDictamenService.postOficioAutorizacion(this.tramite, Number(this.guardarDatos.id_solicitud), PAYLOADSEND)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === "00" && resp.datos) {
            this.datosTablaResolucion = [{
              id: 1,
              idDocumento: '1',
              documento: resp.datos.nombre_archivo ?? '',
              urlPdf: resp.datos.llave_archivo ?? ''
            }];
            this.isDocumento = true;
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: resp.error || 'Error al obtener oficio.',
              mensaje:
                resp.causa ||
                resp.mensaje ||
                resp.error ||
                'Error al obtener oficio.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: 'Error inesperado',
            mensaje: error?.error.error || 'Ocurrió un error al obtener oficio.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method postOficioRechazado
   * @description Genera y obtiene el oficio de rechazo
   * 
   * Realiza una petición al servicio para generar el oficio de rechazo
   * para la solicitud actual. Si la respuesta es exitosa (código '00'), 
   * actualiza la tabla de resoluciones con el documento generado.
   * 
   * @returns {void}
 */
  postOficioRechazado(): void {
    const PAYLOAD: Firma = {
      cadena_original: encodeToISO88591Hex(this.cadenaOriginal || ''),
      cert_serial_number: this.datosFirmaReales.certSerialNumber,
      clave_usuario: this.datosFirmaReales.rfc,
      fecha_firma: formatFecha(new Date()),
      clave_rol: 'Autorizador',
      sello: this.sello
    } 
    const PAYLOADSEND = this.serviceConfigModelo.actualizarModelo ? PAYLOAD : null;
    this.autorizarDictamenService.postOficioRechazado(this.tramite, Number(this.guardarDatos.id_solicitud), PAYLOADSEND)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === "00" && resp.datos) {
            this.datosTablaResolucion = [{
              id: 1,
              idDocumento: '1',
              documento: resp.datos.nombre_archivo ?? '',
              urlPdf: resp.datos.llave_archivo ?? ''
            }];
            this.isDocumento = true;
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: resp.error || 'Error al obtener oficio.',
              mensaje:
                resp.causa ||
                resp.mensaje ||
                resp.error ||
                'Error al obtener oficio.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: 'Error inesperado',
            mensaje: error?.error.error || 'Ocurrió un error al obtener oficio.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method firmaDictamen
   * @description Firma el dictamen con los datos proporcionados.
   * 
   * Convierte la cadena original y la firma a formato hexadecimal, prepara el payload
   * y envía una solicitud al servicio `FirmarDictamenService` para completar la firma.
   * Maneja la respuesta y muestra notificaciones según el resultado de la operación.
   * 
   * @param {string} firma - Firma en base64 a ser procesada.
   * @returns {void}
   */
  firmaDictamen(firma: string): void {
    if (!this.cadenaOriginal || !this.datosFirmaReales) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: CategoriaMensaje.ERROR,
        modo: 'action',
        titulo: 'Error',
        mensaje: 'Faltan datos para completar la firma.',
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
      return;
    }

    const CADENAHEX = encodeToISO88591Hex(this.cadenaOriginal);
    const FIRMAHEX = base64ToHex(firma);
    const NUMFOLIO = this.guardarDatos.folioTramite;

    const PAYLOAD: FirmarDictamenRequest = {
      id_accion: this.guardarDatos.action_id,
      firma: {
        cadena_original: CADENAHEX,
        cert_serial_number: this.datosFirmaReales.certSerialNumber,
        clave_usuario: this.datosFirmaReales.rfc,
        fecha_firma: formatFecha(new Date()),
        clave_rol: 'Dictaminador',
        sello: FIRMAHEX,
      }
    };

    this.firmarDictamenService.postFirmarDictamen(this.tramite, NUMFOLIO, PAYLOAD)
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((firmaResponse: BaseResponse<null>) => {
          if (firmaResponse.codigo !== '00') {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error al firmar la solicitud',
              mensaje: firmaResponse.mensaje || firmaResponse.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          } else if (firmaResponse.codigo === CodigoRespuesta.EXITO) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.EXITO,
              modo: 'action',
              titulo: 'Firma exitosa',
              mensaje: 'La firma del dictamen se ha realizado correctamente.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            }
            this.router.navigate(['bandeja-de-tareas-pendientes']);
          }

        }),
        catchError((error) => {
          if (!this.nuevaNotificacion) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error inesperado',
              mensaje: error?.error.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
          return of(null);
        })
      )
      .subscribe();
  }


  /**
   * @method cancelar
   * @description Método para restablecer los índices de las pestañas principales y de dictamen.
   * 
   * Este método se utiliza para reiniciar el flujo de navegación en el componente:
   * - Establece el índice de la pestaña principal (`indice`) en 1.
   * - Establece el índice de la pestaña de dictamen (`indiceDictamen`) en 1.
   * 
   * @returns {void}
   */
  cancelar(): void {
    this.indice = 1;
    this.indiceDictamen = 1;
  }

  /**
   * Inicia el proceso de requerimiento con datos predefinidos
   * Realiza una petición POST para iniciar un requerimiento y maneja la respuesta
   */
  iniciarRequerimiento(): void {

    const PAYLOAD: IniciarRequerimientoRequest = {
      cve_usuario: this.guardarDatos.current_user,
      id_accion: this.guardarDatos.action_id
    };

    this.iniciarService.postIniciarRequerimiento(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          this.dataIniciarRequerimiento = resp.datos ?? {} as IniciarRequerimientoResponse;
        },
        error: (err) => {
          const MENSAJE = err?.error?.error || 'Error al obtener los criterios';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
  onFormRequerimientoChanged(formValue: any) {
    this.justificacion = formValue.justificacionRequerimiento
  }

  /** 
   * Guarda un requerimiento con los datos proporcionados
   * Realiza una petición POST y maneja diferentes escenarios de respuesta
   * @description Gestiona notificaciones de éxito o error según la respuesta del servidor
   */
  guardarRequerimiento(): void {

    const PAYLOAD: GuardarRequerimiento = {
      id_accion: this.guardarDatos.action_id,
      cve_usuario: this.guardarDatos.current_user,
      justificacion: this.justificacion,
      alcance_requerimiento: 'X0XX',
    };

    this.guardarRequerimientoService.postGuardarRequerimiento(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            this.idRequerimiento = resp.datos?.id_requerimiento || 0;
            this.getTabs();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.EXITO,
              modo: 'action',
              titulo: 'Éxito',
              mensaje: resp.mensaje,
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: resp.error || 'Error al guardar.',
              mensaje:
                resp.causa ||
                resp.mensaje ||
                'Ocurrió un error al guardar el requerimiento.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = err?.error?.error || 'Ocurrió un error al guardar el requerimiento.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }

  /**
   * @method getMostrarFirma
   * @description Prepara y muestra la interfaz de firma para el requerimiento
   * 
   * Construye el payload con los datos del solicitante y realiza una petición
   * para mostrar la interfaz de firma. Maneja notificaciones de éxito o error.
   * 
   * @returns {void}
 */
  mostrarFirmarRequerimiento(): void {
    const PAYLOAD: MostrarFirmarRequerimientoRequest = {
      cve_usuario: this.guardarDatos.current_user,
      id_accion: this.guardarDatos.action_id,
      justificacion: this.justificacion,
      alcance_requerimiento: '',
      solicitante: {
        nombre: 'Javier',
        apellido_paterno: 'Chávez',
        apellido_materno: 'Barrios',
        rfc: this.guardarDatos.current_user,
      }
    };

    this.guardarRequerimientoService.postMostrarFirma(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            this.firmar = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.EXITO,
              modo: 'action',
              titulo: 'Éxito',
              mensaje: resp.mensaje,
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            this.cadenaOriginalRequerimiento = resp.datos?.cadena_original || '';
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: resp.error || 'Error al mostrar la firma.',
              mensaje:
                resp.causa ||
                resp.mensaje ||
                'Ocurrió un error al mostrar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = err?.error?.error || 'Error al mostrar la firma';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }



    /**
   * * @method firmarMostrarAutorizarDictamen
   * * @description Prepara y envía una solicitud para mostrar la interfaz de firma electrónica
   * * para autorizar un dictamen.
   */
  firmarMostrarAutorizarDictamen(): void {

    const PAYLOAD: MostrarFirmaRequest = {
      id_accion: this.guardarDatos.action_id,
      cve_usuario: this.guardarDatos.current_user ?? '',
      id_dictamen: this.dataAutorizarDictamen.id_dictamen ?? 0,
      usuario_perfil: {
        rfc: this.guardarDatos.current_user,
        nombre: 'PRUEBA',
        apellido_paterno: 'PRUEBA',
        apellido_materno: 'PRUEBA'
      },
    };

    this.autorizarDictamenService.postFirmarMostrar(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            
            this.cadenaOriginal = resp.datos?.cadena_original;
            this.isDictamen = false;
            this.isFirma = true;
            this.firmaOficioCadena = resp.datos?.firma_oficios?.cadena_original || '';
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: resp.error || 'Error preparar tramite.',
              mensaje:
                resp.causa ||
                resp.mensaje ||
                resp.error ||
                'Error en preparar tramite.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: err?.error?.error || 'Error preparar tramite.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

   /**
     * Descarga un archivo Excel con los datos de la solicitud.
     *
     * Llama al servicio `evaluarSolicitudService.getDescargarExcel` pasando el ID del trámite
     * y la solicitud. Convierte la respuesta en Base64 a un archivo Blob y fuerza la descarga
     * en el navegador con el nombre `datosRPE.xlsx`.
     *
     * Muestra notificaciones de error si la descarga falla o si la respuesta del servicio no es exitosa.
     *
     * @returns {void}
     */
    descargarSolicitud(): void {
      this.evaluarSolicitudService.getDescargarExcel(this.tramite, this.guardarDatos.id_solicitud)
        .subscribe({
          next: (resp) => {
            if (resp.codigo === CodigoRespuesta.EXITO) {
            // Convertir Base64 a un Blob
              exportExcelFile(resp?.datos || '');
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: resp.error || 'Error al descargar excel',
                mensaje:
                  resp.causa ||
                  resp.mensaje ||
                  'Error al descargar excel',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            }
          },
          error: (err) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const MENSAJE = err?.error?.error || 'Error al descargar excel';
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: 'error',
              modo: 'action',
              titulo: '',
              mensaje: MENSAJE,
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            }
          }
        });
    }

  /**
   * @method getObservar
   * @description Activa el modo de observación en la interfaz
   * 
   * Habilita el panel de observaciones y desactiva los demás paneles
   * (dictamen, firma y documento) para evitar conflictos visuales.
   * 
   * @returns {void}
  */
  getObservar(): void {
    this.isObservacion = true;

    this.isDictamen = false;
    this.isFirma = false;
    this.isDocumento = false;
  }

  /**
   * Abre un archivo PDF en una nueva pestaña del navegador.
   *
   * @param {string} url - La URL del archivo PDF que se va a abrir.
   * @returns {void}
   */
  descargarPdfResolucion(url: string): void {
    this.base64Archivos(url, 'descargar');
  }

  /**
   * Obtiene el contenido base64 de un archivo y realiza la acción especificada.
   * @param {string} uuid - Identificador único del archivo a obtener.
   * @param {'abrir' | 'descargar'} accion - Acción a realizar con el archivo.
   * @returns {void}
   * @example
   * // Abre el archivo en una nueva pestaña
   * base64Archivos('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'abrir');
   * 
   * // Descarga el archivo
   * base64Archivos('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'descargar');
   */
  base64Archivos(uuid: string, accion: 'abrir' | 'descargar'): void {
    this.acuseDetalleService.getDescargarAcuse(this.tramite, uuid).subscribe({
      next: (data) => {
        if (data?.codigo === "00" && data?.datos?.contenido) {
          manejarPdf(
            data.datos.contenido,
            data.datos.nombre_archivo,
            accion
          );
        }
      },
    });
  }


  /**
   * @method postTerminar
   * @description Finaliza y guarda la observación actual
   * 
   * Construye el payload con los datos del formulario de observación
   * y realiza una petición al servicio para guardar la observación.
   * Si la respuesta es exitosa (código '00'), regresa a la vista anterior.
   * 
   * @returns {void}
   */
  postTerminar(): void {
    const PAYLOAD: ObservacionRequest = {
      id_accion: this.guardarDatos.action_id,
      observacion: this.observacionForm.get('observacion')?.value,
      cve_usuario: this.guardarDatos.current_user,
    };
    this.autorizarDictamenService.postObservacionGuardar(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === "00" && resp.datos) {
            this.getRegresar();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: resp.error || 'Error al guardar observación.',
              mensaje:
                resp.causa ||
                resp.mensaje ||
                resp.error ||
                'Error al guardar observación.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: 'Error inesperado',
            mensaje: error?.error.error || 'Error al guardar observación.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method getRegresar
   * @description Regresa a la bandeja de tareas pendientes
   * 
   * Desactiva el modo de observación, reactiva el modo de dictamen
   * y navega de regreso a la bandeja de tareas pendientes.
   * 
   * @returns {void}
   */
  getRegresar(): void {
    this.isObservacion = false;
    this.isDictamen = true;
    this.isFirma = false;
    this.isDocumento = false;
    this.router.navigate(['bandeja-de-tareas-pendientes'], {
      queryParams: { labelExitoso: true }
    });
  }


  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida que se ejecuta al destruir el componente.
   * 
   * Libera los recursos utilizados por el componente:
   * - Emite un valor en el `destroyNotifier$` para cancelar las suscripciones activas y evitar fugas de memoria.
   * - Completa el `destroyNotifier$`.
   * - Limpia el estado del trámite llamando a `solicitanteConsultaio` y `establecerConsultaio` en el store.
   * 
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.consultaioStore.solicitanteConsultaio(null);
    this.consultaioStore.establecerConsultaio('', '', '', '', '', '', false, true, false);
  }

}
