import { AccionBoton, ListaPasosWizard, } from '../../models/220201/certificado-zoosanitario.model';
import { AlertComponent, BtnContinuarComponent, ConsultaioQuery, ConsultaioState, DatosPasos, PasoFirmaComponent, SolicitanteQuery, Usuario, WizardComponent } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ERROR_FORMA_ALERT, MENSAJE_DE_EXITO_ETAPA_UNO, PASOS, PRIVACY_NOTICE_CONTENT } from '../../constantes/certificado-zoosanitario.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { SolicitudService } from '../../services/220201/registro-solicitud/solicitud.service';
import { USUARIO_INFO } from '@libs/shared/data-access-user/src/core/enums/usuario-info.enum';
import { ZoosanitarioStore } from '../../estados/220201/zoosanitario.store';

/**
 * @fileoverview Componente principal para el formulario de certificado zoosanitario.
 * Este componente gestiona el flujo del formulario a través de un asistente (wizard),
 * controlando la navegación entre los pasos y la información mostrada en cada uno.
 * @module ZoosanitarioPageComponent
 */

/**
 * Componente principal para el formulario de certificado zoosanitario.
 * Gestiona el flujo del wizard, la navegación entre pasos y la visualización de mensajes.
 * @component ZoosanitarioPageComponent
 * @selector app-zoosanitario-page
 * @templateUrl ./zoosanitario-page.component.html
 * @styleUrls ./zoosanitario-page.component.scss
 */
@Component({
  selector: 'app-zoosanitario-page',
  templateUrl: './zoosanitario-page.component.html',
  standalone: true,
  imports: [WizardComponent, CommonModule, PasoDosComponent, PasoUnoComponent, BtnContinuarComponent, AlertComponent, PasoFirmaComponent],
})
export class ZoosanitarioPageComponent implements OnInit, OnDestroy {
  @ViewChild(PasoUnoComponent) guardadoParcial!: PasoUnoComponent;
  @ViewChild(PasoUnoComponent) guardadoTotal!: PasoUnoComponent;
  /**
   * Array de pasos del asistente.
   * @property {ListaPasosWizard[]} pasos - Lista de los pasos del asistente, incluyendo título y componente asociado.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @description mnsaje al terminar de llenar el paso uno correctamente y generar folio
   */
  mensajePasos: string = '';

  /**
   * Título del mensaje principal.
   * @property {string | null} tituloMensaje - Título que se muestra en la parte superior del formulario.
   */
  tituloMensaje: string | null = 'Captura del certificado zoosanitario para importación';

  /**
   * Componente Wizard.
   * @property {WizardComponent} componenteWizard - Referencia al componente Wizard para controlar la navegación.
   */
  @ViewChild(WizardComponent) componenteWizard!: WizardComponent;

  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   * const isValid = this.pasoUnoComponent.validateForms();
   * const formsValidity = this.pasoUnoComponent.getAllFormsValidity();
   */
  // Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos.
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

  /**
   * Índice actual del paso.
   * @property {number} indice - Índice del paso actual en el que se encuentra el usuario.
   */
  indice: number = 1;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /** 
   * Datos de respuesta del servidor utilizados para actualizar el formulario. 
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado de la consulta actual, contiene la información relevante del solicitante.
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /**
   * Datos para la configuración de los botones del asistente.
   * @property {DatosPasos} datosPasos - Configuración para los botones "Anterior" y "Siguiente".
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  valoresComplemento: {
    rfc: string;
    tipoPersona: string;
    razon_social: string;
    nombre: string;
  } = {
      rfc: '',
      tipoPersona: '',
      razon_social: '',
      nombre: '',
    };

  /**
   * Mensaje de éxito para el primer paso.
   * @property {string} mensajeDeTextoDeExito - Mensaje que se muestra si el primer paso se completa con éxito.
   */
  mensajeDeTextoDeExito: string = MENSAJE_DE_EXITO_ETAPA_UNO;
  /**
   * Indica si el formulario actual es válido o no.
   *
   * @property esFormaValido
   * @type {boolean}
   * @default false
   */
  esFormaValido: boolean = false;
  /**
    * Contenido del aviso de privacidad utilizado en el componente.
    * @public
    * @readonly
    * @type {string}
    * @memberof SanidadCertificadoComponent
    */
  readonly PRIVACY_NOTICE_CONTENT: string = PRIVACY_NOTICE_CONTENT;

  /** Indica la visibilidad del botón Guardar. */
  public btnGuardarVisible: string = 'visible';

  /**
   * Estado de la solicitud zoosanitario.
   * @type {ZoosanitarioStore}
   */
  public solicitudState!: ZoosanitarioStore;

  /**
   * Un subject utilizado como notificador para señalar la destrucción del componente.
   * Esto se utiliza típicamente para desuscribirse de observables y prevenir fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Mensaje mostrado como alerta para informar al usuario que el acuse de recibo
   * no es un comprobante fiscal.
   */
  txtAlerta: string = 'Este acuse de recibo no es un comprobante fiscal.';

  /**
   * Un mensaje de subtítulo que indica que la solicitud del usuario se ha enviado correctamente
   * y actualmente está siendo procesada.
   */
  subtitulo: string = 'Su solicitud se ha enviado correctamente y se encuentra en proceso.';

  /**
   * Representa el identificador único para la solicitud.
   * Esta propiedad se utiliza para almacenar y gestionar el número de solicitud
   * asociado con el proceso zoosanitario actual.
   */
  numeroSolicitud: string = '';

  /**
   * Indica si la sección "Acuse" es visible en la página.
   * Esta propiedad se utiliza para alternar la visibilidad de la sección "Acuse".
   */
  isAcuseVisible: boolean = false;

  /**
     * Variable para almacenar el id de la solicitud.
     * @private
     */
  public idSolicitud: string = '';

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

  /**
   * Indica si un proceso de carga está actualmente en progreso.
   * Se establece en `true` cuando se están cargando datos o recursos, y en `false` cuando la carga ha finalizado.
   */
  cargaEnProgreso: boolean = true;

  /**
   * Stores the current user's information for use within the Zoosanitario page.
   * 
   * @type {Usuario}
   * @see USUARIO_INFO for the default user data.
   */
  datosUsuario: Usuario = USUARIO_INFO;

  /** Indica si el botón Guardar debe mostrarse o estar habilitado en el formulario. */
  public btnGuardar: boolean = true;


  /**
   * Instance of {@link SolicitanteQuery} injected into the component.
   * Provides access to the state and methods related to the "Solicitante" entity,
   * enabling querying and manipulation of applicant data within the zoosanitario page.
   */
  public solicitanteQuery: SolicitanteQuery = inject(SolicitanteQuery);

  /**
   * Mensaje de éxito mostrado al completar la etapa uno.
   */
  mensajeDeExitoEtapaUno: string = '';


  /**
   * Constructor del componente. Inicializa los pasos del asistente.
   * @method constructor
   */
  constructor(
    private solicitudService: SolicitudService,
    private consultaQuery: ConsultaioQuery

  ) {
    this.pasos = PASOS;
  }

  /**
   * Maneja la acción del botón y navega entre los pasos.
   * @method getValorIndice
   * @param {AccionBoton} e - Objeto con la acción (cont/atras) y el valor (índice) del botón.
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    // Validar formularios antes de continuar desde el paso uno
    if (this.indice === 1 && e.accion === 'cont') {
      const ISVALID = this.validarTodosFormulariosPasoUno();
      window.scrollTo({ top: 300, behavior: 'smooth' });
      if (!ISVALID) {
        this.esFormaValido = true;
        return; // Detener ejecución si los formularios son inválidos
      }
    }

    // Calcular el nuevo índice basado en la acción
    let indiceActualizado = e.valor;
    if (e.accion === 'cont') {
      indiceActualizado = e.valor + 1;
    } else if (e.accion === 'ant') {
      indiceActualizado = e.valor - 1;
    }

    // Validar que el nuevo índice esté dentro de los límites permitidos
    if (indiceActualizado > 0 && indiceActualizado <= this.pasos.length) {

      // Actualizar el índice y datosPasos
      this.indice = indiceActualizado;
      this.datosPasos.indice = indiceActualizado;

      if (this.indice === 2) {
        this.esFormaValido = this.guardadoTotalSolicitud();
      }

      if (e.accion === 'cont') {
        this.componenteWizard.siguiente();
      } else if (e.accion === 'ant') {
        this.componenteWizard.atras();
      }
    }
  }

  /**
   * Cambia el título del mensaje según la pestaña seleccionada.
   * @method enTabChange
   * @param {number} selectedTab - El índice de la pestaña seleccionada.
   */
  enTabChange(selectedTab: number): void {
    switch (selectedTab) {
      case 1:
        this.tituloMensaje = 'Captura del certificado zoosanitario para importación';
        break;
      case 2:
        this.tituloMensaje =
          'Captura del certificado zoosanitario para importación';
        break;
      case 3:
        this.tituloMensaje = 'Captura del certificado zoosanitario para importación';
        break;
      case 4:
        this.tituloMensaje = 'Captura del certificado zoosanitario para importación';
        break;
      case 5:
        this.tituloMensaje =
          'Captura del certificado zoosanitario para importación';
        break;
      default:
        this.tituloMensaje = 'Captura del certificado zoosanitario para importación';
        break;
    }
  }
  /**
   * Valida todos los formularios del primer paso antes de permitir continuar al siguiente paso.
   */
  private validarTodosFormulariosPasoUno(): boolean {
    this.pasoUnoComponent.validarFormularios()
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
   * Suma 10 números introducidos por el usuario.
   * @method sumarDiezNumeros
   * @param {number[]} numeros - Array de 10 números a sumar.
   * @returns {number} - Resultado de la suma de los 10 números.
   */
  static sumarDiezNumeros(numeros: number[]): number {
    if (numeros.length !== 10) {
      throw new Error('Debe proporcionar exactamente 10 números.');
    }
    return numeros.reduce((acumulador, numero) => acumulador + numero, 0);
  }

  /**
   * Maneja el guardado parcial de una solicitud invocando el método `guardaSolicitudParcial` 
   * del servicio `guardadoParcial`. Esta función se utiliza típicamente para persistir 
   * el estado actual del formulario o los datos de la aplicación.
   */
  guardadoParcialSolicitud(): void {
    this.guardadoParcial.guardaSolicitudParcial();
  }

  /**
   * Llama al método `guardadoTotal` para guardar completamente la solicitud.
   */
  guardadoTotalSolicitud(): boolean {
    return this.guardadoTotal.guardadoTotal();
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
   * Maneja el evento de carga en progreso emitido por un componente hijo.
   * Actualiza el estado de cargaEnProgreso según el valor recibido.
   * @param cargando Valor booleano que indica si la carga está en progreso.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onCargaEnProgresoPadre(cargando: boolean) {
    this.cargaEnProgreso = cargando;
  }

  /**
   * Método para navegar a la sección anterior del wizard.
   * Actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  anterior(): void {
    this.componenteWizard.atras();
    this.indice = this.componenteWizard.indiceActual + 1;
    this.datosPasos.indice = this.componenteWizard.indiceActual + 1;
    this.seccionCargarDocumentos = true;
  }

  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.componenteWizard.siguiente();
    this.indice = this.componenteWizard.indiceActual + 1;
    this.datosPasos.indice = this.componenteWizard.indiceActual + 1;
  }

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.idSolicitud = seccionState.id_solicitud;
          const NUEVO = MENSAJE_DE_EXITO_ETAPA_UNO.replace(
            '_folio_',
            this.consultaState.id_solicitud ?? '0'
          );
          this.mensajePasos = NUEVO;
        })
      )
      .subscribe();
  }
  /**
     * Obtiene los datos de la pestaña Solicitante, en esta caso el RFC ORIGINAL
     */
  obtieneDatosTabSolicitud(): void {
    this.solicitanteQuery.selectSeccionState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.valoresComplemento.rfc = seccionState.rfc_original;
        this.valoresComplemento.tipoPersona = seccionState.tipo_persona;
        this.valoresComplemento.razon_social = seccionState.razon_social ?? '';
        this.valoresComplemento.nombre = seccionState.nombre;
      });
  }



  ngOnInit(): void {
    this.obtenerDatosDelStore();
    this.obtieneDatosTabSolicitud();
    this.solicitudService.idSolicitud$.subscribe({
      next: (idSolicitud) => {
        this.numeroSolicitud = idSolicitud;
      }
    });
  }

    /**
  * Limpia las suscripciones para evitar fugas de memoria al destruir el componente.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}