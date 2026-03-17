import { ANEXAR, REQUISITOS} from '@libs/shared/data-access-user/src/core/enums/constantes-alertas.enum';
import { AlertComponent, BtnContinuarComponent, Notificacion, PasoCargaDocumentoComponent, PasoFirmaComponent, RegistroSolicitudService, WizardService, doDeepCopy, esValidObject, getValidDatos} from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ConsultaioQuery, SolicitanteStore } from '@ng-mf/data-access-user';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { PANTA_PASOS, PASO_DOS, PASO_TRES, PASO_UNO} from '../../services/certificados-licencias-permisos.enum';
import { PagoDerechosState, PagoDerechosStore} from '../../../../shared/estados/stores/pago-de-derechos.store';
import { Solicitud260303State, Tramite260303Store, createInitialState} from '../../Estados/tramite260303.store';
import { Solicitud2603State, Tramite2603Store} from '../../../../shared/estados/stores/2603/tramite2603.store';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/301/servicios-pantallas.model';
import { CATALOGOS_ID } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogosService } from '@libs/shared/data-access-user/src/core/services/shared/catalogos/catalogos.service';
import { CertificadosLicenciasPermisosService } from '../../services/certificados-licencias-permisos.service';
import { CommonModule } from '@angular/common';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { DatosSolicitudService } from '../../../../shared/services/shared2603/datos-solicitud.service';
import { GuardarAdapter_260303 } from '../../adapters/guardar.adapter';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src/core/models/forma-render.model';
import { PagoDerechosQuery } from '../../../../shared/estados/queries/pago-derechos.query';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260303Query } from '../../Estados/tramite260303.query';
import { Tramite2603Query } from '../../../../shared/estados/queries/2603/tramite2603.query';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
/**
 * PasoUnoComponent es responsable de manejar el primer paso del proceso.
 * para actualizar el componente actual que se está mostrando.
 */
@Component({
  selector: 'app-todospasos',
  standalone: true,
  imports: [
    CommonModule,
    AlertComponent,
    BtnContinuarComponent,
    PasoUnoComponent,
    WizardComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
  ],
  templateUrl: './todospasos.component.html',
})
export class TodospasosComponent implements OnInit, OnDestroy {
  /**
   * Esta variable se utiliza para almacenar la lista de pasos.
   */
  pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;
  /**
   * Esta variable se utiliza para almacenar el índice del paso.
   */
  indice: number = 1;

  /**
   * Representa el título del paso actual en el proceso.
   * El valor se inicializa como `PASO_UNO`, que probablemente
   * corresponde al primer paso en un flujo de trabajo de múltiples pasos.
   */
  titulo: string = PASO_UNO;

  /**
   * Notificador para destruir observables activos.
   */
  private destroyed$ = new Subject<void>();
  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  public isContinuarTriggered: boolean = false;

  /**
   * Esta variable se utiliza para almacenar el componente wizard.
   * @param wizardComponent - El componente wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /**
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;
  /** Texto de advertencia que se muestra cuando hay condiciones peligrosas. */
  public textoPeligro: string =
    '<strong>¡Error de registro!</strong> Faltan campos por capturar';
  /**
   * Indica si se debe mostrar un mensaje de peligro.
   */
  public isPeligro: boolean = false;
  /**
   * Referencia al componente `PasoUnoComponent`.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  public idProcedimiento: number = 260303;
  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;
  /**
   * Una propiedad pública que contiene el texto de los requisitos para la aplicación.
   * Se inicializa con el valor de la constante `REQUISITOS`.
   */
  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;
  /** Una propiedad pública que contiene el texto de los requisitos para la aplicación.
   * Se inicializa con el valor de la constante `REQUISITOS`.
   */
  public TEXTOS = REQUISITOS;
  /**
   * @property wizardService
   * @description
   * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
   * @type {WizardService}
   */
  wizardService = inject(WizardService);
  /**
   * Una propiedad pública que contiene el texto de los ANEXAR para la aplicación.
   * Se inicializa con el valor de la constante `ANEXAR`.
   */
  public TEXTOS2 = ANEXAR;
  /** Identificador numérico para guardar la solicitud.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  public guardarIdSolicitud: number = 0;
  /**
   * Un array de objetos Catalogo que representa el catálogo de documentos.
   * Este array está inicialmente vacío y puede ser poblado con instancias de Catalogo.
   */
  public catalogoDocumentos: Catalogo[] = [];
  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud2603State;
  /** Estado específico para el trámite 260303.
   * Se utiliza para almacenar y gestionar los datos relacionados con este trámite en particular.
   */
  public state260303!: Solicitud260303State;
  /** Estado del pago de derechos.
   * Se utiliza para almacenar y gestionar los datos relacionados con el pago de derechos.
   */
  public pagoState!: PagoDerechosState;

  /**
   * Estado de la solicitud.
   */
  public tableStore: any;
  /** Indica si se debe saltar la carga de documentos obligatoria. */
  isSaltar: boolean = false;
  /** Alerta de error del formulario. */
  public formErrorAlert!: string;
  /** Indica si el formulario es válido. */
  esFormaValido: boolean = false;
  /**
   * Almacena todos los valores del solicitanteStore al cargar el componente.
   */
  public solicitanteStoreValues: any;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();
  /**
   * Represents the data for the steps in the process.
   *
   * @property {number} nroPasos - The number of steps.
   * @property {number} indice - The current index of the step.
   * @property {string} txtBtnAnt - The text for the "Previous" button.
   * @property {string} txtBtnSig - The text for the "Continue" button.
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  /**
   * Objeto que agrupa las propiedades relacionadas con la validación del pago de derechos.
   */
  public paymentInfoRequiredObj = {
    mostrarAlerta: false,
    isFormValid: false,
    isPaymentRequired: false,
    currentIndex: 0,
    accionSeleccionada: '',
    nextIndex: 0,
    seleccionarFilaNotificacion: {} as Notificacion,
  };

  /**
   * @constructor
   * @description Constructor del componente que inicializa las dependencias necesarias
   * y configura las suscripciones a los observables del estado. Establece la configuración
   * inicial del formulario de pago de derechos y configura la escucha del estado de
   * @param {Tramite260303Store} tramiteStore - Store principal que gestiona todo el
   * @param {ConsultaioQuery} consultaQuery - Query service que proporciona acceso al
   * @throws {Error} Si no se pueden inicializar correctamente los servicios inyectados
   * @example
   * ```typescript
   * // El constructor se invoca automáticamente por Angular
   * // No se debe llamar manualmente
   * ```
   * @since 1.0.0
   */
  constructor(
    private catalogosServices: CatalogosService,
    private _store: Tramite260303Store,
    private _query: Tramite260303Query,
    private toastrService: ToastrService,
    private _sharedSvc: DatosSolicitudService,
    public registroSolicitudService: RegistroSolicitudService,
    private consultaioQuery: ConsultaioQuery,
    private solicitanteStore: SolicitanteStore,
    public tramite2603Store: Tramite2603Store,
    public tramite2603Query: Tramite2603Query,
    public pagoStore: PagoDerechosStore,
    private pagoQuery: PagoDerechosQuery,
    private service: CertificadosLicenciasPermisosService
  ) {
    this.solicitanteStoreValues = this.solicitanteStore.getValue
      ? this.solicitanteStore.getValue()
      : undefined;
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de la solicitud para mantener el estado local actualizado.
   * {void} No retorna ningún valor.
   */
  ngOnInit(): void {
    if (this.solicitanteStore._select) {
      this.solicitanteStore
        ._select((store: any) => store)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data: any) => {
          this.solicitanteStoreValues = data;
        });
    }
  }

  /**
   * compo doc
   * Método de limpieza del componente `DatosComponent`.
   * Detalles:
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * compo doc
   * Método para avanzar al siguiente paso en el asistente.
   * Detalles:
   */
  siguiente(): void {
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Actualiza el estado local de validez del formulario.
   * Este método recibe el valor emitido por el componente hijo.
   * Se utiliza para saber si el formulario es válido o no desde el componente principal.
   */
  onFormValidityChange(isValid: boolean): void {
    this.paymentInfoRequiredObj.isFormValid = isValid;
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
   * Maneja la acción del botón para avanzar o retroceder en el proceso.
   * @param {AccionBoton} e - Objeto que contiene la acción y el valor del botón.
   * @returns {void} No retorna ningún valor.
   */
  public getValorIndice(e: AccionBoton): void {
    if (e.accion === 'cont') {
      let isValid = true;

      if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = true;
      }

      if (!isValid) {
        this.formErrorAlert =
          'Por favor corrija los errores en el formulario antes de continuar.';
        this.esFormaValido = true;
        this.datosPasos.indice = this.indice;
        return;
      }

      this.esFormaValido = false;
      this.postGuardarDatos(e);
    } else {
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.getHeaderDatos();
      this.wizardComponent.atras();
    }
  }

  /**
   * Maneja la lógica para guardar los datos del trámite y navegar entre los pasos.
   * Realiza una llamada al servicio para guardar los datos y maneja la respuesta
   * para determinar si se debe navegar al siguiente paso o mostrar un error.
   *
   * @param {AccionBoton} e - Objeto que contiene la acción y el valor del botón.
   * @return {void} No retorna ningún valor.
   */
  postGuardarDatos(e: AccionBoton): void {
    this.getStoreData();
    this.getAllTramite2603StoreValues();
    if (!this.state260303) {
      this.state260303 = createInitialState();
    }
    const PAYLOAD = GuardarAdapter_260303.toFormPayload(
      this.state260303,
      this.solicitudState,
      this.tableStore,
      this.solicitanteStoreValues,
      this.pagoState
    );
    let shouldNavigate = false;

    this.registroSolicitudService
      .postGuardarDatos('260303', PAYLOAD)
      .subscribe((response) => {
        shouldNavigate = response.codigo === '00';

        if (!shouldNavigate) {
          const ERROR_MESSAGE =
            response.error || 'Error desconocido en la solicitud';
          this.formErrorAlert =
            TodospasosComponent.generarAlertaDeError(ERROR_MESSAGE);
          this.esFormaValido = true;
          this.indice = 1;
          this.datosPasos.indice = 1;
          this.wizardComponent.indiceActual = 1;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }

        if (shouldNavigate) {
          if (esValidObject(response) && esValidObject(response.datos)) {
            const DATOS = response.datos as { id_solicitud?: number };
            if (getValidDatos(DATOS.id_solicitud)) {
              this._store.setIdSolicitud(DATOS.id_solicitud ?? 0);
              this.state260303.idSolicitud = DATOS.id_solicitud ?? null;
            } else {
              this._store.setIdSolicitud(0);
            }
          }

          let indiceActualizado = e.valor;
          if (e.accion === 'cont' && this.indice === 1) {
            indiceActualizado = 2;
          }

          this.toastrService.success(response.mensaje);

          if (indiceActualizado > 0 && indiceActualizado < 5) {
            this.indice = indiceActualizado;
            this.datosPasos.indice = indiceActualizado;
            this.getHeaderDatos();

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
  }

  /**
   * Obtiene el estado actual de la solicitud desde el store Tramite2603Store.
   * Puedes usar este método para acceder a los datos específicos de la solicitud.
   */
  public getStoreData(): void {
    this.tramite2603Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.solicitudState = data;
      });
  }

  /**
   * Obtiene todos los valores actuales del store Tramite2603Store.
   * Puedes usar este método para acceder a todos los datos del store.
   */
  public getAllTramite2603StoreValues(): void {
    this.tableStore = this.tramite2603Store.getStoreTableData();
  }

  /**
   * Genera una alerta de error en formato HTML.
   * @param {string} mensajes - Mensaje de error a mostrar en la alerta.
   * @returns {string} Cadena HTML que representa la alerta de error.
   */
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
   * Procede con la navegación al siguiente paso o al paso anterior
   * según la acción seleccionada y el índice actual.
   */
  private proceedNavigation(): void {
    if (this.paymentInfoRequiredObj.accionSeleccionada === 'cont') {
      if (this.indice === 1) {
        this.shouldNavigate$().subscribe((shouldNavigate) => {
          if (shouldNavigate) {
            this.indice = this.paymentInfoRequiredObj.nextIndex;
            this.datosPasos.indice = this.paymentInfoRequiredObj.nextIndex;
            this.wizardService.cambio_indice(
              this.paymentInfoRequiredObj.nextIndex
            );
            this.wizardComponent.siguiente();
          } else {
            this.indice = this.paymentInfoRequiredObj.currentIndex;
            this.datosPasos.indice = this.paymentInfoRequiredObj.currentIndex;
          }
        });
      } else {
        this.indice = this.paymentInfoRequiredObj.nextIndex;
        this.datosPasos.indice = this.paymentInfoRequiredObj.nextIndex;
        this.wizardService.cambio_indice(this.paymentInfoRequiredObj.nextIndex);
        this.wizardComponent.siguiente();
      }
    } else {
      this.indice = this.paymentInfoRequiredObj.nextIndex;
      this.datosPasos.indice = this.paymentInfoRequiredObj.nextIndex;
      this.wizardComponent.atras();
    }
  }

  /**
   * Verifica si se debe navegar al siguiente paso.
   * Realiza una llamada para guardar los datos y determina si la navegación es exitosa.
   * @returns {Observable<boolean>} Observable que emite true si se debe navegar, false en caso contrario.
   */
  private shouldNavigate$(): Observable<boolean> {
    return this._sharedSvc.getAllState230601().pipe(
      take(1),
      switchMap((data) => this.guardar(data)),
      map((response) => {
        const API_DATOS = doDeepCopy(response);
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
    const PAYLOAD = this._sharedSvc.buildPayload(data, this.idProcedimiento);
    return new Promise((resolve, reject) => {
      this._sharedSvc
        .guardarDatosPost(PAYLOAD, this.idProcedimiento.toString())
        .subscribe({
          next: (response) => {
            const RESPONSE = doDeepCopy(response);
            if (esValidObject(RESPONSE) && esValidObject(RESPONSE['datos'])) {
              const DATOS = RESPONSE['datos'] as { id_solicitud?: number };
              if (getValidDatos(DATOS.id_solicitud)) {
                this.guardarIdSolicitud = DATOS.id_solicitud ?? 0;
                this._store.setIdSolicitud(DATOS.id_solicitud ?? 0);
              } else {
                this._store.setIdSolicitud(0);
              }
            }
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }
  /**
   * Valida los formularios del paso actual antes de permitir continuar.
   * @returns {boolean} - `true` si los formularios son válidos, `false` en caso contrario.
   */
  validarFormulariosPasoActual(): boolean {
    if (this.indice === 1) {
      return this.pasoUnoComponent?.validarFormularios() ?? true;
    }
    return true;
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

  /** Actualiza el estado de salto de carga de documentos obligatoria. */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

  /**
   * Actualiza la propiedad `titulo` en función del valor actual de `indice`.
   *
   * El método utiliza una declaración `switch` para determinar el valor apropiado
   * de `titulo` según los siguientes casos:
   * - `indice` igual a 1: Establece `titulo` como `PASO_DOS`.
   * - `indice` igual a 2: Establece `titulo` como `PASO_TRES`.
   * - Caso por defecto: Establece `titulo` como `PASO_UNO`.
   */
  public getHeaderDatos(): void {
    switch (this.indice) {
      case 1: {
        this.titulo = PASO_DOS;
        break;
      }
      case 2: {
        this.titulo = PASO_TRES;
        break;
      }
      default: {
        this.titulo = PASO_UNO;
        break;
      }
    }
  }

  /**
   * Obtiene el catálogo de tipos de documentos del servicio de catálogos.
   *
   * Este método recupera el catálogo de tipos de documentos identificado por
   * `CATALOGOS_ID.CAT_TIPO_DOCUMENTO` del `catalogosServices`.
   * Si la respuesta contiene algún elemento, los asigna a `catalogoDocumentos`.
   *
   * @returns {void}
   */
  public getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
        error: (_error): void => {
          //
        },
      });
  }

  /**   * @method cerrarModal
   * @description
   * Maneja el cierre del modal de alerta y actualiza el estado según la respuesta del usuario.
   * @param {boolean} value - Indica si se confirmó la acción (true) o se canceló (false).
   */
  public cerrarModal(value: boolean): void {
    this.paymentInfoRequiredObj.mostrarAlerta = false;
    if (value) {
      this.isPeligro = false;
      this.paymentInfoRequiredObj.isPaymentRequired = false;
      this.proceedNavigation();
    } else {
      this.paymentInfoRequiredObj.isPaymentRequired = true;
    }
  }
  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
