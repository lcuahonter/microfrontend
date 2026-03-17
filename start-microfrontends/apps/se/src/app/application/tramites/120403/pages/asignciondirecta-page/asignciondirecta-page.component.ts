/**
 * @fileoverview Componente para la gestión de la página de asignación directa.
 * Este componente maneja la lógica y la presentación de la página de asignación directa,
 * incluyendo la inicialización y la gestión de los pasos del wizard.
 * @module AsignciondirectaPageComponent
 */
import { ASIGNACION, TEXTOS_BUSCAR } from '../../constants/asignacion.enum';
import { AVISO_CONTRNIDO, DatosPasos, WizardComponent, WizardService, doDeepCopy, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { Component, EventEmitter,OnDestroy , OnInit, ViewChild, inject} from '@angular/core';
import { ERROR_FORMA_ALERT,ListaPasosWizard} from '@ng-mf/data-access-user';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { Tramite120403State, Tramite120403Store } from '../../estados/store/tramite120403.store';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { SolicitanteAsigncionComponent } from '../solicitante-asigncionTab/solicitante-entidad.component';
import { SolicitudService } from '../../services/solicitud.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite120403Query } from '../../estados/queries/tramite120403.query';
interface AccionBoton {
  /**
   * La acción a realizar.
   */
  accion: string;
  /**
   * El valor asociado con la acción.
   */
  valor: number;
}

@Component({
  selector: 'app-asignciondirecta-page',
  templateUrl: './asignciondirecta-page.component.html',
  styleUrls: ['./asignciondirecta-page.component.scss'],
})
export class AsignciondirectaPageComponent implements OnInit, OnDestroy {
  /**
   * Lista de pasos del wizard.
   */
  pasos: ListaPasosWizard[] = ASIGNACION;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Los datos para los pasos del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Referencia al componente Wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente SolicitanteAsigncionComponent.
   */
  @ViewChild('entidadRef') solicitanteAsigncionComponent!: SolicitanteAsigncionComponent;
  /**
   * Propiedad para mostrar/ocultar el mensaje de error de búsqueda
   */
  public showBuscarError = false;

  /**
   * Propiedad para mostrar/ocultar el mensaje de error de validación del formulario
   */
  public showValidationError = false;

  /**
   * Propiedad para almacenar los errores de validación
   */
  public validationErrors: string[] = [];

  /**
   * Número de trámite actual.  
   * Identifica y almacena el valor asociado al formulario.  
   */
  numTramite: string = '';
  /**
* Contiene los textos que se muestran al usuario cuando ocurre una cancelación.
* Los textos provienen del archivo de constantes TEXTOS_CANCELACIONS.
*/
  TEXTOS = TEXTOS_BUSCAR;
  /**
* Clase CSS para la alerta de información.
*/
  infoAlert = 'alert-danger';
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

  /** Estado actual del trámite 120403 que contiene toda la información de la solicitud. */
  public solicitudState!: Tramite120403State;

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
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;
  /**
   * Texto plano para la alerta de error del formulario.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;
/**
 * Identificador de la solicitud guardada.
 * Se utiliza para almacenar el ID de la solicitud después de guardarla.
 */
      public guardarIdSolicitud: number = 0;
  /**
   * Identificador del procedimiento actual.
   * Se utiliza para diferenciar entre distintos procedimientos en la aplicación.
   */
   public idProcedimiento: number = 120403;
 
    /**
    * @property wizardService
    * @description
    * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
    * @type {WizardService}
    */
    wizardService = inject(WizardService);
  
  /**
   * Indica si la opción de peligro está activada.
   * Cuando es verdadero, representa que la condición de peligro está presente.
   */
  public isPeligro: boolean = false;

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
    public isContinuarTriggered: boolean = false;
  
  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  constructor(
    private store: Tramite120403Store,
    private query: Tramite120403Query,
    private solicitudService: SolicitudService,
    private toastrService: ToastrService,
    private ampliacionServiciosAdapter: AmpliacionServiciosAdapter
  ) {
    //
  }

  /**
  * @method ngOnInit
  * @description
  * Método de inicialización del componente `AsignciondirectaPageComponent`.
  */
  ngOnInit(): void {
    this.query.selectTramite120403$.pipe(
      takeUntil(this.destroyNotifier$),
      map((data) => {
        this.solicitudState = data;
      })
    ).subscribe();

      this.query.selectTramite120403$.pipe().subscribe((data) => {
      this.solicitudState = data;
      this.isContinuarTriggered = this.solicitudState['isContinuarTriggered'] ?? false;
      });
  }

  /**
   * Método para manejar el evento de intento de búsqueda desde componentes hijos.
   * Establece la propiedad `showBuscarError` según el estado de enviado e inválido del formulario.
   *
   * @param {Object} event - El objeto de evento que contiene las propiedades `submitted` e `invalid`.
   */
  onBuscarIntento(event: { submitted: boolean, invalid: boolean, numTramite: string }): void {
    this.showBuscarError = event.submitted && event.invalid;
    this.numTramite = event.numTramite;
  }

  /**
   * Método para manejar la validación del formulario desde componentes hijos
   * @param event - Objeto que contiene el estado de validación del formulario
   */
  onFormValidation(event: { isValid?: boolean; errors?: string[] } | null | undefined): void {
    if (event && typeof event === 'object' && 'isValid' in event) {
      this.showValidationError = !event.isValid;
      this.validationErrors = event.errors || [];
    } else {
      this.showValidationError = false;
      this.validationErrors = [];
    }
  }

  /**
   * Maneja la acción del botón de navegación en el wizard.
   * @param e - Objeto que contiene la acción y el valor asociado.
   */
  public getValorIndice(e: AccionBoton): void { 
    const NEXT_INDEX =
      e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
          e.valor;

    if (this.indice === 1 && e.accion === 'cont') {
      this.store.setContinuarTriggered(true);
      const ES_VALIDO = this.validarFormulariosPasoActual();
      if (!ES_VALIDO) {
        this.isPeligro = true;
        return;
      }
      this.isPeligro = false;
    }
   if (e.valor > 0 && e.valor < this.pasos.length) {
        if (e.accion === 'cont') {
          if (this.indice === 1) { 
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
            this.wizardService.cambio_indice(NEXT_INDEX);
            this.wizardComponent.siguiente();
          }
        } else {
          this.indice = NEXT_INDEX;
          this.datosPasos.indice = NEXT_INDEX;
          this.wizardComponent.atras();
        }
      }
  }

  /**
    * Valida los formularios del paso actual antes de permitir continuar.
    * @returns {boolean} - `true` si los formularios son válidos, `false` en caso contrario.
    */
  validarFormulariosPasoActual(): boolean { 
    if (this.indice === 1) {
      return this.solicitanteAsigncionComponent?.validarFormularios() ?? false;
    }
    return true;
  }

   /**
      * Verifica si se debe navegar al siguiente paso.
      * Realiza una llamada para guardar los datos actuales y determina si la navegación es posible.
      * @return {Observable<boolean>} Un observable que emite true si se puede navegar, false en caso contrario.
      */
    private shouldNavigate$(): Observable<boolean> { 
      return this.solicitudService.getAllState().pipe(
        take(1),
        switchMap(data => this.guardar(data)),
        map((response) => { 
          const API_DATOS = doDeepCopy(response)
          const OK = API_DATOS.codigo === '00';
          if (OK) {
            this.toastrService.success(API_DATOS.mensaje);
          } else {
            this.toastrService.error(API_DATOS.mensaje);
          }
          return OK;
        })
      );
    }
  
    /**
     * Guarda los datos proporcionados mediante una solicitud HTTP POST.
     * @param data - Los datos que se desean guardar.
     * @returns {Promise<unknown>} Una promesa que se resuelve con la respuesta de la solicitud POST.
     */
    public guardar(data: Record<string, unknown>): Promise<unknown> { 
      const PAYLOAD = this.ampliacionServiciosAdapter.buildPayload(data);
      return new Promise((resolve, reject) => {
        this.solicitudService.guardarDatosPost(this.idProcedimiento.toString(), PAYLOAD).subscribe({
          next: (response) => { 
            const RESPONSE = doDeepCopy(response);
            if (esValidObject(RESPONSE) && esValidObject(RESPONSE['datos'])) {
              const DATOS = RESPONSE['datos'] as { id_solicitud?: number };
              if (getValidDatos(DATOS.id_solicitud)) {
                this.guardarIdSolicitud = DATOS.id_solicitud ?? 0;
                this.store.setIdSolicitud(DATOS.id_solicitud ?? 0);
              } else {
                this.store.setIdSolicitud(0);
              }
            }
            resolve(response);
          },
          error: (error) => {
            reject(error);
          }
        });
      });
    }
  
  /**
   * Getter para la lista de errores (usado por la plantilla)
   */
  get validationErrorsList(): string[] {
    return this.validationErrors || [];
  }

  /**
   * Texto plano para la alerta de búsqueda (usado por la plantilla)
   */
  get buscarAlertText(): string {
    return this.numTramite ? `El valor (${this.numTramite}) debe ser un número válido.` : '';
  }

  /**
   * Valida el paso actual del wizard
   * @returns {boolean} - true si el paso es válido, false en caso contrario
   */
  private validateCurrentStep(): boolean {
    this.validationErrors = [];
    let isValid = true;

    switch (this.indice) {
      case 1:
        isValid = this.validateStep1();
        break;
      case 2:
        isValid = this.validateStep2();
        break;
      case 3:
        isValid = this.validateStep3();
        break;
      default:
        isValid = true;
    }

    this.showValidationError = !isValid;
    return isValid;
  }

  /**
   * Valida el paso 1 (Solicitante/Entidad)
   * @returns {boolean} - true si es válido, false en caso contrario
   */
  private validateStep1(): boolean {
    let isValid = true;
    if (!this.numTramite || this.numTramite.trim() === '') {
      this.validationErrors.push('El número de trámite es requerido.');
      isValid = false;
    }
    return isValid;
  }

  /**
   * Valida el paso 2
   * @returns {boolean} - true si es válido, false en caso contrario
   */
  private validateStep2(): boolean {
    const ISVALID = true;
    return ISVALID;
  }

  /**
   * Valida el paso 3
   * @returns {boolean} - true si es válido, false en caso contrario
   */
  private validateStep3(): boolean {
    const ISVALID = true;
    return ISVALID;
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

  /** Actualiza el estado de carga en progreso. */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }





  /**
   * Navega al paso anterior del wizard
   * @method anterior
   * @description Retrocede un paso en el wizard y actualiza los índices correspondientes
   * @returns {void}
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

    /**
   * Navega al siguiente paso con validación de documentos
   * @method siguiente
   * @description Ejecuta la navegación al siguiente paso del wizard después de validar
   * que todos los documentos requeridos hayan sido cargados correctamente
   * @returns {void}
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

    /**
 * Indica si se debe omitir o saltar un paso en el flujo del trámite.
 * Se utiliza para controlar la navegación condicional en el proceso.
 */
  isSaltar: boolean = false;
    /**
 * Maneja el estado de si un campo obligatorio está en blanco.
 * Actualiza `isSaltar` para determinar si se debe omitir o saltar un paso en el flujo.
 */
  /**
   * Maneja el estado de si un campo obligatorio está en blanco.
   * @param enBlanco Indica si el campo obligatorio está en blanco.
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}