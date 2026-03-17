import {
  AVISO,
  AccionBoton,
  DatosPasos,
  JSONResponse,
  ListaPasosWizard,
  Notificacion,
  RegistroSolicitudService,
  doDeepCopy,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';

import { ERROR_FORMA_ALERT, MSG_REGISTRO_EXITOSO, PASOS, TITULO_MENSAJE } from '../../constants/importacion-materias-primas.enum';
import { Tramite260604State, Tramite260604Store } from '../../estados/tramite260604Store.store';
import { ExportacionService } from '../../services/exportacion.service';
import { GuardarAdapter_260604 } from '../../adapters/guardar-payload.adapter';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260604Query } from '../../estados/tramite260604Query.query';
import { WizardComponent } from '@ng-mf/data-access-user';
import { take } from 'rxjs';
/**
 * @component
 * @name ContenedorDePasosComponent
 * @description
 * Este componente es un contenedor para manejar los pasos de un wizard (asistente).
 * Permite la navegación entre diferentes pasos y actualiza el título del mensaje
 * según el paso seleccionado.
 *
 * @selector app-contenedor-de-pasos
 * @standalone true
 * @imports
 * - CommonModule
 * - WizardComponent
 * - PasoUnoComponent
 * - PasoDosComponent
 * - PasoTresComponent
 * - BtnContinuarComponent
 */
@Component({
  selector: 'app-contenedor-de-pasos',
  templateUrl: './contenedor-de-pasos.component.html',
  styleUrl: './contenedor-de-paso.component.scss',
})
export class ContenedorDePasosComponent implements OnInit {
  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * @property {string | null} tituloMensaje
   * @description Título del mensaje que se muestra en el wizard.
   * Inicializado con el valor de `TITULOMENSAJE`.
   */

  tituloMensaje: string | null = TITULO_MENSAJE;

  /**
   * @property {ListaPasosWizard[]} pasos
   * @description Lista de pasos del wizard.
   * Inicializado con el valor de `PASOS`.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {number} indice
   * @description Índice actual del paso seleccionado en el wizard.
   * Inicializado con el valor `1`.
   */
  indice: number = 1;

  TEXTOS: string = AVISO.Aviso;

  /**
   * @property {Tramite260604State} storeData
   * @description Estado de la tienda para el trámite 260604.
   */
  storeData!: Tramite260604State;

  /**
   *
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  public infoAlert = 'alert-info';

  /**
   * Clase CSS para mostrar una alerta de error.
   */
  infoError = 'alert-danger text-center';

  /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
  public formErrorAlert!: string;

  /**
   * @property {WizardComponent} wizardComponent
   * @description Referencia al componente del wizard.
   * Utilizado para manejar la navegación entre pasos.
   */
  @ViewChild("wizzard") wizardComponent!: WizardComponent;

  /**
    * @property {PasoUnoComponent} pasoUnoComponent
    * @description
    * Referencia al componente hijo `PasoUnoComponent` mediante
    * `@ViewChild`. Permite acceder a sus métodos y propiedades
    * desde este componente padre.
  */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /**
   * @property {DatosPasos} datosPasos
   * @description Objeto que contiene información sobre los pasos del wizard.
   * Incluye el número total de pasos, el índice actual y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;

  /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

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
 * @property {string} MENSAJE_DE_ERROR
 * @description
 * Propiedad usada para almacenar el mensaje de error actual.
 * Se inicializa como cadena vacía y se actualiza en función
 * de las validaciones o errores capturados en el flujo.
 */
  MENSAJE_DE_ERROR: string = ERROR_FORMA_ALERT;

  /**
  * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
  */
  esFormaValido: boolean = false;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

  /** Indica si se requieren datos de pago. */
  public requiresPaymentData: boolean = false;

  /** Indica si se confirmó la ausencia de pago de derechos. */
  public confirmarSinPagoDeDerechos: number = 0;

/** Almacena el folio temporal asignado a la solicitud.*/
  folioTemporal: string | number = '';

  /**
   * Initializes a new instance of the ContenedorDePasosComponent.
   *
   * @param tramite260604Query - Service for querying tramite 260604 related data.
   * @param tramite260604Store - Store for managing tramite 260604 state.
   * @param registroSolicitudService - Service for handling solicitud registration logic.
   * @param toastrService - Service for displaying toast notifications.
   * @param exportacionService - Service for managing exportation-related operations.
   */
  /**
   * Constructor del componente ContenedorDePasosComponent.
   * Inicializa los servicios y dependencias necesarias.
   * 
   * @param tramite260604Query Servicio para consultar datos relacionados con el trámite 260604.
   * @param tramite260604Store Almacén para gestionar el estado del trámite 260604.
   * @param registroSolicitudService Servicio para manejar la lógica de registro de solicitudes.
   * @param toastrService Servicio para mostrar notificaciones tipo toast.
   * @param exportacionService Servicio para operaciones relacionadas con exportación.
   */
  constructor(
    private tramite260604Query: Tramite260604Query,
    private tramite260604Store: Tramite260604Store,
    public registroSolicitudService: RegistroSolicitudService,
    private toastrService: ToastrService,
    public exportacionService: ExportacionService
  ) { }

  /**   * Hook de inicialización del componente.
   * Suscribe los observables para mostrar los datos en la vista.
   */
  ngOnInit(): void {
    this.tramite260604Query.selectTramiteState$.pipe().subscribe((data) => {
      this.storeData = data;
    });
  }

  /**
   * @method seleccionaTab
   * @description Cambia el índice actual al valor proporcionado.
   * @param {number} i - Índice del paso seleccionado.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method getValorIndice
   * @description Actualiza el índice y el título del mensaje según la acción del botón.
   * Navega hacia adelante o hacia atrás en el wizard.
   * @param {AccionBoton} e - Objeto que contiene el valor del índice y la acción ('cont' o 'atras').
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;

    // Paso 1 y acción continuar
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;

      const ISVALID = this.validarTodosFormulariosPasoUno();
      
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore();
    }
    // Navegación normal
    else if (e.valor > 0 && e.valor <= this.pasos.length) {
      this.pasoNavegarPor(e);
    }
  }
  /**
   * Obtiene los datos del store y los guarda.
   */
  obtenerDatosDelStore(): void {
    this.exportacionService.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);
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
          this.seleccionarFilaNotificacion = {
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
    const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validarPasoUno();    
    if (!ISFORM_VALID_TOUCHED) {
      
      return false;
    }
    return true;
  }

  /**
   * @method guardar
   * @description Guarda los datos del trámite en el servidor.
   */
  guardar(data: Tramite260604State): Promise<JSONResponse> {
    const PAYLOAD = GuardarAdapter_260604.toFormPayload(data);

    return new Promise((resolve, reject) => {
      this.registroSolicitudService.postGuardarDatos('260604', PAYLOAD).subscribe(response => {
        const API_RESPONSE = doDeepCopy(response);
        if (esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
          if (getValidDatos(API_RESPONSE.datos.id_solicitud || API_RESPONSE.datos.idSolicitud)) {
            this.folioTemporal = API_RESPONSE.datos.idSolicitud || API_RESPONSE.datos.id_solicitud;
            this.tramite260604Store.setIdSolicitud((API_RESPONSE.datos.id_solicitud || API_RESPONSE.datos.idSolicitud));
            this.pasoNavegarPor({ accion: 'cont', valor: 2 });
          } else {
            this.tramite260604Store.setIdSolicitud(0);
          }
        } else {
        this.toastrService.error(response.mensaje);
        }
      }, error => {
        reject(error);
      });
    });
  }
  /**
   * @method obtenerNombreDelTítulo
   * @description Devuelve el título correspondiente al paso actual.
   * @param {number} valor - Índice del paso.
   * @returns {string} Título del paso.
   */
  static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return TITULO_MENSAJE;
      case 2:
        return 'Cargar archivos';
      case 3:
        return 'Firmar';
      default:
        return TITULO_MENSAJE;
    }
  }

  public static generarAlertaDeError(mensajes: string): string {
    const ALERTA = `
      <div class="d-flex justify-content-center text-center">
        <div class="col-md-12 p-3  border-danger  text-danger rounded">
          <div class="mb-2 text-secondary" >Corrija los siguientes errores:</div>

          <div class="d-flex justify-content-start mb-1">
            <span class="me-2">1.</span>
            <span class="flex-grow-1 text-center">${mensajes}</span>
          </div>  
        </div>
      </div>
      `;
    return ALERTA;
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
   * @method blancoObligatoria
   * @description Método para manejar el evento de documentos obligatorios en blanco.
   * Actualiza la bandera `isSaltar` basada en el estado recibido.
   * @param {boolean} enBlanco - Indica si hay documentos obligatorios en blanco.
   * @return {void}
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

  /**
   * @method saltar
   * @description
   * Método para saltar directamente al paso de firma en el wizard.
   * Actualiza los índices correspondientes y ejecuta la transición
   * forward en el componente wizard.
   */
  saltar(): void {
    this.indice = 3;
    this.datosPasos.indice = 3;
    this.wizardComponent.siguiente();
  }

  /** 
   *  @method cerrarModal
   * @description
   * Maneja el cierre del modal de alerta y actualiza el estado
   * de la solicitud según la confirmación del usuario.
   *
   * @param {boolean} value - Indica si el usuario confirmó la acción.
   */
  cerrarModal(value: boolean): void {
    if (value) {
      this.mostrarAlerta = false;
      this.requiresPaymentData = true;
    } else {
      this.mostrarAlerta = false;
      this.confirmarSinPagoDeDerechos = 3;
    }
  }

}
