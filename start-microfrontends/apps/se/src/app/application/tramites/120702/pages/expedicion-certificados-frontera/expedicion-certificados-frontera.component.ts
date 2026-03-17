import {
  AVISO,
  DatosPasos,
  JSONResponse,
  ListaPasosWizard,
  WizardComponent,
  WizardService,
  doDeepCopy,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild, inject, } from '@angular/core';
import { ERROR_FORMA_ALERT, ERROR_MONTO_ALERT, ERROR_NO_DATOS, EXPEDICION_CERTIFICADOS_FRONTERA } from '../../constantes/expedicion-certificados-frontera.enum';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { Solicitud120702State, Tramite120702Store } from '../../estados/tramite120702.store';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { AsignacionResponse } from '../../models/expedicion-certificados-frontera.models';
import { ExpedicionCertificadosFronteraService } from '../../services/expedicion-certificados-frontera.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite120702Query } from '../../estados/tramite120702.query';

/**
 * Interfaz que representa la acción del botón dentro del wizard.
 */
interface AccionBoton {
  /** Acción que se va a ejecutar ('cont' para continuar o cualquier otro valor para retroceder). */
  accion: string;

  /** Valor del paso al que se desea mover. */
  valor: number;
}

/**
 * Componente principal que controla el flujo del wizard para la expedición
 * de certificados de frontera. Administra los pasos, el índice actual
 * y la navegación dentro del componente `WizardComponent`.
 */
@Component({
  selector: 'app-expedicion-certificados-frontera',
  templateUrl: './expedicion-certificados-frontera.component.html',
})
export class ExpedicionCertificadosFronteraComponent implements OnInit, OnDestroy {

  /**
    * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
    */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Mensaje de alerta que se muestra cuando ocurre un error relacionado con el monto.
   * Se inicializa con el valor de la constante `ERROR_MONTO_ALERT`.
   */
  montoAlert: string = ERROR_MONTO_ALERT;

  /**
   * Contiene el mensaje de error que se muestra cuando no se encuentran datos disponibles.
   * Utiliza la constante `ERROR_NO_DATOS` para mantener la consistencia en los mensajes de error relacionados con la ausencia de datos.
   */
  public noDatosError = ERROR_NO_DATOS

  /**
   * Indica si no se encontraron datos al realizar la búsqueda.
   * 
   * Cuando es `true`, significa que la búsqueda no arrojó resultados.
   */
  noDatosBuscar: boolean = false;

  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   * }
   */
  esFormaValido: boolean = false;
  /**
   * Referencia al componente hijo `WizardComponent` para controlar la navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;


  /**
 * @property wizardService
 * @description
 * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
 * @type {WizardService}
 */
  wizardService = inject(WizardService);

  /**
   * Variable utilizada para almacenar los datos obtenidos en la búsqueda.
   * El tipo es `any`, por lo que puede contener cualquier estructura de datos relacionada con los resultados de la búsqueda.
   */
  buscarDatos!: AsignacionResponse;

  /**
   * Referencia al componente paso uno para acceder a sus métodos de validación.
   */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /**
   * Lista de pantallas que conforman los pasos del wizard.
   */
  pantallasPasos: ListaPasosWizard[] = EXPEDICION_CERTIFICADOS_FRONTERA;

  /**
   * Mensaje de aviso de privacidad que se muestra al usuario.
   */
  public avisoPrivacidadAlert: string = AVISO.Aviso;

  /**
   * Índice actual del paso activo en el wizard.
   */
  indice = 1;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso dentro del componente.
   */
  idSolicitud: number = 0;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
    * Estado de la solicitud de la sección 120101.
    * @type {SolicitudDeRegistroTpl120101State}
    * @memberof BienFinalComponent
    */
  public solicitudDeRegistroState!: Solicitud120702State;

  /**
   * Indica si se ha activado la acción de continuar.
   * 
   * Esta bandera se utiliza para controlar el flujo de la interfaz de usuario
   * cuando el usuario ha iniciado el proceso de continuar en el trámite actual.
   */
  isContinuarTriggered: boolean = false;

  /**
   * Representa la cantidad total de elementos en la tabla.
   * 
   * @remarks
   * Este valor se utiliza para controlar la paginación y mostrar el número total de registros disponibles en la tabla.
   */
  tablaLength: number = 0;

  /**
   * Indica si el componente está en modo solo lectura.
   * Cuando es verdadero, los campos del formulario no pueden ser editados por el usuario.
   */
  readOnly: boolean = true;


  /**
   * Indica si el campo de monto debe estar deshabilitado cuando el valor es menor a un umbral específico.
   * 
   * Cuando es `true`, el campo de monto estará deshabilitado para valores inferiores al permitido.
   */
  isMontoDisableLessValue:boolean=false;

  /**
   * Constructor de la clase ExpedicionCertificadosFronteraComponent.
   * 
   * @param expedicionCertificadosFronteraService Servicio para gestionar la expedición de certificados de frontera.
   * @param tramite120702Store Almacén para el estado del trámite 120702.
   * @param ampliacionServiciosAdapter Adaptador para la ampliación de servicios relacionados.
   * @param toastrService Servicio para mostrar notificaciones tipo toast al usuario.
   * @param tramite120702Query Consulta para obtener información del trámite 120702.
   */
  constructor(private expedicionCertificadosFronteraService: ExpedicionCertificadosFronteraService,
    private tramite120702Store: Tramite120702Store,
    private ampliacionServiciosAdapter: AmpliacionServiciosAdapter,
    private toastrService: ToastrService, private tramite120702Query: Tramite120702Query) {
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al observable `selectSolicitud$` para obtener el estado de la solicitud de registro,
   * actualizando la propiedad `solicitudDeRegistroState` y extrayendo el identificador de la solicitud (`idSolicitud`)
   * si está disponible. La suscripción se mantiene activa hasta que se emite un valor en `destroyNotifier$`,
   * lo que permite limpiar recursos y evitar fugas de memoria.
   */
  ngOnInit(): void {
    this.tramite120702Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudDeRegistroState = seccionState;

          if (
            this.solicitudDeRegistroState &&
            typeof this.solicitudDeRegistroState === 'object'
          ) {
            this.idSolicitud = this.solicitudDeRegistroState['idSolicitud'] as number;
            this.isContinuarTriggered = this.solicitudDeRegistroState['continuarTriggered'] ?? false;
          }
        })
      )
      .subscribe();
  }


  /**
   * Datos de configuración para los pasos del wizard (texto de botones, número total de pasos, etc.).
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Cambia el paso actual del wizard en función de la acción realizada (continuar o retroceder).
   * Valida el formulario antes de continuar al siguiente paso.
   * 
   * @param e Objeto que contiene la acción (`accion`) y el paso (`valor`) al que se desea mover.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      const NEXT_INDEX =
        e.accion === 'cont' ? e.valor + 1 :
          e.accion === 'ant' ? e.valor - 1 :
            e.valor;
      // Si la acción es continuar, validar el formulario del paso actual
      if (e.accion === 'cont') {
        this.tramite120702Store.setContinuarTriggered(true);
        if (this.validarPasoActual() && this.tablaLength !== 0) {
          this.esFormaValido = false;
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
          this.esFormaValido = true; // Mostrar mensaje de error
          // No continuar si la validación falla
        }
      } else {
        this.esFormaValido = false; // Ocultar mensaje de error al retroceder
        this.indice = e.valor;
        this.wizardComponent.atras();
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
    return this.expedicionCertificadosFronteraService.getAllState().pipe(
      take(1),
      switchMap(data => this.guardar(data)),
      map(response => {
        const DATOS = doDeepCopy(response);
        const OK = response.codigo === '00';
        if (OK) {
          this.toastrService.success(DATOS.mensaje);
        } else {
          this.toastrService.error(DATOS.mensaje);
        }
        return OK;
      })
    );
  }

  /**
     * Obtiene los datos del store y los guarda utilizando el servicio.
     */
  obtenerDatosDelStore(): void {
    this.expedicionCertificadosFronteraService.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);
      });
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
  guardar(data: Solicitud120702State): Promise<JSONResponse> {
    const PAYLOAD = this.ampliacionServiciosAdapter.toFormGuardarPayload(data);
    return new Promise((resolve, reject) => {
      this.expedicionCertificadosFronteraService.guardarDatosPost(PAYLOAD).subscribe(response => {
        const API_RESPONSE = doDeepCopy(response);
        this.tramite120702Store.setDynamicFieldValue('idSolicitud', API_RESPONSE.datos.id_solicitud);
        resolve(API_RESPONSE);
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * Maneja el evento recibido con los datos del formulario.
   * Asigna el valor del evento a la propiedad `buscarDatos`.
   *
   * @param event - Datos emitidos por el formulario.
   */
  handleFormaDatos(event: AsignacionResponse): void {
    this.buscarDatos = event;
  }


  /**
   * Maneja el cambio de longitud de la tabla.
   * 
   * @param event - Nuevo valor de la longitud de la tabla.
   */
  public handleTablaLength(event: number): void {
    this.tablaLength = event;
  }
  /**
   * Valida el formulario del paso actual.
   * @returns true si el formulario es válido, false en caso contrario.
   */
  private validarPasoActual(): boolean {
    switch (this.indice) {
      case 1:
        // Validar paso 1 - usar el método que valida todo el formulario
        if (this.pasoUnoComponent) {
          return this.pasoUnoComponent.validarFormularioCompleto();
        }
        return false;

      case 2:
        // Validar paso 2 si es necesario
        return true;

      case 3:
        // Validar paso 3 si es necesario
        return true;

      default:
        return true;
    }
  }

  /**
   * Maneja el evento que indica si no hay datos para buscar.
   * 
   * @param event - Valor booleano que indica si no existen datos para buscar.
   */
  handleEmptyDatos(event: boolean): void {
    this.noDatosBuscar = event;
  }

/**
 * Maneja el evento que indica si el monto debe estar deshabilitado o no.
 * 
 * @param event - Valor booleano que determina si el monto debe estar deshabilitado (`true`) o habilitado (`false`).
 */
public handleIsMontoDisableLess(event: boolean): void {
    this.isMontoDisableLessValue=event;
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
