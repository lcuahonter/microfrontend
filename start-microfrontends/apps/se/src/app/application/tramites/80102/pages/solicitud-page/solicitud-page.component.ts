import {
  AlertComponent,
  BtnContinuarComponent,
  ConsultaioQuery,
  ConsultaioState,
  DatosPasos,
  ERROR_FORMA_ALERT,
  JSONResponse,
  ListaPasosWizard,
  PasoFirmaComponent,
  SeccionLibStore,
  Usuario,
  WizardComponent,
  WizardService,
  doDeepCopy,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import {
  PASOS,
  TITULOMENSAJE,
} from '../../constantes/autorizacion-programa-nuevo.enum';
import { Tramite80102State, Tramite80102Store } from '../../estados/tramite80102.store';
import { AutorizacionProgrmaNuevoService } from '../../services/autorizacion-programa-nuevo.service';
import { CommonModule } from '@angular/common';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ServicioDeFormularioService } from '../../../../shared/services/forma-servicio/servicio-de-formulario.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80102Query } from '../../estados/tramite80102.query';
import { USUARIO_INFO } from '../../enum/enum-80102';
import complimentos from '@libs/shared/theme/assets/json/shared/complimentos.json';
import empresasExtranjeras from '@libs/shared/theme/assets/json/shared/empresas-extranjeras.json';
import empresasNacionales from '@libs/shared/theme/assets/json/shared/empresas-nacionales.json';
import notarios from '@libs/shared/theme/assets/json/shared/notarios.json';
import planta from '@libs/shared/theme/assets/json/shared/planta.json';
import plantasSubmanufactureras from '@libs/shared/theme/assets/json/shared/plantas-submanufactureras.json';
import sociosAccionistas from '@libs/shared/theme/assets/json/shared/socios-accionistas.json';

/**
 * Interfaz que define la estructura de una acción de botón.
 */
interface AccionBoton {
  /**
   * La acción que se realizará.
   */
  accion: string;

  /**
   * El valor asociado a la acción.
   */
  valor: number;
}

@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
  host: { hostID: crypto.randomUUID().toString() },
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    BtnContinuarComponent,
    PasoTresComponent,
    PasoFirmaComponent,
    AlertComponent
  ],
  providers: [ToastrService],
  standalone: true,
})
/**
 * Componente que representa la página de solicitud.
 */
export class SolicitudPageComponent implements OnDestroy, OnInit {

  /**
   * @property consultaState
   * @description
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
   */
   public consultaState!: ConsultaioState;

/**
  * @property esFormaValido
  * @description
  * Indica si el formulario actual es válido. Se utiliza para habilitar o deshabilitar la navegación entre pasos en el wizard.
  * @type {boolean}
  * @default false
  */
   public esFormaValido!: boolean;

   /**
  * @property wizardService
  * @description
  * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
  * @type {WizardService}
  */
   wizardService = inject(WizardService);

/**
  * @property formErrorAlert
  * @description
  * Contiene el mensaje de alerta que se muestra cuando ocurre un error en el formulario.
  * @type {string}
  */
   public formErrorAlert = ERROR_FORMA_ALERT;

  /** 
   * Indica si el componente padre es BtnContinuarComponent. 
   */
  padreBtn: boolean = true;
  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Identificador del tipo de trámite.
   * @type {number}
   */
  idTipoTRamite: string = '80102';

  /**
   * Información del usuario actual.
   * Se inicializa con los datos definidos en la constante USUARIO_INFO.
   */
  datosUsuario: Usuario = USUARIO_INFO;

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de pasos del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Referencia al componente del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos de los pasos del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Título del mensaje principal.
   * @property {string | null} tituloMensaje - Título que se muestra en la parte superior del formulario.
   */
  tituloMensaje: string = TITULOMENSAJE;

  /**
   * URL de la página actual.
   */
  public solicitudState!: Tramite80102State;

  /** Listado de empresas nacionales utilizadas en el formulario de solicitud. */
  private empresasNacionales = empresasNacionales;
  
  /** Listado de empresas  extranjeras utilizadas en el formulario de solicitud. */
  private empresasExtranjeras = empresasExtranjeras;

  /**
  * Objeto base inmutable que representa la estructura inicial de un sociosAccionistas.
  */
  private sociosAccionistas = sociosAccionistas;

  constructor(
    private seccion: SeccionLibStore,
    private autorizacionProgrmaNuevoService: AutorizacionProgrmaNuevoService,
    private tramite80102Store: Tramite80102Store,
    private tramite80102Query: Tramite80102Query,
    private toastrService: ToastrService,
    private consultaQuery: ConsultaioQuery,
    private servicioDeFormularioService: ServicioDeFormularioService
  ) {
    // Constructor del componente
  }


  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al observable `selectSeccionState$` para escuchar cambios en el estado de la sección,
   * actualizando la propiedad `solicitudState` con el nuevo estado recibido.
   * La suscripción se cancela automáticamente cuando se emite un valor en `destroyNotifier$`,
   * evitando fugas de memoria.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      ).subscribe();
    this.tramite80102Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();
  }

  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Indica la visibilidad del botón Guardar. */
  public btnGuardarVisible: string = 'visible';

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
   */
  idSolicitud: number = 0;

/**
 * @method verificarLaValidezDelFormulario
 * @description
 * Este método verifica la validez de los formularios dinámicos asociados a los pasos del wizard.
 * @returns {boolean} - Indica si todos los formularios son válidos.
 */
  verificarLaValidezDelFormulario(): boolean {
    return (
      (this.servicioDeFormularioService.isFormValid('datosGeneralisForm') ??
        false) &&
      (this.servicioDeFormularioService.isFormValid('formaModificacionesForm') ??
        false) &&
      (this.servicioDeFormularioService.isFormValid('obligacionesFiscalesForm') ??
        false) &&
      (this.servicioDeFormularioService.isFormValid('federatariosCatalogoForm') ??
      false) &&
      ((this.servicioDeFormularioService.isArrayFilled('datosSocioAccionistas') ??
      false) ||
      (this.servicioDeFormularioService.isArrayFilled('datosSocioAccionistasExtrenjeros') ??
      false)) &&
      this.isAllArraysFilledIn80102(['anexoUnoTabla1', 'anexoUnoTabla2', 'federatariosDatos', 'plantasImmexDatos','serviciosImmex','empresasNacionales','empresasExtranjera', 'datosTablaSubfabricantesSeleccionadas', 'anexoTresTablaLista'])
    );
  }

  isAllArraysFilledIn80102(array: string[]): boolean {
    return array.every(item => this.servicioDeFormularioService.isArrayFilled(item));
  }

/**
 * Maneja la lógica para actualizar el índice del paso del wizard según el evento del botón de acción proporcionado.
 * 
 * Este método obtiene el estado actual desde `nuevoProgramaIndustrialService`, lo guarda,
 * y muestra un mensaje de éxito o error dependiendo del código de respuesta. Si la respuesta es exitosa
 * y el valor del evento está dentro del rango válido (1 a 4), actualiza el índice del wizard y navega
 * hacia adelante o atrás según el tipo de acción.
 * 
 * @param e - El evento del botón de acción que contiene el valor y el tipo de acción.
 */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor <= this.pasos.length) {
      const NEXT_INDEX =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor;
      if (!this.consultaState.readonly && e.accion === 'cont') {
        if (!this.consultaState.update) {
          this.esFormaValido = this.verificarLaValidezDelFormulario();
          if (!this.esFormaValido) {
            this.indice = e.valor;
            this.datosPasos.indice = e.valor;
            this.servicioDeFormularioService.markFormAsTouched('datosGeneralisForm');
            this.servicioDeFormularioService.markFormAsTouched('formaModificacionesForm');
            this.servicioDeFormularioService.markFormAsTouched('obligacionesFiscalesForm');
            this.servicioDeFormularioService.markFormAsTouched('federatariosCatalogoForm');
            return;
          }
        }
        this.shouldNavigate$()
          .subscribe((shouldNavigate) => {
            if (shouldNavigate) {
              this.indice = NEXT_INDEX;
              this.datosPasos.indice = NEXT_INDEX;
              this.wizardService.cambio_indice(NEXT_INDEX);
              this.wizardComponent.siguiente();
            } else {
              this.indice = e.valor;
              this.datosPasos.indice = e.valor;
            }
          });
      } else if (e.accion === 'cont') {
        this.shouldNavigate$()
          .subscribe((shouldNavigate) => {
            if (shouldNavigate) {
              this.indice = NEXT_INDEX;
              this.datosPasos.indice = NEXT_INDEX;
              this.wizardService.cambio_indice(NEXT_INDEX);
              this.wizardComponent.siguiente();
            } else {
              this.indice = e.valor;
              this.datosPasos.indice = e.valor;
            }
          });
      } else {
        this.indice = NEXT_INDEX;
        this.datosPasos.indice = NEXT_INDEX;
        this.wizardComponent.atras();
      }
    }
  }


  /**
   * Maneja la lógica para actualizar el índice del paso del wizard según el evento del botón de acción proporcionado.
   * 
   * Este método obtiene el estado actual desde `nuevoProgramaIndustrialService`, lo guarda,
   * y muestra un mensaje de éxito o error dependiendo del código de respuesta. Si la respuesta es exitosa
   * y el valor del evento está dentro del rango válido (1 a 4), actualiza el índice del wizard y navega
   * hacia adelante o atrás según el tipo de acción.
   * 
   * @param e - El evento del botón de acción que contiene el valor y el tipo de acción.
   */
    public shouldNavigate$(): Observable<boolean> {
      return this.autorizacionProgrmaNuevoService.getAllState().pipe(
        take(1),
        switchMap(data => this.guardar(data)),
        map(response => {
          const API_DATOS = doDeepCopy(response);
          const OK = API_DATOS.codigo === '00';
          if (OK) {
            this.toastrService.success(API_DATOS.mensaje);
          } else {
            this.padreBtn = true;
            this.toastrService.error(API_DATOS.mensaje);
          }
          return OK;
        })
      );
    }

  /**
   * Obtiene el título para cada página según el índice.
   * @method obtenerNombreDelTítulo
   * @param {number} valor - El índice de la página.
   * @returns {void}
   */
  obtenerNombreDelTítulo(valor: number): void {
    switch (valor) {
      case 1:
        this.tituloMensaje = TITULOMENSAJE;
        break;
      case 2:
        this.tituloMensaje = this.pasos[1].titulo;
        break;
      case 3:
        this.tituloMensaje = this.pasos[2].titulo;
        break;
      case 4:
        this.tituloMensaje = this.pasos[3].titulo;
        break;
      default:
        this.tituloMensaje = TITULOMENSAJE;
    }
  }

 /**
   * Objeto base inmutable que representa la estructura inicial de un socio/accionista.
   */
  private complimentosBase = complimentos;

  /**
   * Objeto base inmutable que representa la estructura inicial de un plantasSubmanufactureras.
   */
  private plantasSubmanufacturerasBase = plantasSubmanufactureras;

  /**
   * Objeto base inmutable que representa la estructura inicial de un planta.
   */
  private plantasBase = planta;

  /**
   * Objeto base inmutable que representa la estructura inicial de un notarios.
   */
  private notariosBase = notarios;

/**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(): void {
    this.autorizacionProgrmaNuevoService.getAllState()
    .pipe(take(1))
    .subscribe(data => {
      this.guardar(data);
    });
  }


  /**
   * Guarda los datos proporcionados enviándolos al servidor mediante el servicio `nuevoProgramaIndustrialService`.
   * 
   * @param data - Los datos que se desean guardar y enviar al servidor.
   * @returns void
   */
  guardar(data: Tramite80102State): Promise<JSONResponse> {
    const SOLICITUD = this.autorizacionProgrmaNuevoService.buildComplimentos(data as unknown as Record<string, unknown>, this.complimentosBase);
    const DECLARACION_SOLICUTUD_ENTRIES = this.autorizacionProgrmaNuevoService.buildDeclaracionSolicitudEntries(data as unknown as Record<string, unknown>);
    const PLANTAS = this.autorizacionProgrmaNuevoService.buildPlantas(data.plantasImmexTablaLista, this.plantasBase, data);
    const ANEXO_ALL = this.autorizacionProgrmaNuevoService.buildAnexo(data);
    const PLANTAS_SUBMANUFACTURERAS = this.autorizacionProgrmaNuevoService.buildPlantasSubmanufactureras(
      Array.isArray(this.plantasSubmanufacturerasBase) ? this.plantasSubmanufacturerasBase : [this.plantasSubmanufacturerasBase],
      Array.isArray(data.empressaSubFabricantePlantas?.plantasSubfabricantesAgregar) ? data.empressaSubFabricantePlantas.plantasSubfabricantesAgregar : []
    );
    const NOTARIOS = this.autorizacionProgrmaNuevoService.buildDatosFederatarios(data.tablaDatosFederatarios, this.notariosBase);
    const SOCIOS_ACCIONISTAS = this.autorizacionProgrmaNuevoService.buildSociosAccionistas(
      Array.isArray(data.tablaDatosComplimentos) ? data.tablaDatosComplimentos : [],
      Array.isArray(data.tablaDatosComplimentosExtranjera) ? data.tablaDatosComplimentosExtranjera : [],
      Array.isArray(this.sociosAccionistas) ? this.sociosAccionistas[0] : this.sociosAccionistas
    );
    const EMPRESAS_NACIONALES = this.autorizacionProgrmaNuevoService.buildEmpresaNacionales(data.datos,this.empresasNacionales);
    const EMPRESAS_EXTRANJERAS = this.autorizacionProgrmaNuevoService.buildEmpresaExtranjera(data.datosEmpresaExtranjera,this.empresasExtranjeras);
    const PAYLOAD = {
      "esDeGuardar": true,
    "tipoDeSolicitud": "guardar",
    "cveRolCapturista": "PersonaMoral",
    "idSolicitud": this.solicitudState.idSolicitud || 0,
    "idTipoTramite": 80102,
    "rfc": "AAL0409235E6",
    "cveUnidadAdministrativa": "8101",
    "costoTotal": 10000.5,
    "certificadoSerialNumber": "1234567890ABCDEF",
    "certificado": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A",
    "numeroFolioTramiteOriginal": "TRM-2023-00001",
    "nombre": "Juan",
    "apPaterno": "Pérez",
    "apMaterno": "López",
    "telefono": "5551234567",
    "discriminator_value": "80102",
    "discriminatorValue": "80102",
     "domicilio": {
    },
    "solicitante": {
        
    },
    "planta": Array.isArray(PLANTAS) ? [...PLANTAS] : [PLANTAS],
    "notarios":[...NOTARIOS],
    "anexoII": Array.isArray(ANEXO_ALL.anexo['ANEXOII']) ? [...ANEXO_ALL.anexo['ANEXOII']] : [],
    "anexoIII": Array.isArray(ANEXO_ALL.anexo['ANEXOIII']) ? [...ANEXO_ALL.anexo['ANEXOIII']] : [],
    "mercanciaImportacion": [
      {
        "listaProveedores": [
          ...(Array.isArray(ANEXO_ALL.anexo['proveedorCliente']) ? ANEXO_ALL.anexo['proveedorCliente'] : [])
        ],
        "complemento": {
          ...(typeof ANEXO_ALL.anexo['datosParaNavegar'] === 'object' && ANEXO_ALL.anexo['datosParaNavegar'] !== null ? ANEXO_ALL.anexo['datosParaNavegar'] : {})
        },
        "anexoI": Array.isArray(ANEXO_ALL.anexo['tableDos']) ? [...ANEXO_ALL.anexo['tableDos']] : []
      }
    ],
    "fraccionArancelaria":[
        {
          "listaProveedores": Array.isArray(ANEXO_ALL.anexo['proveedorClienteDos']) ? [...ANEXO_ALL.anexo['proveedorClienteDos']] : []
        }
      ],
     "productoExportacionDtoList": [
        {
          "proyectosImmex": Array.isArray(ANEXO_ALL.anexo['proyectoimex']) ? [...ANEXO_ALL.anexo['proyectoimex']] : [],
          
        }
      ],
    "plantasSubmanufactureras": [...PLANTAS_SUBMANUFACTURERAS],
    "solicitud": SOLICITUD,
    "declaracionSolicitudEntities": DECLARACION_SOLICUTUD_ENTRIES,
    "sociosAccionistas": [...SOCIOS_ACCIONISTAS],
    "empresasNacionales":[...EMPRESAS_NACIONALES] ,
    "empresasExtranjeras":[...EMPRESAS_EXTRANJERAS] ,
}

    return new Promise((resolve, reject) => {
      this.autorizacionProgrmaNuevoService.guardarDatosPost(PAYLOAD).subscribe(response => {
        const API_RESPONSE = doDeepCopy(response);
        if(esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
          if(getValidDatos(API_RESPONSE.datos.id_solicitud)) {
            this.tramite80102Store.setIdSolicitud(API_RESPONSE.datos.id_solicitud);
          } else {
            this.tramite80102Store.setIdSolicitud(0);
          }
        }
        resolve(response);
      }, error => {
        reject(error);
      });
    });
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

  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Utiliza un Subject para notificar a todos los observables suscritos que deben completarse.
   * Esto ayuda a evitar posibles fugas de memoria al completar el Subject y finalizar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
