import { AVISO, AccionBoton, AlertComponent, NotificacionesComponent, PasoCargaDocumentoComponent, RegistroSolicitudService, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS,MSG_REGISTRO_EXITOSO, PASOS, TITULOMENSAJE } from '../../constants/medicos-uso.enum';
import { Tramite260212State, Tramite260212Store } from '../../estados/tramite260212.store';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosPasos } from '@ng-mf/data-access-user';
import { GuardarAdapter_260212 } from '../../adapters/guardar-mapping.adapter';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { Notificacion } from '@ng-mf/data-access-user';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260212Query } from '../../estados/tramite260212.query';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';


/**
 * @component ContenedorDePasosComponent
 * @description Componente contenedor principal del flujo tipo "wizard".
 * Administra la navegación entre los pasos del formulario y la lógica para cambiar de vista,
 * así como el título dinámico mostrado en el encabezado.
 */
@Component({
  selector: 'app-contenedor-de-pasos',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    AlertComponent,
    NotificacionesComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
  ],
  templateUrl: './contenedor-de-pasos.component.html',
  styleUrl: './contenedor-de-paso.component.scss',
})
export class ContenedorDePasosComponent implements OnInit {
  /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;
  /**
   * Clase CSS para mostrar una alerta de error.
   */
  infoError = 'alert-danger text-center';
  /**
   * @property {string} TEXTOS
   * @description
   * Texto de aviso utilizado en el componente.
   */
  TEXTOS: string = AVISO.Aviso;
  /**
   * @property {string} infoAlert
   * @description
   * Clase CSS para aplicar estilos a los mensajes de información.
   */
  public infoAlert = 'alert-info  text-center';
  /**
   * @property {string} tituloMensaje
   * Título principal mostrado en la parte superior según el paso actual.
   */
  tituloMensaje: string = TITULOMENSAJE;

  /**
   * @property {ListaPasosWizard[]} pasos
   * Lista de pasos del wizard obtenidos desde una constante externa.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {number} indice
   * Índice actual del paso seleccionado (empieza en 1).
   */
  indice: number = 1;

 /**
 * Estado del tramite Folio
 */
 public folioTemporal: number = 0;

   /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
   public alertaNotificacion!: Notificacion;

  /**
   * @property {WizardComponent} wizardComponent
   * Referencia al componente Wizard para controlar navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {PasoUnoComponent} pasoUnoComponent
   * @description
   * Referencia al componente hijo `PasoUnoComponent` mediante
   * `@ViewChild`. Permite acceder a sus métodos y propiedades
   * desde este componente padre.
   */
  @ViewChild(PasoUnoComponent)
  pasoUnoComponent!: PasoUnoComponent;

  /**
   * @property {DatosPasos} datosPasos
   * Objeto de configuración utilizado por el componente wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
   */
  idSolicitudState: number | null = 0;

  /**
   * Estado de la solicitud actual.
   *
   * @type {Tramite260212State}
   * @memberof SolicitudPageComponent
   */
  idTipoTRamite: string = '260212';

  /**
   * @property {string} MENSAJE_DE_ERROR
   * @description
   * Propiedad usada para almacenar el mensaje de error actual.
   * Se inicializa como cadena vacía y se actualiza en función
   * de las validaciones o errores capturados en el flujo.
   */
  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

  /**
   * URL de la página actual.
   */
  public solicitudState!: Tramite260212State;

  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   * }
   */
  esFormaValido: boolean = false;

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  /**
   * @property {boolean} requiresPaymentData
   * @description
   * Indica si se requieren datos de pago para continuar con el trámite.
   */
  public requiresPaymentData: boolean = false;

  /**
   * @property {number} confirmarSinPagoDeDerechos
   * @description
   * Indica si se ha confirmado la continuación sin pago de derechos.
   */
  public confirmarSinPagoDeDerechos: number = 0;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * @ignore
   * Este método es ignorado por Compodoc.
   */
  cargaEnProgreso: boolean = true;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert!: string;

  /**
   * @constructor
   * @param tramiteStore - Servicio para manipular el estado del trámite.
   * @param tramiteQuery - Servicio para consultar el estado del trámite.
   * @param toastrService - Servicio para mostrar notificaciones tipo toast.
   * @param registroSolicitudService - Servicio para registrar y guardar la solicitud.
   */
  constructor(
    private tramiteStore: Tramite260212Store,
    private tramiteQuery: Tramite260212Query,
    private toastrService: ToastrService,
    public registroSolicitudService: RegistroSolicitudService
  ) {}

  /**
   * @ngOnInit
   * Inicializa el componente y suscripciones necesarias.
   * Suscribe al estado del trámite para mantener la información actualizada.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectTramiteState$.pipe().subscribe((data) => {
      this.solicitudState = data;
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
   * Maneja el estado de progreso de la carga de documentos.
   * Actualiza la variable `cargaEnProgreso` según el estado recibido.
   * @param carga - Indica si la carga está en progreso (`true`) o no (`false`).
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * @method seleccionaTab
   * @description Cambia el índice actual del wizard manualmente.
   * @param {number} i - Índice del paso al que se desea cambiar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method getValorIndice
   * @description Controla la navegación del wizard según el botón presionado (anterior o continuar).
   * También actualiza el título correspondiente al paso actual.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor y la acción del botón presionado.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.accion === 'cont') {
      let isValid = true;

      if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = this.pasoUnoComponent.validarPasoUno();
      }

      if (
        !this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor() &&
        this.requiresPaymentData
      ) {
        this.confirmarSinPagoDeDerechos = 2;
      } else {
        this.confirmarSinPagoDeDerechos = 3;
      }

      if (!this.requiresPaymentData) {
        if (
          !this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor()
        ) {
          this.mostrarAlerta = true;
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
            alineacionBtonoCerrar: 'flex-row-reverse',
          };
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        } else if (
          this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() &&
          !this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor()
        ) {
          this.confirmarSinPagoDeDerechos = 2;
        } else if (
          this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() &&
          this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor() &&
          !this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()
        ) {
          this.confirmarSinPagoDeDerechos = 3;
        }
      }

      if (!isValid) {
        this.formErrorAlert = this.MENSAJE_DE_ERROR;
        this.esFormaValido = true;
        this.datosPasos.indice = this.indice;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }

      const PAYLOAD = GuardarAdapter_260212.toFormPayload(this.solicitudState);
      let shouldNavigate = false;
      this.registroSolicitudService
        .postGuardarDatos('260212', PAYLOAD)
        .subscribe((response) => {
          shouldNavigate = response.codigo === '00';
          if (!shouldNavigate) {
            const ERROR_MESSAGE =
              response.mensaje || 'Error desconocido en la solicitud';
            this.formErrorAlert =
              ContenedorDePasosComponent.generarAlertaDeError(ERROR_MESSAGE);
            this.esFormaValido = true;
            this.indice = 1;
            this.datosPasos.indice = 1;
            this.wizardComponent.indiceActual = 1;
            setTimeout(
              () => window.scrollTo({ top: 0, behavior: 'smooth' }),
              0
            );
            return;
          }
          if (shouldNavigate) {
            if (esValidObject(response) && esValidObject(response.datos)) {
              this.esFormaValido = false;
              const DATOS = response.datos as { id_solicitud?: number };
              const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud)
                ? DATOS.id_solicitud ?? 0
                : 0;
              this.idSolicitudState = ID_SOLICITUD;
              this.tramiteStore.setIdSolicitud(ID_SOLICITUD);
              this.folioTemporal = ID_SOLICITUD;
            }
            // Calcular el nuevo índice basado en la acción
            let indiceActualizado = e.valor;
            if (e.accion === 'cont') {
              indiceActualizado = e.valor;
            }
            this.toastrService.success(response.mensaje);
            if (indiceActualizado > 0 && indiceActualizado < 5) {
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
              this.indice = indiceActualizado;
              this.datosPasos.indice = indiceActualizado;
              if (e.accion === 'cont') {
                this.wizardComponent.siguiente();
              } else {
                this.wizardComponent.atras();
              }
            }
          } else {
            this.toastrService.error(response.mensaje);
          }
        });
    } else {
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.atras();
    }
  }
  cerrarModal(value: boolean): void {
    if (value) {
      this.mostrarAlerta = false;
      this.requiresPaymentData = true;
      if (
        !this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor() &&
        this.requiresPaymentData
      ) {
        this.confirmarSinPagoDeDerechos = 2;
      } else {
        this.confirmarSinPagoDeDerechos = 3;
      }
    } else {
      this.mostrarAlerta = false;
      this.confirmarSinPagoDeDerechos = 4;
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
   * @method siguiente
   * @description
   * Método para navegar programáticamente al siguiente paso del wizard.
   * Ejecuta la transición forward en el componente wizard y actualiza los
   * índices correspondientes para mantener sincronización de estado.
   *
   * @navigation_forward
   * Realiza navegación que:
   * - Ejecuta validación de documentos cargados (comentario indica validación futura)
   * - Avanza al siguiente paso usando `wizardComponent.siguiente()`
   * - Actualiza índice local basado en posición del wizard
   * - Sincroniza datos de pasos con nueva posición
   *
   * @wizard_synchronization
   * Mantiene sincronización entre:
   * - Índice local del componente
   * - Índice actual del wizard component
   * - Datos de configuración de pasos
   * - Estado visual de la UI
   *
   * @future_validation
   * Comentario indica que se implementará:
   * - Validación de documentos cargados
   * - Verificación de completitud de adjuntos
   * - Control de calidad de archivos
   *
   * @state_update
   * Actualiza:
   * - `indice`: Posición actual + 1
   * - `datosPasos.indice`: Sincronización con datos de pasos
   *
   * @void
   * @programmatic_navigation
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * @method anterior
   * @description
   * Método para navegar programáticamente al paso anterior del wizard.
   * Ejecuta la transición backward en el componente wizard y actualiza los
   * índices correspondientes para mantener sincronización de estado.
   *
   * @navigation_backward
   * Realiza navegación que:
   * - Retrocede al paso anterior usando `wizardComponent.atras()`
   * - Actualiza índice local basado en nueva posición del wizard
   * - Sincroniza datos de pasos con posición actualizada
   * - Mantiene consistencia de estado durante retroceso
   *
   * @wizard_synchronization
   * Mantiene sincronización entre:
   * - Índice local del componente
   * - Índice actual del wizard component
   * - Datos de configuración de pasos
   * - Estado visual de navegación
   *
   * @state_preservation
   * Durante retroceso:
   * - Preserva datos capturados en pasos anteriores
   * - Mantiene validaciones ya realizadas
   * - Conserva estado de formularios
   *
   * @state_update
   * Actualiza:
   * - `indice`: Nueva posición actual + 1
   * - `datosPasos.indice`: Sincronización con datos de pasos
   *
   * @void
   * @backward_navigation
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * @method obtenerNombreDelTítulo
   * @description Devuelve el título a mostrar según el número de paso.
   *
   * @param {number} valor - Índice del paso actual.
   * @returns {string} - Título correspondiente.
   */
  obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return TITULOMENSAJE;
      case 2:
        return this.pasos[1].titulo;
      case 3:
        return this.pasos[2].titulo;

      default:
        return TITULOMENSAJE;
    }
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
}
