/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccuseComponentes, ListaComponentes, Tabulaciones } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, Type } from "@angular/core";

import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Router } from '@angular/router';

import { DictamenForm } from '../core/models/autorizar-dictamen/dictamen-form.model';
import { EncabezadoRequerimientoComponent } from '@libs/shared/data-access-user/src/tramites/components/encabezado-requerimiento/encabezado-requerimiento.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src/tramites/components/firma-electronica/firma-electronica.component';

import { ReviewersTabsComponent } from '@libs/shared/data-access-user/src/tramites/components/reviewers-tabs/reviewers-tabs.component';


import { Catalogo, CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import {CategoriaMensaje, ConfiguracionColumna, ConsultaCatalogoService, ConsultaioQuery, ConsultaioState, ConsultaioStore, CveEnumeracionConfig, FECHA_DE_INICIO, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TituloComponent, base64ToHex, encodeToISO88591Hex } from '@ng-mf/data-access-user';
import { Subject, catchError, map,of,takeUntil, tap } from 'rxjs';
import { LISTA_TRIMITES } from '../shared/constantes/lista-trimites.enums';

import { AcusesResolucionResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-acuses-response.model';
import { DictamenesResponse } from '@libs/shared/data-access-user/src/core/models/shared/dictamenes-response.model';
import { DocumentoSolicitud } from "@libs/shared/data-access-user/src/core/models/shared/consulta-documentos-response.model";
import { EnvioDigitalResponse } from '@libs/shared/data-access-user/src/core/models/shared/envio-digital-response.model';
import { GuardarDictamenService } from '../core/services/evaluar-tramite/guardar-dictamen.service';
import { OpinionResponse } from '@libs/shared/data-access-user/src/core/models/shared/opinion-response.model';
import { RequerimientosResponse } from '@libs/shared/data-access-user/src/core/models/shared/requerimientos-response.model';
import { TabsSolicitudServiceTsService } from "../core/services/evaluar-tramite/tabs-solicitud.service.ts.service";
import { TareasSolicitud } from "@libs/shared/data-access-user/src/core/models/shared/consulta-tareas-response.model";

import { SentidosDisponiblesResponse } from '@libs/shared/data-access-user/src/core/models/shared/sentidos-disponibles.model';
import { TabsResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-tabs-response.model';

import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';

import { AcuseDetalleService } from '@libs/shared/data-access-user/src/core/services/shared/detalleAcuse.service';
import { AutorizarDictamenService } from '../core/services/autorizar-dictamen/autorizar-dictamen.service';


import { BodyTablaResolucion, HeaderTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';
import { CONSULTA_RESOLUCIONES } from '@libs/shared/data-access-user/src/core/enums/consulta-generica.enum';

import { SERIES26050, SERIES26051, SERIES2609, SERIES2617 } from '@libs/shared/data-access-user/src/core/enums/cofepris-core-enum';
import { CodigoRespuesta } from '../core/enum/cofepris-core-enum';
import { Firma } from '../core/models/evaluar/request/firmar-dictamen-request.model';
import { FirmaAutorizarDictamenRequest } from '../core/models/autorizar-requerimiento/request/firma-autorizar-request.model';
import { GenerarDictamenClasificacionComponent } from "../shared/components/generar-dictamen-calificacion/generar-dictamen-clasificacion.component";
import { MostrarFirmaRequest } from '../core/models/autorizar-requerimiento/request/mostrar-firmar-request.model';
import { MostrarFirmarResponse } from '../core/models/autorizar-requerimiento/response/mostrar-firmar-response.model';
import { ObservacionRequest } from '../core/models/autorizar-requerimiento/request/observacion-guardar-request.model';
import { TramiteConfig } from '../shared/models/tramite-config.model';
import { TramiteConfigService } from '../shared/services/tramiteConfig.service';

import { ModeloConfig, ServiceConfig } from '../shared/models/service-config.model';

import {IniciarAutorizarDictamen ,} from '../core/models/autorizar-dictamen/request/iniciar-autorizar-dictamen.model';

import { EvaluarSolicitudService } from '../core/services/evaluar-tramite/evaluar-solicitud.service';
import { IniciarAutorizacionResponse } from '../core/models/autorizar-dictamen/iniciar-autorizar-dictamen-response.model';

import { HistorialObservacione } from '../core/models/evaluar/response/evaluar-estado-evaluacion-response.model';
import { VistaPreliminarService } from '../core/services/evaluar-tramite/vista-preliminar.service';

import { GenerarDictamen260501Component } from '../shared/components/generar-dictamen-260501/generar-dictamen.component';
import { GenerarDictamen26050Config } from '../shared/models/generar-dictamen-26050-config.model';
import { GenerarDictamen260514Component } from "../shared/components/generar-dictamen-260514/generar-dictamen.component";
import {GenerarDictamenComponent2606} from  '../shared/components/generar-dictamen-2606/generar-dictamen.component';

import { GenerarDictamen2604Component } from '../shared/components/generar-dictamen-2604/generar-dictamen-2604.component';

import { GenerarDictamen2601Component } from '../shared/components/generar-dictamen-2601/generar-dictamen-2601.component';

import { GenerarDictamen26030Component } from '../shared/components/generar-dictamen-26030/generar-dictamen-26030.component';
import { GenerarDictamen261701Component } from '../shared/components/generar-dictamen-261701/generar-dictamen-261701.component';

@Component({
  selector: 'app-autorizar-dictamen',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, ReviewersTabsComponent,
    EncabezadoRequerimientoComponent,
    FormsModule, FirmaElectronicaComponent, ReactiveFormsModule,
    NotificacionesComponent, GenerarDictamenClasificacionComponent, TituloComponent, TablaDinamicaComponent,
     GenerarDictamen260514Component,
      GenerarDictamenComponent2606,
     GenerarDictamen260501Component,
    GenerarDictamen2604Component, GenerarDictamen2601Component,
    GenerarDictamen26030Component,
    GenerarDictamen261701Component
  ],
  templateUrl: './autorizar-dictamen.component.html',
  styleUrl: './autorizar-dictamen.component.scss',
})
export class AutorizarDictamenComponent implements OnInit, OnDestroy {

  /**
   * @property {IniciarAutorizacionResponse} dataAutorizarDictamen
   * @description Datos obtenidos al iniciar el dictamen de autorización.
   */
  dataAutorizarDictamen!: IniciarAutorizacionResponse;
  dataIniciarDictamen!: IniciarAutorizacionResponse;


  /**
    * @property {AccuseComponentes | undefined} slectTramite
    * @description Objeto que representa el trámite seleccionado actualmente.
  */
  slectTramite!: AccuseComponentes | undefined;

  /**
   * @property {boolean} isDictamen
   * @description Indica si se debe mostrar la sección de dictamen.
  */
  isDictamen: boolean = true;

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
     * @property {ConsultaioState} guardarDatos
     * @description Estado actual del trámite consultado.
     */
  guardarDatos!: ConsultaioState;

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

  /**
  * @property {Subject<void>} destroyNotifier$
  * @description Subject utilizado para cancelar las suscripciones y evitar fugas de memoria al destruir el componente.
  * @private
  */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Response del servicio de firmar mostrar */
  mostrarFirmarData!: MostrarFirmarResponse;

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
  readonly encabezadoTablaResolucion: HeaderTablaResolucion[] = CONSULTA_RESOLUCIONES.encabezadoTablaResolucion;

  /**
   * Datos de la tabla de resoluciones.
   * Contiene los registros que se mostrarán en la tabla de resoluciones.
   * @type {BodyTablaResolucion[]}
  */
  datosTablaResolucion: BodyTablaResolucion[] = [];

  /**
   * Formulario reactivo para la solicitud de observacion dictamen.
   * @type {FormGroup}
  */
  public observacionForm!: FormGroup;

  public FormTramite!: FormGroup;
  series_26051: number[] = SERIES26051;
  series_2617: number[] = SERIES2617;
  /** @property {number[]} series_26090
   * @description Arreglo que contiene los identificadores de las series correspondientes al código 2609.
   * Estos valores se utilizan para representar diferentes categorías o tipos dentro del sistema COFEPRIS.
   */
  series_26090: number[] = SERIES2609;
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

  generarDictamen26050Config!: GenerarDictamen26050Config;

  /**
   * @property {string} sello
   * @description Sello digital del documento.
   */
  sello!: string;

  /**
   * @property {string} firmaOficioCadena
   * @description Cadena original del oficio de autorización o rechazo que se va a firmar.
   */
  firmaOficioCadena!: string;

   /**
  * @property {ModeloConfig} vistasModificacion110101
  * @description Configuración específica del trámite, obtenida del servicio TramiteConfigService.
 */
  vistasModificacion110101!: ModeloConfig;

     public plazoOpcions: Catalogo[] = [];

  public autorizadorOpcions:Catalogo[]=[]

  motivoLabel: string = ''
  motivoOpcions: Catalogo[] = [];
  motivoPracialOptcions: Catalogo[] = [];
  motivoRechazoOpcions:Catalogo[]=[];

  mostrarFecha:boolean=false;

  catalogoParameter!:CveEnumeracionConfig;
    public evaluarObservacionesDictamen: HistorialObservacione[] = [];
    public tablaObservacionesDictamen: ConfiguracionColumna<HistorialObservacione>[] = [
        { encabezado: "Fecha de generación", clave: (e: HistorialObservacione) => e.fecha_observacion, orden: 1 },
        { encabezado: "Fecha de atención", clave: (e: HistorialObservacione) => e.fecha_atencion, orden: 2 },
        { encabezado: "Generada por", clave: (e: HistorialObservacione) => {
              const PARTES = [e.nombre, e.apellido_paterno, e.apellido_materno]
                .map(v => (v && v.trim()) ? v.trim() : '')
              .filter(v => v);
            return PARTES.length > 0 ? PARTES.join(' ') : e.cve_usuario;
          }, orden: 3 },
        { encabezado: "Estatus", clave: (e: HistorialObservacione) => e.estado_observacion, orden: 4 },
        { encabezado: "Detalle", clave: (e: HistorialObservacione) => e.observacion, orden: 5 }
      ];
  public calificacionDictaminador!: boolean;

   /**
  * @property {string} justificacionNegativaLabel
  **/    
  justificacionNegativaLabel:string=''
   
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
    private tabsSolicitudServiceTsService: TabsSolicitudServiceTsService,
    private guardarService: GuardarDictamenService,
    private autorizarDictamenService: AutorizarDictamenService,
    private acuseDetalleService: AcuseDetalleService,
    private consultaCatalogoService: ConsultaCatalogoService,
    private evaluarSolicitudService: EvaluarSolicitudService,
    private fb: FormBuilder,
    private tramiteConfigService: TramiteConfigService,
    private vistaPreliminarService: VistaPreliminarService,
    private cdr: ChangeDetectorRef
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
    this.serviceConfigModelo = this.tramiteConfigService.getModeloConfig(this.tramite);
    this.generarDictamen26050Config = this.tramiteConfigService.getGenerarDictamen26050Config(this.tramite);
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
    console.log('AutorizarDictamenComponent ngOnInit - tramite:', this.tramite);
    this.observacionForm = this.fb.group({
      observacion: ['',[Validators.required,AutorizarDictamenComponent.noSoloEspacios, Validators.maxLength(2000)]],
    });
    if (this.tramite) {
      this.selectTramite(this.tramite);
    } else {
      this.router.navigate([`/${this.guardarDatos?.department.toLowerCase()}/seleccion-tramite`]);
    }
    this.observacionForm = this.fb.group({
      observacion: ['',[Validators.required,AutorizarDictamenComponent.noSoloEspacios, Validators.maxLength(2000)]],
    });
    if(this.tramite.toString().startsWith('2602') || this.tramite.toString().startsWith('2604') || this.series_26090.includes(this.tramite) || this.tramite.toString().startsWith('26010')){
    this.inicializarCatalogoOpciens();
    this.initForm();
    this.FormTramite.disable();
    this.iniciarDictamenAutorizar();
    }
     if(SERIES26051.includes(this.tramite) || SERIES26050.includes(this.tramite) || this.tramite.toString().startsWith('2603')){
      this.iniciarDictamenAutorizar26051();
     }
     if(this.series_2617.includes(this.tramite)){
      this.iniciarDictamenAutorizar2617();
     }
     if(this.tramite.toString().startsWith('2606')) {
      this.iniciarDictamenAutorizar2606();
     }
     
    this.getSentidosDisponibles();
    this.getTabs();
  }

    /**
   * Establece el estado del calificador dictaminador.
   * Actualiza el valor que indica si el usuario actúa como dictaminador en el proceso de calificación.
   */
  onDictaminador(valor: boolean): void{
    this.calificacionDictaminador = valor;
  }
  enviarEvento(e: { events: string, datos: DictamenForm }): void {
    switch (e.events) {
      case 'VistaPreliminarAceptado':
        this.vistaPreliminarAceptado();
        break;
      case 'VistaPreliminarRechazado':
        this.vistaPreliminarRechazado();
        break;
      case 'VistaPreliminardelOficio':
        this.vistaPreliminarRechazado();
        break;
      default:
    }
  }
  initForm(): void {
     this.FormTramite = this.fb.group({
      justificacionNegativa: [{ value: '', disabled: true }],
      idMotivoTipoTramite: [{ value: '', disabled: true }], 
      sentidoDelDictamen: [{ value: '', disabled: true }],    
      descripcionUsoAutorizado: [{ value: '', disabled: true }], 
      opinion: [{ value: '', disabled: true }], 
      justificacion: [{ value: '', disabled: true }],
      plazoVigencia: [{ value: '', disabled: true }],
      fechaFinVigencia:[{ value: '', disabled: true }],
      siglasDictaminador: [{ value: '', disabled: true }],
      numeroGenerico1: [{ value: '', disabled: true }],
      aceptada:[{ value: false, disabled: true }],
      mercancia_0_aceptada:[{ value:'Rechazada', disabled: true }]
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
   * @method noSoloEspacios
   * @description Validador personalizado que verifica que el campo no contenga solo espacios en blanco.
   * 
   * @param {AbstractControl} control - Control del formulario a validar.
   * @returns {ValidationErrors | null} Retorna un objeto de error si el valor es solo espacios, de lo contrario retorna null.
   */
  static noSoloEspacios(control: AbstractControl): ValidationErrors | null {
    if (control.value && typeof control.value === 'string' && control.value.trim() === '') {
      return { soloEspacios: true };
    }
    return null;
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
    this.datosFirmaReales = datos;
    this.firmaAutorizarDictamen(datos.firma);
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
    this.catalogoParameter = this.consultaCatalogoService.getCatalogoParameterConfig(this.tramite);

    this.consultaCatalogoService.getPlazo(this.tramite)
    .pipe(takeUntil(this.destroyNotifier$)).subscribe(
    (response) => {
      const DATOS = response.datos as Catalogo[];
      if (response) { this.plazoOpcions = DATOS; }
    })

    this.consultaCatalogoService.getAsignarAutorizador(this.tramite)
    .pipe(takeUntil(this.destroyNotifier$)).subscribe(
    (response) => {
      const DATOS = response.datos as Catalogo[];
      if (response) { this.autorizadorOpcions = DATOS; }
    })

    this.consultaCatalogoService.getMotivoDeRechazo(this.tramite)
    .pipe(takeUntil(this.destroyNotifier$)).subscribe(
    (response) => {
      const DATOS = response.datos as Catalogo[];
      if (response) { this.motivoRechazoOpcions = DATOS; }
    })

    this.consultaCatalogoService.getMotivoDelRequerimiento(this.tramite, this.catalogoParameter?.ideTipoMotivo)
    .pipe(takeUntil(this.destroyNotifier$)).subscribe(
    (response) => {
      const DATOS = response.datos as Catalogo[];
      if (response) { this.motivoPracialOptcions = DATOS; }
    })


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
   * * @method firmarMostrarAutorizarDictamen
   * * @description Prepara y envía una solicitud para mostrar la interfaz de firma electrónica
   * * para autorizar un dictamen.
   */
  firmarMostrarAutorizarDictamen(): void {

    const PAYLOAD: MostrarFirmaRequest = {
      id_accion: this.guardarDatos.action_id,
      cve_usuario: this.guardarDatos.current_user,
      id_dictamen: this.dataAutorizarDictamen?.id_dictamen || this.dataIniciarDictamen?.id_dictamen,
      usuario_perfil: {
        rfc: this.guardarDatos.current_user,
        nombre: 'PRUEBA',
        apellido_paterno: 'PRUEBA',
        apellido_materno: 'PRUEBA'
      }
    };

    this.autorizarDictamenService.postFirmarMostrar(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            this.mostrarFirmarData = resp.datos ?? {} as MostrarFirmarResponse;
            this.cadenaOriginal = resp.datos?.cadena_original;
            this.isDictamen = false;
            this.isFirma = true;
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
        fecha_firma: AutorizarDictamenComponent.formatFecha(new Date()),
        clave_rol: 'Autorizador',
        sello: FIRMAHEX,
        fecha_fin_vigencia: AutorizarDictamenComponent.formatFecha(this.datosFirmaReales.fechaFin),
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
            this.isDocumento = false;

            // let FECHA_ACTUAL: boolean | string = false;
            if (this.dataAutorizarDictamen?.ide_sent_dictamen === 'SEDI.AC' || this.dataIniciarDictamen?.ide_sent_dictamen === 'SEDI.AC') {
               this.postOficioAutorizacion();
            } else if (this.dataAutorizarDictamen?.ide_sent_dictamen === 'SEDI.RZ' || this.dataIniciarDictamen?.ide_sent_dictamen === 'SEDI.RZ') {
              this.postOficioRechazado();
            } else if (this.dataAutorizarDictamen?.ide_sent_dictamen === 'SEDI.PA' || this.dataIniciarDictamen?.ide_sent_dictamen === 'SEDI.PA') {
                this.postOficioParcial();
            }

            // if (FECHA_ACTUAL) {
            //   this.postOficioAutorizacion();
            // } else {
            //   this.postOficioRechazado();
            // }

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
      fecha_firma: AutorizarDictamenComponent.formatFecha(new Date()),
      clave_rol: 'Autorizador',
      sello: this.sello
    }
    const PAYLOADSEND = this.serviceConfigModelo.actualizarModelo ? PAYLOAD : null;
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
      fecha_firma: AutorizarDictamenComponent.formatFecha(new Date()),
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
   * @method postOficioRechazado
   * @description Genera y obtiene el oficio de rechazo
   * 
   * Realiza una petición al servicio para generar el oficio de rechazo
   * para la solicitud actual. Si la respuesta es exitosa (código '00'), 
   * actualiza la tabla de resoluciones con el documento generado.
   * 
   * @returns {void}
 */
  postOficioParcial(): void {
    const PAYLOAD: Firma = {
      cadena_original: encodeToISO88591Hex(this.cadenaOriginal || ''),
      cert_serial_number: this.datosFirmaReales.certSerialNumber,
      clave_usuario: this.datosFirmaReales.rfc,
      fecha_firma: AutorizarDictamenComponent.formatFecha(new Date()),
      clave_rol: 'Autorizador',
      sello: this.sello
    } 
    const PAYLOADSEND = this.serviceConfigModelo.actualizarModelo ? PAYLOAD : null;
    this.autorizarDictamenService.postOficioParcial(this.tramite, Number(this.guardarDatos.id_solicitud), PAYLOADSEND)
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
    if (this.observacionForm.invalid) {
      this.observacionForm.markAllAsTouched();
      return;
    }
    const PAYLOAD: ObservacionRequest = {
      id_accion: this.guardarDatos.action_id,
      observacion: this.observacionForm.get('observacion')?.value,
      cve_usuario: this.guardarDatos.current_user,
    };
    this.autorizarDictamenService.postObservacionGuardar(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === "00" && resp.datos) {
            this.getRegresarafterObservacion();
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
  getRegresarafterObservacion(): void {
    this.isObservacion = false;
    this.isDictamen = true;
    this.isFirma = false;
    this.isDocumento = false;
    this.router.navigate(['bandeja-de-tareas-pendientes'], {
      queryParams: { labelExitoso: true }
    });
  }

   getRegresar(): void {
    this.isObservacion = false;
    this.isDictamen = true;
    this.isFirma = false;
    this.isDocumento = false;
  }
  /**
   * @method getSentidosDisponibles
   * @description Obtiene los sentidos disponibles para el dictamen del trámite 130118.
   * Realiza una petición al servicio `GuardarDictamenService` para recuperar los sentidos disponibles.
   */
  getSentidosDisponibles(): void {
    this.guardarService.getSentidosDisponibles(this.tramite.toString(), this.guardarDatos.folioTramite).subscribe({
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
        }
      }
    });
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

  iniciarDictamenAutorizar26051(): void {
    console.log('authorizar iniciarDictamenAutorizar26051');
    const PAYLOAD: IniciarAutorizarDictamen = {
      id_accion: this.guardarDatos.action_id,
      cve_usuario: this.guardarDatos.current_user,
    };

    this.autorizarDictamenService.postIniciarDictamen(this.tramite, this.guardarDatos.folioTramite, PAYLOAD).subscribe({
      next: (resp) => {
        
        if (resp.codigo === CodigoRespuesta.EXITO) {
          console.log('resp iniciarDictamenAutorizar26051',resp);
          this.dataIniciarDictamen = resp.datos ?? {} as IniciarAutorizacionResponse;
           this.dataIniciarDictamen.ide_sent_dictamen=resp.datos?.ide_sent_dictamen ?? 'SEDI.PA';
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
 * @method iniciarDictamenAutorizar2617
 * @description Inicia el dictamen del trámite .
 * Llama al servicio `IniciarService` para iniciar el dictamen con un número de folio predefinido.
 */
iniciarDictamenAutorizar2606(): void {
  console.log('authorizar iniciarDictamenAutorizar2617');
      const PAYLOAD: IniciarAutorizarDictamen = {
        id_accion: this.guardarDatos.action_id,
        cve_usuario: this.guardarDatos.current_user,
      };
  
      this.autorizarDictamenService.postIniciarDictamen(this.tramite, this.guardarDatos.folioTramite, PAYLOAD).subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            console.log('resp iniciarDictamenAutorizar2617',resp);
            this.dataIniciarDictamen = resp.datos ?? {} as IniciarAutorizacionResponse;
            this.dataIniciarDictamen.justificacion = resp.datos?.justificacion ?? '';
            
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
 * @method iniciarDictamenAutorizar2617
 * @description Inicia el dictamen del trámite .
 * Llama al servicio `IniciarService` para iniciar el dictamen con un número de folio predefinido.
 */
iniciarDictamenAutorizar2617(): void {
console.log('authorizar iniciarDictamenAutorizar2617');
    const PAYLOAD: IniciarAutorizarDictamen = {
      id_accion: this.guardarDatos.action_id,
      cve_usuario: this.guardarDatos.current_user,
    };

    this.autorizarDictamenService.postIniciarDictamen(this.tramite, this.guardarDatos.folioTramite, PAYLOAD).subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO) {
          console.log('resp iniciarDictamenAutorizar2617',resp);
          this.dataIniciarDictamen = resp.datos ?? {} as IniciarAutorizacionResponse;
          this.dataIniciarDictamen.justificacion = resp.datos?.justificacion ?? '';
          
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
   * @method iniciarDictamen
   * @description Inicia el dictamen del trámite 130118.
   * 
   * Llama al servicio `IniciarService` para iniciar el dictamen con un número de folio predefinido.
   * Muestra un mensaje en la consola si el dictamen se inicia correctamente o si ocurre un error.
   * 
   * @returns {void}
   */
  iniciarDictamenAutorizar(): void {

    const PAYLOAD: IniciarAutorizarDictamen = {
      id_accion: this.guardarDatos.action_id,
      cve_usuario: this.guardarDatos.current_user,
    };

    this.autorizarDictamenService.postIniciarDictamen(this.tramite, this.guardarDatos.folioTramite, PAYLOAD).subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO) {
          this.dataAutorizarDictamen = resp.datos ?? {} as IniciarAutorizacionResponse;
          
          if(this.dataAutorizarDictamen.ide_sent_dictamen==='SEDI.RZ')
           {
            this.motivoLabel='Motivo de rechazo';
            this.motivoOpcions=this.motivoRechazoOpcions;
            this.justificacionNegativaLabel='Justificación negativa del dictamen';
           }
           else if(this.dataAutorizarDictamen.ide_sent_dictamen==='SEDI.PA')
           {
             this.motivoLabel='Motivo del oficio';
             this.motivoOpcions=this.motivoPracialOptcions;
             this.justificacionNegativaLabel='Justificación del oficio del dictamen';
           }
          this.FormTramite.patchValue({
              sentidoDelDictamen: this.dataAutorizarDictamen.ide_sent_dictamen,
              justificacionNegativa:   this.dataAutorizarDictamen.justificacionNegativa,
              descripcionUsoAutorizado:  this.dataAutorizarDictamen.descripcionUsoAutorizado,
              opinion:  this.dataAutorizarDictamen.opinion,
              justificacion:  this.dataAutorizarDictamen.justificacion,
              plazoVigencia:  this.dataAutorizarDictamen.plazoVigencia?.toString() || '1',
              siglasDictaminador:  this.dataAutorizarDictamen.siglasDictaminador,
              numeroGenerico1:  this.dataAutorizarDictamen.numeroGenerico1,
              idMotivoTipoTramite: this.dataAutorizarDictamen.idMotivoTipoTramites[0] ?? null,
              aceptada:this.dataAutorizarDictamen.aceptada,
              mercancia_0_aceptada: this.dataAutorizarDictamen.ide_sent_dictamen === 'SEDI.PA' ? (this.dataAutorizarDictamen.aceptada === true ? 'Aceptado' : 'Rechazado' ) : null,
              fechaFinVigencia: AutorizarDictamenComponent.formatearFecha(this.dataAutorizarDictamen.fecha_fin_vigencia)
          });
          this.evaluarObservacionesDictamen = this.dataAutorizarDictamen.historial_observaciones || [];
        }
                
        this.mostrarFecha = this.FormTramite.get('plazoVigencia')?.value === 'PZVI.FFV';  
          

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
   * @method vistaPreliminarAceptado
   * @description Obtiene y abre la vista preliminar del documento aceptado en una nueva pestaña.
   *
   * Realiza una petición al servicio `VistaPreliminarService` para obtener la URL de la vista preliminar
   * del documento aceptado para el trámite y folio actual. Si la respuesta es exitosa (código '00'),
   * abre la vista preliminar en una nueva pestaña del navegador. Si ocurre un error, muestra una notificación.
   *
   * @returns {void}
   */
  vistaPreliminarAceptado(): void {
    this.vistaPreliminarService.getVistaPreliminarAceptado(this.tramite, this.guardarDatos.folioTramite).subscribe({
      next: (resp) => {
         if (resp.codigo === CodigoRespuesta.EXITO && resp.datos?.contenido) {
            AutorizarDictamenComponent.manejarPdf(
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
   * @method vistaPreliminarRechazado
   * @description Obtiene y abre la vista preliminar del documento rechazado en una nueva pestaña.
   *
   * Realiza una petición al servicio `VistaPreliminarService` para obtener la URL de la vista preliminar
   * del documento rechazado para el trámite y folio actual. Si la respuesta es exitosa (código '00'),
   * abre la vista preliminar en una nueva pestaña del navegador. Si ocurre un error, muestra una notificación.
   *
   * @returns {void}
   */
  vistaPreliminarRechazado(): void {
    this.vistaPreliminarService.getVistaPreliminarRechazado(this.tramite, this.guardarDatos.folioTramite).subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO && resp.datos?.contenido) {
            AutorizarDictamenComponent.manejarPdf(
              resp.datos.contenido,
              resp.datos.nombre_archivo,
              'descargar'
            );
        }
      },
      error: (err) => {
        const MENSAJE = err?.error?.error || 'Error al obtener la vista preliminar de rechazado';
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
          AutorizarDictamenComponent.manejarPdf(
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
  static manejarPdf(base64: string, nombreArchivo: string, accion: 'abrir' | 'descargar'): void {
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
      LINK.download = nombreArchivo.endsWith('.pdf') ? nombreArchivo : `${nombreArchivo}.pdf`;
      LINK.click();
      URL.revokeObjectURL(URLCODIFICADA);
    }
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
