/**
 * Componente que representa el asistente para la solicitud de modificación de permiso de salida del territorio.
 * Este componente gestiona los pasos del asistente, la navegación entre ellos y los datos relacionados con cada paso.
 */
import { Component, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { PasoUnoComponent } from '../../pages/paso-uno/paso-uno.component';

import {
  AVISO,
  DatosPasos,
  JSONResponse,
  ListaPasosWizard,
  Notificacion,
  WizardComponent,
  doDeepCopy, 
  esValidObject, 
  getValidDatos,
} from '@libs/shared/data-access-user/src';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { PagoDerechosState } from '../../../../shared/estados/stores/pago-de-derechos.store';

import { AccionBoton } from '../../../../shared/constantes/shared2614/accion-botton.enum';

import { 
  ERROR_ALERTA,
  MENSAJE_CORREGIR_ERRORES,
  MSG_REGISTRO_EXITOSO,
  PASOS_EXPORTACION,
  TITULO_PASO_DOS,
  TITULO_PASO_TRES,
  TITULO_PASO_UNO,
} from '../../../../shared/constantes/shared2614/solicitud-modificacion-permiso-salida-territorio.enum';

import { CombinedState, SolicitudImportacionAmbulanciaService } from '../../services/solicitud-importacion-ambulancia.service';

import {
  Solicitud2614State,
  Tramite2614Store,
} from '../../../../estados/tramites/tramite2614.store';
import { Tramite261401Query } from '../../estados/tramite261401.query';
import { Tramite2614Query } from '../../../../estados/queries/tramite2614.query';

import { Solicitud261401State, Tramite261401Store } from '../../estados/tramite261401.store';

import { Subject, take, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

/**

/**
 * Decorador que define el componente Angular para la solicitud de modificación de permiso de salida del territorio.
 * Incluye el selector del componente y la ruta de su plantilla HTML.
 */
@Component({
  selector: 'app-solicitud-modificacion-permiso-salida-territorio',
  templateUrl:
    './solicitud-modificacion-permiso-salida-territorio.component.html',
})
/**
 * Clase principal del componente para la solicitud de modificación de permiso de salida del territorio.
 * Gestiona el flujo del asistente, la recolección de datos, la validación y la interacción con los servicios relacionados.
 * Incluye métodos para manejar la navegación, la carga de documentos, la validación de formularios y la comunicación con la API.
 */
  /**
   * Devuelve el número de pasos del asistente.
   * @returns {ListaPasosWizard[]}
   */
  /**
   * Devuelve el índice actual del paso del asistente.
   * @returns {number}
   */
  /**
   * Devuelve el id de la solicitud actual desde el estado correspondiente.
   * @returns {number}
   */
  /**
   * Método de limpieza que se ejecuta cuando el componente es destruido.
   */
  /**
   * Devuelve un objeto ConsultaioState por defecto con todas las propiedades requeridas.
   * @returns {ConsultaioState}
   */
  /**
   * Devuelve un objeto PagoDerechosState por defecto con todas las propiedades requeridas.
   * @returns {PagoDerechosState}
   */
export class SolicitudModificacionPermisoSalidaTerritorioComponent implements OnDestroy {

  /**
   * @property PANTALLAS_PASOS
   * @description
   * Lista de pasos del wizard, representada como un arreglo de objetos `ListaPasosWizard`.
   *
   * @type {ListaPasosWizard[]}
   */
  public PANTALLAS_PASOS: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * Alias para compatibilidad con template
   */
  public get pasosSolicitar(): ListaPasosWizard[] {
    return this.PANTALLAS_PASOS;
  }

  /**
   * Índice del paso actual en el asistente.
   */
  INDICE: number = 1;

  /**
   * Alias para compatibilidad con template
   */
  public get indice(): number {
    return this.INDICE;
  }

  /**
   * Índice de la pestaña seleccionada.
   */
  TAB_INDEX: number = 1;

    /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;

  /**
   * @description
   * Indica si el formulario del paso uno es válido.
   * @type {boolean}
   */
  esFormaValido: boolean = false;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public errorAlerta = ERROR_ALERTA;

  /**
   * @property TITULO_PASO_UNO
   * @description
   * Título del paso actual en el wizard.
   * @type {string}
   */
  public TITULO_PASO_UNO: string = TITULO_PASO_UNO;

  /**
   * @property PASO_DOS_TITULO
   * @description
   * Título del segundo paso en el wizard.
   * @type {string}
   */
  PASO_DOS_TITULO: string = TITULO_PASO_DOS;

  /**
   * @property PASO_TRES_TITULO
   * @description
   * Título del tercer paso en el wizard.
   * @type {string}
   */
  PASO_TRES_TITULO: string = TITULO_PASO_TRES;

  /**
   * @property AVISO_HTML
   * @type {string}
   *  Texto del aviso de privacidad en formato HTML.
   */
  AVISO_HTML = AVISO.Aviso;

  /**
   * Indica si la carga de documentos está en progreso.
   * Se inicializa en true para indicar que la carga está en progreso al inicio.
   */
  CARGA_EN_PROGRESO: boolean = true;

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  SECCION_CARGAR_DOCUMENTOS: boolean = true;

  /**
   * @property ACTIVAR_BOTON_CARGA_ARCHIVOS
   * @description
   * Indica si el botón para cargar archivos debe estar activo o no.
   *
   * @type {boolean}
   */
  ACTIVAR_BOTON_CARGA_ARCHIVOS: boolean = false;

  /**
   * @property solicitudState
   * @description
   * Estado del trámite de importaciones agropecuarias.
   *
   * @type {Solicitud2614State}
   */
  solicitudState!: Solicitud2614State;

  /**
   * @property solicitud261401State
   * @description
   * Estado específico del trámite 261401.
   *
   * @type {Solicitud261401State}
   */
  solicitud261401State!: Solicitud261401State;

  /**
   * Referencia a la función generadora de mensajes de error relacionados
   * con el proceso de cálculo.
   */
  public MENSAJE_CORREGIR_ERRORES = MENSAJE_CORREGIR_ERRORES;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Referencia al componente del asistente (wizard).
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /**
   * Mensaje de alerta utilizado en el componente.
   * Puede ser asignado a cualquiera de las claves definidas en TEXTOS.
   */
  public alert_message: string = AVISO.Aviso;

  /**
   * Datos relacionados con los pasos del asistente.
   * Incluye el número total de pasos, el índice actual y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.PANTALLAS_PASOS.length,
    indice: this.INDICE,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

    /**
   * @description
   * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Folio temporal de la solicitud.
   * @description
   */
  public folioTemporal: number = 0;
  /**
   * @description
   * Constructor del componente.
   * Inyecta el servicio de validación de formularios.
   * @param solicitudImportacionAmbulanciaService Servicio para gestionar las importaciones agropecuarias.
   * @param tramite2614Store Store para gestionar el estado del trámite 2614.
   * @param tramite2614Query Query para consultar el estado del trámite 2614.
   * @param tramite261401Store Store para gestionar el estado del trámite 261401.
   * @param tramite261401Query Query para consultar el estado del trámite 261401.
   * @param toastrService Servicio para mostrar notificaciones tipo toast.
   */
  constructor(
    private solicitudImportacionAmbulanciaService: SolicitudImportacionAmbulanciaService,
    private tramite2614Store: Tramite2614Store,
    private tramite2614Query: Tramite2614Query,
    private tramite261401Store: Tramite261401Store,
    private tramite261401Query: Tramite261401Query,
    private toastrService: ToastrService
  ) {
    this.tramite2614Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((solicitudState) => {
            // console.log('Updated solicitudState (2614):', solicitudState);
            // console.log('destinatarioDatos in solicitudState:', solicitudState?.destinatarioDatos);
        this.solicitudState = solicitudState;
      });
    
    this.tramite261401Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((solicitud261401State) => {
            // console.log('Updated solicitud261401State:', solicitud261401State);
            // console.log('mercanciaTabla in solicitud261401State:', solicitud261401State?.mercanciaTabla);
            // console.log('destinatarios in solicitud261401State:', solicitud261401State?.destinatarios);
        this.solicitud261401State = solicitud261401State;
      });
  }

  /**
   * Método para manejar el evento de carga en progreso.
   * @param carga Indica si la carga está en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.CARGA_EN_PROGRESO = carga;
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   * @param cargaRealizada Indica si la carga de documentos se realizó correctamente.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.SECCION_CARGAR_DOCUMENTOS = cargaRealizada ? false : true;
  }

  /**
   * Emite un evento para cargar archivos.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado del botón de carga de archivos.
   * @param carga Indica si la carga de documentos está activa o no.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.ACTIVAR_BOTON_CARGA_ARCHIVOS = carga;
  }

  /**
   * Gets the idSolicitud from the appropriate state
   */
  get idSolicitudActual(): number {
    return this.solicitud261401State?.idSolicitud || 0;
  }

  /**
   * Cleanup when component is destroyed
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  
  /**
   * Returns a default ConsultaioState object with all required properties.
   */
  private static getDefaultConsultaioState(): ConsultaioState {
    return {
      procedureId: '0',
      parameter: '',
      department: '',
      folioTramite: '',
      tipoDeTramite: '',
      estadoDeTramite: '',
      readonly: false,
      create: false,
      update: false,
      consultaioSolicitante: {
        folioDelTramite: '',
        fechaDeInicio: '',
        estadoDelTramite: '',
        tipoDeTramite: ''
      },
      action_id: '',
      current_user: '',
      id_solicitud: '',
      nombre_pagina: ''
    };
  }

  /**
   * Returns a default PagoDerechosState object with all required properties.
   */
  private static getDefaultPagoDerechosState(): PagoDerechosState {
    return {
      claveReferencia: '',
      cadenaDependencia: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
      importePago: '', // Fixed: was importe, now importePago to match interface
      estado: ''
    };
  }
  /**
   * Validates the current step based on combined state from service
   * @returns true if valid, false otherwise
   */
  private validateCurrentStep(): boolean {
    let isValid = false;
    this.solicitudImportacionAmbulanciaService.getAllState()
      .pipe(take(1))
      .subscribe((combinedState: CombinedState) => {
        const SOLICITUD2614 = combinedState.solicitud2614;
        const SOLICITUD261401 = combinedState.solicitud261401;
        
        if (!SOLICITUD2614?.observaciones || !SOLICITUD261401) {
          isValid = false;
          return;
        }
        
        if (!SOLICITUD2614?.destinatarioDatos || SOLICITUD2614.destinatarioDatos.length === 0) {
          isValid = false;
          return;
        }
        
        isValid = true;
      });
    
    return isValid;
  }

  /**
   * Cambia el índice del paso actual en el asistente.
   * Si la acción es "cont", avanza al siguiente paso.
   * Si la acción no es "cont", retrocede al paso anterior.
   * 
   * Param e Objeto que contiene la acción y el valor del índice.
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    if (this.INDICE === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      // Validate current step form data directly from state
      const IS_VALID = this.validateCurrentStep();
      if (IS_VALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore(e);
    } else {
      this.pasoNavegarPor(e);
    }
  }

  /**
   * Collects all form data from the combined state.
   * @returns An object containing all relevant form data.
   */
  private collectAllFormData(): Record<string, unknown> {
    const ALL_DATA: Record<string, unknown> = {};
    
    try {
      // Obtener datos del formulario compartido (datos de la solicitud)
      if (this.pasoUnoComponent?.datosContainer?.datosFormComponent?.formulario) {
        const SHARED_FORM_DATA = this.pasoUnoComponent.datosContainer.datosFormComponent.formulario.getRawValue();
        Object.assign(ALL_DATA, SHARED_FORM_DATA);
      }

      let destinatarioData: unknown[] = [];
      
      if (this.pasoUnoComponent?.tercerosRelacionadosContenedoraComponent?.tercerosRelacionadosComponent?.tableData) {
        const COMPONENT_DATA = this.pasoUnoComponent.tercerosRelacionadosContenedoraComponent.tercerosRelacionadosComponent.tableData;
        if (Array.isArray(COMPONENT_DATA) && COMPONENT_DATA.length > 0) {
          destinatarioData = COMPONENT_DATA;
              // console.log('Using destinatario data from component:', COMPONENT_DATA);
        }
      }
      
      if (destinatarioData.length === 0) {
        if (this.solicitudState?.destinatarioDatos && Array.isArray(this.solicitudState.destinatarioDatos) && this.solicitudState.destinatarioDatos.length > 0) {
          destinatarioData = this.solicitudState.destinatarioDatos;
        } else if (this.solicitud261401State?.destinatarios && Array.isArray(this.solicitud261401State.destinatarios) && this.solicitud261401State.destinatarios.length > 0) {
          destinatarioData = this.solicitud261401State.destinatarios;
        }
      }
      
      ALL_DATA['destinatarioDatos'] = destinatarioData;
      if (this.solicitud261401State?.mercanciaTabla && Array.isArray(this.solicitud261401State.mercanciaTabla) && this.solicitud261401State.mercanciaTabla.length > 0) {
        ALL_DATA['mercanciaTabla'] = this.solicitud261401State.mercanciaTabla;
      } else {
        ALL_DATA['mercanciaTabla'] = [];
      }

      // Obtener datos de pago
      if (this.pasoUnoComponent?.datosContainer?.pagosContainer?.component?.pagosForm) {
        const PAGOS_DATA = this.pasoUnoComponent.datosContainer.pagosContainer.component.pagosForm.getRawValue();
        Object.assign(ALL_DATA, PAGOS_DATA);
      }
      return ALL_DATA;
    } catch (error) {
      return {};
    }
  }

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.solicitudImportacionAmbulanciaService
      .getAllState()
      .pipe(take(1))
      .subscribe((data: CombinedState) => {
        this.guardar({ consultaio: data.consultaio, pagoDerechos: data.pagoDerechos }, e);
      });
  }

  /**
   * Guarda los datos del trámite en el servidor.
   * @param item Estado actual del trámite.
   * @param e Acción del botón que indica la navegación entre pasos.
   */
  guardar(item: { consultaio?: unknown; pagoDerechos?: unknown }, e: AccionBoton): Promise<JSONResponse> {
    return new Promise((resolve, reject) => {
      this.solicitudImportacionAmbulanciaService.getAllState()
        .pipe(take(1))
        .subscribe({
          next: (combinedState: CombinedState) => {
            // Recopile datos del formulario de todos los componentes.
            const DATOS_STATE = this.collectAllFormData();
            const PAYLOAD = SolicitudImportacionAmbulanciaService.getPayloadDatos(
              combinedState.solicitud261401,
              DATOS_STATE,
              combinedState.solicitud2614,
              (item.consultaio as ConsultaioState) || SolicitudModificacionPermisoSalidaTerritorioComponent.getDefaultConsultaioState(),
              (item.pagoDerechos as PagoDerechosState) || SolicitudModificacionPermisoSalidaTerritorioComponent.getDefaultPagoDerechosState()
            ) as Record<string, unknown>;

            this.solicitudImportacionAmbulanciaService.guardarDatos(PAYLOAD).subscribe({
              next: (response) => {
                this.handleSaveResponse(response, e, resolve, reject);
              },
              error: (error) => {
                this.toastrService.error('Error al guardar los datos');
                reject(error);
              }
            });
          },
          error: (error) => {
            this.toastrService.error('Error al obtener el estado del formulario');
            reject(error);
          }
        });
    });
  }

  /**
   * Maneja la respuesta de la API de la operación de guardado
   * @param response Respuesta de la API
   * @param e Evento del botón de acción
   * @param resolve Función de resolución de la promesa
   * @param reject Función de rechazo de la promesa
   */
  private handleSaveResponse(
    response: JSONResponse, 
    e: AccionBoton, 
    resolve: (value: JSONResponse) => void, 
    reject: (reason?: unknown) => void
  ): void {
    this.esFormaValido = false;

    if (response.codigo === '3') {
      const ERROR_RESPONSE = response as JSONResponse & { error?: string };
      this.errorAlerta = this.MENSAJE_CORREGIR_ERRORES(
        ERROR_RESPONSE?.error || 'Error en la validación'
      );
      reject(new Error(ERROR_RESPONSE?.error || 'Error en la validación'));
      return;
    }

    const SHOULD_NAVIGATE = response.codigo === '00';
    
    if (!SHOULD_NAVIGATE) {
      const CAUSA_RESPONSE = response as JSONResponse & { causa?: string };
      if (CAUSA_RESPONSE?.causa) {
        this.esFormaValido = true;
        this.errorAlerta = this.MENSAJE_CORREGIR_ERRORES(CAUSA_RESPONSE.causa);
      }
          // this.toastrService.error(response.mensaje || 'Error en la operación');
      reject(new Error(response.mensaje || 'Error en la operación'));
      return;
    }
    
    if (SHOULD_NAVIGATE) {
      this.handleSaveSuccess(response, e);
          // this.toastrService.success(response.mensaje || 'Operación exitosa');
      resolve(response);
    }
  }

  /**
   * Maneja la operación de guardado exitosa
   * @param response Respuesta de la API
   * @param e Evento del botón de acción
   */
  private handleSaveSuccess(response: JSONResponse, e: AccionBoton): void {
    const API_RESPONSE = doDeepCopy(response);
    
    if (esValidObject(API_RESPONSE?.datos)) {
      if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
        this.folioTemporal = API_RESPONSE.datos.idSolicitud || API_RESPONSE.datos.id_solicitud;
      }
      
      this.navigateWizard(e);
    }
  }

  /**
   * Maneja la navegación del asistente según la acción
   * @param e Evento del botón de acción
   */
  private navigateWizard(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.INDICE = e.valor;
      
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
        this.alertaNotificacion = {
          tipoNotificacion: 'banner',
          categoria: 'success',
          modo: 'action',
          titulo: '',
          mensaje: MSG_REGISTRO_EXITOSO(String(this.folioTemporal)),
          cerrar: true,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        };
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Obtiene el valor del índice según la acción del botón.
   * @param e Acción del botón.
   */
  pasoNavegarPor(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.INDICE = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

}
