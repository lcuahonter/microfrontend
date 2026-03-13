import { AVISO_CONTRNIDO, AccionBoton, DatosPasos, ERROR_FORMA_ALERT, JSONResponse, ListaPasosWizard, Notificacion, WizardComponent, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Solicitud110208State, Tramite110208Store } from '../../../../estados/tramites/tramite110208.store';
import { Subject, take, takeUntil } from 'rxjs';
import { ALERTA_COM } from '@libs/shared/data-access-user/src/tramites/constantes/110208/certificado.enum';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { MSG_REGISTRO_EXITOSO } from '../../constants/validacion-posteriori.enum';
import { PASOS } from "@libs/shared/data-access-user/src/core/enums/110208/modificacion.enum";
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Solocitud110208Service } from '../../services/service110208.service';
import { Tramite110208Query } from '../../../../estados/queries/tramite110208.query';

/**
 * Componente para la página de solicitud.
 * Este componente gestiona el flujo de un asistente (wizard) para completar los pasos de un trámite.
 */
@Component({
  selector: 'app-solicitud-page',
  templateUrl: './solicitud-page.component.html',
})
export class SolicitudPageComponent implements OnDestroy {
  /**
   * Índice actual del paso en el asistente.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;
  /**
* @property {boolean} esFormaValido
* @description
* Indica si el formulario del paso actual es válido.
* Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
*/
  esFormaValido: boolean = false;
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
  * @property {PasoUnoComponent} pasoUnoComponent
  * @description
  * Referencia al componente hijo `PasoUnoComponent` mediante ViewChild.
  * Permite acceder a los métodos y propiedades del formulario del primer paso del asistente desde el componente padre.
  */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /**
   * Estado actual de la 110208.
   * @type {Solicitud110208State}
   */
  public solicitudState!: Solicitud110208State;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;
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
   * Constructor del componente. Se inyectan servicios y queries necesarios para el flujo de datos.
   * @param consultaQuery Consulta a los datos del store.
   * @param solocitud110208Service Servicio para carga y actualización de datos del formulario.
   */
  constructor(
    private solocitud110208Service: Solocitud110208Service,
    public tramite110208Store: Tramite110208Store,
    private tramite110208Query: Tramite110208Query,
  ) {
    this.tramite110208Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });

  }

  /**
   * Constante de alerta utilizada en el componente.
   * @type {typeof ALERTA_COM}
   */
  alerta = ALERTA_COM;

  /**
   * Indica si ya se cargaron los datos de respuesta para mostrar en el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Observable para gestionar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * Referencia al componente del asistente (wizard).
   * Se utiliza para interactuar con el wizard y controlar su flujo (pasar al siguiente paso, ir al anterior, etc.).
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Lista de pasos del asistente.
   * Contiene un arreglo con los pasos definidos en `PASOS` que será utilizado en el wizard.
   * @type {ListaPasosWizard[]}
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Datos de los pasos del asistente.
   * Incluye el número total de pasos, el índice del paso actual y los textos de los botones de navegación (Anterior, Continuar).
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    /**
     * Número total de pasos en el asistente.
     */
    nroPasos: this.pasos.length,
    /**
     * Índice del paso actual.
     */
    indice: this.indice,
    /**
     * Texto del botón "Anterior".
     */
    txtBtnAnt: 'Anterior',
    /**
     * Texto del botón "Continuar".
     */
    txtBtnSig: 'Continuar',
  };

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
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID = this.validarTodosFormulariosPasoUno();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore()
    }
    else if (e.valor > 0 && e.valor <= this.pasos.length) {
      this.pasoNavegarPor(e);
    }
  }
  /**
  * Obtiene los datos del store y los guarda utilizando el servicio.
  */
  obtenerDatosDelStore(): void {
    this.solocitud110208Service.getAllState()
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
  guardar(data: Solicitud110208State): Promise<JSONResponse> {
    const CERTIFICADO = this.solocitud110208Service.buildCertificado(data);
    const DATOS_CERTIFICADO = this.solocitud110208Service.buildDatosCertificado(data);
    const DESTINATARIO = this.solocitud110208Service.buildDestinatario(data);
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
      destinatario: DESTINATARIO,
      datos_del_certificado: DATOS_CERTIFICADO
    };

    return new Promise((resolve, reject) => {
      this.solocitud110208Service.guardarDatosPost(PAYLOAD).subscribe(response => {
        const API_RESPONSE = doDeepCopy(response);
        if (esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
          if (getValidDatos(API_RESPONSE.datos.id_solicitud || API_RESPONSE.datos.idSolicitud)) {
            this.folioTemporal = API_RESPONSE.datos.id_solicitud;
            this.tramite110208Store.setIdSolicitud((API_RESPONSE.datos.id_solicitud || API_RESPONSE.datos.idSolicitud));
            this.pasoNavegarPor({ accion: 'cont', valor: 2 });
          } else {
            this.tramite110208Store.setIdSolicitud(0);
          }
        }
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * Obtiene el valor del índice de la acción del botón.
   * @param e Acción del botón.
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
    const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validateAll();
    if (!ISFORM_VALID_TOUCHED) {
      return false;
    }
    return true;
  }
  /**
   * Hook de destrucción del componente. Limpia las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}