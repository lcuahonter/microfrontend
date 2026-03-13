/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccuseComponentes, ListaComponentes, Tabulaciones } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, ConsultaCatalogoService, ConsultaioState, ConsultaioStore, CveEnumeracionConfig, EncabezadoRequerimientoComponent, FECHA_DE_INICIO, FirmaElectronicaComponent, Notificacion, TablaDinamicaComponent, TituloComponent, base64ToHex, encodeToISO88591Hex } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, Type } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

import { CategoriaMensaje,ConsultaioQuery,NotificacionesComponent} from '@ng-mf/data-access-user';
import { CodigoRespuesta } from '../core/enum/cofepris-core-enum';
import { DictamenesResponse } from '@libs/shared/data-access-user/src/core/models/shared/dictamenes-response.model';
import { DocumentoSolicitud } from '@libs/shared/data-access-user/src/core/models/shared/consulta-documentos-response.model';
import { LISTA_TRIMITES } from '../shared/constantes/lista-trimites.enums';
import { Router } from '@angular/router';
import { TareasSolicitud } from "@libs/shared/data-access-user/src/core/models/shared/consulta-tareas-response.model";

import { ReviewersTabsComponent } from '@libs/shared/data-access-user/src/tramites/components/reviewers-tabs/reviewers-tabs.component';

import { TabsResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-tabs-response.model';
import { TabsSolicitudServiceTsService } from '../core/services/evaluar-tramite/tabs-solicitud.service.ts.service';

import { AcusesResolucionResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-acuses-response.model';
import { EnvioDigitalResponse } from '@libs/shared/data-access-user/src/core/models/shared/envio-digital-response.model';

import { BodyTablaResolucion, HeaderTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';
import { ModeloConfig, ServiceConfig } from '../shared/models/service-config.model';
import { AcuseDetalleService } from '@libs/shared/data-access-user/src/core/services/shared/detalleAcuse.service';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CONSULTA_RESOLUCIONES } from '@libs/shared/data-access-user/src/core/enums/consulta-generica.enum';
import { EvaluarSolicitudService } from '../core/services/evaluar-tramite/evaluar-solicitud.service';

import { IniciarVerificarDictamen } from '../core/models/verificar-dictamen/request/iniciar-verificar-dictamen.model';

import { FirmaVerificarDictamenRequest, IniciarVerificarResponse } from '../core/models/verificar-dictamen/iniciar-verificar-dictamen-response.model';
import { MostrarFirmaRequest } from '../core/models/autorizar-requerimiento/request/mostrar-firmar-request.model';
import { MostrarFirmarResponse } from '../core/models/autorizar-requerimiento/response/mostrar-firmar-response.model';
import { ObservacionRequest } from '../core/models/autorizar-requerimiento/request/observacion-guardar-request.model';
import { OpinionResponse } from '@libs/shared/data-access-user/src/core/models/shared/opinion-response.model';
import { RequerimientosResponse } from '@libs/shared/data-access-user/src/core/models/shared/requerimientos-response.model';
import { TramiteConfig } from '../shared/models/tramite-config.model';
import { TramiteConfigService } from '../shared/services/tramiteConfig.service';
import { VerificarDictamenService } from '../core/services/verificar-dictamen/verificar-dictamen.service';

import { HistorialObservacione } from '../core/models/evaluar/response/evaluar-estado-evaluacion-response.model';

import { GuardarDictamenService } from '../core/services/evaluar-tramite/guardar-dictamen.service';
import { SentidosDisponiblesResponse } from '@libs/shared/data-access-user/src/core/models/shared/sentidos-disponibles.model';
import { VistaPreliminarService } from '../core/services/evaluar-tramite/vista-preliminar.service';

import { SERIES26050, SERIES26051, SERIES2609 } from '@libs/shared/data-access-user/src/core/enums/cofepris-core-enum';
import { DictamenForm } from '../core/models/autorizar-dictamen/dictamen-form.model';
import { GenerarDictamen260501Component } from '../shared/components/generar-dictamen-260501/generar-dictamen.component';
import { GenerarDictamen26050Config } from '../shared/models/generar-dictamen-26050-config.model';
import { GenerarDictamen260514Component } from "../shared/components/generar-dictamen-260514/generar-dictamen.component";
import {GenerarDictamenComponent2606} from '../shared/components/generar-dictamen-2606/generar-dictamen.component';

import { GenerarDictamen2604Component } from '../shared/components/generar-dictamen-2604/generar-dictamen-2604.component';

import { GenerarDictamen2601Component } from '../shared/components/generar-dictamen-2601/generar-dictamen-2601.component';
import { GenerarDictamen26030Component } from '../shared/components/generar-dictamen-26030/generar-dictamen-26030.component';
/**
 * @component
 * @name VerificarDictamenComponent
 * @description Componente para la verificación y gestión de dictámenes en el flujo de trámites COFEPRIS.
 * Permite consultar, firmar, observar y gestionar dictámenes, así como interactuar con los catálogos y servicios relacionados al trámite.
 * Incluye integración con componentes de firma electrónica, notificaciones, tablas dinámicas y generación de dictamenes específicos por serie.
 *
 * @selector app-verificar-dictamen
 * @standalone true
 * @imports
 *  - CommonModule
 *  - ReactiveFormsModule
 *  - NotificacionesComponent
 *  - CatalogoSelectComponent
 *  - ReviewersTabsComponent
 *  - FirmaElectronicaComponent
 *  - EncabezadoRequerimientoComponent
 *  - TablaDinamicaComponent
 *  - TituloComponent
 *  - GenerarDictamen260514Component
 *  - GenerarDictamen260501Component
 *  - GenerarDictamenComponent2606
 *  - GenerarDictamen2604Component
 *  - GenerarDictamen2601Component
 *  - GenerarDictamen26030Component
 * @templateUrl ./verificar-dictamen.component.html
 * @styleUrl ./verificar-dictamen.component.scss
 */
@Component({
  selector: 'app-verificar-dictamen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotificacionesComponent,
    CatalogoSelectComponent,
    ReviewersTabsComponent,
    FirmaElectronicaComponent,
    EncabezadoRequerimientoComponent,
    TablaDinamicaComponent,
    TituloComponent,
    GenerarDictamen260514Component,
    GenerarDictamen260501Component,
    GenerarDictamenComponent2606,
    GenerarDictamen2604Component,
    GenerarDictamen2601Component,
    GenerarDictamen26030Component


],
  templateUrl: './verificar-dictamen.component.html',
  styleUrl: './verificar-dictamen.component.scss',
})
export class VerificarDictamenComponent implements OnInit, OnDestroy {
  trimateSeries26030: number[] = [260301, 260302, 260303, 260304];

    public plazoOpcions: Catalogo[] = [];

    dataIniciarDictamen!: IniciarVerificarResponse;
  public autorizadorOpcions:Catalogo[]=[];
  mostrarFecha:boolean=false;

  /** 
   * Subject para destruir las suscripciones.
   */
  private destruirSuscripcion$: Subject<void> = new Subject();
  /** 
   * Formulario de tramite 
   * 
   */
  documentosSolicitud: DocumentoSolicitud[] = [];
  isDocumento: boolean = false;

   /**
     * Formulario reactivo para la solicitud de observacion dictamen.
     * @type {FormGroup}
    */
  public observacionForm!: FormGroup;
  public FormTramite!: FormGroup;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de objetos de tipo Catalogo que representa las opciones disponibles
   * para asignar un autorizador en el componente. Se utiliza para poblar el
   * combo o selector de autorizadores en la interfaz de usuario.
   */
  asignarAutorizadorCombo: Catalogo[] = [];
  yaCargoDocumentos = false;
  yaCargoTareas = false;
  yaCargoAcuses = false;
  yaCargoDictamenes = false;
  yaCargoRequerimientos = false;
  yaCargoEnvioDigital = false;
  yaCargoOpinion = false;
  envioDigital!: EnvioDigitalResponse;
  dictamenesSolicitud: DictamenesResponse[] = [];
  opinion: OpinionResponse[] = [];
  /**
   * @property {number} tramite
   * @description Identificador del trámite seleccionado.
   */
  nuevaNotificacion!: Notificacion;
  tramite: number = 0;
  tabs!: TabsResponse;
  acusesResolucion!: AcusesResolucionResponse;
  tareasSolicitud: TareasSolicitud[] = [];
  requerimientosSolicitud: RequerimientosResponse[] = [];

  motivoLabel: string = ''
  motivoOpcions: Catalogo[] = [];
  motivoPracialOptcions: Catalogo[] = [];
  motivoRechazoOpcions: Catalogo[] = [];
  series_26051: number[] = SERIES26051;

  /** @property {number[]} series_26090
   * @description Arreglo que contiene los identificadores de las series correspondientes al código 2609.
   * Estos valores se utilizan para representar diferentes categorías o tipos dentro del sistema COFEPRIS.
   */
  series_26090: number[] = SERIES2609;
    /** 
     * @property {GuardarDictamenRequest} guardarDictamenRequest
     * @description Objeto que contiene los datos necesarios para guardar un dictamen.
     */
    opcionesSentidosDispobles: SentidosDisponiblesResponse[] = [];
  /**
   * @property {Type<unknown>} viewChild
   * @description Referencia dinámica al componente hijo que se carga según la pestaña seleccionada.
   */
  viewChild!: Type<unknown>;
  /**
   * @property {AccuseComponentes | undefined} slectTramite
   * @description Objeto que representa el trámite seleccionado actualmente.
   */
  slectTramite!: AccuseComponentes | undefined;

  /**
   * Esta variable se utiliza para almacenar el estado de la consulta.
   */
  // public consultaState!:ConsultaioState;

  /**
   * @property {ConsultaioState} guardarDatos
   * @description Estado actual del trámite consultado.
   */
  guardarDatos!: ConsultaioState;

  /**
   * @property {AccuseComponentes[] } listaTrimites
   * @description Lista de trámites disponibles para evaluación, obtenida de la constante LISTA_TRIMITES.
   */
  listaTrimites = LISTA_TRIMITES;

  /**
   * Indica si el panel de verificación y firma está visible.
   */
  panelVerFirmar: boolean = false;

  /**
   * Cadena que almacena el valor original para verificación.
   */
  cadenaOriginal: string = '';

  /**
   * @property {IniciarAutorizacionResponse} dataVerificarDictamen
   * @description Datos obtenidos al iniciar el dictamen de autorización.
   */
  dataVerificarDictamen!: IniciarVerificarResponse;

    /** Response del servicio de firmar mostrar */
  mostrarFirmarData!: MostrarFirmarResponse;

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
   * @property {string} firmaOficioCadena
   * @description Cadena original del oficio de autorización o rechazo que se va a firmar.
   */
  firmaOficioCadena!: string;

   /**
   * @property {boolean} isObservacion
   * @description Indica si se debe la observacion.
  */
  isObservacion: boolean = false;

    /**
   * @property {string} sello
   * @description Sello digital del documento.
   */
  sello!: string;

  
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
      * Indica si se debe mostrar un input de justificación.
      * En unos tramites se muestra un input de justificacion.
      */
     inputSentidos!: boolean;

  /**
   * @property {string} resultadoEvaluacion
   * @description Almacena el resultado de la evaluación del dictamen.
   */
  public resultadoEvaluacion: string = '';
  /**
  * @property {ModeloConfig} serviceConfigModelo
  * @description Configuración de modelo específicos del trámite, obtenida del servicio TramiteConfigService.
  */
  serviceConfigModelo!: ModeloConfig;

  /** Configuración específica para la generación del dictamen del trámite 26050. */
  generarDictamen26050Config!: GenerarDictamen26050Config;
      /**
       * Datos de la tabla de resoluciones.
       * Contiene los registros que se mostrarán en la tabla de resoluciones.
       * @type {BodyTablaResolucion[]}
      */
      datosTablaResolucion: BodyTablaResolucion[] = [];
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
   * Encabezado de la tabla de resoluciones.
   * Contiene las columnas que se mostrarán en la tabla de resoluciones.
   * @type {HeaderTablaResolucion[]}
  */
  readonly encabezadoTablaResolucion: HeaderTablaResolucion[] = CONSULTA_RESOLUCIONES.encabezadoTablaResolucion;
  
    catalogoParameter!:CveEnumeracionConfig;
 /**
  * @property {string} justificacionNegativaLabel
  **/    
  justificacionNegativaLabel:string=''

  constructor(
    private fb: FormBuilder, 
     private consultaioStore: ConsultaioStore,
    private router: Router, 
    private tabsSolicitudServiceTsService: TabsSolicitudServiceTsService,
    private verificarDictamenService: VerificarDictamenService,
    private guardarService: GuardarDictamenService,
    private tramiteConfigService: TramiteConfigService,
    private consultaioQuery: ConsultaioQuery,
    private acuseDetalleService: AcuseDetalleService,
    private evaluarSolicitudService: EvaluarSolicitudService,
    private consultaCatalogoService: ConsultaCatalogoService,
    private vistaPreliminarService: VistaPreliminarService
  ) 
  {
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.guardarDatos = seccionState;
        this.tramite = Number (seccionState.procedureId);
        if (this.tramite) {
            this.selectTramite(this.tramite);
        }
      })
    ).subscribe()

    this.tramite = Number(this.guardarDatos?.procedureId);
    this.consultaioStore.solicitanteConsultaio({
          folioDelTramite: this.guardarDatos?.folioTramite,
          fechaDeInicio: FECHA_DE_INICIO,
          estadoDelTramite: this.guardarDatos?.estadoDeTramite,
          tipoDeTramite: this.guardarDatos?.tipoDeTramite
        });
    this.serviceConfigModelo = this.tramiteConfigService.getModeloConfig(this.tramite);
    this.generarDictamen26050Config = this.tramiteConfigService.getGenerarDictamen26050Config(this.tramite);
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario de tramite y consulta los datos generales del tramite.
   */
  ngOnInit(): void {
    this.observacionForm = this.fb.group({
      observacion: ['',[Validators.required,VerificarDictamenComponent.noSoloEspacios, Validators.maxLength(2000)]],
    });
    if(this.tramite.toString().startsWith('2602') || this.series_26090.includes(this.tramite)) {
      this.inicializarCatalogoOpciens();
    }
    this.getSentidosDisponibles();
    this.observacionForm = this.fb.group({
      observacion: ['',[Validators.required,VerificarDictamenComponent.noSoloEspacios, Validators.maxLength(2000)]],
    });
    if(this.tramite.toString().startsWith('2602') || this.tramite.toString().startsWith('2604') || this.series_26090.includes(this.tramite) || this.tramite.toString().startsWith('26010')){
    this.inicializaFormTramite();
    this.iniciarDictamenVerificar();
    }
    if(SERIES26051.includes(this.tramite) || SERIES26050.includes(this.tramite)|| this.trimateSeries26030.includes(this.tramite)){
      this.iniciarDictamenVerificar26051();
    }
    if (this.tramite) {
      this.selectTramite(this.tramite);
    } else {
      this.router.navigate([`/${this.guardarDatos?.department.toLowerCase()}/seleccion-tramite`]);
    }
      this.getTabs();
  }
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
 * Inicializa las opciones de los catálogos utilizados en el componente.
 */
  /**
   * @method inicializarCatalogoOpciens
   * @description Inicializa los catálogos necesarios para el formulario de verificación de dictamen, obteniendo las opciones de plazo, autorizadores y motivos desde los servicios de catálogo según el trámite actual.
   * Llama a los servicios de catálogo y asigna los resultados a las propiedades correspondientes del componente.
   * @returns {void}
   */
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
     * @method iniciarDictamen
     * @description Inicia el dictamen del trámite 130118.
     * 
     * Llama al servicio `IniciarService` para iniciar el dictamen con un número de folio predefinido.
     * Muestra un mensaje en la consola si el dictamen se inicia correctamente o si ocurre un error.
     * 
     * @returns {void}
     */
    iniciarDictamenVerificar(): void {
      const PAYLOAD: IniciarVerificarDictamen = {
        id_accion: this.guardarDatos.action_id,
        cve_usuario: this.guardarDatos.current_user,
      };
  
      this.verificarDictamenService.postIniciarDictamen(this.tramite, this.guardarDatos.folioTramite, PAYLOAD).subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            this.dataVerificarDictamen = resp.datos ?? {} as IniciarVerificarResponse;
            this.FormTramite.patchValue({
              sentidoDelDictamen: this.dataVerificarDictamen.ide_sent_dictamen,
              justificacionNegativa:   this.dataVerificarDictamen.justificacion_negativa,
              descripcionUsoAutorizado:  this.dataVerificarDictamen.descripcion_uso_autorizado,
              opinion:  this.dataVerificarDictamen.opinion || this.dataVerificarDictamen.tipoAnalisis,
              justificacion:  this.dataVerificarDictamen.justificacion,
              plazoVigencia:  this.dataVerificarDictamen.plazo_vigencia?.toString() || '1',
              siglasDictaminador:  this.dataVerificarDictamen.siglas_dictaminador,
              numeroGenerico1:  this.dataVerificarDictamen.numero_generico_1?.toString() || '1',
              idMotivoTipoTramite: this.dataVerificarDictamen?.id_motivo_tipo_tramites?.[0] ?? this.dataVerificarDictamen?.idMotivoTipoTramites?.[0] ?? null,
              aceptada:this.dataVerificarDictamen.aceptada,
              mercancia_0_aceptada: this.dataVerificarDictamen.ide_sent_dictamen === 'SEDI.PA' ? (this.dataVerificarDictamen.aceptada === true ? 'Aceptado' : 'Rechazado' ) : null,
              fechaFinVigencia: VerificarDictamenComponent.formatearFecha(this.dataVerificarDictamen.fecha_fin_vigencia)
          });

          this.evaluarObservacionesDictamen=this.dataVerificarDictamen.historial_observaciones || [];
          }

          this.mostrarFecha = this.FormTramite.get('plazoVigencia')?.value === 'PZVI.FFV';  
          if(this.FormTramite.get('sentidoDelDictamen')?.value==='SEDI.RZ')
           {
            this.motivoLabel='Motivo de rechazo';
            this.motivoOpcions=this.motivoRechazoOpcions;
            this.justificacionNegativaLabel='Justificación negativa del dictamen';
           }
           else if(this.FormTramite.get('sentidoDelDictamen')?.value==='SEDI.PA')
           {
             this.motivoLabel='Motivo del oficio';
             this.motivoOpcions=this.motivoPracialOptcions;
             this.justificacionNegativaLabel='Justificación del oficio del dictamen';
           }
  
            /**
             * Establece el valor del campo 'AsignarAutorizador' en el formulario.
             */ 
            // const ASIGNA_AUT_CONTROL = this.FormTramite.get('numeroGenerico1');
            // if (ASIGNA_AUT_CONTROL) {
            //   ASIGNA_AUT_CONTROL.setValue('1');
            // }
  
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

     iniciarDictamenVerificar26051(): void {
      const PAYLOAD: IniciarVerificarDictamen = {
        id_accion: this.guardarDatos.action_id,
        cve_usuario: this.guardarDatos.current_user,
      };
  
      this.verificarDictamenService.postIniciarDictamen(this.tramite, this.guardarDatos.folioTramite, PAYLOAD).subscribe({
        next: (resp) => {
          
          if (resp.codigo === CodigoRespuesta.EXITO) {
            const RESP = resp.datos ?? {} as IniciarVerificarResponse;
           this.dataIniciarDictamen= { 
            ...RESP,
            ide_sent_dictamen: RESP.ide_sent_dictamen ?? 'SEDI.PA',
            descripcionObjetoimportacion: RESP.descripcion_objetoimportacion ?? RESP.descripcionObjetoimportacion ?? '',
            idRestriccionTipoTramites: RESP.id_restriccion_tipo_tramites ?? RESP.idRestriccionTipoTramites ?? [],
            descripcionDetalladaMercancia: RESP.descripcion_detallada_mercancia ?? RESP.descripcionDetalladaMercancia ?? '',
            idClasificacionToxicologicaTipoTramite: RESP.idClasificacionToxicologicaTipoTramite ?? '',
            descripcionUsoAutorizado: RESP.descripcion_uso_autorizado ?? RESP.descripcionUsoAutorizado ?? '',
            justificacion: RESP.justificacion ?? '',
            idMotivoTipoTramites: RESP.id_motivo_tipo_tramites ?? RESP.idMotivoTipoTramites ?? [],
            siglasDictaminador: RESP.siglas_dictaminador ?? RESP.siglasDictaminador ?? '',
            numeroGenerico1: RESP.numero_generico_1 ?? RESP.numeroGenerico1 ?? '',
           }
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
            VerificarDictamenComponent.manejarPdf(
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
            VerificarDictamenComponent.manejarPdf(
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
   * Inicializa el formulario de tramite
   * @returns {void}
   */
  inicializaFormTramite(): void {
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
      aceptada: [{ value: false, disabled: true }],
      mercancia_0_aceptada: [{ value: 'Rechazada', disabled: true }]
    });
  }

  /**
   * @method guardar
   * @description Emite un evento al hacer clic en el botón guardar.
   * @returns {void}
   */
  // observacion(): void {
  //   this.router.navigate([this.guardarDatos.department+'/detalle-v-dictamen']);
  // }

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

      if(this.observacionForm.invalid){
        this.observacionForm.markAllAsTouched();
        return;
      }
      const PAYLOAD: ObservacionRequest = {
        id_accion: this.guardarDatos.action_id,
        observacion: this.observacionForm.get('observacion')?.value,
        cve_usuario: this.guardarDatos.current_user,
      };
      this.verificarDictamenService.postObservacionGuardar(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
        .subscribe({
          next: (resp) => {
            if (resp.codigo === "00" && resp.datos) {
              this.getRegresarAfterObservacion();
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
          error: (error:any) => {
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
  * Se ejecuta al destruir el componente.
  * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
  */
  ngOnDestroy(): void {
    this.destruirSuscripcion$.next();
    this.destruirSuscripcion$.complete();
  }


    observacion(): void {
    this.router.navigate([this.guardarDatos.department+'/detalle-v-dictamen']);
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
            VerificarDictamenComponent.manejarPdf(
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
   * Muestra el panel de verificación para firmar el dictamen.
   */
  firmar(): void {
    this.panelVerFirmar = true;
  }


  
  
    /**
     * * @method firmarMostrarVerificarDictamen
     * * @description Prepara y envía una solicitud para mostrar la interfaz de firma electrónica
     * * para verificar un dictamen.
     */
    firmarMostrarVerificarDictamen(): void {
  
      const PAYLOAD: MostrarFirmaRequest = {
        id_accion: this.guardarDatos.action_id,
        cve_usuario: this.guardarDatos.current_user,
        id_dictamen: this.dataVerificarDictamen?.id_dictamen || this.dataIniciarDictamen?.id_dictamen,
        usuario_perfil: {
          rfc: this.guardarDatos.current_user,
          nombre: 'PRUEBA',
          apellido_paterno: 'PRUEBA',
          apellido_materno: 'PRUEBA'
        },
      };
  
      this.verificarDictamenService.postFirmarMostrar(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
        .subscribe({
          next: (resp) => {
            if (resp.codigo === CodigoRespuesta.EXITO) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.mostrarFirmarData = resp.datos ?? {} as MostrarFirmarResponse;
              this.cadenaOriginal = resp.datos?.cadena_original ?? '';
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
   * @method getRegresar
   * @description Regresa a la bandeja de tareas pendientes
   * 
   * Desactiva el modo de observación, reactiva el modo de dictamen
   * y navega de regreso a la bandeja de tareas pendientes.
   * 
   * @returns {void}
   */
  getRegresarAfterObservacion(): void {
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
    this.firmaVerificarDictamen(datos.firma);
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


/**
   * @method getSentidosDisponibles
   * @description Obtiene los sentidos disponibles para el dictamen del trámite 130118.
   * Realiza una petición al servicio `GuardarDictamenService` para recuperar los sentidos disponibles.
   */
  getSentidosDisponibles(): void {
    this.verificarDictamenService.getSentidosDisponibles(this.tramite.toString()).subscribe({
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
    firmaVerificarDictamen(firma: string): void {
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
  
      const PAYLOAD: FirmaVerificarDictamenRequest = {
        id_accion: this.guardarDatos.action_id,
        firma: {
          id_solicitud: Number(this.guardarDatos.id_solicitud),
          cadena_original: CADENAHEX,
          cert_serial_number: this.datosFirmaReales.certSerialNumber,
          clave_usuario: this.datosFirmaReales.rfc,
          fecha_firma: VerificarDictamenComponent.formatFecha(new Date()),
          clave_rol: 'Dictaminador',
          sello: FIRMAHEX,
          fecha_fin_vigencia: VerificarDictamenComponent.formatFecha(this.datosFirmaReales.fechaFin),
        },
         id_dictamen: this.dataVerificarDictamen?.id_dictamen || this.dataIniciarDictamen?.id_dictamen,
      };
  
  
      this.verificarDictamenService.firmarVerificar(this.tramite, NUMFOLIO, PAYLOAD)
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

    
}