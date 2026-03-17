import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Subject, firstValueFrom, map, take, takeUntil } from 'rxjs';
import { Tramite120601Store, Tramites120601State } from '../../estados/tramite-120601.store';
import {doDeepCopy, esValidObject } from '@ng-mf/data-access-user';
import { DatosEmpresaService } from '../../services/datos-empresa.service';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ERROR_FORMA_ALERT } from '../../constantes/definiciones.enum';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS_REGISTRO } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { RepresentacionFederalComponent } from '../../component/representacion-federal/representacion-federal.component';
import { Tramite120601Query } from '../../estados/tramite-120601.query';
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
 * Almacena el estado actual de la solicitud del trámite 120601.
 * Contiene la información y los datos necesarios para el flujo del trámite.
 */
  public solicitudState!: Tramites120601State;

/**
 * Emite una notificación para cancelar suscripciones y evitar fugas de memoria.
 * Se utiliza comúnmente en el método ngOnDestroy con takeUntil().
 */
  destroyNotifier$: Subject<void> = new Subject();

  /** Identificador numérico para guardar la solicitud.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;

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
 * Inyecta los servicios y la store necesarios para gestionar el trámite 120601.
 * - servicio120601: Maneja los datos relacionados con la empresa.  
 * - tramite120601Store: Administra el estado del trámite.  
 * - tramite120601Query: Permite consultar el estado actual del trámite.
 */
  constructor( 
    private servicio120601: DatosEmpresaService,
    private tramite120601Store: Tramite120601Store,
    private tramite120601Query: Tramite120601Query
  ) {}

  /**
 * Inicializa el componente y se suscribe a los cambios del estado de la solicitud.
 * Actualiza la variable `solicitudState` cada vez que el estado del trámite cambia.
 * La suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
 */
    ngOnInit(): void {
      this.tramite120601Query.selectSolicitud$
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
      } else if (e.accion === 'ant') {
        this.wizardComponent.atras();
      }
    }
  }

  /**
 * Maneja el evento que indica si se debe activar el botón de carga de archivos.
 * Actualiza la variable `activarBotonCargaArchivos` según el valor recibido.
 */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
 * Actualiza la visibilidad de la sección de carga de documentos.
 * Si la carga se ha realizado, oculta la sección; de lo contrario, la mantiene visible.
 */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
 * Actualiza el estado de carga en progreso.
 * Permite habilitar o deshabilitar indicadores de carga según el valor recibido.
 */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
 * Maneja el estado de si un campo obligatorio está en blanco.
 * Actualiza `isSaltar` para determinar si se debe omitir o saltar un paso en el flujo.
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
      return firstValueFrom(this.servicio120601.getAllState().pipe(take(1)))
      .then(data => {
      return this.guardar(data);
      });
    }

/**
 * Construye y envía la información de la solicitud y de la empresa para su guardado.
 * - `data`: Estado actual del trámite que se transformará en los datos de la empresa.
 * Crea un payload con la información del solicitante y los datos de la empresa para enviarlo al servicio correspondiente.
 */
  guardar(data: Tramites120601State):Promise<void>{
    const DATOS_EMPRESA = this.servicio120601.buildDatosEmpresa(data);
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
          this.servicio120601.guardarDatosPost(PAYLOAD).subscribe(response => {
            const API_RESPONSE = doDeepCopy(response);
            if(esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
              if(getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                this.tramite120601Store.setIdSolicitud(API_RESPONSE.datos.id_solicitud);
              } else {
                this.tramite120601Store.setIdSolicitud(0);
              }
            }
            resolve();
          }, error => {
            reject(error);
          });
          });
  }
}
