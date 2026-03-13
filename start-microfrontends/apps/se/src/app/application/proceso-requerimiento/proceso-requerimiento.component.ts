/**
 * @fileoverview Componente encargado de gestionar el proceso completo de atención a un requerimiento.
 * ...
 */
import {
  AccionBoton,
  AcuseComponent,
  AlertComponent,
  AnexarDocumentosComponent,
  BodyTablaAcuse,
  BtnContinuarComponent,
  CATALOGOS_ID,
  Catalogo,
  CatalogosService,
  CategoriaMensaje,
  ConsultaioQuery, ConsultaioState,
  ConsultaioStore,
  DatosPasos,
  DesplazarseHaciaArribaService,
  DocumentoProcesado,
  DocumentosFirmaQuery,
  DocumentosFirmaStore,
  EncabezadoRequerimientoComponent,
  FORM_ERROR_ALERT,
  FirmaElectronicaComponent,
  ListaPasosWizard,
  Notificacion,
  NotificacionesComponent,
  PASOS_REQUERIMIENTOS,
  PasoCargaDocumentoComponent,
  RequerimientoInformacionComponent,
  TITULO_ACUSE,
  TXT_ALERTA_ACUSE_RECIBO,
  TramiteFolioQueries,
  ValidacionesFormularioService,
  WizardComponent,
  base64ToHex,
  encodeToISO88591Hex
} from '@ng-mf/data-access-user';
import {
  AccuseComponentes,
  ListaComponentes,
  Tabulaciones,
} from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { Component, EventEmitter, OnDestroy, ViewChild, forwardRef } from '@angular/core';
import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { AtenderRequerimientoService } from '../core/services/atender-requerimiento/atender-requerimiento.service';
import { CommonModule } from '@angular/common';
import { IniciarAtenderRequerimientoResponse } from '../core/models/atender-requerimiento/response/iniciar-atender-requerimiento.model';
import { LISTA_TRIMITES } from '../shared/constantes/lista-trimites.enums';
import { Location } from '@angular/common';
import { OnInit } from '@angular/core';
import { ReviewersTabsComponent } from '@libs/shared/data-access-user/src/tramites/components/reviewers-tabs/reviewers-tabs.component';
import { Router } from '@angular/router';
import { Type } from '@angular/core';

import { CodigoRespuesta, ProcesoSolicitud } from '../core/enum/se-core-enum';
import { DocumentosRequerido, MostrarFirmaRequest } from '../core/models/atender-requerimiento/request/mostrar-firma-request.model';
import { AcusesResolucionResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-acuses-response.model';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { DictamenesResponse } from '@libs/shared/data-access-user/src/core/models/shared/dictamenes-response.model';
import { DocumentoSolicitud } from '@libs/shared/data-access-user/src/core/models/shared/consulta-documentos-response.model';
import { FirmarRequest } from '../core/models/atender-requerimiento/request/fimar-request.model';
import { FirmarResponse } from '../core/models/atender-requerimiento/response/firmar-response.model';
import { OpinionResponse } from '@libs/shared/data-access-user/src/core/models/shared/opinion-response.model';
import { TabsResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-tabs-response.model';
import { TabsSolicitudServiceTsService } from '../core/services/evaluar-tramite/tabs-solicitud.service.ts.service';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AtenderRequerimientoCampos } from '../shared/models/atender-req-campos.model';
import { DocumentoRequeridoFirmar } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { EnvioDigitalResponse } from '@libs/shared/data-access-user/src/core/models/shared/envio-digital-response.model';
import { RequerimientosResponse } from '@libs/shared/data-access-user/src/core/models/shared/requerimientos-response.model';
import { TareasSolicitud } from '@libs/shared/data-access-user/src/core/models/shared/consulta-tareas-response.model';
import { TramiteConfigService } from '../shared/services/tramiteConfig.service';

/**
 * Componente principal para el proceso de requerimiento.
 *
 * Este componente gestiona el flujo del requerimiento de información,
 * incluyendo anexar documentos, firma electrónica, y generación de acuse.
 *
 * @selector proceso-requerimiento
 * @standalone Este componente es autónomo (standalone).
 * @imports Importa módulos y componentes necesarios para el proceso.
 * @providers Proveedor del servicio `AtenderRequerimientoService`.
 * @templateUrl Ruta al archivo de plantilla HTML del componente.
 * @styleUrl Ruta al archivo de estilos SCSS del componente.
 */
@Component({
  selector: 'proceso-requerimiento',
  standalone: true,
  imports: [
    CommonModule,
    ReviewersTabsComponent,
    WizardComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    AcuseComponent,
    forwardRef(() => EncabezadoRequerimientoComponent),
    forwardRef(() => RequerimientoInformacionComponent),
    NotificacionesComponent,
    PasoCargaDocumentoComponent,
    AnexarDocumentosComponent,
    ReactiveFormsModule,
    AlertComponent
  ],
  providers: [AtenderRequerimientoService],
  templateUrl: './proceso-requerimiento.component.html',
  styleUrl: './proceso-requerimiento.component.scss',
})
export class ProcesoRequerimientoComponent implements OnInit, OnDestroy {
  /**
  * Lista de pasos del wizard de requerimientos.
  */
  pasos: ListaPasosWizard[] = PASOS_REQUERIMIENTOS;

  /**
   * Índice actual del paso en el wizard.
   */
  indice: number = 1;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
  * Indica si el botón para cargar archivos está habilitado.
  */
  activarBotonCargaArchivos: boolean = false;

  /**
  * Indica si la sección de carga de documentos está activa.
  * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
  */
  seccionCargarDocumentos: boolean = true;

  /** Carga del progreso del archivo */
  cargaEnProgreso: boolean = true;

  /** 
   * Datos de respuesta al iniciar un requerimiento
   */
  iniciarAtenderRequerimientoData!: IniciarAtenderRequerimientoResponse;

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
   * Nueva notificación para mostrar mensajes de error o información al usuario.
   */
  nuevaNotificacion: Notificacion | null = null;

  /** Identificador de la solicitud generada tras firmar el requerimiento. */
  idSolicitud!: number;

  /** Identificador del requerimiento asociado tras firmar el requerimiento. */
  idRequerimiento!: number;

  /**
   * Lista de trámites disponibles.
   */
  listaTrimites = LISTA_TRIMITES;

  /**
   * Trámite seleccionado.
   */
  slectTramite!: AccuseComponentes | undefined;

  /**
   * Componente dinámico a mostrar.
   */
  viewChild!: Type<unknown>;

  /**
   * Identificador del trámite actual.
   */
  tramite: number = 0;

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
   * @property {DictamenesResponse[]} dictamenesSolicitud
   * @description Dictamenes de solicitud.
  */
  dictamenesSolicitud: DictamenesResponse[] = [];

  /**
   * @property {RequerimientosResponse[]} requerimientosSolicitud
   * @description Requerimientos de solicitud.
  */
  requerimientosSolicitud: RequerimientosResponse[] = [];

  /**
   * @property {OpinionResponse[]} opinion
   * @description Opiniones de solicitud.
  */
  opinion: OpinionResponse[] = [];

  /**
    * @property {AcusesResolucionResponse[]} acusesResolucion
    * @description Acuses de resolución asociados al trámite.
  */
  acusesResolucion!: AcusesResolucionResponse;

  /**
   * @property {TareasSolicitud[]} tareasSolicitud
   * @description Tareas de solicitud.
  */
  tareasSolicitud: TareasSolicitud[] = [];

  /**
   * @property {EnvioDigitalResponse} envioDigital
   * @description Respuesta del envío digital asociado al trámite.
  */
  envioDigital!: EnvioDigitalResponse;

  /**
   * @property {boolean} yaCargoDocumentos
   * @description Indica si los documentos de la solicitud ya han sido cargados.
   */
  yaCargoDocumentos = false;

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
   * @property {boolean} yaCargoOpinion
   * @description Indica si las opiniones ya han sido cargados.
   */
  yaCargoOpinion = false;

  /**
   * @property {boolean} yaCargoAcuses
   * @description Indica si los acuses de resolución ya han sido cargados.
   */
  yaCargoAcuses = false;

  /**
   * @property {boolean} yaCargoTareas
   * @description Indica si las tareas de la solicitud ya han sido cargadas.
   */
  yaCargoTareas = false;

  /**
   * @property {boolean} yaCargoEnvioDigital
   * @description Indica si el envío digital ya ha sido cargado.
   */
  yaCargoEnvioDigital = false;

  /**
   * Fecha del requerimiento.
   */
  fechaRequerimiento!: string;

  /**
   * Justificación del requerimiento.
   */
  justificacionRequerimiento!: string;

  /**
   * Estado actual de la consulta.
   */
  guardarDatos!: ConsultaioState;

  /**
* Cadena original generada a partir de los datos del trámite.
* Esta cadena será firmada con el certificado digital y la llave privada proporcionados.
*/
  cadenaOriginal?: string;

  /**
   * Departamento asociado al trámite.
   */
  departamento!: string;

  /**
   * Indica si el servicio de requerimiento está cargado.
   */
  esRequerimientoServiceLoaded: boolean = false;

  /**
   * Texto de alerta mostrado en el componente.
   */
  txtAlerta!: string;

  /**
   * Subtítulo mostrado en el componente.
   */
  subtitulo = TITULO_ACUSE;

  /**
   * Folio del trámite.
   */
  folio!: string;

  /**
   * URL actual.
   */
  url!: string;

  /**
   * Indica si se muestra el acuse.
   */
  esAcuse: boolean = false;

  /**
   * Catálogo de documentos disponibles.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Datos que se muestran en la tabla de acuse.
  */
  datosTablaAcuse: BodyTablaAcuse[] = [];

  /**
   * Referencia al componente Wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos de los pasos del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
 * Array que almacena las cadenas originales de los documentos que requieren firma.
 */
  public cadenasOriginalesDocumentos: string[] = [];

  /** Lista de documentos que requieren firma electrónica.
   * Esta lista se obtiene del store `DocumentosFirmaStore` a través del query `DocumentosFirmaQuery`.
   * Se utiliza para mostrar los documentos al usuario y procesar la firma de cada uno.
   */
  public documentosFirma: DocumentoRequeridoFirmar[] = [];

  /** Lista de documentos específicos para el proceso.
   * Contiene los documentos procesados necesarios para continuar con el trámite.
   */
  public documentos_especificos: DocumentoProcesado[] = [];


  public isAtencionRequerimiento: boolean = true;

  /**
 * Formulario reactivo para la solicitud de atencionRequerimiento dictamen.
 * @type {FormGroup}
 */
  public requerimientoForm!: FormGroup;

  /**
   * Indica si el formulario es válido.
   * @type {boolean}
   */
  esFormaValido: boolean = false;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = FORM_ERROR_ALERT;

  /** Configuración de atención de requerimientos por campo */
  config!: AtenderRequerimientoCampos; // Adjust in the configuration service, since not all procedures require displaying the Atención del requerimiento

  /**
   * Indica si el texto del botón debe ser visible.
   * @type {boolean}
   * @default true
   */
  btnTextVisible: boolean = true;

  /**
   * Constructor del componente.
   * Inicializa servicios y suscripciones necesarias.
   */
  constructor(
    private router: Router,
    private consultaioStore: ConsultaioStore,
    private consultaioQuery: ConsultaioQuery,
    private catalogosServices: CatalogosService,
    private tramiteQueries: TramiteFolioQueries,
    private desplazarseHaciaArribaService: DesplazarseHaciaArribaService,
    private atenderRequerimientoService: AtenderRequerimientoService,
    private location: Location,
    private tabsSolicitudServiceTsService: TabsSolicitudServiceTsService,
    private documentosFirmaQuery: DocumentosFirmaQuery,
    private documentosFirmaStore: DocumentosFirmaStore,
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private tramiteConfigService: TramiteConfigService,
  ) {

    /**
     * Suscripción al estado de consulta.
     * Guarda los datos actuales del estado en `guardarDatos`.
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.guardarDatos = seccionState;
        })
      )
      .subscribe();

    this.documentosFirmaQuery.documentos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((docs) => {
        this.documentosFirma = docs;
        this.cadenasOriginalesDocumentos = docs.map(d => d.hash_documento);
      });

    this.documentosFirmaQuery.documentosEspecificos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((docsReq) => {
        this.documentos_especificos = docsReq;
      });

    /**
     * Asigna valores a propiedades locales a partir de `guardarDatos`.
     * - `tramite`: ID del procedimiento.
     * - `departamento`: Nombre del departamento en minúsculas.
     */
    this.tramite = Number(this.guardarDatos?.procedureId);
    this.departamento = this.guardarDatos?.department.toLowerCase();
    this.config = this.tramiteConfigService.getAtenderRequerimientoCampos(this.tramite);
  }

  /**
   * Método del ciclo de vida OnInit.
   * Inicializa el componente y obtiene datos necesarios.
   */
  ngOnInit(): void {
    this.requerimientoForm = this.fb.group({
      atencionRequerimiento: ['', Validators.required],
    });
    /**
     * Verifica si existe un trámite previamente seleccionado.
     * Si existe, se selecciona automáticamente.
     * En caso contrario, redirige al usuario a la pantalla de selección de trámite.
     */
    if (this.tramite) {
      this.selectTramite(this.tramite);
    } else {
      this.router.navigate([`/${this.departamento}/seleccion-tramite`]);
    }

    /**
     * Obtiene los tipos de documentos necesarios para el trámite actual.
     */
    this.getTiposDocumentos();

    this.getTabs();

    this.iniciarAtenderRequerimiento();

    if (this.tramite.toString().startsWith('130')) {
      this.btnTextVisible = false;
    }

    /**
     * Obtiene la URL actual desde el router.
     * Extrae la primera sección de la URL para asignarla a la propiedad `url`.
     */
    const URL_ACTUAL = this.router.url;
    this.url = URL_ACTUAL.split('/')[1];

    /**
     * Obtiene el folio del trámite actual desde el servicio `tramiteQueries`.
     */
    this.folio = this.tramiteQueries.getTramite();

    /**
     * Realiza un desplazamiento suave hacia la parte superior de la página usando el servicio.
     *
     * Se utiliza para mejorar la experiencia de usuario al cambiar de paso o al inicializar el componente.
     */
    this.desplazarseHaciaArribaService.desplazarArriba();

  }

  /**
   * Carga dinámicamente un componente según el parámetro recibido.
   * @param li - Objeto de tipo ListaComponentes que contiene la ruta del componente a cargar.
   */
  async loadComponent(li: ListaComponentes): Promise<void> {
    if (!li.componentPath) {
      console.error('Component not found in registry:');
      return;
    }
    this.viewChild = (await li.componentPath()) as Type<unknown>;
  }

  /**
   * Cambia la pestaña activa en el wizard según el id recibido.
   * @param id - Objeto de tipo Tabulaciones que indica la pestaña a mostrar.
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
   * Selecciona un trámite según el identificador recibido.
   * @param i - Identificador del trámite a seleccionar.
   */
  selectTramite(i: number): void {
    this.tramite = i;
    this.slectTramite = LISTA_TRIMITES.find((v) => v.tramite === i);
  }

  /**
   * Actualiza el índice basado en el valor de la acción proporcionada y navega en el componente wizard.
   *
   * @param e - Objeto de tipo `AccionBoton` que contiene el valor y la acción a realizar.
   *   - `valor`: Número que debe estar entre 1 y 4 (inclusive).
   *   - `accion`: Cadena que indica la acción a realizar ('cont' para siguiente, cualquier otro valor para atrás).
   * @return {void}
   */
  getValorIndice(e: AccionBoton): void {
    const IS_ATENCION_REQUERIMIENTO = this.tramiteConfigService.getAtenderRequerimientoCampos(this.tramite);
    if (IS_ATENCION_REQUERIMIENTO.isAtencionRequerimientoCampo && this.indice === 1 && e.accion === 'cont') {
      if (this.requerimientoForm.invalid) {
        if (this.tramite === 130109) {
          this.esFormaValido = true;
        }
        this.datosPasos.indice = 1;
        this.requerimientoForm.markAllAsTouched();
        return;
      }
      this.postAtencionRequerimientoValido();
    }
    this.esFormaValido = false;
    if (e?.valor && e.valor > 0 && e.valor < 4) {
      this.indice = e.valor;
      if (this.indice === 2) {
        this.consultaioStore.establecerConsultaio(
          this.guardarDatos?.procedureId,
          this.guardarDatos?.parameter,
          this.guardarDatos?.department,
          this.guardarDatos?.folioTramite,
          this.guardarDatos?.tipoDeTramite,
          this.guardarDatos?.estadoDeTramite,
          false, false, true,
          this.guardarDatos?.action_id,
          this.guardarDatos.current_user,
          this.guardarDatos.id_solicitud
        );
      } else {
        this.consultaioStore.establecerConsultaio(
          this.guardarDatos?.procedureId,
          this.guardarDatos?.parameter,
          this.guardarDatos?.department,
          this.guardarDatos?.folioTramite,
          this.guardarDatos?.tipoDeTramite,
          this.guardarDatos?.estadoDeTramite,
          true, false, false,
          this.guardarDatos?.action_id,
          this.guardarDatos.current_user,
          this.guardarDatos.id_solicitud
        );
      }
      if (this.indice === 3) {
        this.mostrarFirmarAtenderRequerimiento();
      }
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
      this.desplazarseHaciaArribaService.desplazarArriba();
    }
  }

  /**
   * Obtiene el catálogo de los tipos de documentos disponibles para el trámite.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
        error: (_error): void => {
          // Manejo de errores si es necesario
        },
      });
  }

  /**
   * Recibe la firma electrónica y redirige a la página de acuse si la firma es válida.
   * @param ev - Cadena que representa la firma electrónica obtenida.
   */
  obtieneFirma(datos: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  }): void {
    this.datosFirmaReales = datos;
    this.firmarAtenderRequerimiento(datos.firma);
  }

  /**
* Maneja los documentos firmados y actualiza el store con los sellos correspondientes.
* @param sellos - Array de cadenas que representan los sellos de los documentos firmados.
*/
  onDocumentosFirmados(sellos: string[]): void {
    // Mezclas los sellos con los documentos de Akita
    const DOCUMENTOS = this.documentosFirma.map((doc, i) => ({
      ...doc,
      hash_documento: encodeToISO88591Hex(doc.hash_documento),
      sello_documento: base64ToHex(sellos[i] || '')
    }));

    this.documentosFirmaStore.update({ documentos: DOCUMENTOS });
  }


  /**
   * Inicia la atención de un requerimiento específico.
   * 
   * Realiza la consulta al servicio para obtener los datos iniciales del requerimiento
   * basado en el número de folio del trámite. Maneja la respuesta mostrando notificaciones
   * de error en caso de fallas y guarda los datos recibidos en la propiedad `iniciarAtenderRequerimientoData`.
   */
  iniciarAtenderRequerimiento(): void {
    const NUMFOLIO = this.guardarDatos.folioTramite;
    this.atenderRequerimientoService.getIniciarAtenderRequerimiento(this.tramite, NUMFOLIO).subscribe({
      next: (response) => {
        if (response.codigo === '00') {
          this.iniciarAtenderRequerimientoData = response.datos ?? {} as IniciarAtenderRequerimientoResponse;
        } else {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: response.error || 'Error al consultar la notificacion',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          this.location.back();
        }
      },
      error: (error) => {
        const MENSAJE = error?.error?.error || 'Error inesperado al consultar notificacion.';
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
   * Muestra los datos de la firma para atender un requerimiento.
   * Realiza la llamada al servicio para obtener la información necesaria
   * y guarda la cadena original en `this.cadenaOriginal`.
   * También maneja notificaciones de éxito o error.
   */
  mostrarFirmarAtenderRequerimiento(): void {

    const DOCUMENTOS_REQUERIDOS: DocumentosRequerido[] =
      (this.iniciarAtenderRequerimientoData?.documentos ?? [])
        .map(doc => ({
          id_documento_seleccionado:
            doc.id_documento ||
            (this.documentos_especificos.find(p => p.id_tipo_documento === doc.id_tipo_documento)?.id_documento ?? null),
          id_documento_solicitud: doc.id_documento_solicitud
        }));

    const PAYLOAD: MostrarFirmaRequest = {
      documentos_requeridos: DOCUMENTOS_REQUERIDOS
    };

    this.atenderRequerimientoService.postFirmarMostrar(this.tramite, this.guardarDatos.folioTramite, PAYLOAD)
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
            this.cadenaOriginal = resp.datos?.cadena_original_atender_requerimiento || '';
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
   * Firma electrónicamente un requerimiento utilizando los datos guardados
   * y la cadena original obtenida previamente.
   * 
   * @param firma Cadena base64 de la firma generada por el usuario.
   */
  firmarAtenderRequerimiento(firma: string): void {
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

    const PAYLOAD: FirmarRequest = {
      id_accion: this.guardarDatos.action_id,
      firma: {
        cadena_original: CADENAHEX,
        cert_serial_number: this.datosFirmaReales.certSerialNumber,
        clave_usuario: this.datosFirmaReales.rfc,
        fecha_firma: ProcesoRequerimientoComponent.formatFecha(new Date()),
        clave_rol: 'CapturistaGubernamental',
        sello: FIRMAHEX,
        fecha_fin_vigencia: ProcesoRequerimientoComponent.formatFecha(this.datosFirmaReales.fechaFin),
        documentos_requeridos: this.documentosFirma || []
      },
    };

    this.atenderRequerimientoService.postFirmarAtenderRequerimiento(this.tramite, NUMFOLIO, PAYLOAD)
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((firmaResponse: BaseResponse<FirmarResponse>) => {
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
            this.esAcuse = true;
            this.idSolicitud = firmaResponse.datos?.id_solicitud || 0;
            this.idRequerimiento = firmaResponse.datos?.id_requerimiento || 0;
            this.txtAlerta = TXT_ALERTA_ACUSE_RECIBO(this.idRequerimiento.toString());
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
            this.postAcuseRecibo();
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
   * Convierte un objeto Date o string de fecha a formato 'YYYY-MM-DD HH:mm:ss'.
   * @param fecha Fecha a formatear.
   * @returns Cadena con el formato 'YYYY-MM-DD HH:mm:ss'.
   */
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
  /**
   * @method postAcuseRecibo
   * @description Genera y obtiene el oficio
   * 
   * Realiza una petición al servicio para generar el oficio
   * para la solicitud actual. Si la respuesta es exitosa (código '00'), 
   * actualiza la tabla de resoluciones con el documento generado.
   * 
   * @returns {void}
 */
  postAcuseRecibo(): void {
    this.atenderRequerimientoService.postAcuseRecibo(this.tramite, Number(this.guardarDatos.id_solicitud))
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO && resp.datos) {
            this.datosTablaAcuse = [{
              id: 1,
              idDocumento: '1',
              documento: resp.datos.nombre_archivo ?? '',
              urlPdf: resp.datos.llave_archivo ?? ''
            }];
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
    this.tabsSolicitudServiceTsService.getTabs(this.tramite, this.guardarDatos.id_solicitud, ProcesoSolicitud.ATENDER_REQUERIMIENTO)
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
   * @method getOpiniones
   * @description Método para obtener las opiniones asociados a un trámite.
   *
   * Realiza una petición al servicio tabsSolicitudServiceTsService para recuperar las opiniones
   * vinculados al número de folio proporcionado. Asigna los requerimientos a la variable opinion
   * si la respuesta es exitosa (código '00'), o muestra un error en caso contrario.
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
   * @method onTabSeleccionado
   * @description Método del ciclo de vida que se ejecuta las peticiones de los tabs.
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
* Método para manejar el evento de carga de documentos.
* Actualiza el estado del botón de carga de archivos.
*  carga - Indica si la carga de documentos está activa o no.
* {void} No retorna ningún valor.
*/
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
 * Método para manejar el evento de carga de documentos.
 * Actualiza el estado de la sección de carga de documentos.
 *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
 * {void} No retorna ningún valor.
 */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
 * Método para navegar a la sección anterior del wizard.
 * Actualiza el índice y el estado de los pasos.
 * {void} No retorna ningún valor.
 */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  anteriorFirmar(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
    this.seccionCargarDocumentos = true;
    this.activarBotonCargaArchivos = false;
  }

  /**
 * Emite un evento para cargar archivos.
 * {void} No retorna ningún valor.
 */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Método para manejar el evento de continuar en el wizard.
   * Navega al siguiente paso o inicia la carga de archivos según el estado actual.
   * {void} No retorna ningún valor.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onContinuarClick() {
    if (this.seccionCargarDocumentos) {
      this.onClickCargaArchivos();
    } else {
      this.wizardComponent.siguiente();
      this.indice = this.wizardComponent.indiceActual + 1;
      this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
      // Creamos un objeto AccionBoton como lo hacía btn-continuar
      const ACCION: AccionBoton = {
        valor: this.indice,
        accion: 'cont'
      };
      this.getValorIndice(ACCION);
    }
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
    return this.validacionesService.isValid(this.requerimientoForm, campo);
  }

  /**
  * @method atencionRequerimientoValido
  * @description
  * Valida y envía la atención del requerimiento si es necesario.
  * Realiza una llamada al servicio para guardar la atención del requerimiento
  * si el campo correspondiente está habilitado y tiene un valor.
  */
  postAtencionRequerimientoValido(): void {
    const ATENCION_VALUE = {
      desc_atencion_requerimiento: this.requerimientoForm.get("atencionRequerimiento")?.value
    }
    this.atenderRequerimientoService.postAtencionRequerimiento(this.tramite, this.guardarDatos.folioTramite, ATENCION_VALUE).subscribe({
      next: (response) => {
        if (response.codigo === CodigoRespuesta.EXITO) {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.EXITO,
            modo: 'action',
            titulo: '',
            mensaje: response.mensaje || 'Atención al requerimiento guardada con éxito.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (error) => {
        const MENSAJE = error?.error?.error || 'Error inesperado al consultar la atencion del requerimiento.';
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

  public esMostrarTituloYNotificacion(): boolean {
    const SKIP_TRAMITE = [130113, 130107, 130104];
    return !SKIP_TRAMITE.includes(this.tramite);
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Este método se encarga de limpiar las suscripciones a eventos y notificar la destrucción del componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.consultaioStore.establecerConsultaio('', '', '', '', '', '', false, true, false);
  }
}
