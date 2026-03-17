import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosPasos, ListaPasosWizard, Notificacion, PASOS, Pedimento, SeccionLibQuery, SeccionLibState, SeccionLibStore, WizardComponent } from '@ng-mf/data-access-user';
import { ReplaySubject, map, take, takeUntil } from 'rxjs';

import { 
  ERROR_ALERTA,
  MENSAJE_CORREGIR_ERRORES,
  PASOS_EXPORTACION,
  TITULO_PASO_DOS,
  TITULO_PASO_TRES,
  TITULO_PASO_UNO,
 } from '../../constants/solicitud-importacion-ambulancia.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { RegistroComoEmpresaService } from '../../services/registro-como-empresa.service';
import { Solicitud120603State } from '../../estados/tramite120603.store';
/**
 * Interfaz que representa una acción de botón en el wizard.
 */
interface AccionBoton {
  /** Acción a realizar (e.g., 'cont' para continuar, 'atras' para retroceder). */
  accion: string;

  /** Valor asociado al índice del paso. */
  valor: number;
}

/**
 * Componente que representa la página de registro del trámite.
 * Gestiona la navegación entre los pasos del wizard y el estado de la sección.
 */
@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrl: './registro-empresa.component.scss',
 
})
export class RegistroEmpresaComponent implements OnDestroy, OnInit {
  /** Lista de pasos del wizard. */
  pasos: Array<ListaPasosWizard> = PASOS;

  /**
   * @property pantallasPasos
   * @description
   * Lista de pasos del wizard, representada como un arreglo de objetos `ListaPasosWizard`.
   *
   * @type {ListaPasosWizard[]}
   */
  public pantallasPasos: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * @property titulo
   * @description
   * Título del paso actual en el wizard.
   * @type {string}
   */
  public titulo: string = TITULO_PASO_UNO;

  /**
   * @property pasoDosTitulo
   * @description
   * Título del segundo paso en el wizard.
   * @type {string}
   */
  pasoDosTitulo: string = TITULO_PASO_DOS;

  /**
   * @property pasoTresTitulo
   * @description
   * Título del tercer paso en el wizard.
   * @type {string}
   */
  pasoTresTitulo: string = TITULO_PASO_TRES;

    /**
     * Referencia a la función generadora de mensajes de error relacionados
     * con el proceso de cálculo.
     */
    public MENSAJE_CORREGIR_ERRORES = MENSAJE_CORREGIR_ERRORES;

  /** Índice del paso actual en el wizard. */
  indice: number = 1;

  /** Estado de la solicitud actual. */
  solicitudState!: Solicitud120603State;

  /** Evento para cargar archivos en el paso de carga de documentos. */
  cargarArchivosEvento = new EventEmitter<void>();

  /** Indica si el botón de carga de archivos debe estar activo. */
  activarBotonCargaArchivos: boolean = false;

  /** Indica si la sección de carga de documentos está activa. */
  seccionCargarDocumentos: boolean = true;

  /** Indica si la carga de documentos está en progreso. */
  cargaEnProgreso: boolean = true;

    /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
    public errorAlerta = ERROR_ALERTA;

  /**
   * @description
   * Indica si el formulario del paso uno es válido.
   * @type {boolean}
   */
  esFormaValido: boolean = false;

  /** Sujeto para manejar la destrucción de observables. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Estado actual de la sección. */
  public seccion!: SeccionLibState;

  /** Referencia al componente del wizard. */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

    /**
     * Referencia al componente `PasoUnoComponent`.
     * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
     */
    @ViewChild(PasoUnoComponent, { static: false })
    pasoUnoComponent!: PasoUnoComponent;

  /** Datos de configuración para los pasos del wizard. */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /** Controla la visibilidad de la alerta de tipo "danger". */
  showAlert: boolean = false;

  /** Controla la visibilidad del modal. */
  mostrarModal: boolean | undefined;

  /**
   * Constructor del componente.
   * @param seccionQuery Servicio para consultar el estado de la sección.
   * @param seccionStore Servicio para gestionar el estado de la sección.
   */
  constructor(
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    public serviceRegistroEmpresa: RegistroComoEmpresaService
  ) {}

  /**
   * Método para seleccionar un paso específico en el wizard.
   * Actualiza el índice del paso seleccionado.
   * @param i Índice del paso a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Notificación nueva que se mostrará en el modal. */
  public alertaNotificacion!: Notificacion;

  /** Índice del elemento que se desea eliminar. */
  elementoParaEliminar!: number;

  /** Lista de pedimentos asociados. */
  pedimentos: Array<Pedimento> = [];

  
  /**
   * Método que se ejecuta al inicializar el componente.
   * Suscribe al estado de la sección y actualiza la propiedad `seccion`.
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState: SeccionLibState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();
    // Suscribirse al estado de la solicitud para idSolicitud y otros datos
    this.serviceRegistroEmpresa.getAllState()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((solicitudState) => {
        this.solicitudState = solicitudState;
      });
  }
    /**
   * Método para eliminar un pedimento de la lista.
   * Verifica si se debe eliminar y lo elimina según el índice especificado.
   * @param borrar Indica si se debe proceder con la eliminación.
   */
    eliminarPedimento(borrar: boolean): void {
      if (borrar) {
        this.pedimentos.splice(this.elementoParaEliminar, 1);
      } 
    }
    /**
   * Método para abrir un modal con una notificación.
   * Configura los datos de la notificación y establece el índice del elemento relacionado.
   * @param i Índice del elemento relacionado con la notificación (por defecto es 0).
   */
  abrirModal(i: number = 0): void {
    this.alertaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'La entidad federativa seleccionada no cuenta con sucursales asociadas a su RFC para tramitar el Registro como Empresa de la Frontera',
      cerrar: false,
      tiempoDeEspera: 100,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    }
    this.elementoParaEliminar = i;
  }

  /**
     * Método para actualizar el índice del paso actual en el asistente.
     * También navega al siguiente o al paso anterior según la acción especificada.
     *
     * Objeto de tipo `AccionBoton` que contiene:
     *  - `valor`: El nuevo índice del paso.
     *  - `accion`: La acción a realizar ('cont' para continuar o 'ant' para retroceder).
     */
    getValorIndice(e: AccionBoton): void {
      this.esFormaValido = false;
      if (this.indice === 1 && e.accion === 'cont') {
        this.datosPasos.indice = 1;
        
        if (!this.pasoUnoComponent?.DatosEmpresaComponent) {
          this.esFormaValido = true;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const WAS_VALID = this.pasoUnoComponent.DatosEmpresaComponent.guardarTodo();
        if (!WAS_VALID) {
          this.esFormaValido = true;
          this.errorAlerta = 'Por favor complete todos los campos requeridos antes de continuar.';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        // Continuar con el siguiente paso
        this.obtenerDatosDelStore(e);
      } else if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
        this.pasoNavegarPor(e);
      }
    }

      /**
       * Obtiene el valor del índice de la acción del botón.
       * @param e Acción del botón.
       */
      pasoNavegarPor(e: AccionBoton): void {
        if (e.valor > 0 && e.valor < 5) {
          this.indice = e.valor;
          if (e.accion === 'cont') {
            this.wizardComponent.siguiente();
          } else {
            this.wizardComponent.atras();
          }
        }
      }
  /** Obtiene los datos del store y los guarda en el estado del componente. */

  obtenerDatosDelStore(e: AccionBoton): void {
    this.serviceRegistroEmpresa.getAllState()
      .pipe(take(1))
      .subscribe((data: Solicitud120603State) => {
        if (this.validarDatosRequeridos(data)) {
          this.guardarSolicitud120603(data, e);
        } else {
          this.showAlert = true;
        }
      });
  }

  /**
   * Validates that all required fields are populated before making the API call.
   * Logs missing fields for debugging.
   * Adjusts logic to handle optional fields.
   * @param data - The state data to validate.
   * @returns boolean indicating if the data is valid.
   */
  private validarDatosRequeridos(data: Solicitud120603State): boolean {
    const CAMPOS_REQUERIDA = [
      { key: 'representacionFederal', value: data.representacionFederal },
      { key: 'estado', value: data.estado },
      { key: 'tipoEmpresa', value: data.tipoEmpresa },
      { key: 'actividadEconomicaPreponderante', value: data.actividadEconomicaPreponderante },
      { key: 'tipoDePersona', value: data.tipoDePersona }
    ];

    const DOMICILIO_CAMPOS = [
      { key: 'cvepais', value: data.domicilioDisabledForm?.['cvepais'] },
      { key: 'cveColonia', value: data.domicilioDisabledForm?.['cveColonia'] },
      { key: 'cveEntidad', value: data.domicilioDisabledForm?.['cveEntidad'] },
      { key: 'codigoPostal', value: data.domicilioDisabledForm?.['codigoPostal'] }
    ];

    const SOLICITANTE_CAMPOS = [
      { key: 'taxId', value: data.taxId },
      { key: 'nombre', value: data.nombre },
      { key: 'correoElectronico', value: data.correoElectronico },
      { key: 'razonSocial', value: data.razonSocial }
    ];

    const FALTAN_CAMPOS = [
      ...CAMPOS_REQUERIDA,
      ...DOMICILIO_CAMPOS,
      ...SOLICITANTE_CAMPOS
    ].filter(field => !field.value || (typeof field.value === 'string' && field.value.trim() === ''));

    if (FALTAN_CAMPOS.length > 0) {
      const FALTAN_CAMPOS_CRITICAL = CAMPOS_REQUERIDA.filter(field => !field.value || (typeof field.value === 'string' && field.value.trim() === ''));
      if (FALTAN_CAMPOS_CRITICAL.length > 0) {
        return false;
      }
    }

    return true;
  }
  /**
   * Método que se ejecuta al hacer clic en la alerta.
   * Abre el modal correspondiente con la notificación configurada.
   */
  onAlertClick(): void {
    this.abrirModal();
  }
  
  /**
   * Guarda la solicitud del trámite 120603.
   *
   * Construye el payload a partir del estado actual, realiza la petición al backend y gestiona la navegación y notificaciones según la respuesta.
   * Si la respuesta es exitosa, avanza o retrocede en el wizard y muestra una notificación de éxito.
   * Si ocurre un error, muestra una alerta y desplaza la ventana al inicio.
   *
   * @param solcitud120603State - Estado actual de la solicitud a guardar.
   * @param e - Objeto que indica la acción y el índice del paso en el wizard.
   */
  guardarSolicitud120603(solcitud120603State: Solicitud120603State, e: AccionBoton): void {
    try {
      const PAYLOAD = this.serviceRegistroEmpresa.buildPayload120603(solcitud120603State);
      this.serviceRegistroEmpresa.guardarDatosPost(PAYLOAD).subscribe((response) => {
        // Simula la lógica de navegación y notificación de 120603
        if (response.codigo === '00') {
          if (e.valor > 0 && e.valor < 5) {
            this.indice = e.valor;
            if (e.accion === 'cont') {
              this.wizardComponent.siguiente();
              // Notificación de éxito
              this.alertaNotificacion = {
                tipoNotificacion: 'banner',
                categoria: 'success',
                modo: 'action',
                titulo: '',
                mensaje: 'Registro exitoso',
                cerrar: true,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            } else {
              this.wizardComponent.atras();
            }
          }
        } else {
          // Manejo de error
          this.showAlert = true;
        }
      });
    } catch (err: unknown) {
      this.esFormaValido = true;
      let msg = 'Por favor complete todos los campos requeridos antes de continuar.';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
        msg = (err as { message: string }).message;
      }
      this.errorAlerta = msg;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  // Métodos para manejo de carga de documentos y navegación, siguiendo la lógica de 130116
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
   * @param cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * @returns {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
   * Método para manejar el evento de carga en progreso.
   * @param carga Indica si la carga está en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Navega al paso anterior del wizard.
   */
  anterior(): void {
    /**
     * Llama al método para retroceder un paso en el wizard.
     */
    this.wizardComponent.atras();
    /**
     * Actualiza el índice local del paso actual sumando 1 al índice del wizard.
     */
    this.indice = this.wizardComponent.indiceActual + 1;
    /**
     * Actualiza el índice en la configuración de pasos sumando 1 al índice del wizard.
     */
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Navega al siguiente paso del wizard.
   */
  siguiente(): void {
    /**
     * Llama al método para avanzar un paso en el wizard.
     */
    this.wizardComponent.siguiente();
    /**
     * Actualiza el índice local del paso actual sumando 1 al índice del wizard.
     */
    this.indice = this.wizardComponent.indiceActual + 1;
    /**
     * Actualiza el índice en la configuración de pasos sumando 1 al índice del wizard.
     */
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Completa el sujeto `destroyed$` para liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
