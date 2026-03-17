import { AVISO_PRIVACIDAD, ERROR_FORMA_ALERT, MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS, PASOS, TITULO_MENSAJE } from '../../constants/importacion-materias-primas.enum';
import {
  AccionBoton,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  RegistroSolicitudService,
  WizardComponent,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Tramite260202State, Tramite260202Store } from '../../estados/tramite260202Store.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { GuardarAdapter_260202 } from '../../adapters/guardar-payload.adapter';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260202Query } from '../../estados/tramite260202Query.query';

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

    /**
     * Identificador del tipo de trámite.
     * Valor estático usado en llamadas al servicio para asociar acciones al trámite 260202.
     */
    idTipoTramite: string = '260202';
  /**
   * @property {WizardComponent} wizardComponent
   * @description Referencia al componente del wizard.
   * Utilizado para manejar la navegación entre pasos.
   */
  @ViewChild("wizzard") wizardComponent!: WizardComponent;

  @ViewChild('pasoUno') pasoUnoComponent!: PasoUnoComponent;

  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
     * Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
     */
    TEXTOS = AVISO_PRIVACIDAD;

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

  esFormaValido!: boolean;

  /**
   * @property {Tramite260202State} storeData
   * @description Estado de la tienda para el trámite 260202.
   */
  storeData!: Tramite260202State;

  /**
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;

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
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

   public requiresPaymentData: boolean = false;

   public confirmarSinPagoDeDerechos: number = 0;

  /**
   * @property {string} MENSAJE_DE_ERROR
   * @description
   * Propiedad usada para almacenar el mensaje de error actual.
   * Se inicializa como cadena vacía y se actualiza en función
   * de las validaciones o errores capturados en el flujo.
   */
  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

  /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

  /**
   * @property {AccionBoton} accionDelBoton
   * @description
   * Almacena la acción del botón presionado en el wizard (continuar o anterior).
   * Permite controlar la navegación y el flujo de validaciones según la interacción del usuario.
   */
  accionDelBoton!: AccionBoton;

  constructor(private tramite260202Query: Tramite260202Query, private tramite260202Store: Tramite260202Store, public registroSolicitudService: RegistroSolicitudService, private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.tramite260202Query.selectTramiteState$.pipe().subscribe((data) => {
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
	  this.accionDelBoton = e;
    this.esFormaValido = false;

   if (e.accion === 'cont') {
      let isValid = true;
      if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = this.requiresPaymentData ? this.pasoUnoComponent.validarPasoUno() : this.pasoUnoComponent.validarTodosLosPasos();
      }
      if(!this.pasoUnoComponent.datosSolicitud?.validarFormularioDatos() && this.requiresPaymentData) {
        this.confirmarSinPagoDeDerechos = 2;
      }else {
        this.confirmarSinPagoDeDerechos = 3;
      }
      if(!this.requiresPaymentData) {
        if(!this.pasoUnoComponent.pagoDeDerechos.validarFormulario()){
          this.mostrarAlerta=true;
          this.seleccionarFilaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE_DE_VALIDACION_PAGO_DERECHOS,
            cerrar: true,
            tiempoDeEspera: 2000,
            txtBtnAceptar: 'SI',
            txtBtnCancelar: 'NO',
            alineacionBtonoCerrar:'flex-row-reverse'
          }
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        } else if(this.pasoUnoComponent.pagoDeDerechos.validarFormulario() && !this.pasoUnoComponent.datosSolicitud?.validarFormularioDatos()) {
          this.confirmarSinPagoDeDerechos = 2;
        } else if(this.pasoUnoComponent.pagoDeDerechos.validarFormulario() && this.pasoUnoComponent.datosSolicitud?.validarFormularioDatos() && !this.pasoUnoComponent.tercerosRelacionados.validarFormulario()) {
          this.confirmarSinPagoDeDerechos = 3;
        } else if(this.pasoUnoComponent.pagoDeDerechos.validarFormulario() && this.pasoUnoComponent.datosSolicitud?.validarFormularioDatos() && this.pasoUnoComponent.tercerosRelacionados.validarFormulario()) {
          this.postGuardarDatos(e);
        }
      }
      if (!isValid) {
        this.formErrorAlert = this.MENSAJE_DE_ERROR;
        this.esFormaValido = true;
        this.datosPasos.indice = this.indice;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      }
      else if(isValid && this.requiresPaymentData){
        this.postGuardarDatos(e);
      }
    }else{
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.atras();
    }
  }
             
  /**
   * Método que se ejecuta después de guardar los datos.
   * Actualmente no realiza ninguna acción.
   */
  postGuardarDatos(e: AccionBoton): void {
    const PAYLOAD = GuardarAdapter_260202.toFormPayload(this.storeData);
      let shouldNavigate = false;
      this.registroSolicitudService.postGuardarDatos(this.idTipoTramite, PAYLOAD).subscribe(response => {
        shouldNavigate = response.codigo === '00';
        if (!shouldNavigate) {
          const ERROR_MESSAGE = response.error || 'Error desconocido en la solicitud';
          this.formErrorAlert = ContenedorDePasosComponent.generarAlertaDeError(ERROR_MESSAGE);
          this.esFormaValido = false;
          this.indice = 1;
          this.datosPasos.indice = 1;
          this.wizardComponent.indiceActual = 1;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }
        if(shouldNavigate) {
          this.navigateToPasoDos(e, response);
        } else {
          this.toastrService.error(response.mensaje);
        }
      });
  }

  navigateToPasoDos(e: AccionBoton, response: BaseResponse<unknown>): void {
    this.esFormaValido = false;
    if(esValidObject(response) && esValidObject(response.datos)) {
      const DATOS = response.datos as { id_solicitud?: number };
      if(getValidDatos(DATOS.id_solicitud)) {
        this.tramite260202Store.setIdSolicitud(DATOS.id_solicitud ?? 0);
      } else {
        this.tramite260202Store.setIdSolicitud(0);
      }
    }
    // Calcular el nuevo índice basado en la acción
    let indiceActualizado = e.valor;
    if (e.accion === 'cont') {
      indiceActualizado = e.valor;
    }
    this.toastrService.success(response.mensaje);
    if (indiceActualizado > 0 && indiceActualizado < 5) {
      this.indice = indiceActualizado;
      this.datosPasos.indice = indiceActualizado;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  public static generarAlertaDeError(mensajes:string): string {
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

  private validarTodosFormulariosPasoUno(): boolean {
    if (!this.pasoUnoComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validarFormularios();
    if (!ISFORM_VALID_TOUCHED) {
      return false;
    }
    return true;
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

  cerrarModal(value: Event | boolean): void {
    if(value){
      this.mostrarAlerta = false;
      this.requiresPaymentData = true;
       if(!this.pasoUnoComponent.datosSolicitud?.validarFormularioDatos() && this.requiresPaymentData) {
          this.confirmarSinPagoDeDerechos = 2;
        }else {
          this.confirmarSinPagoDeDerechos = 3;
        }
    } else {
      this.mostrarAlerta = false;
      this.confirmarSinPagoDeDerechos = 4;
    }
  }
}
