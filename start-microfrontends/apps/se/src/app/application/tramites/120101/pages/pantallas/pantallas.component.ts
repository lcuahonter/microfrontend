import { ALERTA_DE_APLICACION_REGISTRADA, CUPOS_PASOS, ERROR_FORMA_ALERT } from '../../constantes/solicitud-de-registro-tpl.enum';
import {
  AVISO,
  AccionBoton,
  DatosPasos,
  JSONResponse,
  ListaPasosWizard,
  WizardComponent,
  WizardService,
  doDeepCopy
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { SolicitudDeRegistroTpl120101State, Tramite120101Store } from '../../../../estados/tramites/tramite120101.store';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { SolicitudDeRegistroTplService } from '../../services/solicitud-de-registro-tpl.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite120101Query } from '../../../../estados/queries/tramite120101.query';
/**
 * @component PantallasComponent
 * @description
 * Este componente representa la página principal de las pantallas del trámite 120101.
 * Gestiona la navegación entre los pasos del wizard y valida los formularios asociados.
 * 
 * Funcionalidad:
 * - Renderiza el wizard con los pasos definidos en `CUPOS_PASOS`.
 * - Valida los formularios dinámicos asociados a cada paso.
 * - Controla la navegación entre pasos utilizando el componente `WizardComponent`.
 * 
 * @selector app-pantallas
 * @templateUrl ./pantallas.component.html
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
})
export class PantallasComponent implements OnInit, OnDestroy {

  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

  /**
   *
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  public infoAlert = 'alert-info';

  /**
   * Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
   */
  TEXTOS = AVISO.Aviso;

  /**
 * @property applicacionRegistradaAlerta
 * @description
 * Contiene el mensaje de alerta que se muestra cuando la aplicación ha sido registrada.
 * @type {string}
  * @memberof PantallasComponent
 */
  public applicacionRegistradaAlerta = ALERTA_DE_APLICACION_REGISTRADA.message;

  /**
 * @property formErrorAlert
 * @description
 * Contiene el mensaje de alerta que se muestra cuando ocurre un error en el formulario.
 * 
 * Funcionalidad:
 * - Utiliza el mensaje definido en la constante `ERROR_FORMA_ALERT`.
 * - Este mensaje informa al usuario sobre los errores que deben corregirse en el formulario antes de continuar.
 * 
 * @type {string}
 * 
 * @example
 * <div *ngIf="!esFormaValido">
 *   {{ formErrorAlert }}
 * </div>
 */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
 * @property mostrarAplicacionRegistradaAlerta
 * @description
 * Indica si se debe mostrar el mensaje de alerta relacionado con el registro exitoso de la aplicación.
 * @type {boolean}
 * @default false
 */
  public mostrarAplicacionRegistradaAlerta: boolean = false;
  /**
   * Lista de pasos del wizard.
   * @type {ListaPasosWizard[]}
   */
  public pantallasPasos: ListaPasosWizard[] = CUPOS_PASOS;

  /**
   * Índice del paso actual.
   * @type {number}
   * @default 1
   */
  public indice: number = 1;

  /**
   * Datos utilizados para el control del wizard.
   * @type {DatosPasos}
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;

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
 * @property subpestanaSeleccionada
 * @description
 * Almacena el índice de la subpestaña seleccionada dentro de un paso del wizard.
 * @type {number}
 */
  public subpestanaSeleccionada!: number;

  /**
 * @property pestanaDosFormularioValido
 * @description
 * Indica si los formularios asociados a la pestaña dos del wizard son válidos.
 * @type {boolean}
 * @default false
 */
  public pestanaDosFormularioValido: boolean = false;

  /**
   * Indica si la pestaña dos debe actualizarse.
   * 
   * Cuando es `true`, la pestaña dos se actualizará automáticamente.
   * Puede ser utilizado para controlar la recarga o renderizado de la pestaña correspondiente en la interfaz de usuario.
   */
  public pestanaDosUpdate: boolean = true;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  public consultaState!: ConsultaioState;

  /**
    * Estado de la solicitud de la sección 120101.
    * @type {SolicitudDeRegistroTpl120101State}
    * @memberof BienFinalComponent
    */
  public solicitudDeRegistroState!: SolicitudDeRegistroTpl120101State;

  /**
   * Indica si el botón padre está habilitado o visible.
   * 
   * @default true
   */
  padreBtn: boolean = true;

  /**
   * Identificador numérico de la solicitud actual.
   * 
   * Este valor se utiliza para referenciar de manera única una solicitud dentro del sistema.
   * Por defecto, se inicializa en 0 hasta que se asigne un identificador válido.
   */
  idSolicitud: number = 0;

  /**
   * Identificador numérico del mecanismo seleccionado.
   * 
   * @remarks
   * Este valor se utiliza para determinar el mecanismo actual en uso dentro del componente.
   * 
   * @defaultValue 0
   */
  idMecanismo: number = 0;

  /**
   * Indica si el elemento "obtenor" es visible en la interfaz de usuario.
   * 
   * @default false El elemento no es visible por defecto.
   */
  obtenorVisibile: boolean = false;

  /**
   * Estado que almacena los datos relacionados con la solicitud de registro
   * para el trámite 120101. Utiliza la interfaz `SolicitudDeRegistroTpl120101State`
   * para tipar la información gestionada en el componente.
   */
  stateDatos!: SolicitudDeRegistroTpl120101State;

  /**
 * @constructor
 * @description
 * Constructor del componente `PantallasComponent`. Inicializa las dependencias necesarias para el funcionamiento del componente.
 * @param {ServicioDeFormularioService} servicioDeFormularioService - Servicio para gestionar formularios dinámicos.
 */
  constructor(
    public servicioDeFormularioService: ServicioDeFormularioService,
    private consultaQuery: ConsultaioQuery,
    private solicitudDeRegistroTplService: SolicitudDeRegistroTplService,
    private ampliacionServiciosAdapter: AmpliacionServiciosAdapter,
    private toastrService: ToastrService,
    private tramite120101Store: Tramite120101Store,
    private tramite120101Query: Tramite120101Query


  ) {
    //
  }

  /**
 * @method ngOnInit
 * @description
 * Método de inicialización del componente `PantallasComponent`.
 * 
 * Detalles:
 * - Se suscribe al observable `selectConsultaioState$` del store `ConsultaioQuery` para obtener el estado actual de la consulta.
 * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
 * - Actualiza la propiedad `consultaState` con el estado recibido.
 * - Si el estado está en modo solo lectura (`readonly`), marca la pestaña dos como válida (`pestanaDosFormularioValido = true`).
 * 
 * @example
 * this.ngOnInit();
 * // Inicializa el componente y gestiona el flujo de datos según el estado de la consulta.
 */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.readonly) {
            this.pestanaDosFormularioValido = true
          }
        })
      ).subscribe();

    this.tramite120101Query.selectSolicitudDeRegistroTpl$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudDeRegistroState = seccionState;

          if (
            this.solicitudDeRegistroState &&
            typeof this.solicitudDeRegistroState === 'object'
          ) {
            this.idSolicitud = this.solicitudDeRegistroState['idSolicitud'] as number;
            this.idMecanismo = this.solicitudDeRegistroState['idMecanismo'] as number;
          }
        })
      )
      .subscribe();


  }

  /**
 * @method verificarLaValidezDelFormulario
 * @description
 * Este método verifica la validez de los formularios dinámicos asociados a los pasos del wizard.
 * @returns {boolean} - Indica si todos los formularios son válidos.
 */
  verificarLaValidezDelFormulario(): boolean {
    if (!this.idSolicitud) {
      return (this.servicioDeFormularioService.isFormValid('representacionFederalForm') ??
        false);
    }
    return (
      (this.servicioDeFormularioService.isFormValid('bienFinalForm') ??
        false) &&
      (this.servicioDeFormularioService.isFormValid('representacionFederalForm') ??
        false) &&
      (this.servicioDeFormularioService.isFormValid('insumosForm') ??
        false) &&
      (this.servicioDeFormularioService.isFormValid('procesoProductivoForm') ??
        false)
    );
  }

  /**
 * @getter esConsultarCupoFormValid
 * @description
 * Verifica si el formulario `consultarCupoForm` es válido.
 * @returns {boolean} - `true` si el formulario es válido, de lo contrario `false`.
 */
  get esConsultarCupoFormValid(): boolean {
    return this.servicioDeFormularioService.isFormValid('consultarCupoForm') ?? false;
  }

  /**
 * @getter esBienFinalFormValid
 * @description
 * Verifica si el formulario `esBienFinalFormValid` es válido.
 * @returns {boolean} - `true` si el formulario es válido, de lo contrario `false`.
 */
  get esBienFinalFormValid(): boolean {
    return this.servicioDeFormularioService.isFormValid('bienFinalForm') ?? false;
  }

  /**
 * @getter esRepresentacionFederalFormValid
 * @description
 * Verifica si el formulario `esRepresentacionFederalFormValid` es válido.
 * @returns {boolean} - `true` si el formulario es válido, de lo contrario `false`.
 */
  get esRepresentacionFederalFormValid(): boolean {
    return this.servicioDeFormularioService.isFormValid('representacionFederalForm') ?? false;
  }

  /**
 * @getter esInsumosFormValid
 * @description
 * Verifica si el formulario `esInsumosFormValid` es válido.
 * @returns {boolean} - `true` si el formulario es válido, de lo contrario `false`.
 */
  get esInsumosFormValid(): boolean {
    return this.servicioDeFormularioService.isFormValid('insumosForm') ?? false;
  }

  /**
 * @getter esProcesoProductivoFormValid
 * @description
 * Verifica si el formulario `esProcesoProductivoFormValid` es válido.
 * @returns {boolean} - `true` si el formulario es válido, de lo contrario `false`.
 */
  get esProcesoProductivoFormValid(): boolean {
    return this.servicioDeFormularioService.isFormValid('procesoProductivoForm') ?? false;
  }



  /**
   * Mensaje de error asociado a la fracción uno.
   * Puede ser indefinido si no existe un error actual para esta fracción.
   */
  fraccionErrorUno?: string;

  /**
   * Indica si ha ocurrido un error relacionado con la fracción.
   * 
   * Cuando es `true`, significa que se ha detectado un error en la fracción.
   * Cuando es `false` o `undefined`, no hay error presente.
   */
  fraccionError?: boolean;

  /**
   * @method pestanaCambiado
   * @description
   * Maneja el evento de cambio de pestaña en el wizard.
   * 
   * Funcionalidad:
   * - Actualiza el índice de la subpestaña seleccionada con el valor proporcionado por el evento.
   * 
   * @param {number} event - El índice de la nueva subpestaña seleccionada.
   * 
   * @example
   * this.pestanaCambiado(2); // Cambia a la subpestaña con índice 2.
   */
  public pestanaCambiado(event: number): void {
    if (event) {
      this.subpestanaSeleccionada = event;
    }
  }

  /**
   * Actualiza el índice del paso y maneja la navegación hacia adelante o atrás.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
   * @returns {void}
   */
  public getValorIndice(e: AccionBoton): void {
    if (!this.consultaState.readonly) {

      if (this.esBienFinalFormValid && this.esRepresentacionFederalFormValid) {
        this.mostrarAplicacionRegistradaAlerta = true;
        this.pestanaDosFormularioValido = true;
      }

      this.esFormaValido = this.verificarLaValidezDelFormulario();
      if (!this.esFormaValido) {
        this.pasoUnoComponent.validarFormularios();
        return;
      }

      if (this.esFormaValido) {
        if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
          const NEXT_INDEX =
            e.accion === 'cont' ? e.valor + 1 :
              e.accion === 'ant' ? e.valor - 1 :
                e.valor;
          if (e.accion === 'cont') {
            this.shouldNavigate$()
              .subscribe((shouldNavigate) => {
                if (shouldNavigate && this.idSolicitud && this.servicioDeFormularioService.isFormValid('procesoProductivoForm')) {

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
  private shouldNavigate$(): Observable<boolean> {
    return this.solicitudDeRegistroTplService.getAllState().pipe(
      take(1),
      switchMap(data => this.guardar(data)),
      map(response => {
        const DATOS = doDeepCopy(response);
        const OK = response.codigo === '00';
        if (OK) {
          this.toastrService.success(DATOS.mensaje);
        } else {
          this.padreBtn = true;
          this.toastrService.error(DATOS.mensaje);
        }
        return OK;
      })
    );
  }

  /**
   * Guarda los datos de la solicitud de registro utilizando el adaptador y servicio correspondiente.
   * 
   * @param data - Estado actual de la solicitud de registro de tipo `SolicitudDeRegistroTpl120101State`.
   * @returns Una promesa que se resuelve con la respuesta JSON del API (`JSONResponse`) o se rechaza con un error.
   * 
   * El método transforma los datos recibidos en el formato requerido por el backend, realiza la petición de guardado,
   * y actualiza el store con el identificador de la solicitud retornado por el API.
   */
  guardar(data: SolicitudDeRegistroTpl120101State): Promise<JSONResponse> {
    const PAYLOAD = this.ampliacionServiciosAdapter.toFormGuardarPayload(data);
    if (!this.idSolicitud) {
      delete PAYLOAD['insumos'];
      delete PAYLOAD['solicitud'];
    }else{
      PAYLOAD['solicitud'] = {
    ...(PAYLOAD['solicitud'] ?? {}),
    id_solicitud: this.idSolicitud
  };
    }
    return new Promise((resolve, reject) => {
      this.solicitudDeRegistroTplService.guardarDatosPost(PAYLOAD).subscribe(response => {
        const API_RESPONSE = doDeepCopy(response);
        this.tramite120101Store.setDynamicFieldValue('idSolicitud', API_RESPONSE.datos?.id_solicitud);
        resolve(API_RESPONSE);
      }, error => {
        reject(error);
      });
    });
  }


  /**
   * Guarda el cupo realizando una solicitud de registro parcial.
   * 
   * Este método obtiene el estado actual mediante el servicio `solicitudDeRegistroTplService`,
   * luego llama a `guardarPartical` con los datos obtenidos. Dependiendo de la respuesta,
   * muestra un mensaje de éxito o error utilizando `toastrService`. Si ocurre un error,
   * también habilita el botón padre (`padreBtn`).
   * 
   * @returns {void} No retorna ningún valor.
   */
  guardarCupo(): void {
    this.solicitudDeRegistroTplService.getAllState().pipe(
      take(1),
      switchMap(data => this.guardarPartical(data)),
      map(response => {
        const DATOS = doDeepCopy(response);
        const OK = response.codigo === '00';
        if (OK) {
          this.toastrService.success(DATOS.mensaje);
        } else {
          this.padreBtn = true;
          this.toastrService.error(DATOS.mensaje);
        }
        return OK;
      })
    ).subscribe();
  }

  /**
   * Guarda parcialmente la información de una solicitud de registro para el trámite 120101.
   *
   * Este método adapta los datos del estado de la solicitud utilizando el adaptador correspondiente,
   * elimina ciertos campos innecesarios del payload, y luego realiza una petición al servicio para
   * guardar parcialmente la información. Al finalizar, actualiza el identificador de la solicitud
   * en el store y resuelve la promesa con la respuesta de la API.
   *
   * @param data Estado actual de la solicitud de registro (`SolicitudDeRegistroTpl120101State`).
   * @returns Una promesa que se resuelve con la respuesta de la API (`JSONResponse`) o se rechaza en caso de error.
   */
  guardarPartical(data: SolicitudDeRegistroTpl120101State): Promise<JSONResponse> {
    const PAYLOAD = this.ampliacionServiciosAdapter.toFormGuardarPayload(data);
    if (PAYLOAD['solicitud']) {
      delete PAYLOAD['insumos'];
      delete PAYLOAD['solicitud'];
    }
    const SOLICETUE = {
      id_solicitud: this.idSolicitud
    };
    PAYLOAD['solicitud'] = SOLICETUE;

    return new Promise((resolve, reject) => {
      this.solicitudDeRegistroTplService.guardarPartialPost(PAYLOAD).subscribe(response => {
        const API_RESPONSE = doDeepCopy(response);
        this.tramite120101Store.setDynamicFieldValue('idSolicitud', API_RESPONSE.datos.id_solicitud);
        resolve(API_RESPONSE);
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(): void {
    this.solicitudDeRegistroTplService.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.stateDatos = data;
        this.guardar(data);
      });
  }

  /**
 * @method continuar
 * @description
 * Maneja la lógica para continuar al siguiente paso del wizard o mostrar alertas según la validez de los formularios.
 * 
 * Funcionalidad:
 * - Verifica si los formularios asociados a la pestaña seleccionada son válidos.
 * - Si la subpestaña seleccionada es `2` y los formularios son válidos, muestra una alerta de registro exitoso.
 * - Si el formulario general es válido, avanza al siguiente paso del wizard.
 * - Si los formularios no son válidos, oculta la alerta de registro exitoso.
 * 
 * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
 * 
 * @example
 * this.continuar({ valor: 2, accion: 'cont' });
 */
  public continuar(e: AccionBoton): void {
    if (this.esBienFinalFormValid === false) {
      this.servicioDeFormularioService.markFormAsTouched('consultarCupoForm');
    }
    if (this.subpestanaSeleccionada === 2 && this.esConsultarCupoFormValid) {
      this.mostrarAplicacionRegistradaAlerta = true;
      this.pestanaDosFormularioValido = true;
    } else if (this.esFormaValido) {
      this.pestanaDosFormularioValido = true;
      this.indice = e.valor + 1;
      this.datosPasos.indice = e.valor + 1;
      this.wizardService.cambio_indice(this.datosPasos.indice);
      this.wizardComponent.siguiente();
    } else {
      this.mostrarAplicacionRegistradaAlerta = false;
    }
  }



  /**
   * Maneja el evento de error relacionado con la fracción.
   * 
   * @param event Objeto que contiene información sobre el error de fracción.
   *  - `fraccionErrorUno` (opcional): Mensaje de error específico.
   *  - `fraccionError` (opcional): Indica si existe un error en la fracción.
   */
  fraccionErrorEvent(event: { fraccionErrorUno?: string; fraccionError?: boolean }): void {
    this.fraccionErrorUno = event.fraccionErrorUno;
    this.fraccionError = event.fraccionError;
  }

  /**
   * Cambia el estado de visibilidad basado en el evento recibido.
   * 
   * @param event - Valor booleano que indica el estado actual de visibilidad.
   */
  obtenerVisible(event: boolean): void {
    this.obtenorVisibile = !event as boolean;
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
