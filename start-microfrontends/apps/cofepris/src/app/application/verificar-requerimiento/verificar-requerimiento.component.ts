/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AccuseComponentes,
  ListaComponentes,
  Tabulaciones,
} from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import {
  Catalogo,
  ConfiguracionColumna,
  ConsultaCatalogoService,
  ConsultaioState,
  ConsultaioStore,
  CveEnumeracionConfig,
  EncabezadoRequerimientoComponent,
  FECHA_DE_INICIO,
  FirmaElectronicaComponent,
  Notificacion,
  SERIES2609,
  ValidacionesFormularioService,
  base64ToHex,
  encodeToISO88591Hex,
} from '@libs/shared/data-access-user/src';
import {
  CatalogoTipoDocumento,
  DocumentosEspecificosResponse,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  CategoriaMensaje,
  ConsultaioQuery,
  NotificacionesComponent,
} from '@ng-mf/data-access-user';

import {
  BodyTablaResolucion,
  HeaderTablaResolucion,
} from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';
import { AcusesResolucionResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-acuses-response.model';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CONSULTA_RESOLUCIONES } from '@libs/shared/data-access-user/src/core/enums/consulta-generica.enum';
import { DocumentoSolicitud } from '@libs/shared/data-access-user/src/core/models/shared/consulta-documentos-response.model';
import { EnvioDigitalResponse } from '@libs/shared/data-access-user/src/core/models/shared/envio-digital-response.model';
import { IniciarRequerimientoResponse } from '@libs/shared/data-access-user/src/core/models/shared/Iniciar-requerimiento-response.model';
import { OpinionResponse } from '@libs/shared/data-access-user/src/core/models/shared/opinion-response.model';
import { RequerimientosResponse } from '@libs/shared/data-access-user/src/core/models/shared/requerimientos-response.model';
import { TabsResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-tabs-response.model';
import { TareasSolicitud } from '@libs/shared/data-access-user/src/core/models/shared/consulta-tareas-response.model';


import { ReviewersTabsComponent } from '@libs/shared/data-access-user/src/tramites/components/reviewers-tabs/reviewers-tabs.component';
import { SolicitarDocumentosEvaluacionComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitar-documentos-evaluacion/solicitar-documentos-evaluacion.component';

import { CodigoRespuesta } from '../core/enum/cofepris-core-enum';



import { FirmaVerificarRequerimientoRequest, RequerimientoMostrarFirmarRequest } from '../core/models/verificar-requerimiento/request/requerimiento-mostrar-firmar-request.model';
import { DocumentosEspecificosRequest } from '../core/models/atender-requerimiento/request/documentos-especificos.model';
import { HistorialObservacione } from '../core/models/evaluar/response/evaluar-estado-evaluacion-response.model';
import { IniciarRequerimientoRequest } from '../core/models/evaluar/request/iniciar-requerimiento-request.model';
import { ObservacionRequest } from '../core/models/autorizar-requerimiento/request/observacion-guardar-request.model';
import { RequerimientoMostrarFirmarResponse } from '../core/models/verificar-requerimiento/response/requerimiento-mostrar-firmar-response.model';

import { AcuseDetalleService } from '@libs/shared/data-access-user/src/core/services/shared/detalleAcuse.service';
import { EvaluarSolicitudService } from '../core/services/evaluar-tramite/evaluar-solicitud.service';
import { GuardarDictamenService } from '../core/services/evaluar-tramite/guardar-dictamen.service';
import { IniciarService } from '../core/services/evaluar-tramite/iniciar.service';
import { TabsSolicitudServiceTsService } from '../core/services/evaluar-tramite/tabs-solicitud.service.ts.service';
import { TramiteConfigService } from '../shared/services/tramiteConfig.service';
import { VerificarRequerimientoService } from '../core/services/verificar-requerimiento/verificar-requerimiento.service';

import {
  ModeloConfig,
  ServiceConfig,
} from '../shared/models/service-config.model';
import { CapturarRequerimientoComponent } from '../shared/components/capturar-requerimiento/capturar-requerimiento.component';
import { DictamenesResponse } from '@libs/shared/data-access-user/src/core/models/shared/dictamenes-response.model';
import { GenerarRequerimientoForm } from '../core/models/evaluar/request/generar-requerimiento-form.model';
import { LISTA_TRIMITES } from '../shared/constantes/lista-trimites.enums';
import { RequerimientoConfig } from '../shared/models/requerimiento-config.model';
import { TramiteConfig } from '../shared/models/tramite-config.model';

import { RequerimientosStore } from '../estados/store/requerimientos.store';
import { VistaPreliminarService } from '../core/services/evaluar-tramite/vista-preliminar.service';
@Component({
  selector: 'app-verificar-requerimiento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotificacionesComponent,
    ReviewersTabsComponent,
    FirmaElectronicaComponent,
    EncabezadoRequerimientoComponent,
    CapturarRequerimientoComponent,
    SolicitarDocumentosEvaluacionComponent
  ],
  templateUrl: './verificar-requerimiento.component.html',
  styleUrl: './verificar-requerimiento.component.scss',
})
export class VerificarRequerimientoComponent implements OnInit, OnDestroy {

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
   * @property {number} tramite
   * @description Identificador del trámite seleccionado.
   */
  tramite: number = 0;

  /**
   * @property {Type<unknown>} viewChild
   * @description Referencia dinámica al componente hijo que se carga según la pestaña seleccionada.
   */
  viewChild!: Type<unknown>;

  /**
   * @property {ConsultaioState} guardarDatos
   * @description Estado actual del trámite consultado.
   */
  guardarDatos!: ConsultaioState;

  /**
   * @property {number} indiceDictamen
   * @description Índice de la pestaña de dictamen seleccionada.
   */
  indiceDictamen: number = 1;

  /** * @property {RequerimientoConfig} requerimientoConfig
   * @description Configuración de requerimientos específica del trámite, obtenida del servicio TramiteConfigService.
   */
  requerimientoConfig!: RequerimientoConfig;

  /** Datos de respuesta al iniciar un requerimiento */
  dataIniciarRequerimiento!: IniciarRequerimientoResponse;

  /** Lista de tipos de requerimiento */
  documentosEscpecificos: DocumentosEspecificosResponse[] = [];

  /** Listado de documentos específicos guardados para el requerimiento */
  listadoDocumentosGuardados: CatalogoTipoDocumento[] = [];
  indicerequerimiento: number = 1;
  public plazoOpcions: Catalogo[] = [];
  public autorizadorOpcions: Catalogo[] = [];
  mostrarFecha: boolean = false;
  private destruirSuscripcion$: Subject<void> = new Subject();
  documentosSolicitud: DocumentoSolicitud[] = [];
  isDocumento: boolean = false;
  public observacionForm!: FormGroup;
  public FormTramite!: FormGroup;
  private destroyNotifier$: Subject<void> = new Subject();
  asignarAutorizadorCombo: Catalogo[] = [];
  yaCargoDocumentos = false;
  yaCargoTareas = false;
  yaCargoAcuses = false;
  yaCargoDictamenes = false;
  yaCargoRequerimientos = false;
  yaCargoEnvioDigital = false;
  yaCargoOpinion = false;
  envioDigital!: EnvioDigitalResponse;
  opinion: OpinionResponse[] = [];
  nuevaNotificacion!: Notificacion;
  tabs!: TabsResponse;
  acusesResolucion!: AcusesResolucionResponse;
  tareasSolicitud: TareasSolicitud[] = [];
  requerimientosSolicitud: RequerimientosResponse[] = [];

  motivoLabel: string = '';
  motivoOpcions: Catalogo[] = [];
  motivoPracialOptcions: Catalogo[] = [];
  motivoRechazoOpcions: Catalogo[] = [];
  panelVerFirmar: boolean = false;
  cadenaOriginal: string = '';
  mostrarFirmarData!: RequerimientoMostrarFirmarResponse;
  isRequerimiento: boolean = true;
  isFirma: boolean = false;
  firmaOficioCadena!: string;
  isObservacion: boolean = false;
  sello!: string;
  config!: TramiteConfig;
  serviceConfig!: ServiceConfig;
  inputSentidos!: boolean;
  public resultadoEvaluacion: string = '';
  serviceConfigModelo!: ModeloConfig;
  datosTablaResolucion: BodyTablaResolucion[] = [];
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
  readonly encabezadoTablaResolucion: HeaderTablaResolucion[] =
    CONSULTA_RESOLUCIONES.encabezadoTablaResolucion;
  catalogoParameter!: CveEnumeracionConfig;

  formRequerimiento!: GenerarRequerimientoForm;

  /**
   * @property {DictamenesResponse[]} dictamenesSolicitud
   * @description Dictamenes de solicitud.
   */
  dictamenesSolicitud: DictamenesResponse[] = [];

  /** Cadena original del requerimiento a firmar */
  cadenaOriginalRequerimiento!: string;

  constructor(
    private iniciarService: IniciarService,
    private verificarRequerimientoService: VerificarRequerimientoService,
    private fb: FormBuilder,
    private consultaioStore: ConsultaioStore,
    private router: Router,
    private tabsSolicitudServiceTsService: TabsSolicitudServiceTsService,
    private guardarService: GuardarDictamenService,
    private tramiteConfigService: TramiteConfigService,
    private consultaioQuery: ConsultaioQuery,
    private acuseDetalleService: AcuseDetalleService,
    private evaluarSolicitudService: EvaluarSolicitudService,
    private consultaCatalogoService: ConsultaCatalogoService,
    private vistaPreliminarService: VistaPreliminarService,
    private validacionesService: ValidacionesFormularioService,
    private requerimientosStore: RequerimientosStore
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.guardarDatos = seccionState;
          this.tramite = Number(seccionState.procedureId);
          if (this.tramite) {
            this.selectTramite(this.tramite);
          }
        })
      )
      .subscribe();

  /* this.guardarDatos = {
            "action_id": "17020",
           "consultaioSolicitante": null,
          "create": false,
           "current_user": "MAVL621207C95",
           "department": "cofepris",
          "estadoDeTramite": "Iniciado",
            "folioTramite": "0402600600120264001000023",
           "idSolicitudSeleccionada": "",
           "id_solicitud": "203059505",
           "nombre_pagina": '',
           "parameter": "AutorizarRequerimiento",
         "procedureId": "260601",
            "readonly": true,
           "tipoDeTramite": "Permiso Sanitario de Importación de Insumos que No Sean o Contengan Estupefacientes o Psicotrópicos, por Retorno",
            "update": true
       }*/
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
    this.serviceConfigModelo = this.tramiteConfigService.getModeloConfig(
      this.tramite
    );
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario de tramite y consulta los datos generales del tramite.
   */
  ngOnInit(): void {
    this.observacionForm = this.fb.group({
      observacion: ['', Validators.required],
    });
    this.iniciarRequerimiento();
    if (this.tramite) {
      this.selectTramite(this.tramite);
    } else {
      this.router.navigate([
        `/${this.guardarDatos?.department.toLowerCase()}/seleccion-tramite`,
      ]);
    }
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

  datosFirmaReales!: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  };

  iniciarRequerimiento(): void {
    const PAYLOAD: IniciarRequerimientoRequest = {
      cve_usuario: this.guardarDatos.current_user,
      id_accion: this.guardarDatos.action_id,
    };

    this.iniciarService
      .postVerificarIniCiarRequerimiento(
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
  getObservar(): void {
    this.isObservacion = true;

    this.isRequerimiento = false;
    this.isFirma = false;
    this.isDocumento = false;
  }
  postTerminar(): void {
    const PAYLOAD: ObservacionRequest = {
      id_accion: this.guardarDatos.action_id,
      observacion: this.observacionForm.get('observacion')?.value,
      cve_usuario: this.guardarDatos.current_user,
    };
    this.verificarRequerimientoService
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
        error: (error: any) => {
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
        },
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
   * @method seleccionaTabRequerimiento
   * @description Cambia la pestaña de dictamen seleccionada.
   * @param {number} i - Índice de la pestaña de dictamen.
   * @returns {void}
   */
  seleccionaTabRequerimiento(i: number): void {
    this.indicerequerimiento = i;

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

    this.verificarRequerimientoService
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

  /**
   * Carga los documentos específicos previamente guardados para un requerimiento.
   * Realiza una petición al servicio `GuardarRequerimientoService` y actualiza
   * el listado de documentos guardados si la respuesta es exitosa.
   * Maneja errores mostrando notificaciones adecuadas.
   * @param idRequerimiento - Identificador del requerimiento.
   * @param idSolicitud - Identificador de la solicitud.
   * @param payload - Objeto con los parámetros necesarios para la petición.
   */
  cargarDocumentosGuardados(
    idRequerimiento: number,
    idSolicitud: string,
    payload: DocumentosEspecificosRequest | null
  ): void {
    this.verificarRequerimientoService
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
          VerificarRequerimientoComponent.manejarPdf(
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

  firmar(): void {
    this.panelVerFirmar = true;
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
    this.verificarRequerimientoService.postObservacionGuardar(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === "00" && resp.datos) {
            if (SERIES2609.includes(this.tramite)) {
              this.getRegresarafterObservacion();
            }
            else {
              this.getRegresar();
            }
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
    this.isFirma = false;
    this.isDocumento = false;
    this.router.navigate(['bandeja-de-tareas-pendientes'], {
      queryParams: { labelExitoso: true }
    });
  }

  firmarMostrarVerificarRequerimiento(): void {
    const PAYLOAD: RequerimientoMostrarFirmarRequest = {
      id_accion: this.guardarDatos.action_id,
      cve_usuario: this.guardarDatos.current_user,
      solicitante: {
        rfc: this.guardarDatos.current_user,
        nombre: 'PRUEBA',
        apellido_paterno: 'PRUEBA',
        apellido_materno: 'PRUEBA',
      },
    };

    this.verificarRequerimientoService
      .postFirmarMostrar(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            this.mostrarFirmarData =
              resp.datos ?? ({} as RequerimientoMostrarFirmarResponse);
            this.cadenaOriginal = resp.datos?.cadena_original ?? '';
            this.isRequerimiento = false;
            this.isFirma = true;
            this.firmaOficioCadena = resp.datos?.fecha_firma || '';
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

  getRegresar(): void {
    this.isObservacion = false;
    this.isRequerimiento = true;
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
    this.firmaVerificarRequerimiento(datos.firma);
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


  firmaVerificarRequerimiento(firma: string): void {
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

    const PAYLOAD: FirmaVerificarRequerimientoRequest = {
      id_accion: this.guardarDatos.action_id,
      firma: {
        id_solicitud: Number(this.guardarDatos.id_solicitud),
        cadena_original: CADENAHEX,
        cert_serial_number: this.datosFirmaReales.certSerialNumber,
        clave_usuario: this.datosFirmaReales.rfc,
        fecha_firma: VerificarRequerimientoComponent.formatFecha(new Date()),
        clave_rol: 'Dictaminador',
        sello: FIRMAHEX,
        fecha_fin_vigencia: VerificarRequerimientoComponent.formatFecha(
          this.datosFirmaReales.fechaFin
        ),
      },
    };

    this.verificarRequerimientoService
      .firmarVerificar(this.tramite, NUMFOLIO, PAYLOAD)
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
  onFormRequerimientoChanged(formValue: any) {
    this.formRequerimiento = formValue;
  }

  vistaPreliminarVerificarRequerimiento(): void {
      let NUMFOLIO: string | null = null;
    if (SERIES2609.includes(this.tramite)) {
      NUMFOLIO = this.guardarDatos.folioTramite;
    }
    else{
      NUMFOLIO = this.guardarDatos.id_solicitud;
    }
    this.vistaPreliminarService.getVistaPreliminarRequerimiento(this.tramite,NUMFOLIO).subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO && resp.datos?.contenido) {
          VerificarRequerimientoComponent.manejarPdf(
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
    this.destruirSuscripcion$.next();
    this.destruirSuscripcion$.complete();
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