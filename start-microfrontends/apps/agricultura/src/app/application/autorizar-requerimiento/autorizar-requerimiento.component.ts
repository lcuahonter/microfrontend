// -------------------------------------------------------------------
// ANGULAR
// -------------------------------------------------------------------
import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, Type } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from '@angular/router';

// -------------------------------------------------------------------
// RXJS
// -------------------------------------------------------------------
import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';

// -------------------------------------------------------------------
// LIBS SHARED – MODELOS, RESPUESTAS, STORES, QUERIES
// -------------------------------------------------------------------
import { AccuseComponentes, ListaComponentes, Tabulaciones } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { AcusesResolucionResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-acuses-response.model';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CriteriosResponse } from '@libs/shared/data-access-user/src/core/models/shared/criterios-response.model';
import { DictamenesResponse } from '@libs/shared/data-access-user/src/core/models/shared/dictamenes-response.model';
import { DocumentoSolicitud } from "@libs/shared/data-access-user/src/core/models/shared/consulta-documentos-response.model";
import { Documentos, IniciarRequerimientoResponse } from '@libs/shared/data-access-user/src/core/models/shared/Iniciar-requerimiento-response.model';
import { EnvioDigitalResponse } from '@libs/shared/data-access-user/src/core/models/shared/envio-digital-response.model';
import { IniciarDictamenResponse } from '@libs/shared/data-access-user/src/core/models/shared/iniciar-dictamen-response.model';
import { OpinionResponse } from '@libs/shared/data-access-user/src/core/models/shared/opinion-response.model';
import { RequerimientosResponse } from '@libs/shared/data-access-user/src/core/models/shared/requerimientos-response.model';
import { SentidosDisponiblesResponse } from '@libs/shared/data-access-user/src/core/models/shared/sentidos-disponibles.model';
import { SolicitudRequerimientoQuery } from '@libs/shared/data-access-user/src/core/queries/requerimientos.query';
import { SolicitudRequerimientosState } from '@libs/shared/data-access-user/src/core/estados/requerimientos.store';
import { TabsResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-tabs-response.model';
import { TareasSolicitud } from "@libs/shared/data-access-user/src/core/models/shared/consulta-tareas-response.model";

// -------------------------------------------------------------------
// LIBS – TRÁMITES COMPONENTES
// -------------------------------------------------------------------
import { CapturarRequerimientoComponent } from '@libs/shared/data-access-user/src/tramites/components/capturar-requerimiento/capturar-requerimiento.component';
import { EncabezadoRequerimientoComponent } from '@libs/shared/data-access-user/src/tramites/components/encabezado-requerimiento/encabezado-requerimiento.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src/tramites/components/firma-electronica/firma-electronica.component';
import { GenerarDictamenComponent } from '@libs/shared/data-access-user/src/tramites/components/generar-dictamen/generar-dictamen.component';
import { ReviewersTabsComponent } from '@libs/shared/data-access-user/src/tramites/components/reviewers-tabs/reviewers-tabs.component';
import { SolicitarDocumentosEvaluacionComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitar-documentos-evaluacion/solicitar-documentos-evaluacion.component';
import { SolicitarOpinionComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitar-opinion/solicitar-opinion.component';

// -------------------------------------------------------------------
// LIBS – ACCESO USUARIO (data-access-user)
// -------------------------------------------------------------------
import {
  CatalogoTipoDocumento,
  CategoriaMensaje,
  ConsultaioQuery,
  ConsultaioState,
  ConsultaioStore,
  DocumentosEspecificosResponse,
  FECHA_DE_INICIO,
  Notificacion,
  NotificacionesComponent,
  TabEvaluarTratadosResponse,
  ValidacionesFormularioService,
  base64ToHex,
  encodeToISO88591Hex,
  formatFecha,
  manejarPdf
} from '@ng-mf/data-access-user';

// -------------------------------------------------------------------
// MODELOS LOCALES (src/app/...)
// -------------------------------------------------------------------
import { DictamenForm } from '@libs/shared/data-access-user/src/core/models/shared/dictamen-form.model';
import { Documento, GuardarRequerimiento } from '../core/models/evaluar/request/guardar-requerimiento-request.model';
import { DocumentosEspecificosRequest } from '../core/models/atender-requerimiento/request/documentos-especificos.model';
import { EvaluacionOpcionResponse } from '../core/models/evaluar/response/evaluar-estado-evaluacion-response.model';
import { FirmarDictamenRequest } from '../core/models/evaluar/request/firmar-dictamen-request.model';
import { FirmarRequerimientoRequest } from '../core/models/evaluar/request/firmar-requerimiento-request.model';
import { GuardarDictamenRequest } from '../core/models/evaluar/request/guardar-dictamen-request.model';
import { IniciarRequerimientoRequest } from '../core/models/evaluar/request/iniciar-requerimiento-request.model';
import { MostrarFirmarRequerimientoRequest } from '../core/models/evaluar/request/firma-mostrar-requerimiento.request.model';
import { MostrarFirmarRequest } from '../core/models/evaluar/request/firmar-mostrar-dictamen.request.model';
import { MostrarFirmarResponse } from '../core/models/evaluar/response/mostrar-firmar-response.model';
import { OpcionesEvaluacionRequest } from '../core/models/evaluar/request/opciones-evaluacion.model';

// -------------------------------------------------------------------
// SERVICIOS
// -------------------------------------------------------------------
import { EvaluarSolicitudService } from '../core/services/evaluar-tramite/evaluar-solicitud.service';
import { FirmarDictamenService } from '../core/services/evaluar-tramite/firmarDictamen.service';
import { FirmarRequermientoService } from '../core/services/evaluar-tramite/firmarRequermiento.service';
import { GuardarDictamenService } from '../core/services/evaluar-tramite/guardar-dictamen.service';
import { GuardarRequerimientoService } from '../core/services/evaluar-tramite/guardarRequerimiento.service';
import { TabsSolicitudServiceTsService } from "../core/services/evaluar-tramite/tabs-solicitud.service.ts.service";
import { TramiteConfigService } from '../shared/services/tramiteConfig.service';

// -------------------------------------------------------------------
// CONFIGURACIONES
// -------------------------------------------------------------------
import { ModeloConfig, ServiceConfig } from '../shared/models/service-config.model';
import { RequerimientoConfig } from '../shared/models/requerimiento-config.model';
import { TramiteConfig } from '../shared/models/tramite-config.model';

// -------------------------------------------------------------------
// ENUMS / CONSTANTES
// -------------------------------------------------------------------
import { CodigoRespuesta, TipoRequerimiento } from '../core/enum/agricultura-core-enum';
import { LISTA_TRIMITES } from '../shared/constantes/lista-trimites.enums';

// -------------------------------------------------------------------
// COMPONENTES LOCALES
// -------------------------------------------------------------------
import { CapturarRequerimientoAgriculturaComponent } from "../shared/components/capturar-requerimiento-agricultura/capturar-requerimiento-agricultura.component";
import { IniciarService } from "../core/services/autorizar-requerimiento/iniciar.service";
import { DocumentosTabsService } from "@libs/shared/data-access-user/src/core/services/shared/documentosTabs.service";
import { MostrarFirmarAutorizarRequerimientoRequest } from "../core/models/autorizar-requerimiento/request/firma-mostrar-autorizar-requerimiento.request.model";
import { GuardarAutorizarRequerimientoService } from "../core/services/autorizar-requerimiento/guardarAutorizarRequerimiento.service";
import { ObservacionRequest } from "../core/models/autorizar-requerimiento/request/observacion-guardar-request.model";


@Component({
  selector: 'app-autorizar-requerimiento',
  standalone: true,
  imports: [CommonModule,
    ReviewersTabsComponent,
        EncabezadoRequerimientoComponent,
        FormsModule,
        ReactiveFormsModule,
        GenerarDictamenComponent,
        FirmaElectronicaComponent,
        SolicitarDocumentosEvaluacionComponent,
        SolicitarOpinionComponent,
        NotificacionesComponent,
        CapturarRequerimientoAgriculturaComponent
  ],
  templateUrl: './autorizar-requerimiento.component.html',
  styleUrl: './autorizar-requerimiento.component.scss',
})
export class AutorizarRequerimientoComponent implements OnInit, OnDestroy {
    /**
     * @property {boolean} calificacionDictaminador
     * @description Indica la calificación actual del dictaminador.
     * Por defecto es false, lo que significa que no se puede ver el boton dictaminador.
     */
    calificacionDictaminador: boolean = false;

  
    /**
     * @property {TabEvaluarTratadosResponse[]} tratadosParaEvaluar
     * @description Lista de tratados a evaluar, recibidos desde el componente Datos.
     */
    tratadosParaEvaluar: TabEvaluarTratadosResponse[] = [];
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
  
    /** Justificación del requerimiento */
    tipoRequerimiento!: string;
  
    /** Justificación del requerimiento */
    areasSolicitantes!: string[];
  
  
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
    indiceDictamen: number = 0;
  
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
  
    /** Response del servicio de firmar mostrar */
    mostrarFirmarData!: MostrarFirmarResponse;
  
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
     * @property {boolean} yaCargoDictamenes
     * @description Indica si los dictamenes ya han sido cargados.
     */
    yaCargoDictamenes = false;
  
    /** Lista de tipos de requerimiento */
    documentosAdicionales: DocumentosEspecificosResponse[] = [];
  
    /** Listado de documentos específicos seleccionados para el requerimiento */
    listadoDocumentosEspecificos: number[] = [];
  
    /** Listado de documentos específicos guardados para el requerimiento */
    listadoDocumentosGuardados: CatalogoTipoDocumento[] = [];
  
  
  
    /** Lista de documentos requeridos */
    listaDocumentosRequeridos: Documento[] = [];
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
     * @property {TramiteConfig} config
     * @description Configuración específica del trámite, obtenida del servicio TramiteConfigService.
     */
    config!: TramiteConfig;
  
    /** * @property {RequerimientoConfig} requerimientoConfig
     * @description Configuración de requerimientos específica del trámite, obtenida del servicio TramiteConfigService.
     */
    requerimientoConfig!: RequerimientoConfig;
  
    /**
     * @property {ServiceConfig} serviceConfig
     * @description Configuración de servicios específicos del trámite, obtenida del servicio TramiteConfigService.
     */
    serviceConfig!: ServiceConfig;
  
    /**
     * @property {ModeloConfig} vistasModificacion110101
     * @description Configuración específica del trámite, obtenida del servicio TramiteConfigService.
     */
    vistasModificacion110101!: ModeloConfig;

  /**
     * @property {FormGroup} observacionForm
     * @description Formulario reactivo para la captura de la justificación de la observación.
     */
  public observacionForm!: FormGroup;

  /** @property {boolean} esObservacion
   * @description Bandera que indica si se está generando una observación.
   */
  esObservacion: boolean = false;

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
                private guardarRequerimientoService: GuardarAutorizarRequerimientoService,
                private firmarDictamenService: FirmarDictamenService,
                private firmarRequermientoService: FirmarRequermientoService,
                private tramiteConfigService: TramiteConfigService,
      private documentosTabsService: DocumentosTabsService,
      private validacionesService: ValidacionesFormularioService,
      private fb: FormBuilder, 
    ) {
       this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.guardarDatos = seccionState;
        })
      )
      .subscribe()
    this.solicitudRequerimientoQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.requerimientoState = seccionState;
        })
      )
      .subscribe();
    this.tramite = Number(this.guardarDatos?.procedureId);
    this.config = this.tramiteConfigService.getConfig(this.tramite);
    this.serviceConfig = this.tramiteConfigService.getServiceConfig(this.tramite);
    this.requerimientoConfig = this.tramiteConfigService.getRequerimientoConfig(this.tramite);
    this.vistasModificacion110101 = this.tramiteConfigService.getModeloConfig(this.tramite);
    this.consultaioStore.solicitanteConsultaio({
      folioDelTramite: this.guardarDatos?.folioTramite,
      fechaDeInicio: FECHA_DE_INICIO,
      estadoDelTramite: this.guardarDatos?.estadoDeTramite,
      tipoDeTramite: this.guardarDatos?.tipoDeTramite
    });
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
    this.iniciarRequerimiento();
    this.getEvaluacionTramite();
    this.getTabs();

      this.observacionForm = this.fb.group({
        justificacionObservacion: ['', [Validators.required, Validators.maxLength(2000)]],
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
        .subscribe({
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
        .subscribe({
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
        .subscribe({
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
        .subscribe({
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
        .subscribe({
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
        .subscribe({
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
        .subscribe({
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
        .subscribe({
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
     * @method seleccionaTabRequerimiento
     * @description Cambia la pestaña de dictamen seleccionada.
     * @param {number} i - Índice de la pestaña de dictamen.
     * @returns {void}
     */
    seleccionaTabRequerimiento(i: number): void {
      this.indiceDictamen = i;
  
      if (i === 2 && this.requerimientoConfig.isSegundaTabla) {
        this.postDocumentosEspecificos();
      }
    }
  
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
      console.log('Firma obtenida en el componente padre:', datos);
      this.datosFirmaReales = datos;     
        this.firmarRequerimiento(datos.firma);
      
  
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
  observar(): void {
    this.esObservacion = true

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
  
      this.iniciarService.postIniciarAutorizarRequerimiento(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
        .subscribe({
          next: (resp) => {
            this.dataIniciarRequerimiento = resp.datos ?? {} as IniciarRequerimientoResponse;
            this.indiceDictamen = 1;
            this.deshabilitarSolicitarDocumentos =
              this.dataIniciarRequerimiento.alcance_requerimiento ===
                TipoRequerimiento.DATOS ||
                this.dataIniciarRequerimiento.alcance_requerimiento === undefined
                ? true
                : false;
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
      this.justificacion = formValue.justificacionRequerimiento;
      this.tipoRequerimiento = formValue.tipoRequerimiento;
      this.areasSolicitantes = formValue.areasSolicitantes;


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
      const PAYLOAD: MostrarFirmarAutorizarRequerimientoRequest = {
        cve_usuario: this.guardarDatos.current_user,
        id_accion: this.guardarDatos.action_id,
        id_requerimiento: this.dataIniciarRequerimiento?.id_requerimiento,
        usuario_perfil: {
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
     * Realiza la firma electrónica de un requerimiento.
     *
     * Valida que existan los datos necesarios, genera la firma en formato hexadecimal,
     * construye el payload y envía la solicitud al servicio de firma.
     * Muestra notificaciones de éxito o error según la respuesta del servicio.
     *
     * @param firma - Cadena base64 de la firma electrónica generada por el usuario.
     */
    firmarRequerimiento(firma: string): void {
      console.log('Iniciando proceso de firma del requerimiento...');
      if (!this.cadenaOriginalRequerimiento || !this.datosFirmaReales) {
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
  
      const CADENAHEX = encodeToISO88591Hex(this.cadenaOriginalRequerimiento);
      const FIRMAHEX = base64ToHex(firma);
      const NUMFOLIO = this.guardarDatos.folioTramite;
  
      const PAYLOAD: FirmarRequerimientoRequest = {
        id_accion: this.guardarDatos.action_id,
        firma: {
          cadena_original: CADENAHEX,
          cert_serial_number: this.datosFirmaReales.certSerialNumber,
          clave_usuario: this.datosFirmaReales.rfc,
          fecha_firma: formatFecha(new Date()),
          clave_rol: 'Dictaminador',
          sello: FIRMAHEX,
        },
        cve_usuario: this.guardarDatos.current_user,
        requiere_autorizador: false
      };
  
      this.guardarRequerimientoService.postFirmarAutorizarRequerimiento(this.tramite, NUMFOLIO, PAYLOAD)
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
     * Realiza una petición para guardar y generar el oficio de requerimiento.
     * Maneja la respuesta mostrando notificaciones de éxito o error según corresponda.
     */
    postDocumentoRequerimiento(): void {
      this.firmarRequermientoService.postGuardarOficioRequerimiento(this.tramite, this.guardarDatos.id_solicitud)
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
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: resp.error || 'Error generar oficio',
                mensaje:
                  resp.causa ||
                  resp.mensaje ||
                  'Ocurrió un error al generar el oficio.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            }
          },
          error: (err) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const MENSAJE = err?.error?.error || 'Error generar oficio';
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
     * Realiza una petición para obtener los documentos específicos asociados a un requerimiento.
     * Maneja la respuesta mostrando notificaciones de éxito o error según corresponda.
     */
    postDocumentosEspecificos(): void {
      const PAYLOAD = this.requerimientoConfig.isBodyNullDocumentos === true
        ? null
        : {
          id_pexim: 0,
          list_fraccion_arancelarias: [],
          list_mecanismo_asignaciones: [],
          list_tratamientos: [],
          clave_tipo_accion_mecanismo: '',
          descripcion_tipo_accion_mecanismo: '',
          esquema_regla_octava: 0
        } as DocumentosEspecificosRequest;
      const IDREQUERMIENTO = this.dataIniciarRequerimiento?.id_requerimiento;
      const IDSOLICITUD = this.guardarDatos.id_solicitud;
  
      this.guardarRequerimientoService.postDocumentosAdicionales(this.tramite, IDSOLICITUD, false, IDREQUERMIENTO, PAYLOAD)
        .subscribe({
          next: (resp) => {
            if (resp.codigo === CodigoRespuesta.EXITO) {
              this.documentosAdicionales = resp.datos ?? [];  

            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: resp.error || 'Error al recuperar documentos específicos.',
                mensaje:
                  resp.causa ||
                  resp.mensaje ||
                  'Error al recuperar documentos específicos.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            }
          },
          error: (err) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const MENSAJE = err?.error?.error || 'Error al recuperar documentos específicos.';
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
     * Carga los documentos específicos previamente guardados para un requerimiento.
     * Realiza una petición al servicio `GuardarRequerimientoService` y actualiza
     * el listado de documentos guardados si la respuesta es exitosa.
     * Maneja errores mostrando notificaciones adecuadas.
     * @param idRequerimiento - Identificador del requerimiento.
     * @param idSolicitud - Identificador de la solicitud.
     * @param payload - Objeto con los parámetros necesarios para la petición.
     */
    cargarDocumentosGuardados(idRequerimiento: number, idSolicitud: string, payload: DocumentosEspecificosRequest | null): void {
      this.guardarRequerimientoService
        .postDocumentosEspecificos(this.tramite, idSolicitud, true, idRequerimiento, payload)
        .subscribe({
          next: (resp) => {
            if (resp.codigo === CodigoRespuesta.EXITO) {
              const DOCUMENTOS_PREVIOS = (resp.datos ?? []).map(doc => ({
                id: doc.id_tipo_documento,
                description: doc.documento,
              }));
              this.listadoDocumentosGuardados = DOCUMENTOS_PREVIOS;
            }
          },
          error: (err) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const MENSAJE = err?.error?.error || 'Error al recuperar documentos específicos.';
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
          },
        });
    }
  
    /**
     * Actualiza el listado de documentos específicos seleccionados.
     *
     * @param listado - Arreglo de objetos que contienen el identificador de cada documento.
     *                   Se extrae únicamente la propiedad `id` de cada elemento.
     */
    onDocumentosActualizados(listado: { id: number }[]): void {
      this.listadoDocumentosEspecificos = listado.map(item => item.id);
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
              const BASE64_DATA = resp.datos ?? '';
              const BYTE_CHARACTERS = atob(BASE64_DATA);
              const BYTE_NUMBERS = new Array(BYTE_CHARACTERS.length);
              for (let i = 0; i < BYTE_CHARACTERS.length; i++) {
                BYTE_NUMBERS[i] = BYTE_CHARACTERS.charCodeAt(i);
              }
              const BYTE_ARRAY = new Uint8Array(BYTE_NUMBERS);
              const BLOB = new Blob([BYTE_ARRAY], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
              // Crear enlace de descarga
              const LINK = document.createElement('a');
              LINK.href = window.URL.createObjectURL(BLOB);
              LINK.download = 'datosRPE.xlsx';
              LINK.click();
  
              // Liberar memoria
              window.URL.revokeObjectURL(LINK.href);
  
  
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
   * @method onDocumentosRequeridos
   * @description Actualiza la lista de documentos requeridos.
   * @param {Documentos[]} lista - Lista de documentos requeridos.
   * @returns {void}
   */
    onDocumentosRequeridos(lista: Documentos[]): void {
      this.listaDocumentosRequeridos = lista.map(doc => ({
        id_documento_solicitud: doc.id_documento_solicitud,
        id_tipo_documento: doc.id_tipo_documento,
        requerido: doc.requerido
      }));
    }

      /**
* Abre el detalle de un acuse en una nueva pestaña.
* @param {string} url - La URL (UUID) del archivo PDF del acuse.
* @returns {void}
* @example
* // Abre el detalle de acuse
* verDetalleAcuse('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
*/
  verDetalleAcuse(url: string, nombre: string): void {
    this.base64Archivos(url, 'abrir', nombre);
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
    base64Archivos(uuid: string, accion: 'abrir' | 'descargar', nombre: string): void {
      this.documentosTabsService.getDescargarDoc(uuid).subscribe({
        next: (data) => {
          if (data?.codigo === "UPSER00" && data?.datos?.content) {
            manejarPdf(
              data.datos.content,
              nombre,
              accion
            );
          }
        },
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


  /**
 * @method isValid
 * @description Verifica si un campo específico del formulario es válido utilizando el servicio de validaciones personalizadas.
 * 
 * @param {string} field - Nombre del campo a validar.
 * @returns {boolean} Retorna `true` si el campo es válido, de lo contrario `false`.
 */
  isValid(field: string): boolean {
    const VALIDATIONRESULT = this.validacionesService.isValid(
      this.observacionForm,
      field
    );
    return VALIDATIONRESULT === null ? false : VALIDATIONRESULT;
  }

  /**
 * @method regresar
 * @description Emite el evento de regreso hacia el componente padre, enviando el tipo de evento "regresar" y datos nulos.
 * 
 * @returns {void}
 */
  regresar(): void {
    this.esObservacion = false;
  }

  /**
 * @method generarObservacion
 * @description Marca todos los campos del formulario como tocados y, si el formulario es válido, emite el evento de generación de observación con los datos.
 * 
 * @returns {void}
 */
  generarObservacion(): void {
    this.observacionForm.markAllAsTouched();
    if (this.observacionForm.valid) {
      const PAYLOAD: ObservacionRequest = {
        cve_usuario: this.guardarDatos.current_user,
        id_accion: this.guardarDatos.action_id,
        observacion: this.observacionForm.value?.justificacionObservacion,

      };

      this.guardarRequerimientoService.postGenerarObservacion(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
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

              this.router.navigate([`/bandeja-de-tareas-pendientes`]);

            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: resp.error || 'Error al generar la observación.',
                mensaje:
                  resp.causa ||
                  resp.mensaje ||
                  'Ocurrió un error al generar la observación.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            }
          },
          error: (err) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const MENSAJE = err?.error?.error || 'Error al generar la observación.';
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
  }
  
  }
