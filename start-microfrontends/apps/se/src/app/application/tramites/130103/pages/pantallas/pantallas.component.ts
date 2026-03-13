import { AccionBoton, DatosPasos, JSONResponse, ListaPasosWizard, Notificacion, WizardComponent, doDeepCopy, esValidObject, getValidDatos, } from '@libs/shared/data-access-user/src';
import { CALCULATE_ALERT_ERROR, FORM_ERROR_ALERT, MSG_REGISTRO_EXITOSO } from '../../constantes/importacion-definitiva.enum';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, take, takeUntil } from 'rxjs';
import { Tramite130103State, Tramite130103Store } from '../../../../estados/tramites/tramite130103.store';
import { AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/aviso-privacidad.enum';
import { ImportacionDefinitivaService } from '../../services/importacion-definitiva.service';
import { PANTA_PASOS } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantallas.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite130103Query } from '../../../../estados/queries/tramite130103.query';

/**
 * @component
 * @name PantallasComponent
 * @description
 * Componente que gestiona la visualización de pantallas y permite cambiar entre diferentes pasos o pestañas.
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html'
})
export class PantallasComponent implements OnInit, OnDestroy {
  /**  * Estado del trámite de importación definitiva.
  */
  solicitudState!: Tramite130103State;
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
 * Indica si la carga de documentos está en progreso.
 * Se inicializa en true para indicar que la carga está en progreso al inicio.
 */
  cargaEnProgreso: boolean = true;

  /**
     * Evento que se emite para cargar archivos.
     * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
     */
  cargarArchivosEvento = new EventEmitter<void>();
  /**
 * compo doc
 * Lista de pasos del wizard.
 * @type {ListaPasosWizard[]}
 */
  public pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;

  /**
     * Folio temporal de la solicitud.
     * Se utiliza para mostrar el folio en la notificación de éxito.
     */
  public alertaNotificacion!: Notificacion;

  /**
    * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
    */
  public formErrorAlert = FORM_ERROR_ALERT;

  /**
   * Referencia a la función generadora de mensajes de error relacionados
   * con el proceso de cálculo.
   */
  public CALCULATE_ALERT_ERROR = CALCULATE_ALERT_ERROR;

  /**
  * @property {boolean} esFormaValido
  * @description
  * Indica si el formulario del paso actual es válido.
  * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
  */
  esFormaValido: boolean = false;
  /**
 * @description
 * Folio temporal asignado de manera provisional mientras se genera
 * o se obtiene el folio definitivo del trámite o solicitud.
 *
 * Este valor inicia en 0 y se actualiza conforme avanza el proceso,
 * permitiendo identificar temporalmente la operación en curso.
 *
 * @type {number}
 */
  folioTemporal: number = 0;

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

  /**
  *  Método para manejar el evento de carga en progreso.
  * @param carga Indica si la carga está en progreso.
  */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }
  /**
 * compo doc 
 * Índice del paso actual.
 * @type {number}
 * @default 1
 */
  public indice: number = 1;

  /**
 * compo doc
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
  * compo doc
  * variable para contener el índice de la pestaña seleccionada
  * @type {number}
  */
  public indiceDePestanaSeleccionada: number = 1;

  /**
 * compo doc
 * Mensaje relacionado con el aviso de privacidad simplificado.
 * 
 * @type {string}
 * @memberof PantallasComponent
 */
  public avisoPrivacidadAlert: string = AVISO.Aviso;

  /**
 * compo doc
 * Referencia al componente Wizard para controlar la navegación entre pasos.
 * @type {WizardComponent}
 */
  @ViewChild(WizardComponent) public wizardComponent!: WizardComponent;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  public consultaState!: ConsultaioState;

  /**
    * jest.spyOnIdentificador del procedimiento actual.
    * @type {number}
    */
  idProcedimiento: number = 130103;

  /**
     * Referencia al componente `PasoUnoComponent`.
     * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
     */
  @ViewChild(PasoUnoComponent, { static: false }) pasoUnoComponent!: PasoUnoComponent;

  /**
  * @constructor
  * @description Inicializa una instancia del `DatosComponent`.
  */
  constructor(
    private consultaQuery: ConsultaioQuery, private importacionDefinitivaService: ImportacionDefinitivaService,
    private tramite130103Store: Tramite130103Store, private toastrService: ToastrService, private tramite130103Query: Tramite130103Query
  ) {
    this.tramite130103Query.selectSolicitud$.pipe(
      takeUntil(this.destroyNotifier$)).subscribe((solicitudState) => {
        this.solicitudState = solicitudState;
      });
  }

  /**
   * compo doc
   * @method ngOnInit
   * @description
   * Método de inicialización del componente `DatosComponent`.
   * 
   * Detalles:
   * - Se suscribe al observable `selectConsultaioState$` del store `ConsultaioQuery` para obtener el estado actual de la consulta.
   * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   * - Actualiza la propiedad `consultaState` con el estado recibido.
   * - Si la propiedad `update` del estado es verdadera, llama al método `guardarDatosFormulario()`.
   * - Si no, establece la bandera `esDatosRespuesta` en `true` para indicar que se deben mostrar los datos de respuesta.
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
        })
      ).subscribe();
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
* Emite un evento para cargar archivos.
* {void} No retorna ningún valor.
*/
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * compo doc
   * Método para avanzar al siguiente paso en el asistente.
   * Detalles:
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
  * compo doc
  * Actualiza el índice del paso y maneja la navegación hacia adelante o atrás.
  *
  * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
  * @returns {void}
  */
  public getValorIndice(e: AccionBoton): void {

    this.esFormaValido = false;
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID = this.pasoUnoComponent?.solicitudComponent?.validarFormulario();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
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
  /**
   * compo doc
   * Función que obtiene el índice de la pestaña seleccionada
   * @param {number} event - evento de numero
   * @returns {void}
   */
  pestanaCambiado(event: number): void {
    if (event !== undefined && event !== null && !isNaN(event)) {
      this.indiceDePestanaSeleccionada = event;
    } else {
      this.indiceDePestanaSeleccionada = 1;
    }
  }

  /**
    * Obtiene los datos del store y los guarda utilizando el servicio.
    */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.importacionDefinitivaService.getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data, e);
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
  guardar(item: Tramite130103State, e: AccionBoton): Promise<JSONResponse> {
    const PAYLOAD = this.importacionDefinitivaService.guardarPayloadDatos(item) as Record<string, unknown>;

    return new Promise((resolve, reject) => {
      let shouldNavigate = false;
      this.importacionDefinitivaService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {
          this.esFormaValido = false;
          if (response.codigo === '3') {
            this.esFormaValido = true;
            this.formErrorAlert = this.CALCULATE_ALERT_ERROR((response as unknown as { error: string })['error'] || '');
          }
          shouldNavigate = response.codigo === '00';
          if (shouldNavigate) {
            const API_RESPONSE = doDeepCopy(response);
            if (
              esValidObject(API_RESPONSE) &&
              esValidObject(API_RESPONSE.datos)
            ) {
              if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                this.folioTemporal = API_RESPONSE.datos.idSolicitud || API_RESPONSE.datos.id_solicitud;
                this.tramite130103Store.actualizarEstado({ idSolicitud: API_RESPONSE.datos.id_solicitud });
              } else {
                this.tramite130103Store.actualizarEstado({ idSolicitud: 0 });
              }
              if (e.valor > 0 && e.valor < 5) {
                this.indice = e.valor;

                if (e.valor > 0 && e.valor < 5) {
                  this.indice = e.valor;
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
            }
            this.toastrService.success(response.mensaje);
            resolve(response);
          } else {
            this.toastrService.error(response.mensaje);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  /**
 * @method ngOnDestroy
 * @description
 * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
 * 
 * Detalles:
 * - Emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores que el componente está siendo destruido.
 * - Completa el observable para liberar recursos y evitar fugas de memoria.
 * 
 * @returns {void} No retorna ningún valor.
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
