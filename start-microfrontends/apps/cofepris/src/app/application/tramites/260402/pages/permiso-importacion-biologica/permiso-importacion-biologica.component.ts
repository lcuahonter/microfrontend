import { Component, EventEmitter, ViewChild, inject } from '@angular/core';
import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosPasos, JSONResponse, ListaPasosWizard, Notificacion, WizardComponent, WizardService, getValidDatos } from '@libs/shared/data-access-user/src';
import { MENSAJE_DE_VALIDACION_PAGO_DERECHOS, PERMISO_MAQUILA } from '../../constantes/permiso-importacion-biologica.enum';
import { Observable, Subject, catchError, filter, map, switchMap, take, takeUntil, throwError } from 'rxjs';
import { doDeepCopy, esValidObject } from '@ng-mf/data-access-user';
import { Datos260402Component } from '../datos-260402/datos-260402.component';
import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { PermisoImportacionBiologicaState } from '../../../../shared/estados/permiso-importacion-biologica.store';
import { PermisoImportacionBiologicaStore } from '../../../../shared/estados/permiso-importacion-biologica.store';
import { Solocitud260402Service } from '../../services/service260402.service';
import { TercerosRelacionadasState } from '../../../../shared/estados/stores/terceros-relacionados.stores';
import { ToastrService } from 'ngx-toastr';
/**
 * Representa una acción asociada a un botón con un valor numérico.
 *
 * @interface AccionBoton
 * @property {string} accion - Describe la acción que se realizará al interactuar con el botón.
 * @property {number} valor - Representa un valor numérico asociado a la acción del botón.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}
/**
 * @descripción
 * Este componente se encarga de gestionar la funcionalidad del asistente (wizard) "Permiso Maquila".
 * Proporciona la lista de pasos del asistente y administra el índice del paso actual.
 */

@Component({
  selector: 'app-permiso-importacion-biologica',
  standalone: false,
  templateUrl: './permiso-importacion-biologica.component.html',
})
export class PermisoImportacionBiologicaComponent {
  /**
   * @comdoc
   * Referencia al componente WizardComponent utilizado en este componente.
   * 
   * @decorador {ViewChild} - Permite acceder a una instancia del componente hijo `WizardComponent`.
   * @prop {WizardComponent} wizardComponent - Instancia del componente wizard que se utiliza para manejar la navegación entre pasos.
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
   * @comdoc
   * Esta variable se utiliza para almacenar la lista de pasos del asistente.
   * @type {ListaPasosWizard[]}
   */
  pantallasPasos: ListaPasosWizard[] = PERMISO_MAQUILA;

  /**
   * @comdoc
   * Esta variable se utiliza para almacenar el índice del paso actual en el asistente.
   * @type {number}
   */
  indice = 1;

  /**
   * @comdoc
   * Representa los datos relacionados con los pasos de un proceso o flujo en la aplicación.
   * 
   * @prop {number} nroPasos - Número total de pasos en el flujo, calculado a partir de la longitud de `pantallasPasos`.
   * @prop {number} indice - Índice actual del paso en el flujo.
   * @prop {string} txtBtnAnt - Texto que se muestra en el botón para retroceder al paso anterior.
   * @prop {string} txtBtnSig - Texto que se muestra en el botón para avanzar al siguiente paso.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @comdoc
   * Emite una notificación para cancelar suscripciones y evitar fugas de memoria.
   * Se utiliza comúnmente en el método ngOnDestroy con takeUntil().
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * @comdoc
   * Almacena el estado actual de la solicitud del DatosDelSolicituteSeccionState.
   * Contiene la información y los datos necesarios para el flujo del trámite.
   * @type {DatosDelSolicituteSeccionState}
   */
  solicitudState!: DatosDelSolicituteSeccionState;
  
  /** 
   * @comdoc
   * Evento que notifica la acción de cargar archivos desde el componente.
   * No emite datos y solo indica que la operación debe ejecutarse. 
   * @type {EventEmitter<void>}
   */
  cargarArchivosEvento = new EventEmitter<void>();
  
  /**
   * @comdoc
   * Controla la activación del botón para cargar archivos.
   * Se establece en true cuando las condiciones necesarias se cumplen.
   * @type {boolean}
   */
  activarBotonCargaArchivos: boolean = false;
  
  /**
   * @comdoc
   * Indica si la sección de carga de documentos está visible o activa.
   * Se utiliza para mostrar u ocultar dicha sección en la interfaz.
   * @type {boolean}
   */
  seccionCargarDocumentos: boolean = true;
  
  /**
   * @comdoc
   * Indica si actualmente hay una carga en progreso.
   * Se utiliza para mostrar indicadores de carga o deshabilitar acciones durante el proceso.
   * @type {boolean}
   */
  cargaEnProgreso: boolean = true;
  
  /**
   * @comdoc
   * Indica si se debe omitir o saltar un paso en el flujo del trámite.
   * Se utiliza para controlar la navegación condicional en el proceso.
   * @type {boolean}
   */
  isSaltar: boolean = false;

  /**
   * @comdoc
   * Referencia al componente hijo `Datos260402Component`.
   * Permite acceder a sus propiedades y métodos desde el componente padre.
   * @type {Datos260402Component}
   */
  @ViewChild(Datos260402Component) datos260402Component!: Datos260402Component;

  /**
   * @comdoc
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   * @type {boolean}
   */
  esFormaValido: boolean = false;

  /**
     * Controla la visibilidad del modal de alerta.
     * @property {boolean} mostrarAlerta
     */
    public mostrarAlerta: boolean = false;

    /**
     * Indica si es necesario validar el pago de derechos antes de continuar con el siguiente paso del asistente.
     * Se utiliza para controlar la lógica de validación y navegación en el flujo del wizard.
     */
    private isClickedNo: boolean = false;

    /** Nueva notificación relacionada con el RFC. */
    public seleccionarFilaNotificacion!: Notificacion;

    /**
     * Almacena el siguiente índice a utilizar en operaciones internas del componente,
     * como la navegación o el manejo de pasos en formularios.
     */
    private nextIndex: number = 0;
  
    /**
     * Almacena el índice actual del paso en el asistente (wizard),
     * permitiendo controlar y restaurar la posición del usuario en la navegación.
     */
    private currentIndex: number = 0;
    
    /**
     * Almacena la acción seleccionada por el usuario en el asistente (wizard),
     * como avanzar ('cont') o retroceder ('ant'), para controlar la navegación entre pasos.
     */
    private accionSeleccionada: string = ''; 

  /**
   * @comdoc
   * Constructor del componente. Se inyectan las dependencias necesarias.
   * @param {DatosDelSolicituteSeccionQuery} tramite260402Query - Servicio de consulta para el estado de la solicitud.
   * @param {Solocitud260402Service} servicio260402 - Servicio para manejar las operaciones de la solicitud.
   * @param {DatosDelSolicituteSeccionStateStore} tramite260402Store - Store para el estado de la solicitud.
   */
  constructor(
    private tramite260402Query: DatosDelSolicituteSeccionQuery,
    private servicio260402: Solocitud260402Service,
    private tramite260402Store: DatosDelSolicituteSeccionStateStore,
    private toastrService: ToastrService,
    private permisoImportacionBiologicaStore: PermisoImportacionBiologicaStore,
  ){
    this.tramite260402Query.selectSolicitud$
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((solicitud) => {
      this.solicitudState = solicitud;
    });
  }

  /**
 * @description
 * Guarda en el sistema los datos provenientes del estado global, incluyendo:
 * - Información del establecimiento solicitante.
 * - Datos de los terceros relacionados.
 * - Información del pago de derechos.
 *
 * Este método centraliza la lógica de persistencia o envío de la información,
 * permitiendo manejarla de forma unificada y asincrónica.
 *
 * @param {DatosDelSolicituteSeccionState} establecimientoDatos
 * Datos correspondientes al establecimiento solicitante dentro del estado.
 *
 * @param {TercerosRelacionadasState} tercerosDatos
 * Información relacionada con los terceros asociados al trámite.
 *
 * @param {PermisoImportacionBiologicaState} pagoDerechosDatos
 * Datos referentes al pago de derechos dentro del permiso de importación.
 *
 * @returns {Promise<JSONResponse>} Una promesa que se resuelve con la respuesta del guardado.
 */
  guardar(
  establecimientoDatos: DatosDelSolicituteSeccionState,
  tercerosDatos: TercerosRelacionadasState,
  pagoDerechosDatos: PermisoImportacionBiologicaState
): Observable<JSONResponse> {

  const SOLICITUD = Solocitud260402Service.buildSolicitud(establecimientoDatos);
  const ESTABLECIMIENTO = Solocitud260402Service.buildEstablecimiento(establecimientoDatos);
  const SCIAN = Solocitud260402Service.buildDatosScian(establecimientoDatos);
  const MERCANCIAS = Solocitud260402Service.buildMercancias(establecimientoDatos);
  const REPRESENTANTE_LEGAL = Solocitud260402Service.buildRepresentanteLegal(establecimientoDatos);
  const DESTINATARIO = Solocitud260402Service.buildDestinatario(tercerosDatos);
  const PAGO_DERECHOS = Solocitud260402Service.buildPagoDerechos(pagoDerechosDatos);

  const PAYLOAD = {
    idSolicitud: '',
    solicitante: {
      rfc: 'AAL0409235E6',
      nombre: 'ACEROS ALVARADO S.A. DE C.V.',
      actividad_economica: 'Fabricación de productos de hierro y acero',
      correo_electronico: 'contacto@acerosalvarado.com',
      domicilio: {
        pais: 'México',
        codigo_postal: '06700',
        estado: 'Ciudad de México',
        municipio_alcaldia: 'Cuauhtémoc',
        localidad: 'Centro',
        colonia: 'Roma Norte',
        calle: 'Av. Insurgentes Sur',
        numero_exterior: '123',
        numero_interior: 'Piso 5, Oficina A',
        lada: '',
        telefono: '123456'
      }
    },
    solicitud: SOLICITUD,
    establecimiento: ESTABLECIMIENTO,
    datosSCIAN: [SCIAN],
    mercancias: MERCANCIAS,
    representanteLegal: REPRESENTANTE_LEGAL,
    gridTerceros_TIPERS_DES: [DESTINATARIO],
    pagoDeDerechos: PAGO_DERECHOS
  };

  return this.servicio260402.guardarDatosPost(PAYLOAD).pipe(
    map(response => {
      const API_RESPONSE = doDeepCopy(response);

      if (esValidObject(API_RESPONSE?.datos)) {
        if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
          this.tramite260402Store.setIdSolicitud(API_RESPONSE.datos.id_solicitud);
          this.pasoNavegarPor({ accion: 'cont', valor: 2 });
        } else {
          this.tramite260402Store.setIdSolicitud(0);
        }
      }

      return {
        id: API_RESPONSE?.id ?? 0,
        descripcion: API_RESPONSE?.descripcion ?? '',
        codigo: API_RESPONSE?.codigo ?? '',
        data: API_RESPONSE?.data ?? API_RESPONSE?.datos ?? null,
        ...API_RESPONSE
      } as JSONResponse;
    }),
    catchError(error => {
      console.error('[guardar] API error:', error);
      return throwError(() => error);
    })
  );
}



/**
 * @description
 * Obtiene los datos almacenados en el estado global mediante el servicio `servicio260402`
 * y ejecuta una única suscripción para evitar fugas de memoria.  
 * Una vez obtenidos los valores (`datos`, `terceros`, `pagoDerechos`),
 * se envían al método `guardar` para su procesamiento y persistencia.
 *
 * @returns {void} No retorna ningún valor.
 */
  private obtenerDatosDelStore$(): Observable<{
    datos: DatosDelSolicituteSeccionState;
    terceros: TercerosRelacionadasState;
    pagoDerechos: PermisoImportacionBiologicaState;
  }> {
    return this.servicio260402.getAllState().pipe(
      filter(({ datos, terceros, pagoDerechos }) =>
        esValidObject(datos) &&
        esValidObject(terceros) &&
        esValidObject(pagoDerechos)
      ),
      take(1)
    );
  }

  /**
   * @description
   * Obtiene el valor del índice basado en la acción del botón y realiza una acción en el componente wizard.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor y la acción a realizar.
   *   - `valor`: Número que debe estar entre 1 y 4 (inclusive) para ser considerado válido.
   *   - `accion`: Cadena que indica la acción a realizar, puede ser 'cont' para avanzar o cualquier otro valor para retroceder.
   *
   * Si el valor está en el rango permitido, actualiza el índice y llama al método correspondiente
   * del componente wizard (`siguiente` o `atras`) según la acción especificada.
   */
getValorIndice(e: AccionBoton): void {
  this.nextIndex =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor; 

    this.accionSeleccionada = e.accion;
    this.currentIndex = e.valor;
  if (this.indice === 1 && e.accion === 'cont') {
    this.datosPasos.indice = 1;
    const ISVALID = this.validarFormulariosPasoActual();
    if (!ISVALID) {
      this.esFormaValido = true;
      return;
    }
    if (ISVALID) {
      this.esFormaValido = false; 
    }

    if (ISVALID && !this.mostrarAlerta && !this.isClickedNo) {
      if (!this.datos260402Component.isPagoDerechosValid()) {
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
          alineacionBtonoCerrar:'flex-row-reverse'
        }
      } else {
        this.mostrarAlerta = false;
        this.esFormaValido = false;
        this.proceedNavigation();
        return;
      }

      const CLAVE_REFERENCIA = this.permisoImportacionBiologicaStore.getValue().setClaveDeReferncia;
      if (CLAVE_REFERENCIA!=='') {
        this.esFormaValido = true; 
        this.datos260402Component.validarPagoDerechos();
      } else {
        this.esFormaValido = false; 
      }
      
      return;
    }

    if (this.isClickedNo) {
      const ES_PAGO_DERECHOS_VALIDO = this.datos260402Component.validarPagoDerechos();
      if (ES_PAGO_DERECHOS_VALIDO) {
        this.mostrarAlerta = false;
        this.esFormaValido = false;
        this.proceedNavigation();
      }
    }
  } else {
      this.proceedNavigation();
    }
}

/** @method cerrarModal
   * @description
   * Maneja el cierre del modal de alerta y actualiza el estado según la respuesta del usuario.
   * @param {boolean} value - Indica si se confirmó la acción (true) o se canceló (false).
   */
  public cerrarModal(value: boolean): void {
    this.mostrarAlerta = false;
    this.isClickedNo = value;
    if (value) {
      this.esFormaValido = false;
      this.proceedNavigation();
    } else {
      this.datos260402Component.seleccionaTab(4);
    }
  }

 /**
   * Controla la navegación entre los pasos del asistente (wizard) según la acción seleccionada.
   *
   * Si la acción es 'cont' (continuar) y el usuario está en el primer paso, valida si se puede avanzar
   * llamando a shouldNavigate$(). Si la validación es exitosa, avanza al siguiente paso y actualiza el estado;
   * de lo contrario, permanece en el paso actual. Para otros pasos, simplemente avanza al siguiente paso.
   * Si la acción no es 'cont', retrocede al paso anterior.
   *
   * Este método actualiza los índices y notifica al wizard para reflejar el cambio de paso en la interfaz.
   */
  private proceedNavigation(): void {
    if (this.accionSeleccionada === 'cont') {
      if (this.indice === 1) { 
          this.shouldNavigate$()
        .subscribe((shouldNavigate) => {
          if (shouldNavigate) {
            this.indice = this.nextIndex;
            this.datosPasos.indice = this.nextIndex;
            this.wizardService.cambio_indice(this.nextIndex);
          } else {
            this.indice = this.currentIndex;
            this.datosPasos.indice = this.currentIndex;
          }
        });
      } else {
        this.indice = this.nextIndex;
        this.datosPasos.indice = this.nextIndex;
        this.wizardService.cambio_indice(this.nextIndex);
      }
    } else {
      this.indice = this.nextIndex;
      this.datosPasos.indice = this.nextIndex;
      this.wizardComponent.atras();
    }
  }

   /**
   * Verifica si se debe navegar al siguiente paso.
   * Realiza una llamada para guardar los datos y determina si la navegación es exitosa.
   * @returns {Observable<boolean>} Observable que emite true si se debe navegar, false en caso contrario.
   */
  private shouldNavigate$(): Observable<boolean> {
    return this.obtenerDatosDelStore$().pipe(
    switchMap(({ datos, terceros, pagoDerechos }) =>
      this.guardar(datos, terceros, pagoDerechos)
    ),
    map(response => {
      const OK = response.codigo === '00';

      // eslint-disable-next-line no-unused-expressions
      OK
        ? this.toastrService.success(response.mensaje)
        : this.toastrService.error(response.mensaje);

      return OK;
    })
  );
  }



/**
 * @description
 * Navega entre los pasos del asistente según la acción recibida.
 * Actualiza el índice actual y ejecuta avanzar o retroceder en el wizard.
 * @param {AccionBoton} e - Objeto con la acción y el valor para la navegación.
 */
pasoNavegarPor(e: AccionBoton): void {
  if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
    this.indice = e.valor;
    this.datosPasos.indice = this.indice;
    if (e.accion === 'cont') {
      this.wizardComponent?.siguiente();
    } else {
      this.wizardComponent?.atras();
    }
  }
}

/** 
 * @description
 * Valida los formularios correspondientes al paso actual del flujo,  
 * devolviendo `true` si son válidos o `false` en caso contrario. 
 * @returns {boolean} `true` si los formularios son válidos, de lo contrario `false`.
 */
  private validarFormulariosPasoActual(): boolean {
    if (this.indice === 1) {
      return this.datos260402Component?.validarFormularios() ?? true;
    }
    return true;
  }

  /** 
   * @description
   * Emite el evento para iniciar la carga de archivos,  
   * notificando a los componentes padres que se debe proceder. 
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * @description
   * Maneja el evento que indica si se debe activar el botón de carga de archivos.
   * Actualiza la variable `activarBotonCargaArchivos` según el valor recibido.
   * @param {boolean} carga - `true` para activar el botón, `false` para desactivarlo.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * @description
   * Actualiza la visibilidad de la sección de carga de documentos.
   * Si la carga se ha realizado, oculta la sección; de lo contrario, la mantiene visible.
   * @param {boolean} cargaRealizada - `true` si la carga fue realizada.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
   * @description
   * Actualiza el estado de carga en progreso.
   * Permite habilitar o deshabilitar indicadores de carga según el valor recibido.
   * @param {boolean} carga - `true` si hay una carga en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

/**
 * @description
 * Maneja el estado de si un campo obligatorio está en blanco.
 * Actualiza `isSaltar` para determinar si se debe omitir o saltar un paso en el flujo.
 * @param {boolean} enBlanco - `true` si un campo obligatorio está en blanco.
 */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

/**
 * @description
 * Retrocede un paso en el asistente y actualiza el índice actual.
 * Sincroniza el valor del índice local y el de los datos del paso
 * con el índice gestionado por el componente del wizard.
 */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

/**
 * @description
 * Avanza al siguiente paso del asistente y actualiza el índice actual.
 * Incluye el punto donde se realizará la validación de documentos antes de continuar.
 * Sincroniza el índice local y el de los datos del paso con el índice del wizard.
 */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
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
