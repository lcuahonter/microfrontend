import {
  AccuseComponentes,
  ListaComponentes,
  Tabulaciones,
} from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Type,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { EncabezadoRequerimientoComponent } from '@libs/shared/data-access-user/src/tramites/components/encabezado-requerimiento/encabezado-requerimiento.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src/tramites/components/firma-electronica/firma-electronica.component';

import { ReviewersTabsComponent } from '@libs/shared/data-access-user/src/tramites/components/reviewers-tabs/reviewers-tabs.component';

import { FirmaAutorizarDictamenRequest } from '../core/models/autorizar-requerimiento/request/firma-autorizar-request.model';

import { RequerimientoConfig } from '../shared/models/requerimiento-config.model';

import { Catalogo, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';

import {
  CategoriaMensaje,
  ConfiguracionColumna,
  ConsultaCatalogoService,
  ConsultaioQuery,
  ConsultaioState,
  ConsultaioStore,
  CveEnumeracionConfig,
  FECHA_DE_INICIO,
  Notificacion,
  NotificacionesComponent,
  base64ToHex,
  encodeToISO88591Hex,
} from '@ng-mf/data-access-user';
import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { LISTA_TRIMITES } from '../shared/constantes/lista-trimites.enums';

import { AcusesResolucionResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-acuses-response.model';
import { DictamenesResponse } from '@libs/shared/data-access-user/src/core/models/shared/dictamenes-response.model';
import { DocumentoSolicitud } from '@libs/shared/data-access-user/src/core/models/shared/consulta-documentos-response.model';
import { EnvioDigitalResponse } from '@libs/shared/data-access-user/src/core/models/shared/envio-digital-response.model';
import { GuardarDictamenService } from '../core/services/evaluar-tramite/guardar-dictamen.service';
import { OpinionResponse } from '@libs/shared/data-access-user/src/core/models/shared/opinion-response.model';
import { RequerimientosResponse } from '@libs/shared/data-access-user/src/core/models/shared/requerimientos-response.model';
import { TabsSolicitudServiceTsService } from '../core/services/evaluar-tramite/tabs-solicitud.service.ts.service';
import { TareasSolicitud } from '@libs/shared/data-access-user/src/core/models/shared/consulta-tareas-response.model';

import { MostrarFirmarResponse } from '../core/models/autorizar-requerimiento/response/mostrar-firmar-response.model';
import { SentidosDisponiblesResponse } from '@libs/shared/data-access-user/src/core/models/shared/sentidos-disponibles.model';
import { TabsResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-tabs-response.model';

import { AcuseDetalleService } from '@libs/shared/data-access-user/src/core/services/shared/detalleAcuse.service';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CONSULTA_RESOLUCIONES } from '@libs/shared/data-access-user/src/core/enums/consulta-generica.enum';
import { CodigoRespuesta } from '../core/enum/cofepris-core-enum';
import { TramiteConfig } from '../shared/models/tramite-config.model';
import { TramiteConfigService } from '../shared/services/tramiteConfig.service';

import {
  ModeloConfig,
  ServiceConfig,
} from '../shared/models/service-config.model';

import { AutorizarRequerimientoService } from '../core/services/autorizar-requerimiento/autorizar-requerimiento.service';
import { EvaluarSolicitudService } from '../core/services/evaluar-tramite/evaluar-solicitud.service';
import { IniciarService } from '../core/services/evaluar-tramite/iniciar.service';

import { BodyTablaResolucion, HeaderTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';
import { CatalogoTipoDocumento, DocumentosEspecificosResponse, } from '@ng-mf/data-access-user';
import { CapturarRequerimientoComponent } from '../shared/components/capturar-requerimiento/capturar-requerimiento.component';
import { SolicitarDocumentosEvaluacionComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitar-documentos-evaluacion/solicitar-documentos-evaluacion.component';

import { AutorizarMostrarFirmarResponse } from '../core/models/autorizar-requerimiento/response/autorizar-mostrar-firmar-response.model';
import { DocumentosEspecificosRequest } from '../core/models/atender-requerimiento/request/documentos-especificos.model';
import { GenerarRequerimientoForm } from '../core/models/evaluar/request/generar-requerimiento-form.model';
import { GuardarRequerimientoService } from '../core/services/evaluar-tramite/guardarRequerimiento.service';
import { HistorialObservacione } from '../core/models/evaluar/response/evaluar-estado-evaluacion-response.model';
import { IniciarRequerimientoRequest } from '../core/models/evaluar/request/iniciar-requerimiento-request.model';
import { IniciarRequerimientoResponse } from '@libs/shared/data-access-user/src/core/models/shared/Iniciar-requerimiento-response.model';
import { MostrarFirmaRequest } from '../core/models/autorizar-requerimiento/request/mostrar-firmar-request.model';
import { ObservacionRequest } from '../core/models/autorizar-requerimiento/request/observacion-guardar-request.model';
import { RequerimientosStore } from '../estados/store/requerimientos.store';
import { VistaPreliminarService } from '../core/services/evaluar-tramite/vista-preliminar.service';

@Component({
  selector: 'app-autorizar-requerimiento',
  standalone: true,
  imports: [
    CommonModule,
    ReviewersTabsComponent,
    EncabezadoRequerimientoComponent,
    FormsModule,
    ReactiveFormsModule,
    CapturarRequerimientoComponent,
    FirmaElectronicaComponent,
    CapturarRequerimientoComponent,
    SolicitarDocumentosEvaluacionComponent,
    NotificacionesComponent,
  ],
  templateUrl: './autorizar-requerimiento.component.html',
  styleUrl: './autorizar-requerimiento.component.scss',
})
export class AutorizarRequerimientoComponent implements OnInit, OnDestroy {
   listadoDocumentosGuardados: CatalogoTipoDocumento[] = [];
    documentosEscpecificos: DocumentosEspecificosResponse[] = [];
  /** * @property {RequerimientoConfig} requerimientoConfig
   * @description Configuración de requerimientos específica del trámite, obtenida del servicio TramiteConfigService.
   */
  requerimientoConfig!: RequerimientoConfig;
  indiceRequerimiento: number = 1;
  dataIniciarRequerimiento!: IniciarRequerimientoResponse;

  /**
   * @property {AccuseComponentes | undefined} slectTramite
   * @description Objeto que representa el trámite seleccionado actualmente.
   */
  slectTramite!: AccuseComponentes | undefined;

  isRequerimiento: boolean = true;

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

  /**
   * @property {boolean} isObservacion
   * @description Indica si se debe la observacion.
   */
  isObservacion: boolean = false;

  /** Nueva notificación a gestionar */
  nuevaNotificacion!: Notificacion;

  /**
     * Datos de la tabla de resoluciones.
     * Contiene los registros que se mostrarán en la tabla de resoluciones.
     * @type {BodyTablaResolucion[]}
    */
    datosTablaResolucion: BodyTablaResolucion[] = [];

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

  /**
   * @property {number} tramite
   * @description Identificador del trámite seleccionado.
   */
  tramite: number = 0;

  /**
   * @property {GuardarDictamenRequest} guardarDictamenRequest
   * @description Objeto que contiene los datos necesarios para guardar un dictamen.
   */
  opcionesSentidosDispobles: SentidosDisponiblesResponse[] = [];

  /**
   * Indica si se debe mostrar un input de justificación.
   * En unos tramites se muestra un input de justificacion.
   */
  inputSentidos!: boolean;

  public resultadoEvaluacion: string = '';


  /** Response del servicio de firmar mostrar */
  mostrarFirmarData!: AutorizarMostrarFirmarResponse;

  /**
   * Cadena original generada a partir de los datos del trámite.
   * Esta cadena será firmada con el certificado digital y la llave privada proporcionados.
   */
  cadenaOriginal?: string;

  /**
   * @property {Type<unknown>} viewChild
   * @description Referencia dinámica al componente hijo que se carga según la pestaña seleccionada.
   */
  viewChild!: Type<unknown>;

  /**
   * @property {TabsResponse} tabs
   * @description Almacena la respuesta de pestañas disponibles.
   */
  tabs!: TabsResponse;

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

  /**
   * @property {DictamenesResponse[]} dictamenesSolicitud
   * @description Dictamenes de solicitud.
   */
  dictamenesSolicitud: DictamenesResponse[] = [];

  /**
   * @property {EnvioDigitalResponse} envioDigital
   * @description Respuesta del envío digital asociado al trámite.
   */
  envioDigital!: EnvioDigitalResponse;

  /** Listado de opiniones registradas para el trámite. */
  opinion: OpinionResponse[] = [];

  /**
   * @property {RequerimientosResponse[]} requerimientosSolicitud
   * @description Requerimientos de solicitud.
   */
  requerimientosSolicitud: RequerimientosResponse[] = [];

  /**
   * @property {AcusesResolucionResponse[]} acusesResolucion
   * @description Acuses de resolución asociados al trámite.
   */
  acusesResolucion!: AcusesResolucionResponse;

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
   * @property {string} firmaOficioCadena
   * @description Cadena original del oficio de autorización o rechazo que se va a firmar.
   */
  firmaOficioCadena!: string;
  /**
   * @property {boolean} yaCargoDictamenes
   * @description Indica si los dictamenes ya han sido cargados.
   */
  yaCargoDictamenes = false;

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
   * Variable para deshabilitar pestaña documento
   */
  deshabilitarSolicitarDocumentos: boolean = false;

  /**
   * Encabezado de la tabla de resoluciones.
   * Contiene las columnas que se mostrarán en la tabla de resoluciones.
   * @type {HeaderTablaResolucion[]}
   */
  readonly encabezadoTablaResolucion: HeaderTablaResolucion[] =
    CONSULTA_RESOLUCIONES.encabezadoTablaResolucion;

  /**
   * Formulario reactivo para la solicitud de observacion dictamen.
   * @type {FormGroup}
   */
  public observacionForm!: FormGroup;

  // public FormTramite!: FormGroup;

  /**
   * @property {TramiteConfig} config
   * @description Configuración específica del trámite, obtenida del servicio TramiteConfigService.
   */
  config!: TramiteConfig;

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
   * @property {string} sello
   * @description Sello digital del documento.
   */
  sello!: string;

  /**
   * @property {ModeloConfig} vistasModificacion110101
   * @description Configuración específica del trámite, obtenida del servicio TramiteConfigService.
   */
  vistasModificacion110101!: ModeloConfig;

  public plazoOpcions: Catalogo[] = [];

  public autorizadorOpcions: Catalogo[] = [];

  motivoLabel: string = '';
  motivoOpcions: Catalogo[] = [];
  motivoPracialOptcions: Catalogo[] = [];
  motivoRechazoOpcions: Catalogo[] = [];

  mostrarFecha: boolean = false;

  catalogoParameter!: CveEnumeracionConfig;
  public evaluarObservacionesDictamen: HistorialObservacione[] = [];
  public tablaObservacionesDictamen: ConfiguracionColumna<HistorialObservacione>[] =
    [
      {
        encabezado: 'Fecha de generación',
        clave: (e: HistorialObservacione) => e.fecha_observacion,
        orden: 1,
      },
      {
        encabezado: 'Fecha de atención',
        clave: (e: HistorialObservacione) => e.fecha_atencion,
        orden: 2,
      },
      {
        encabezado: 'Generada por',
        clave: (e: HistorialObservacione) => e.cve_usuario,
        orden: 3,
      },
      {
        encabezado: 'Estatus',
        clave: (e: HistorialObservacione) => e.estado_observacion,
        orden: 4,
      },
      {
        encabezado: 'Detalle',
        clave: (e: HistorialObservacione) => e.observacion,
        orden: 5,
      },
    ];

    formRequerimiento!: GenerarRequerimientoForm;

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
  constructor(
    private router: Router,
    private consultaioStore: ConsultaioStore,
    private consultaioQuery: ConsultaioQuery,
    private iniciarService: IniciarService,
    private tabsSolicitudServiceTsService: TabsSolicitudServiceTsService,
    private guardarService: GuardarDictamenService,
    private autorizarRequerimientoService: AutorizarRequerimientoService,
    private acuseDetalleService: AcuseDetalleService,
    private consultaCatalogoService: ConsultaCatalogoService,
    private evaluarSolicitudService: EvaluarSolicitudService,
    private fb: FormBuilder,
    private tramiteConfigService: TramiteConfigService,
    private cdr: ChangeDetectorRef,
    private guardarRequerimientoService: GuardarRequerimientoService,
    private vistaPreliminarService: VistaPreliminarService,
    private validacionesService: ValidacionesFormularioService,
    private requerimientosStore: RequerimientosStore
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
    this.requerimientoConfig = this.tramiteConfigService.getRequerimientoConfig(
      this.tramite
    );
    this.consultaioStore.solicitanteConsultaio({
      folioDelTramite: this.guardarDatos?.folioTramite,
      fechaDeInicio: FECHA_DE_INICIO,
      estadoDelTramite: this.guardarDatos?.estadoDeTramite,
      tipoDeTramite: this.guardarDatos?.tipoDeTramite,
    });

    /**
     * Formulario reactivo para detalle observacion.
     */
    this.serviceConfigModelo = this.tramiteConfigService.getModeloConfig(
      this.tramite
    );
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
    this.observacionForm = this.fb.group({
      observacion: ['', Validators.required],
    });
    if (this.tramite) {
      this.selectTramite(this.tramite);
    } else {
      this.router.navigate([
        `/${this.guardarDatos?.department.toLowerCase()}/seleccion-tramite`,
      ]);
    }
    // this.FormTramite.disable();
    this.iniciarRequerimiento();
    this.getTabs();
  }

  /**
  * compo doc
  * @method isValid
  * @description 
  * Verifica si un campo específico del formulario es válido.
  * @param field El nombre del campo que se desea validar.
  * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
  */
  public esValido(campo: string): boolean | null {
    return this.validacionesService.isValid(this.observacionForm, campo);
  }

  /**
   * @method seleccionaTabRequerimiento
   * @description Cambia la pestaña de dictamen seleccionada.
   * @param {number} i - Índice de la pestaña de dictamen.
   * @returns {void}
   */
  seleccionaTabRequerimiento(i: number): void {
    this.indiceRequerimiento = i;

    if (i === 2 && this.requerimientoConfig.isSegundaTabla) {
      // this.postDocumentosEspecificos();
    }
  }

  postDocumentosEspecificos(): void {
    const PAYLOAD =
      this.requerimientoConfig.isBodyNullDocumentos === true
        ? null
        : ({
            id_pexim: 0,
            list_fraccion_arancelarias: [],
            list_mecanismo_asignaciones: [],
            list_tratamientos: [],
            clave_tipo_accion_mecanismo: '',
            descripcion_tipo_accion_mecanismo: '',
            esquema_regla_octava: 0,
          } as DocumentosEspecificosRequest);
    const IDREQUERMIENTO = this.dataIniciarRequerimiento?.id_requerimiento;
    const IDSOLICITUD = this.guardarDatos.id_solicitud;

    this.autorizarRequerimientoService
      .postDocumentosEspecificos(
        this.tramite,
        IDSOLICITUD,
        false,
        IDREQUERMIENTO,
        PAYLOAD
      )
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            this.documentosEscpecificos = resp.datos ?? [];

            if (IDREQUERMIENTO) {
              this.cargarDocumentosGuardados(
                IDREQUERMIENTO,
                IDSOLICITUD,
                PAYLOAD
              );
            }
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo:
                resp.error || 'Error al recuperar documentos específicos.',
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
          const MENSAJE =
            err?.error?.error || 'Error al recuperar documentos específicos.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        },
      });
  }

  cargarDocumentosGuardados(
    idRequerimiento: number,
    idSolicitud: string,
    payload: DocumentosEspecificosRequest | null
  ): void {
    this.autorizarRequerimientoService
      .postDocumentosEspecificos(
        this.tramite,
        idSolicitud,
        true,
        idRequerimiento,
        payload
      )
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            const DOCUMENTOS_PREVIOS = (resp.datos ?? []).map((doc) => ({
              id: doc.id_tipo_documento,
              description: doc.documento,
            }));
            this.listadoDocumentosGuardados = DOCUMENTOS_PREVIOS;
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE =
            err?.error?.error || 'Error al recuperar documentos específicos.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        },
      });
  }
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
    this.firmaAutorizarRequerimiento(datos.firma);
  }

  static formatFecha(fecha: string | Date): string {
    const DATE_OBJ = new Date(fecha);
    const PAD = (n: number): string => n.toString().padStart(2, '0');

    const YYYY = DATE_OBJ.getFullYear();
    const MM = PAD(DATE_OBJ.getMonth() + 1);
    const DD = PAD(DATE_OBJ.getDate());
    const HH = PAD(DATE_OBJ.getHours());
    const MM_MINUTES = PAD(DATE_OBJ.getMinutes());
    const SS = PAD(DATE_OBJ.getSeconds());

    return `${YYYY}-${MM}-${DD} ${HH}:${MM_MINUTES}:${SS}`;
  }

  static formatearFecha(dateString: string): string {
    const DATE = new Date(dateString);
    const DAY = String(DATE.getDate()).padStart(2, '0');
    const MONTH = String(DATE.getMonth() + 1).padStart(2, '0');
    const YEAR = DATE.getFullYear();

    return `${DAY}/${MONTH}/${YEAR}`;
  }

  inicializarCatalogoOpciens(): void {
    this.catalogoParameter =
      this.consultaCatalogoService.getCatalogoParameterConfig(this.tramite);

    this.consultaCatalogoService
      .getPlazo(this.tramite)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        const DATOS = response.datos as Catalogo[];
        if (response) {
          this.plazoOpcions = DATOS;
        }
      });

    this.consultaCatalogoService
      .getAsignarAutorizador(this.tramite)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        const DATOS = response.datos as Catalogo[];
        if (response) {
          this.autorizadorOpcions = DATOS;
        }
      });

    this.consultaCatalogoService
      .getMotivoDeRechazo(this.tramite)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        const DATOS = response.datos as Catalogo[];
        if (response) {
          this.motivoRechazoOpcions = DATOS;
        }
      });

    this.consultaCatalogoService
      .getMotivoDelRequerimiento(
        this.tramite,
        this.catalogoParameter?.ideTipoMotivo
      )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        const DATOS = response.datos as Catalogo[];
        if (response) {
          this.motivoPracialOptcions = DATOS;
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
    this.tabsSolicitudServiceTsService
      .getTabs(this.tramite, this.guardarDatos.id_solicitud)
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.tabs = response.datos ?? ({} as TabsResponse);
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
            mensaje:
              error?.error?.error || 'Error inesperado en solicitud estado.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        },
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
    this.tabsSolicitudServiceTsService
      .getDocumentosSolicitud(this.tramite, this.guardarDatos.id_solicitud)
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
        },
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
    this.tabsSolicitudServiceTsService
      .getRequerimientos(this.tramite, this.guardarDatos.folioTramite)
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
            mensaje:
              error?.error?.error || 'Error inesperado en requerimientos.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        },
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
    this.tabsSolicitudServiceTsService
      .getDictamenes(this.tramite, this.guardarDatos.folioTramite)
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
        },
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
    this.tabsSolicitudServiceTsService
      .getTareasSolicitud(this.tramite, this.guardarDatos.folioTramite)
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
        },
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
    this.tabsSolicitudServiceTsService
      .getOpiniones(this.tramite, this.guardarDatos.folioTramite)
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
        },
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
    this.tabsSolicitudServiceTsService
      .getAcusesResolucion(this.tramite, this.guardarDatos.folioTramite)
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.acusesResolucion =
              response.datos ?? ({} as AcusesResolucionResponse);
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
        },
      });
  }

  /**
   * @method getEnvioDigital
   * @description Método para obtener el envío digital asociado a un trámite.
   */
  getEnvioDigital(): void {
    this.tabsSolicitudServiceTsService
      .getEnvioDigital(this.tramite, this.guardarDatos.folioTramite)
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.envioDigital = response.datos ?? ({} as EnvioDigitalResponse);
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
            mensaje:
              error?.error?.error || 'Error inesperado en envio digital.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        },
      });
  }

  /**
   * * @method firmarMostrarAutorizarDictamen
   * * @description Prepara y envía una solicitud para mostrar la interfaz de firma electrónica
   * * para autorizar un dictamen.
   */
  firmarMostrarAutorizarRequerimiento(): void {
    const PAYLOAD = {
      id_accion: this.guardarDatos.action_id,
      cve_usuario: this.guardarDatos.current_user,
      usuario_perfil: {
        rfc: this.guardarDatos.current_user,
        nombre: 'PRUEBA',
        apellido_paterno: 'PRUEBA',
        apellido_materno: 'PRUEBA',
      },
    };

    this.autorizarRequerimientoService
      .postFirmarMostrar(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            const DATOS = resp.datos ?? {} as MostrarFirmarResponse;
             // Ensure id_requerimiento is present for AutorizarMostrarFirmarResponse
            this.mostrarFirmarData = {
              ...DATOS,
              id_requerimiento: DATOS.id_requerimiento ?? this.dataIniciarRequerimiento?.id_requerimiento ?? 0
            };
            this.cadenaOriginal = resp.datos?.cadena_original;
            this.isRequerimiento = false;
            this.isFirma = true;
            this.firmaOficioCadena =
              resp.datos?.firma_oficios.cadena_original || '';
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
        },
      });
  }

  firmaAutorizarRequerimiento(firma: string): void {
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
        fecha_firma: AutorizarRequerimientoComponent.formatFecha(new Date()),
        clave_rol: 'Autorizador',
        sello: FIRMAHEX,
        fecha_fin_vigencia: AutorizarRequerimientoComponent.formatFecha(
          this.datosFirmaReales.fechaFin
        ),
        documentos_requeridos: [],
      },
    };

    this.autorizarRequerimientoService
      .firmarAutorizar(this.tramite, NUMFOLIO, PAYLOAD)
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((firmaResponse: BaseResponse<null>) => {
          if (firmaResponse.codigo !== '00' || !firmaResponse.datos) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error al firmar la solicitud',
              mensaje:
                firmaResponse.mensaje ||
                firmaResponse.error ||
                'Ocurrió un error al procesar la firma.',
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
            };
            this.isRequerimiento = false;
            this.isFirma = false;
            this.isDocumento = false;
            this.postOficioAutorizacion();
          }
        }),
        catchError((error) => {
          if (!this.nuevaNotificacion) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error inesperado',
              mensaje:
                error?.error.error || 'Ocurrió un error al procesar la firma.',
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

  postOficioAutorizacion(): void {
    this.autorizarRequerimientoService.postOficioAutorizacion(this.tramite, Number(this.guardarDatos.id_solicitud))
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
   * Descarga un archivo Excel con los datos de la solicitud.
   *
   * Llama al servicio `consultaCatalogoService.getDescargarExcel` pasando el ID del trámite
   * y la solicitud. Convierte la respuesta en Base64 a un archivo Blob y fuerza la descarga
   * en el navegador con el nombre `datosRPE.xlsx`.
   *
   * Muestra notificaciones de error si la descarga falla o si la respuesta del servicio no es exitosa.
   *
   * @returns {void}
   */
  descargarSolicitud(): void {
    this.evaluarSolicitudService
      .getDescargarExcel(this.tramite, this.guardarDatos.id_solicitud)
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
            const BLOB = new Blob([BYTE_ARRAY], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

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
              mensaje: resp.causa || resp.mensaje || 'Error al descargar excel',
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
          };
        },
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

    this.isRequerimiento = false;
    this.isFirma = false;
    this.isDocumento = false;
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
    this.isRequerimiento = true;
    this.isFirma = false;
    this.isDocumento = false;
  }

  /**
   * @method getSentidosDisponibles
   * @description Obtiene los sentidos disponibles para el dictamen del trámite 130118.
   * Realiza una petición al servicio `GuardarDictamenService` para recuperar los sentidos disponibles.
   */
  getSentidosDisponibles(): void {
    this.guardarService
      .getSentidosDisponibles(
        this.tramite.toString(),
        this.guardarDatos.folioTramite
      )
      .subscribe({
        next: (resp) => {
          this.opcionesSentidosDispobles = resp.datos ?? [];
        },
        error: (err) => {
          const MENSAJE = err?.error?.error || 'Error al obtener los sentidos';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        },
      });
  }

  /**
   * Inicia el proceso de requerimiento con datos predefinidos
   * Realiza una petición POST para iniciar un requerimiento y maneja la respuesta
   */
  iniciarRequerimiento(): void {
    const PAYLOAD: IniciarRequerimientoRequest = {
      cve_usuario: this.guardarDatos.current_user,
      id_accion: this.guardarDatos.action_id,
    };

    this.iniciarService
      .postAutorizarIniCiarRequerimiento(
        this.tramite,
        this.guardarDatos.folioTramite,
        PAYLOAD
      )
      .subscribe({
        next: (resp) => {
          this.dataIniciarRequerimiento =
            resp.datos ?? ({} as IniciarRequerimientoResponse);
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
          };
        },
      });
  }

  observacion(): void {
    this.router.navigate([
      this.guardarDatos.department + '/detalle-v-dictamen',
    ]);
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
    this.viewChild = (await li.componentPath()) as Type<unknown>;
  }

  mostrarFirmarAutorizarRequerimiento(): void {
    const PAYLOAD: MostrarFirmaRequest = {
      id_accion: this.guardarDatos.action_id,
      cve_usuario: this.guardarDatos.current_user,
      id_requerimiento: this.dataIniciarRequerimiento?.id_requerimiento ?? 0,
      usuario_perfil: {
        rfc: this.guardarDatos.current_user,
        nombre: 'PRUEBA',
        apellido_paterno: 'PRUEBA',
        apellido_materno: 'PRUEBA'
      }
    };

    this.guardarRequerimientoService.postFirmarMostrar(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            const DATOS = resp.datos ?? {} as MostrarFirmarResponse;
            // Ensure id_requerimiento is present for AutorizarMostrarFirmarResponse
            this.mostrarFirmarData = {
              ...DATOS,
              id_requerimiento: DATOS.id_requerimiento ?? this.dataIniciarRequerimiento?.id_requerimiento ?? 0
            };
            this.cadenaOriginal = resp.datos?.cadena_original;
            this.isFirma = true;
            this.isRequerimiento = false;
            this.firmaOficioCadena = resp.datos?.firma_oficios.cadena_original || '';
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
  onFormRequerimientoChanged(formValue: any) {
    this.formRequerimiento = formValue;
  }

  postGenerarObservacion(): void {
    if (!this.observacionForm.get('observacion')?.value) {
      this.observacionForm.markAllAsTouched();
      return;
    }
    const PAYLOAD: ObservacionRequest = {
      id_accion: this.guardarDatos.action_id,
      observacion: this.observacionForm.get('observacion')?.value,
      cve_usuario: this.guardarDatos.current_user,
    };
    this.guardarRequerimientoService.postObservacionGuardar(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === "00" && resp.datos) {
            this.getRegresar();
                this.router.navigate(['bandeja-de-tareas-pendientes'], {
                  queryParams: { labelExitoso: true },
                });
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
   * @method viewChildcambioDePestana
   * @description Cambia el componente hijo mostrado según la pestaña seleccionada.
   * @param {Tabulaciones} id - Identificador de la pestaña seleccionada.
   * @returns {void}
   */
  viewChildcambioDePestana(id: Tabulaciones): void {
    const LI = this.slectTramite?.listaComponentes.find(
      (v: ListaComponentes) => v.id === id.id
    );
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
        if (data?.codigo === '00' && data?.datos?.contenido) {
          AutorizarRequerimientoComponent.manejarPdf(
            data.datos.contenido,
            data.datos.nombre_archivo,
            accion
          );
        }
      },
    });
  }

  /**
   * Método genérico para manejar un PDF en base64.
   *
   * @param base64 Contenido del PDF en base64.
   * @param nombreArchivo Nombre del archivo a descargar (si aplica).
   * @param accion 'abrir' para abrir en pestaña o 'descargar' para forzar descarga.
   */
  static manejarPdf(
    base64: string,
    nombreArchivo: string,
    accion: 'abrir' | 'descargar'
  ): void {
    // Decodificar el base64
    const BYTE_CHARACTERS = atob(base64);
    const BYTE_NUMBERS = new Array(BYTE_CHARACTERS.length);
    for (let i = 0; i < BYTE_CHARACTERS.length; i++) {
      BYTE_NUMBERS[i] = BYTE_CHARACTERS.charCodeAt(i);
    }
    const BYTE_ARRAY = new Uint8Array(BYTE_NUMBERS);

    // Crear el Blob y la URL
    const BLOB = new Blob([BYTE_ARRAY], { type: 'application/pdf' });
    const URLCODIFICADA = URL.createObjectURL(BLOB);

    if (accion === 'abrir') {
      window.open(URLCODIFICADA, '_blank');
    } else {
      const LINK = document.createElement('a');
      LINK.href = URLCODIFICADA;
      LINK.download = nombreArchivo.endsWith('.pdf')
        ? nombreArchivo
        : `${nombreArchivo}.pdf`;
      LINK.click();
      URL.revokeObjectURL(URLCODIFICADA);
    }
  }

  postTerminar(): void {
      const PAYLOAD: ObservacionRequest = {
        id_accion: this.guardarDatos.action_id,
        observacion: this.observacionForm.get('observacion')?.value,
        cve_usuario: this.guardarDatos.current_user,
      };
      this.autorizarRequerimientoService
        .postObservacionGuardar(
          this.tramite,
          this.guardarDatos.folioTramite,
          PAYLOAD
        )
        .subscribe({
          next: (resp) => {
            if (resp.codigo === '00' && resp.datos) {
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
          error: (error: unknown) => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error inesperado',
              mensaje: (error as { error?: { error?: string } })?.error?.error || 'Error al guardar observación.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          },
        });
    }

  vistaPreliminarAutorizarRequerimiento(): void {
      this.vistaPreliminarService.getVistaPreliminarRequerimiento(this.tramite, this.guardarDatos.folioTramite).subscribe({
          next: (resp) => {
            if (resp.codigo === CodigoRespuesta.EXITO && resp.datos?.contenido) {
                AutorizarRequerimientoComponent.manejarPdf(
                  resp.datos.contenido,
                  resp.datos.nombre_archivo,
                  'descargar'
                );
            }
          },
          error: (err) => {
            const MENSAJE = err?.error?.error || 'Error al obtener la vista preliminar de aceptado';
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
    this.consultaioStore.establecerConsultaio(
      '',
      '',
      '',
      '',
      '',
      '',
      false,
      true,
      false
    );
    this.requerimientosStore.resetStore();
  }
}