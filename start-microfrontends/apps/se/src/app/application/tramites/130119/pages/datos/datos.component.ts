import { AVISO, DatosPasos, JSONResponse, ListaPasosWizard, LoginQuery, Notificacion, WizardComponent, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { CALCULATE_ALERT_ERROR, FORM_ERROR_ALERT, MSG_REGISTRO_EXITOSO, PASOS_EXPORTACION } from '../../constants/aviso-importacion-maquinas.enum';
import { Component, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { Subject, map, take, takeUntil } from 'rxjs';
import { Tramite130119State, Tramite130119Store } from '../../estados/store/tramite130119.store';
import { AVISO_PRIVACIDAD_CONTENIDO } from '../../constants/aviso-importacion-maquinas.enum';
import { AccionBoton } from '../../modelos/aviso-importacion-maquinas.model';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud/datos-de-la-solicitud.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite130119Query } from '../../estados/queries/tramite130119.query';

/**
 * Componente DatosComponent.
 *
 * Este componente gestiona la selección de pestañas (tabs) y muestra contenido diferente
 * basado en el índice de la pestaña seleccionada.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  standalone: false, // Indica que este componente no es un componente independiente (standalone).
})
export class DatosComponent implements OnDestroy {

  /**
   * Referencia al componente WizardComponent.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Variable utilizada para almacenar la lista de pasos.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * Variable utilizada para almacenar el índice del paso actual.
   */
  indice: number = 1;

  /**
   * Datos para los pasos en el asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  /**
 * Contenido del aviso de privacidad utilizado en el componente.
 * @public
 * @readonly
 * @type {string}
 * @memberof SanidadCertificadoComponent
 */
  readonly AVISO_PRIVACIDAD_CONTENIDO: string = AVISO_PRIVACIDAD_CONTENIDO;

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
   * Referencia al componente `PasoUnoComponent`.
   * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
   */
  @ViewChild(PasoUnoComponent, { static: false }) pasoUnoComponent!: PasoUnoComponent;

  /**
* Indica si el botón para cargar archivos está habilitado.
*/
  activarBotonCargaArchivos: boolean = false;

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;

  /**
   * @property {Tramite130119State} solicitudState
   * @description
   * Estado actual de la solicitud del trámite 130119.
   */
  solicitudState!: Tramite130119State;

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
     * Folio temporal de la solicitud.
     * Se utiliza para mostrar el folio en la notificación de éxito.
     */
  public alertaNotificacion!: Notificacion;

  /**
      * Constante que almacena el valor de la nota de privacidad.
      * 
      * @constant AVISO_PRIVACIDAD_ADJUNTAR - Almacena el valor definido en `NOTA.AVISO_PRIVACIDAD_ADJUNTAR`.
      * Se utiliza para adjuntar o gestionar el aviso de privacidad dentro del sistema.
      */
  AVISO_PRIVACIDAD_ADJUNTAR = AVISO.Aviso;

  /**
     * Lista de pasos que se deben completar en el asistente.
     */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
    * Evento que se emite para cargar archivos.
    * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
    */
  cargarArchivosEvento = new EventEmitter<void>();

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
   * @description
   * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

    /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

  /**
 * @constructor
 * @description
 * Inicializa la clase inyectando los servicios y stores necesarios para la gestión
 * del trámite 130119 y el estado de la sesión del usuario.
 *
 * El constructor realiza dos suscripciones importantes:
 *
 * 1. **selectTramite130119$**  
 *    - Se suscribe al estado del trámite 130119.  
 *    - Al recibir cambios, actualiza la propiedad `solicitudState` con el nuevo estado.  
 *
 * 2. **selectLoginState$**  
 *    - Se suscribe al estado de login del usuario.  
 *    - Obtiene el RFC desde el store de login y lo envía al store del trámite
 *      para mantener sincronizados los datos.
 *
 * Ambas suscripciones se cancelan automáticamente usando `takeUntil(this.destroyed$)`  
 * para evitar fugas de memoria al destruir el componente.
 *
 * @param {LoginQuery} loginQuery - Consulta del estado de login del usuario.
 * @param {DatosDeLaSolicitudService} datosDeLaSolicitudService - Servicio para obtener y gestionar datos de la solicitud.
 * @param {Tramite130119Store} tramite130119Store - Store encargado de gestionar el estado del trámite 130119.
 * @param {Tramite130119Query} tramite130119Query - Query para consultar el estado del trámite 130119.
 * @param {ToastrService} toastrService - Servicio para mostrar notificaciones al usuario.
 */
  constructor(private loginQuery: LoginQuery, 
    public datosDeLaSolicitudService: DatosDeLaSolicitudService, 
    public tramite130119Store: Tramite130119Store, 
    public tramite130119Query: Tramite130119Query, 
    public toastrService: ToastrService) {
    this.tramite130119Query.selectTramite130119$.pipe(takeUntil(this.destroyed$)).subscribe((solicitudState) => {
      this.solicitudState = solicitudState;
    });

    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.tramite130119Store.establecerDatos({ loginRfc: seccionState.rfc });
        })
      )
      .subscribe();
  }



  /**
 * @method anterior
 * @description
 * Método para navegar programáticamente al paso anterior del wizard.
 * Ejecuta la transición backward en el componente wizard y actualiza los
 * índices correspondientes para mantener sincronización de estado.
 * 
 * @navigation_backward
 * Realiza navegación que:
 * - Retrocede al paso anterior usando `wizardComponent.atras()`
 * - Actualiza índice local basado en nueva posición del wizard
 * - Sincroniza datos de pasos con posición actualizada
 * - Mantiene consistencia de estado durante retroceso
 * 
 * @wizard_synchronization
 * Mantiene sincronización entre:
 * - Índice local del componente
 * - Índice actual del wizard component  
 * - Datos de configuración de pasos
 * - Estado visual de navegación
 * 
 * @state_preservation
 * Durante retroceso:
 * - Preserva datos capturados en pasos anteriores
 * - Mantiene validaciones ya realizadas
 * - Conserva estado de formularios
 * 
 * @state_update
 * Actualiza:
 * - `indice`: Nueva posición actual + 1
 * - `datosPasos.indice`: Sincronización con datos de pasos
 * 
 * @void
 * @backward_navigation
 */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }


  /**
   * Método para actualizar el índice del paso actual en el asistente.
   * También navega al siguiente o al paso anterior según la acción especificada.
   *
   * Objeto de tipo `AccionBoton` que contiene:
   *  - `valor`: El nuevo índice del paso.
   *  - `accion`: La acción a realizar ('cont' para continuar o 'ant' para retroceder).
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID = this.pasoUnoComponent?.datosDeLaSolicitudComponent?.validarFormulario();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore(e);
    } else if (e.valor > 0 && e.valor <= this.pasosSolicitar.length) {
      this.pasoNavegarPor(e);
    }
  }

  /**
    * Obtiene los datos del store y los guarda utilizando el servicio.
    */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.datosDeLaSolicitudService.getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data, e);
      });
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

/**
   * @method blancoObligatoria
   * @description Método para manejar el evento de documentos obligatorios en blanco.
   * Actualiza la bandera `isSaltar` basada en el estado recibido.
   * @param {boolean} enBlanco - Indica si hay documentos obligatorios en blanco.
   * @return {void}
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
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
  guardar(item: Tramite130119State, e: AccionBoton): Promise<JSONResponse> {
    const PAYLOAD = this.datosDeLaSolicitudService.guardarPayloadDatos(item) as Record<string, unknown>;

    return new Promise((resolve, reject) => {
      let shouldNavigate = false;
      this.datosDeLaSolicitudService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {
          this.esFormaValido = false;
          if (response.codigo === '03') {
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
                this.tramite130119Store.establecerDatos({ idSolicitud: API_RESPONSE.datos.id_solicitud });
              } else {
                this.tramite130119Store.establecerDatos({ idSolicitud: 0 });
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
 * @method siguiente
 * @description
 * Método para navegar programáticamente al siguiente paso del wizard.
 * Ejecuta la transición forward en el componente wizard y actualiza los
 * índices correspondientes para mantener sincronización de estado.
 * 
 * @navigation_forward
 * Realiza navegación que:
 * - Ejecuta validación de documentos cargados (comentario indica validación futura)
 * - Avanza al siguiente paso usando `wizardComponent.siguiente()`
 * - Actualiza índice local basado en posición del wizard
 * - Sincroniza datos de pasos con nueva posición
 * 
 * @wizard_synchronization
 * Mantiene sincronización entre:
 * - Índice local del componente
 * - Índice actual del wizard component
 * - Datos de configuración de pasos
 * - Estado visual de la UI
 * 
 * @future_validation
 * Comentario indica que se implementará:
 * - Validación de documentos cargados
 * - Verificación de completitud de adjuntos
 * - Control de calidad de archivos
 * 
 * @state_update
 * Actualiza:
 * - `indice`: Posición actual + 1
 * - `datosPasos.indice`: Sincronización con datos de pasos
 * 
 * @void
 * @programmatic_navigation
 */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
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
  * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
  * Limpia los recursos y restablece el estado del store asociado al trámite 130114.
  */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.tramite130119Store.resetStore();
  }
}
