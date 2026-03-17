import {
  AVISO_CONTRNIDO,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  SeccionLibStore,
  WizardComponent,
  doDeepCopy,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ERROR_FORMA_ALERT, MSG_REGISTRO_EXITOSO, PASOS } from '../../constantes/modificacion.enum';
import { Subject, take, takeUntil } from 'rxjs';
import {
  Tramite110204Store,
  TramiteState,
} from '../../estados/tramite110204.store';
import { CertificadosOrigenGridService } from '../../services/certificadosOrigenGrid.service';
import { JSONResponse } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Tramite110204Query } from '../../estados/tramite110204.query';
import { SolicitanteService } from 'libs/shared/data-access-user/src/core/services/shared/solicitante/solicitante.service';


/**
 * Interfaz que define la estructura de una acción de botón.
 */
interface AccionBoton {
  /**
   * La acción que se realizará.
   */
  accion: string;

  /**
   * El valor asociado a la acción.
   */
  valor: number;
}

@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
})
/**
 * Componente que representa la página de solicitud.
 * Este componente gestiona los pasos de un asistente de solicitud (wizard).
 */
export class SolicitudPageComponent implements OnDestroy {
  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;
  /**
   * Estado actual de la solicitud.
   * @property {TramiteState} solicitudState - Almacena el estado de la solicitud.
   */
  public solicitudState!: TramiteState;

  /**
   * Lista de pasos del asistente.
   * Contiene un arreglo con los pasos definidos en `PASOS` que será utilizado en el wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {string} formErrorAlert
   * @description
   * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Índice del paso actual.
   * Este valor se utiliza para determinar qué paso está activo en el wizard.
   * Inicialmente se establece en 1, que corresponde al primer paso.
   */
  constructor(
    private seccionStore: SeccionLibStore,
    private tramiteQuery: Tramite110204Query,
    private tramiteStore: Tramite110204Store,
    private solicitanteService: SolicitanteService,
    private certificadoService: CertificadosOrigenGridService
  ) {
    this.tramiteQuery.selectState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });
  }

  indice: number = 1;

  /**
   * Referencia al componente del asistente (wizard).
   * Se utiliza para interactuar con el wizard y controlar su flujo (pasar a siguiente paso, ir al anterior, etc.).
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {PasoUnoComponent} pasoUnoComponent
   * @description
   * Referencia al componente hijo `PasoUnoComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario del primer paso del asistente desde el componente padre.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;
/**
 * Indica si el formulario de estado es válido.
 * Se utiliza para mostrar mensajes de error relacionados con la selección de estado.
 * Si es true, se muestra el mensaje de error correspondiente en la interfaz.
 */
  esFormaEstadoValido: boolean = false;
  /**
 * Mensaje de error relacionado con la selección de estado.
 * Se muestra cuando el usuario no ha seleccionado un estado válido para la planta o domicilio fiscal.
 */
  formErrorEstadoAlert: string = '';

  /**
   * Datos de los pasos del asistente.
   * Incluye el número total de pasos, el índice del paso actual y los textos de los botones de navegación (Anterior, Continuar).
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length, // Número total de pasos en el asistente
    indice: this.indice, // Índice del paso actual
    txtBtnAnt: 'Anterior', // Texto del botón "Anterior"
    txtBtnSig: 'Continuar', // Texto del botón "Continuar"
  };
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
   * Clase CSS utilizada para mostrar alertas informativas.
   * Esta clase se aplica a los mensajes de información que se muestran en el componente.
   */
  public infoAlert = 'alert-info';

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

  /**
   * Selecciona una pestaña del asistente (wizard).
   * Este método actualiza el índice del paso seleccionado y, por lo tanto, cambia el paso que se está mostrando.
   *
   * @param i Índice de la pestaña a seleccionar (paso).
   */
  seleccionaTab(i: number): void {
    // Actualiza el índice del paso seleccionado
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice de la acción del botón.
   * Este método controla el cambio de paso en el wizard dependiendo de la acción del botón presionado.
   *
   * Si la acción es 'cont', pasa al siguiente paso. Si la acción es 'atras', regresa al paso anterior.
   *
   * @param e Acción del botón (cont o atras) y el valor asociado a la acción.
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    const estado = localStorage.getItem('estado');
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID = this.validarTodosFormulariosPasoUno();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      if (estado !== this.certificadoService.catalogo) {
        this.formErrorEstadoAlert = 'Favor de seleccionar un estado en el que se tenga registrada una planta o su domicilio fiscal';
        this.esFormaEstadoValido = true;
        return;
      }
      else {
        this.esFormaEstadoValido = false;
      }
      this.obtenerDatosDelStore()
    }
    else if (e.valor > 0 && e.valor <= this.pasos.length) {
        if (estado!== this.certificadoService.catalogo) {
        this.formErrorEstadoAlert = 'Favor de seleccionar un estado en el que se tenga registrada una planta o su domicilio fiscal';
        this.esFormaEstadoValido = true;
        return;
      }
      else {
        this.esFormaEstadoValido = false;
      }
      this.pasoNavegarPor(e);
    }
  }

  /**
  * Obtiene los datos del store y los guarda utilizando el servicio.
  */
  obtenerDatosDelStore(): void {
    this.certificadoService.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);

      });
  }



 /**
* Guarda los datos proporcionados en el parámetro `item` construyendo un objeto payload y enviándolo al servicio backend.
* El payload incluye información del solicitante, certificado, destinatario y detalles del certificado.
*
* @param item - Objeto que contiene todos los datos necesarios para el payload, incluyendo información del certificado, destinatario y detalles adicionales.
*
* @remarks
* Este método muestra el payload construido en la consola y está diseñado para enviarlo al backend mediante `certificadoService.guardarDatosPost`.
* La llamada al servicio actualmente está comentada.
*/
 guardar(item: TramiteState): Promise<JSONResponse> {
  const CERTIFICADO = this.certificadoService.buildCertificado(item);
  const DATOS_CERTIFICADO = this.certificadoService.buildDatosCertificado(item);

  const PAYLOAD = {
    rfc_solicitante: 'AAL0409235E6',
    idSolicitud: this.solicitudState.idSolicitud || 0,
    solicitante: {
      rfc: "AAL0409235E6",
      nombre: "ACEROS ALVARADO S.A. DE C.V.",
      actividad_economica: "Fabricación de productos de hierro y acero",
      correo_electronico: "contacto@acerosalvarado.com",
      domicilio: {
        pais: "México",
        codigo_postal: "06700",
        estado: "Ciudad de México",
        municipio_alcaldia: "Cuauhtémoc",
        localidad: "Centro",
        colonia: "Roma Norte",
        calle: "Av. Insurgentes Sur",
        numero_exterior: "123",
        numero_interior: "Piso 5, Oficina A",
        lada: "",
        telefono: "123456"
      }
    },
    certificado: CERTIFICADO,
    datos_del_certificado: DATOS_CERTIFICADO
  };

     return new Promise((resolve, reject) => {
        this.certificadoService.guardarDatosPost(PAYLOAD).subscribe(response => {
          const API_RESPONSE = doDeepCopy(response);
          if(esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
            if(getValidDatos(API_RESPONSE.datos.id_solicitud)) {
              this.tramiteStore.setIdSolicitud(API_RESPONSE.datos.id_solicitud);
               this.folioTemporal = API_RESPONSE.datos.id_solicitud;
              this.pasoNavegarPor({ accion: 'cont', valor: 2 });
            } else {
              this.tramiteStore.setIdSolicitud(0);
            }
          }
          resolve(response);
        }, error => {
          reject(error);
        });
        });
}


  /**
   * Navega a través de los pasos del asistente según la acción del botón.
   * @param e Objeto que contiene la acción y el valor del índice al que se desea navegar.
   */
  pasoNavegarPor(e: AccionBoton): void {
     this.indice = e.valor;
     this.datosPasos.indice = e.valor;
     if (e.valor > 0 && e.valor < 5) {
       if (e.accion === 'cont') {
         this.wizardComponent.siguiente();
         if (e.valor > 0 && e.valor < 5) {
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
 
         }
       } else {
         this.wizardComponent.atras();
       }
     }
   }

  /**
   * @method validarTodosFormulariosPasoUno
   * @description
   * Valida todos los formularios del componente `PasoUnoComponent`.
   * Si la referencia al componente no existe, retorna `true` (no hay formularios que validar).
   * Llama al método `validarFormularios()` del componente hijo y retorna `false` si algún formulario es inválido.
   * Retorna `true` si todos los formularios son válidos.
   *
   * @returns {boolean} Indica si todos los formularios del paso uno son válidos.
   */
  private validarTodosFormulariosPasoUno(): boolean {
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
   * Notificador para gestionar la destrucción de suscripciones RxJS.
   *
   * Es un `Subject<void>` que se utiliza en combinación con el operador `takeUntil`
   * para finalizar las suscripciones activas cuando el componente se destruye.
   *
   * @type {Subject<void>}
   * @private
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
