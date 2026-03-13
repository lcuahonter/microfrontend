import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AVISO_CONTRNIDO, DatosPasos, JSONResponse, ListaPasosWizard, Notificacion, PASOS2, WizardComponent, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { ERROR_FORMA_ALERT, MSG_REGISTRO_EXITOSO } from '../../enum/certificado.enum';
import { Solicitud110201State, Tramite110201Store } from '../../state/Tramite110201.store';
import { Subject, map, take, takeUntil } from 'rxjs';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Solicituds110201State } from '../../state/tramites110201.store';
import { Solocitud110201Service } from '../../services/service110201.service';
import { Tramite110201Query } from '../../state/Tramite110201.query';
import { SolicitanteService } from 'libs/shared/data-access-user/src/core/services/shared/solicitante/solicitante.service';
/**
 * Texto de alerta para terceros.
 */
const TERCEROS_TEXTO_DE_ALERTA =
  'La solicitud ha quedado registrada con el número temporal 202757598 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.';

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

/**
 * Componente que representa la página de solicitud.
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
})
/**
 * Componente que representa la página de solicitud.
 */
export class SolicitudPageComponent implements OnInit, OnDestroy {
  /**
   * Texto de alerta que se muestra a los terceros.
   */
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;

  /**
   * Lista de pasos del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS2;

  /**
   * Indica si se debe mostrar el botón de continuar (controla la visibilidad según el estado de carga de archivo).
   */
  cargarArchivo: boolean = true;

  /**
   * Índice del paso actual en el asistente.
   */
  indice: number = 1;

  /**
    * @property {boolean} esFormaValido
    * @description
    * Indica si el formulario del paso actual es válido.
    * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
    */
  esFormaValido: boolean = false;
 /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;
    /**
     * Contiene el texto del aviso de privacidad simplificado.
     *
     * @constant {string} avisoContrnido
     * Se inicializa con la propiedad `aviso` del objeto `AVISO_CONTRNIDO`.
     *
     * Uso:
     * - Mostrar el aviso de privacidad en la interfaz de usuario.
     * - Reutilizar el contenido del aviso en distintos componentes.
     */
    avisoContrnido = AVISO_CONTRNIDO.aviso;
  /**
   * URL de la página actual.
   */
  public solicitudState!: Solicitud110201State;

  /**
    * @property {string} formErrorAlert
    * @description
    * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
    */
  public formErrorAlert = ERROR_FORMA_ALERT;
  /**
   * @property {PasoUnoComponent} pasoUnoComponent
   * @description
   * Referencia al componente hijo `PasoUnoComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario del primer paso del asistente desde el componente padre.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
  /**
   * Referencia al componente del asistente (wizard).
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /**
   * Subject para notificar la destrucción del componente y cancelar suscripciones.
   * Se utiliza para evitar fugas de memoria al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Datos de los pasos del asistente, incluyendo textos de botones y el índice actual.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
* Indica si la sección de carga de documentos está activa.
* Se inicializa en true para mostrar la sección de carga de documentos al inicio.
*/
  seccionCargarDocumentos: boolean = true;

  /**
   * Indica si hay un proceso de carga en progreso.
   * Se establece en `true` cuando se están cargando datos o recursos, y en `false` cuando la carga ha finalizado.
   */
  cargaEnProgreso: boolean = true;
  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Evento que se emite para regresar a la sección de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe regresar a la sección de carga de documentos.
   */
  regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

  /**
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;
  /**
 * Estado del tramite Folio
 */
  public folioTemporal: number = 0;
  /**
   * Indica si ya se cargaron los datos de respuesta para mostrar en el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
 * Indica si el formulario de estado es válido.
 * Se utiliza para mostrar mensajes de error relacionados con la selección de estado.
 * Si es true, se muestra el mensaje de error correspondiente en la interfaz.
 */
  esFormaEstadoValido: boolean = false;
  /**
 * Mensaje de error relacionado con la selección de estado.
 * Se muestra cuando el usuario no ha seleccionado un estado válido para la planta o domicilio fiscal.
 */
  formErrorEstadoAlert: string = '';
  
  constructor(
    private solicitanteService: SolicitanteService,
    private tramite110201Store: Tramite110201Store,
    private tramite110201Query: Tramite110201Query,
    private solocitud110201Service: Solocitud110201Service,
  ) { }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de la sección y obtiene la URL actual.
   * Si el estado de la consulta indica que hay datos actualizados, se guardan los datos del formulario.
   * Si no, se establece que hay datos de respuesta disponibles.
   */
  ngOnInit(): void {
    this.tramite110201Query.selectSolicitud$
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

  /**
   * Obtiene el valor del índice de la acción del botón y controla la navegación del asistente.
   * @param e Acción del botón.
   */
 getValorIndice(e: AccionBoton): void {
    const estado = localStorage.getItem('estado');
    this.esFormaValido = false;
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID = this.validarTodosFormulariosPasoUno();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      if (estado !== this.solicitanteService.catalogoEntidad) {
        this.formErrorEstadoAlert = 'Favor de seleccionar un estado en el que se tenga registrada una planta o su domicilio fiscal';
        this.esFormaEstadoValido = true;
        return;
      }
      else {
        this.esFormaEstadoValido = false;
      }
      this.obtenerDatosDelStore()
    }
    else if (e.valor > 0 && e.valor <= this.pasos.length) {
        if (estado !== this.solicitanteService.catalogoEntidad) {
        this.formErrorEstadoAlert = 'Favor de seleccionar un estado en el que se tenga registrada una planta o su domicilio fiscal';
        this.esFormaEstadoValido = true;
        return;
      }
      else {
        this.esFormaEstadoValido = false;
      }
      this.pasoNavegarPor(e);
    }
  }

      /**
    * Guarda los datos proporcionados en el parámetro `item` construyendo un objeto payload y enviándolo al servicio backend.
    * El payload incluye información del solicitante, certificado, destinatario y detalles del certificado.
    *
    * @param item - Objeto que contiene todos los datos necesarios para el payload, incluyendo información del certificado, destinatario y detalles adicionales.
    *
    * @remarks
    * Este método muestra el payload construido en la consola y está diseñado para enviarlo al backend mediante `certificadoService.guardarDatosPost`.
    * La llamada al servicio actualmente está comentada.
    */
     guardar(data: Solicituds110201State): Promise<JSONResponse> {
     const CERTIFICADO = this.solocitud110201Service.buildCertificado(data);
      const DATOS_CERTIFICADO = this.solocitud110201Service.buildDatosCertificado(data);
      const DESTINATARIO = this.solocitud110201Service.buildDestinatario(data);
      const PAYLOAD = {
          rfc_solicitante: 'AAL0409235E6',
          idSolicitud: this.solicitudState.idSolicitud || 0,
          solicitante: {
            rfc: "AAL0409235E6",
            rol_capturista: "PersonaMoral",
            nombre: "ACEROS ALVARADO S.A. DE C.V.",
            actividad_economica: "Fabricación de productos de hierro y acero",
            correo_electronico: "contacto@acerosalvarado.com",
            domicilio: {
              pais: "México",
              codigo_postal: "06700",
              estado: "Ciudad de México",
              municipio_alcaldia: "Cuauhtémoc",
              localidad: "Centro",
              colonia: "Roma Norte",
              calle: "Av. Insurgentes Sur",
              numero_exterior: "123",
              numero_interior: "Piso 5, Oficina A",
              lada: "",
              telefono: "123456"
            }
          },
          certificado: CERTIFICADO,
          destinatario: DESTINATARIO,
          datos_del_certificado: DATOS_CERTIFICADO
        };
    
         return new Promise((resolve, reject) => {
               this.solocitud110201Service.guardarDatosPost(PAYLOAD).subscribe(response => {
                 const API_RESPONSE = doDeepCopy(response);
                 if(esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
                   if(getValidDatos(API_RESPONSE.datos.id_solicitud ||API_RESPONSE.datos.idSolicitud )) {
                      this.folioTemporal = API_RESPONSE.datos.id_solicitud;
                     this.tramite110201Store.setIdSolicitud((API_RESPONSE.datos.id_solicitud ||API_RESPONSE.datos.idSolicitud));
                     this.pasoNavegarPor({ accion: 'cont', valor: 2 });
                   } else {
                     this.tramite110201Store.setIdSolicitud(0);
                   }
                 }
                 resolve(response);
               }, error => {
                 reject(error);
               });
               });
      }
  /**
   * Navega a través de los pasos del asistente según la acción del botón.
   * @param e Objeto que contiene la acción y el valor del índice al que se desea navegar.
   */
  pasoNavegarPor(e: AccionBoton): void {
    this.indice = e.valor;
    this.datosPasos.indice = e.valor;
    if (e.valor > 0 && e.valor < 5) {
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
        if (e.valor > 0 && e.valor < 5) {
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

        }
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
  * Obtiene los datos del store y los guarda utilizando el servicio.
  */
  obtenerDatosDelStore(): void {
    this.solocitud110201Service.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);
        
      });
  }
  /**
   * @method validarTodosFormulariosPasoUno
   * @description
   * Valida todos los formularios del componente `PasoUnoComponent`.
   * Si la referencia al componente no existe, retorna `true` (no hay formularios que validar).
   * Llama al método `validarFormularios()` del componente hijo y retorna `false` si algún formulario es inválido.
   * Retorna `true` si todos los formularios son válidos.
   *
   * @returns {boolean} Indica si todos los formularios del paso uno son válidos.
   */
  private validarTodosFormulariosPasoUno(): boolean {
    if (!this.pasoUnoComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validateAll();
    if (!ISFORM_VALID_TOUCHED) {
      return false;
    }
    return true;
  }

  /**
   * Actualiza el estado de carga de archivo, permitiendo mostrar u ocultar el botón de continuar.
   * Este método es llamado desde un componente hijo mediante un evento.
   * @param data Valor booleano que indica si se está cargando un archivo.
   */
  cargaArchivo(data: boolean): void {
    this.cargarArchivo = data;
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
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
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
  * Método para manejar el evento de carga de documentos.
  * Actualiza el estado del botón de carga de archivos.
  *  carga - Indica si la carga de documentos está activa o no.
  * {void} No retorna ningún valor.
  */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }
/**
   * Método que se ejecuta al destruir el componente.
   *
   * Este método emite un valor al `destroyNotifier$` y lo completa para cancelar
   * todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}