
import { AVISO, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { Component,EventEmitter,OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { AmpliacionServiciosQuery } from '../../estados/tramite80205.query';
import { AmpliacionServiciosStore } from '../../estados/tramite80205.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ERROR_SERVICIO_ALERT } from '../../models/datos-info.model';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * Interfaz que representa una acción asociada a un botón.
 * 
 * @property {string} accion - Nombre o descripción de la acción que realiza el botón.
 * @property {number} valor - Valor asociado a la acción, que puede ser utilizado para identificar o parametrizar la acción.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * @fileoverview Componente principal para el formulario de certificado zoosanitario.
 * Este componente gestiona el flujo del formulario a través de un asistente (wizard),
 * controlando la navegación entre los pasos y la información mostrada en cada uno.
 * @component RegistroPageComponent --80205
 * @selector app-registro-page
 * @templateUrl ./registro-page.component.html
 */
@Component({
  selector: 'app-registro-page',
  templateUrl: './registro-page.component.html',
})
export class RegistroPageComponent implements OnDestroy {

  /**
   * Array de pasos del asistente.
   * @property {ListaPasosWizard[]} pasos - Lista de los pasos del asistente, incluyendo título y componente asociado.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Subject utilizado para notificar la destrucción del componente.
   * 
   * Se utiliza con el operador `takeUntil` para cancelar automáticamente
   * todas las suscripciones cuando el componente se destruye, evitando
   * memory leaks y comportamientos inesperados.
   * 
   * @property {Subject<void>} destroyNotifier$ - Subject que emite cuando el componente se destruye
   */
  destroyNotifier$: Subject<void> = new Subject();

   /**
   * Clase CSS para mostrar una alerta de error.
   * @type {string}
   */
  infoError = 'alert-danger';

  /**
   * Título del mensaje principal.
   * @property {string | null} tituloMensaje - Título que se muestra en la parte superior del formulario.
   */
  tituloMensaje: string | null = 'Registro de solicitud IMMEX modalidad ampliación servicios ';

  /**
   * Componente Wizard.
   * @property {WizardComponent} wizardComponent - Referencia al componente Wizard para controlar la navegación.
   */
  @ViewChild('wizardRef') wizardComponent!: WizardComponent;

  /**
   * Índice actual del paso.
   * @property {number} indice - Índice del paso actual en el que se encuentra el usuario.
   */
  indice: number = 1;

   /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
   @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

   /**
     * Mensaje de error para validación de formularios.
     * @type {string}
     */
   public formErrorAlert!:string;


      /**
     * Valor del aviso de privacidad.
     * @type {string}
     */
      AVISO_PRIVACIDAD_ADJUNTAR = AVISO.Aviso;

  /**
   * Controla la visibilidad del mensaje de error.
   * @type {boolean}
   */
  esFormaValido: boolean = true;

  /**
   * Datos para la configuración de los botones del asistente.
   * @property {DatosPasos} datosPasos - Configuración para los botones "Anterior" y "Siguiente".
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Mensaje de éxito para el primer paso.
   * @type {string}
   */
  mensajeDeTextoDeExito: string = "MENSAJE_DE_ÉXITO_ETAPA_UNO";


  
      /**
       * Evento para cargar archivos.
       * @type {EventEmitter<void>}
       */
      cargarArchivosEvento = new EventEmitter<void>();
    
      /**
       * Evento para regresar a la sección de carga de documentos.
       * @type {EventEmitter<void>}
       */
      regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();
    
      /**
     * Indica si el botón de carga de archivos está habilitado.
     * @type {boolean}
     */
      activarBotonCargaArchivos: boolean = false;
    
      /**
     * Indica si la sección de carga de documentos está activa.
     * @type {boolean}
     */
      seccionCargarDocumentos: boolean = true;

      /**
       * Indica si la carga de documentos está en progreso.
       * @type {boolean}
       */
      cargaEnProgreso: boolean = true;

      /**
       * ID del estado de la solicitud.
       * @type {number | null}
       */
      idSolicitudState: number | null = 0;

      /**
       * Identificador del tipo de trámite.
       * @type {string}
       */
      idTipoTramite: string = '80205';

  /**
   * Constructor del componente RegistroPageComponent.
   * 
   * Inicializa las dependencias necesarias para el funcionamiento del componente
   * y establece las suscripciones iniciales para el estado del formulario.
   * 
   * @constructor
   * @param {AmpliacionServiciosQuery} tramiteQuery - Servicio de consulta para trámites de ampliación de servicios
   * @param {AmpliacionServiciosStore} tranmiteStore - Store para el manejo del estado de trámites
   * @param {SeccionLibStore} seccion - Store para el manejo del estado de secciones
   * @param {RegistroSolicitudService} registroSolicitudService - Servicio para el registro de solicitudes
   * @param {ToastrService} toastrService - Servicio para mostrar notificaciones tipo toast
   */
  constructor(
    private tramiteQuery: AmpliacionServiciosQuery,
    private tranmiteStore: AmpliacionServiciosStore,
    private seccion: SeccionLibStore,
    private registroSolicitudService: RegistroSolicitudService,
    private toastrService: ToastrService,
  ) {
    this.tramiteQuery.FormaValida$.pipe(takeUntil(this.destroyNotifier$)).subscribe(_res => {
      this.seccion.establecerSeccion([true]);
      this.seccion.establecerFormaValida([true]);
    })
  }

  /**
   * Maneja la acción del botón y navega entre los pasos del wizard.
   * 
   * Este método gestiona la navegación entre pasos del asistente, validando
   * formularios en el primer paso y ejecutando el guardado de datos.
   * Controla la navegación hacia adelante y hacia atrás del wizard.
   * 
   * @method getValorIndice
   * @param {AccionBoton} e - Objeto con la acción ('cont' o 'ant') y el valor (índice) del botón
   * @returns {void} Este método no retorna ningún valor
   * 
   * @example
   * ```typescript
   * this.getValorIndice({ accion: 'cont', valor: 2 });
   * ```
   */
  getValorIndice(e: AccionBoton): void {
    if (this.indice === 1) {
      const FORM_VALIDO = this.pasoUnoComponent?.validarTodosLosFormularios() ?? false;
      this.esFormaValido = FORM_VALIDO;

      if (!this.esFormaValido) {
        this.datosPasos.indice = 1;
        this.formErrorAlert = ServiciosService.generarAlertaDeError(ERROR_SERVICIO_ALERT);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }

      this.onGuardar().pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe({
        next: (respuesta: BaseResponse<{ id_solicitud: number }>) => {
          if (respuesta.codigo !== '00') {
            const ERROR_MESSAGE = respuesta.error || 'Error desconocido en la solicitud';
            this.formErrorAlert = ServiciosService.generarAlertaDeError(ERROR_MESSAGE);
            this.esFormaValido = false;
            this.indice = 1;
            this.datosPasos.indice = 1;
            if (this.wizardComponent) {
              this.wizardComponent.indiceActual = 0;
            }
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            return;
          }
          
          if (respuesta.datos?.id_solicitud) {
            this.idSolicitudState = respuesta.datos.id_solicitud;
            this.tranmiteStore.setIdSolicitud(respuesta.datos.id_solicitud);
          }
          
          this.esFormaValido = true;
          
          this.indice = e.valor; // This should be 2 for step 2
          this.datosPasos.indice = this.indice;
          
          if (e.accion === 'cont') {
            this.wizardComponent.siguiente();
          } else if (e.accion === 'ant') {
            this.wizardComponent.atras();
          }
          
          this.toastrService.success(respuesta.mensaje);
        },
        error: (error) => {
          this.formErrorAlert = ServiciosService.generarAlertaDeError(error.error || 'Error al procesar la solicitud');
          this.esFormaValido = false;
          this.indice = 1;
          // Reset wizard to first step (wizard is 0-indexed)
          if (this.wizardComponent) {
            this.wizardComponent.indiceActual = 0;
          }
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        }
      });
      
    } else {
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        this.datosPasos.indice = this.indice;
        
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

  
  /**
   * Maneja el evento de finalización de carga de documentos.
   * 
   * Actualiza el estado de la sección de carga de documentos basado en
   * si la carga se realizó correctamente o no.
   * 
   * @method cargaRealizada
   * @param {boolean} cargaRealizada - Indica si la carga de documentos se realizó correctamente
   * @returns {void} Este método no retorna ningún valor
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
   * Maneja el evento de activación/desactivación de la carga de documentos.
   * 
   * Actualiza el estado del botón de carga de archivos basado en el parámetro
   * proporcionado, habilitando o deshabilitando la funcionalidad.
   * 
   * @method manejaEventoCargaDocumentos
   * @param {boolean} carga - Indica si la carga de documentos está activa (true) o inactiva (false)
   * @returns {void} Este método no retorna ningún valor
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Navega al siguiente paso del wizard.
   * 
   * Realiza la validación de los documentos cargados y actualiza
   * el índice actual y el estado de los pasos del asistente.
   * 
   * @method siguiente
   * @returns {void} Este método no retorna ningún valor
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Navega al paso anterior del wizard.
   * 
   * Actualiza el índice actual y el estado de los pasos del asistente
   * para retroceder un paso en la navegación.
   * 
   * @method anterior
   * @returns {void} Este método no retorna ningún valor
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Maneja el evento de clic del botón de carga de archivos.
   * 
   * Emite un evento para iniciar el proceso de carga de archivos
   * cuando el usuario hace clic en el botón correspondiente.
   * 
   * @method onClickCargaArchivos
   * @returns {void} Este método no retorna ningún valor
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Maneja el estado de carga en progreso.
   * 
   * Actualiza la propiedad que indica si hay una carga de documentos
   * en progreso, utilizada para mostrar indicadores de carga en la UI.
   * 
   * @method onCargaEnProgreso
   * @param {boolean} carga - Estado de la carga (true: en progreso, false: finalizada)
   * @returns {void} Este método no retorna ningún valor
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Guarda la solicitud de ampliación de servicios.
   * 
   * Utiliza el adaptador para convertir el estado actual del trámite
   * en el formato requerido y envía los datos al servidor mediante
   * el servicio de registro de solicitudes.
   * 
   * @method onGuardar
   * @returns {Observable<BaseResponse<{ id_solicitud: number }>>} Observable que emite la respuesta del servidor con el ID de la solicitud creada
   * 
   * @example
   * ```typescript
   * this.onGuardar().subscribe({
   *   next: (response) => console.log('Solicitud guardada:', response.datos.id_solicitud),
   *   error: (error) => console.error('Error al guardar:', error)
   * });
   * ```
   */
  onGuardar(): Observable<BaseResponse<{ id_solicitud: number }>> {
    return this.tramiteQuery.selectTramite80205$.pipe(
      take(1), // Tomar solo el primer valor para evitar loops
      map(ESTADO_ACTUAL => AmpliacionServiciosAdapter.toFormPayload(ESTADO_ACTUAL)),
      switchMap(FORM_PAYLOAD => {
        return (this.registroSolicitudService.postGuardarDatos(this.idTipoTramite, FORM_PAYLOAD) as Observable<BaseResponse<{ id_solicitud?: number }>>).pipe(
          map((response: BaseResponse<{ id_solicitud?: number }>) => {
            // Adapt the response to the expected type
            return {
              ...response,
              datos: {
                id_solicitud: response.datos?.id_solicitud ?? 0
              }
            } as BaseResponse<{ id_solicitud: number }>;
          })
        );
      }),
      catchError(error => {
        console.error('Error al guardar:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * 
   * Emite un valor en el observable `destroyNotifier$` para notificar a todos los
   * suscriptores que deben limpiar recursos o cancelar suscripciones activas,
   * y luego completa el observable para liberar memoria.
   * 
   * @method ngOnDestroy
   * @returns {void} Este método no retorna ningún valor
   * 
   * @implements {OnDestroy}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}