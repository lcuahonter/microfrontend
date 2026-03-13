/**
 * @fileoverview Componente encargado de gestionar el proceso completo de atención a un requerimiento.
 * ...
 */
import {
  AccionBoton,
  AcuseComponent,
  AnexarDocumentosComponent,
  BodyTablaAcuse,
  BtnContinuarComponent,
  CATALOGOS_ID, Catalogo,
  CatalogosService,
  CategoriaMensaje,
  ConsultaioQuery,
  ConsultaioState,
  ConsultaioStore,
  DatosPasos,
  DesplazarseHaciaArribaService,
  EncabezadoRequerimientoComponent,
  FirmaElectronicaComponent,
  ListaPasosWizard,
  Notificacion,
  NotificacionesComponent,
  PASOS_REQUERIMIENTOS,
  PASOS_REQUERIMIENTOS_DATOS,
  PASOS_REQUERIMIENTOS_DATOS_DOCUMENTOS,
  PASOS_REQUERIMIENTOS_DOCUMENTOS,
  RequerimientoInformacionComponent,
  RequerimientosStates,
  TITULO_ACUSE,
  TRAMITES_CUATRO_PASOS,
  TXT_ALERTA_ACUSE_RECIBO,
  TramiteFolioQueries,
  WizardComponent,
  base64ToHex,
  encodeToISO88591Hex,
  PasoCargaDocumentoComponent
} from '@ng-mf/data-access-user';
import {
  AccuseComponentes,
  ListaComponentes,
  Tabulaciones,
} from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, ViewChild, forwardRef } from '@angular/core';
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

import { CodigoRespuesta, ProcesoSolicitud, TipoRequerimiento } from '../core/enums/aga-core-enum';
import { AcusesResolucionResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-acuses-response.model';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { DictamenesResponse } from '@libs/shared/data-access-user/src/core/models/shared/dictamenes-response.model';
import { DocumentoSolicitud } from '@libs/shared/data-access-user/src/core/models/shared/consulta-documentos-response.model';
import { FirmarRequest } from '../core/models/atender-requerimiento/request/fimar-request.model';
import { FirmarResponse } from '../core/models/atender-requerimiento/response/firmar-response.model';
import { MostrarFirmaRequest } from '../core/models/atender-requerimiento/request/mostrar-firma-request.model';
import { OpinionResponse } from '@libs/shared/data-access-user/src/core/models/shared/opinion-response.model';
import { TabsResponse } from '@libs/shared/data-access-user/src/core/models/shared/consulta-tabs-response.model';
import { TabsSolicitudServiceTsService } from '../core/services/evaluar-tramite/tabs-solicitud.service.ts.service';

import { EnvioDigitalResponse } from '@libs/shared/data-access-user/src/core/models/shared/envio-digital-response.model';
import { RequerimientosResponse } from '@libs/shared/data-access-user/src/core/models/shared/requerimientos-response.model';
import { TareasSolicitud } from '@libs/shared/data-access-user/src/core/models/shared/consulta-tareas-response.model';
import { formatFecha } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../tramites/5701/pages/paso-uno/paso-uno.component';
import { PasoDatosComponent } from '../tramites/5701/components/paso-datos/paso-datos.component';
import { GuardaSolicitudService } from '../core/services/5701/guardar/guarda-solicitud.service';

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
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    AcuseComponent,
    PasoDatosComponent,
    forwardRef(() => EncabezadoRequerimientoComponent),
    forwardRef(() => RequerimientoInformacionComponent),
    NotificacionesComponent,
    PasoCargaDocumentoComponent
  ],
  providers: [AtenderRequerimientoService],
  templateUrl: './proceso-requerimiento.component.html',
  styleUrl: './proceso-requerimiento.component.scss',
})
export class ProcesoRequerimientoComponent implements OnInit, OnDestroy {
  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();
  

  /**
  * Lista de pasos del wizard de requerimientos.
  */
  pasos!: ListaPasosWizard[];

  /**
   * Índice actual del paso en el wizard.
   */
  indice: number = 1;

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
   * Bandera que indica si la solicitud  5701 es de tipo datos.
   */
  esTramiteEspecial: boolean = false;

  /**
   * Bandera que indica si la solicitud 5701 es de tipo documentos.
   * 
   */
  esTramiteDocumentos: boolean = false;

  /**
   * Catálogo de documentos disponibles.
   */
  catalogoDocumentos: Catalogo[] = [];

  /** Tipo de requerimiento seleccionado */
  tipoRequerimiento!: string;

  /**
   * Datos que se muestran en la tabla de acuse.
  */
  datosTablaAcuse: BodyTablaAcuse[] = [];

  /**
   * Referencia al componente Wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /*
  * Referencia al componente PasoDatos.
  */
  @ViewChild(PasoDatosComponent) pasoDatosComponent!: PasoDatosComponent;

  /**
   * Datos de los pasos del wizard.
   */
  datosPasos!: DatosPasos;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de trámites que utilizan el flujo de cuatro pasos.
   */
  tramitesCuatroPasos: string[] = ['5701'];

  /**
   * Enumera los tipos de requerimiento disponibles.
   */
  tipoRequerimientoEnum = TipoRequerimiento;

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
    private consultaReq: RequerimientosStates,
    private cdRef: ChangeDetectorRef,
    private guardarSolicitudService: GuardaSolicitudService
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

      this.esTramiteEspecial = TRAMITES_CUATRO_PASOS.includes(this.guardarDatos?.procedureId);

    /**
     * Asigna valores a propiedades locales a partir de `guardarDatos`.
     * - `tramite`: ID del procedimiento.
     * - `departamento`: Nombre del departamento en minúsculas.
     */
    this.tramite = Number(this.guardarDatos?.procedureId);
    this.departamento = this.guardarDatos?.department.toLowerCase();
    this.iniciarAtenderRequerimiento();
  }

  /**
   * Método del ciclo de vida OnInit.
   * Inicializa el componente y obtiene datos necesarios.
   */
  ngOnInit(): void {

    this.pasos = PASOS_REQUERIMIENTOS;
    this.datosPasos = {
      nroPasos: this.pasos?.length ? this.pasos.length : 3,
      indice: this.indice,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    };

    /**
     * Verifica si existe un trámite previamente seleccionado.
     * Si existe, se selecciona automáticamente.
     * En caso contrario, redirige al usuario a la pantalla de selección de trámite.
     */
    if (this.tramite) {
      this.selectTramite(this.tramite);
      this.consultaioStore.setSolicitudEditable(false);
    } else {
      this.router.navigate([`/${this.departamento}/seleccion-tramite`]);
    }

    /**
     * Obtiene los tipos de documentos necesarios para el trámite actual.
     */
    this.getTiposDocumentos();

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
 * Genera el texto de alerta de acuse con el folio del trámite.
 */
    this.txtAlerta = TXT_ALERTA_ACUSE_RECIBO(this.guardarDatos.id_solicitud);

    /**
     * Realiza un desplazamiento suave hacia la parte superior de la página usando el servicio.
     *
     * Se utiliza para mejorar la experiencia de usuario al cambiar de paso o al inicializar el componente.
     */
    this.desplazarseHaciaArribaService.desplazarArriba();

    this.getTabs();


  }
  
  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
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

  /*
    * Método para manejar el evento de carga en progreso.
    * Actualiza el estado de carga en progreso.
    * carga - Indica si la carga está en progreso.
    * {void} No retorna ningún valor.
    */  
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
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
   * Método para navegar a la sección anterior del wizard.
   * Actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  anterior(): void {    
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
        
    const ACCION: AccionBoton = {
      valor: this.indice,
      accion: 'atras'
    };
    this.getValorIndice(ACCION);
  }

  onAnteriorClick(): void {    
    const ACCION: AccionBoton = {
      valor: this.indice - 1,
      accion: 'atras'
    };
    this.getValorIndice(ACCION);
  }

  /**
   * Carga dinámicamente un componente según el parámetro recibido.
   * @param li - Objeto de tipo ListaComponentes que contiene la ruta del componente a cargar.
   */
  async loadComponent(li: ListaComponentes): Promise<void> {
    if (!li.componentPath) {

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
    if (e?.valor && e.valor > 0 && e.valor <= 4) {
      this.indice = e.valor;
      
      // Restablecer estado de carga de documentos al regresar al paso de anexar documentos
      if ((this.indice === 2 && this.tipoRequerimiento === this.tipoRequerimientoEnum.DOCUMENTOS) || 
          (this.indice === 3 && this.tipoRequerimiento === this.tipoRequerimientoEnum.DATOS_DOCUMENTOS) ||
          (this.indice === 2 && this.esTramiteEspecial)) {
        this.seccionCargarDocumentos = true;
        this.cargaEnProgreso = true;
      }
      
      this.cdRef.detectChanges(); // Asegura que la vista se actualice con el nuevo índice

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
      if (this.indice === this.datosPasos.nroPasos) {        
        this.mostrarFirmarAtenderRequerimiento();
      }
      if (e.accion === 'cont') {        
        this.wizardComponent.siguiente();
      } else if (e.accion === 'ant') {        
        this.wizardComponent.atras();
      }      
      this.desplazarseHaciaArribaService.desplazarArriba();
    }
  }

  /**
   * Invoca el método `actualizarSolicitud` del componente hijo `PasoDatosComponent`.
   */
  ejecutaActualizarSolicitud() {
    this.pasoDatosComponent.actualizarSolicitud();
  }

  /**
   * Método para guardar los cambios de la soliciditud.
   * @param e 
   */
  guardar(e: void) : void {
    this.pasoDatosComponent.actualizarSolicitud();
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
              this.tipoRequerimiento = this.iniciarAtenderRequerimientoData.alcance_requerimiento || '';
              this.cdRef.detectChanges(); // Asegura que la vista se actualice con el nuevo índice

              if(TRAMITES_CUATRO_PASOS.includes(this.guardarDatos?.procedureId)) {
              switch(this.tipoRequerimiento) {
                case TipoRequerimiento.DATOS:
                  this.pasos = PASOS_REQUERIMIENTOS_DATOS;
                  break;
                case TipoRequerimiento.DOCUMENTOS:
                  this.pasos = PASOS_REQUERIMIENTOS_DOCUMENTOS; 
                  break;
                case TipoRequerimiento.DATOS_DOCUMENTOS:
                  this.pasos = PASOS_REQUERIMIENTOS_DATOS_DOCUMENTOS;
                  break;
              }
              this.datosPasos.nroPasos = this.pasos.length;
              this.cdRef.detectChanges();
          
              } else {
                this.pasos = PASOS_REQUERIMIENTOS;
              }
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
    const PAYLOAD: MostrarFirmaRequest = {
      documentos_requeridos: []
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
        fecha_firma: formatFecha(new Date()),
        clave_rol: 'CapturistaGubernamental',
        sello: FIRMAHEX,
        fecha_fin_vigencia: formatFecha(this.datosFirmaReales.fechaFin),
        documentos_requeridos: []
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

  onFormularioPadreValido(isValid: boolean): void {
  
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Este método se encarga de limpiar las suscripciones a eventos y notificar la destrucción del componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.consultaioStore.establecerConsultaio('', '', '', '', '', '', false, true, false);
    this.consultaioStore.setSolicitudEditable(true);
  }
}
