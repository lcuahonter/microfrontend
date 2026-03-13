import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ERROR_FORMA_ALERT, MSG_REGISTRO_EXITOSO } from '../../constantes/definiciones.enum';
import { Notificacion, doDeepCopy, esValidObject } from '@ng-mf/data-access-user';
import { Subject, firstValueFrom, map, take, takeUntil } from 'rxjs';
import { Tramite120602Store, Tramites120602State } from '../../estados/tramite-120602.store';
import { DatosEmpresaService } from '../../services/datos-empresa.service';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS_REGISTRO } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { RepresentacionFederalComponent } from '../../component/representacion-federal/representacion-federal.component';
import { Tramite120602Query } from '../../estados/tramite-120602.query';
import { WizardComponent } from '@ng-mf/data-access-user';
import { getValidDatos } from '@libs/shared/data-access-user/src';
/**
 * Interfaz que representa la acción de un botón.
 */
interface AccionBoton {
  /**
   * La acción que se va a realizar.
   */
  accion: string;
  /**
   * El valor asociado a la acción.
   */
  valor: number;
}

/**
 * Componente que representa los pasos de datos en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit{
  /**
   * Lista de pasos en el asistente.
   */
  pasos: ListaPasosWizard[] = PASOS_REGISTRO;

  /**
   * Referencia al componente WizardComponent.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente PasoUno.
   * 
   * @viewChild pasoUnoRef
   * @description Permite acceder a las propiedades y métodos públicos del componente PasoUnoComponent desde el componente padre.
   */
  @ViewChild('pasoUnoRef') pasoUno!: PasoUnoComponent;

  /**
   * @description Referencia al componente `RepresentacionFederalComponent` dentro de la vista actual.
   * Permite acceder a las propiedades y métodos públicos del componente hijo para interactuar desde el componente padre.
   * 
   * @type {RepresentacionFederalComponent}
   * @memberof DatosComponent
   */
  @ViewChild(RepresentacionFederalComponent) representacionFederal!: RepresentacionFederalComponent;

   /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Variable utilizada para almacenar la lista de pasos.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS_REGISTRO;

  /**
   * Variable utilizada para almacenar el índice del paso actual.
   */
  indice: number = 1;

  /**
   * Datos para los pasos en el asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   * }
   */
  esFormaValido: boolean = false;

/**
 * Almacena el estado actual de la solicitud del trámite 120602.
 * Contiene la información y los datos necesarios para el flujo del trámite.
 */
  /**
   * Almacena el estado actual de la solicitud del trámite 120602.
   * Contiene la información y los datos necesarios para el flujo del trámite.
   */
  public solicitudState!: Tramites120602State;

/**
 * Emite una notificación para cancelar suscripciones y evitar fugas de memoria.
 * Se utiliza comúnmente en el método ngOnDestroy con takeUntil().
 */
  destroyNotifier$: Subject<void> = new Subject();

  /** Identificador numérico para guardar la solicitud.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;

   /**
   * Emite evento para iniciar carga de archivos
   * @method onClickCargaArchivos
   * @description Dispara el evento cargarArchivosEvento para notificar a componentes
   * hijo que deben iniciar el proceso de carga de archivos
   * @returns {void}
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
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

  /** Mensaje de confirmación al guardar la solicitud.
   * Se inicializa como una cadena vacía y se actualiza cuando se guarda la solicitud.
   */
  guardarMensaje: string = '';

  /**
 * Controla la activación del botón para cargar archivos.
 * Se establece en true cuando las condiciones necesarias se cumplen.
 */
  activarBotonCargaArchivos: boolean = false;

  /**
 * Indica si la sección de carga de documentos está visible o activa.
 * Se utiliza para mostrar u ocultar dicha sección en la interfaz.
 */
  seccionCargarDocumentos: boolean = true;

  /**
 * Indica si actualmente hay una carga en progreso.
 * Se utiliza para mostrar indicadores de carga o deshabilitar acciones durante el proceso.
 */
  cargaEnProgreso: boolean = true;

  /**
 * Indica si se debe omitir o saltar un paso en el flujo del trámite.
 * Se utiliza para controlar la navegación condicional en el proceso.
 */
  isSaltar: boolean = false;

  /**
 * Emite un evento cuando se solicita la carga de archivos.
 * Permite comunicar esta acción a otros componentes o servicios suscritos.
 */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Almacena la notificación que se mostrará al usuario.
   */
  public alertaNotificacion!: Notificacion;
 
  /**
   * Folio temporal asignado a la solicitud antes de ser guardada definitivamente.
   */
  public folioTemporal: number = 0;

  /**
 * Inyecta los servicios y la store necesarios para gestionar el trámite 120602.
 * - servicio120602: Maneja los datos relacionados con la empresa.  
 * - tramite120602Store: Administra el estado del trámite.  
 * - tramite120602Query: Permite consultar el estado actual del trámite.
 */
  /**
   * Constructor del componente. Inyecta los servicios y la store necesarios para gestionar el trámite 120602.
   * @param servicio120602 Servicio para manejar los datos de la empresa.
   * @param tramite120602Store Store para administrar el estado del trámite.
   * @param tramite120602Query Query para consultar el estado actual del trámite.
   */
  constructor( 
    private servicio120602: DatosEmpresaService,
    private tramite120602Store: Tramite120602Store,
    private tramite120602Query: Tramite120602Query
  ) {}

  /**
 * Inicializa el componente y se suscribe a los cambios del estado de la solicitud.
 * Actualiza la variable `solicitudState` cada vez que el estado del trámite cambia.
 * La suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
 */
    ngOnInit(): void {
      this.tramite120602Query.selectSolicitud$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.solicitudState = seccionState;
          })
        ).subscribe();
    }

  /**
   * Valida los formularios del paso actual y marca los campos inválidos como tocados para mostrar errores de validación.
   */
  /**
   * Valida los formularios del paso actual y marca los campos inválidos como tocados para mostrar errores de validación.
   * @returns {boolean} true si el formulario es válido, false en caso contrario.
   */
  public validarFormularios(): boolean {
    let isValid = true;

    // Validar formulario de solicitante (pestaña 1) a través del componente paso-uno
    if (this.pasoUno) {
      isValid = this.pasoUno.validarFormularios();
    } else {
      isValid = false;
    }

    return isValid;
  }

  /**
   * Actualiza el valor del índice según el evento del botón de acción.
   * @param e El evento del botón de acción que contiene la acción y el valor.
   */
  /**
   * Actualiza el valor del índice según el evento del botón de acción.
   * @param e El evento del botón de acción que contiene la acción y el valor.
   */
  public async getValorIndice(e: AccionBoton): Promise<void> {
    this.esFormaValido = false;
    // Validar formularios antes de continuar desde el paso uno
    if (this.indice === 1 && e.accion === 'cont') {
      const ISVALID = this.validarFormularios();
      if (!ISVALID) {
        this.esFormaValido = true;
        // Scroll to top to show error message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return; // Detener ejecución si los formularios son inválidos
      }
    try {
      await this.obtenerDatosDelStore();
    } catch (err) {
      console.error('Error saving data before continuing', err);
      return;
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
     

      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
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
      } else if (e.accion === 'ant') {
        this.wizardComponent.atras();
      }
    }
  }

  /**
 * Maneja el evento que indica si se debe activar el botón de carga de archivos.
 * Actualiza la variable `activarBotonCargaArchivos` según el valor recibido.
 */
  /**
   * Maneja el evento que indica si se debe activar el botón de carga de archivos.
   * @param carga Valor booleano que indica si se activa el botón de carga de archivos.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
 * Actualiza la visibilidad de la sección de carga de documentos.
 * Si la carga se ha realizado, oculta la sección; de lo contrario, la mantiene visible.
 */
  /**
   * Actualiza la visibilidad de la sección de carga de documentos.
   * @param cargaRealizada Indica si la carga se ha realizado.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
 * Actualiza el estado de carga en progreso.
 * Permite habilitar o deshabilitar indicadores de carga según el valor recibido.
 */
  /**
   * Actualiza el estado de carga en progreso.
   * @param carga Indica si hay una carga en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

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
   * Obtiene los datos almacenados en el estado (store) mediante el servicio correspondiente.
   * Realiza una única suscripción al observable usando 'take(1)'.
   * Al recibir los datos, los guarda mediante el método 'guardar'.
   */
    obtenerDatosDelStore(): Promise<void> {
      return firstValueFrom(this.servicio120602.getAllState().pipe(take(1)))
      .then(data => {
      return this.guardar(data);
      });
    }

/**
 * Construye y envía la información de la solicitud y de la empresa para su guardado.
 * - `data`: Estado actual del trámite que se transformará en los datos de la empresa.
 * Crea un payload con la información del solicitante y los datos de la empresa para enviarlo al servicio correspondiente.
 */
  guardar(data: Tramites120602State):Promise<void>{
    const DATOS_EMPRESA = this.servicio120602.buildDatosEmpresa(data);
    const PAYLOAD = {
     "solicitante": {
        "rfc": "AAL0409235E6",
        "nombre": "ACEROS ALVARADO S.A. DE C.V.",
        "actividad_economica": "Fabricación de productos de hierro y acero",
        "correo_electronico": "contacto@acerosalvarado.com",
        "razonSocial": "INTEGRADORA",
        "domicilio": {
            "pais": "México",
            "codigoPostal": "03100",
            "estado": "26",
            "delegacionMunicipio": "Benito Juárez",
            "localidad": "REGION ARROYO SECO",
            "colonia": "Del Valle",
            "calle": "Av. Insurgentes Sur",
            "numeroExterior": "1234",
            "numeroInterior": "A",
            "lada": "1234",
            "telefono": "12345678"
        }
    },
    "datosEmpresa": DATOS_EMPRESA
    }
        return new Promise((resolve, reject) => {
          this.servicio120602.guardarDatosPost(PAYLOAD).subscribe(response => {
            const API_RESPONSE = doDeepCopy(response);
            if(esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
              if(getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                this.tramite120602Store.setIdSolicitud(API_RESPONSE.datos.id_solicitud);
              } else {
                this.tramite120602Store.setIdSolicitud(0);
              }
            }
            resolve();
          }, error => {
            reject(error);
          });
          });
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
}
