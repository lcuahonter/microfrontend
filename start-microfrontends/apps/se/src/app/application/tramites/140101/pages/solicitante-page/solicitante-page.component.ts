// Importaciones de Angular Core
import { AVISO, FIRMAR, ListaPasosWizard, RegistroSolicitudService } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subject, catchError, map, switchMap, take, takeUntil, throwError } from 'rxjs';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { DatosComponent } from '../datos/datos.component';
import { DatosPasos } from '@libs/shared/data-access-user/src';
import { GuardarMappingAdapter } from '../../adapters/guardar-mapping.adapter';
import { OCTA_TEMPO } from '@libs/shared/data-access-user/src/core/services/130102/octava-temporal.enum';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite140101Query } from '../../../../estados/queries/tramite140101.query';
import { Tramite140101Store } from '../../../../estados/tramites/tramite140101.store';
import { WizardComponent } from '@libs/shared/data-access-user/src';


/**
 * Componente principal para la gestión de la página del solicitante en el trámite 140101.
 * 
 * Este componente maneja el flujo completo de cancelación de programas IMMEX/PROSEC,
 * incluyendo la navegación por pasos mediante un wizard, validación de formularios,
 * y el procesamiento de la solicitud en el servidor.
 * 
 * Características principales:
 * - Navegación step-by-step mediante wizard
 * - Validación de formularios en tiempo real
 * - Integración con Akita para manejo de estado
 * - Manejo de errores y notificaciones al usuario
 * - Guardado automático del estado de la solicitud
 * 
 * @component SolicitantePageComponent
 * @selector app-solicitante-de-page
 * @templateUrl ./solicitante-page.component.html
 * @implements {OnDestroy}
 * 
 * @example
 * ```html
 * <!-- Uso en template -->
 * <app-solicitante-de-page></app-solicitante-de-page>
 * ```
 * 
 * @example
 * ```typescript
 * // Integración con routing
 * {
 *   path: 'solicitante',
 *   component: SolicitantePageComponent
 * }
 * ```
 * 
 * @see {@link DatosComponent} - Componente hijo para manejo de datos
 * @see {@link WizardComponent} - Componente para navegación step-by-step
 * @see {@link GuardarMappingAdapter} - Adaptador para conversión de datos
 * @version 1.0.0
 * @since 2025-10-17
 */
@Component({
  // Selector utilizado para identificar el componente en el HTML.
  selector: 'app-solicitante-de-page',

  // Ruta del archivo de plantilla HTML asociado al componente.
  templateUrl: './solicitante-page.component.html',
})

// Definición de la clase del componente.
export class SolicitantePageComponent implements OnDestroy {
  /**
   * @property {ListaPasosWizard[]} pantallasPasos - Array para almacenar los pasos del wizard.
   * Inicializa con los valores de OCTA_TEMPO.
   */
  pantallasPasos: ListaPasosWizard[] = OCTA_TEMPO;

  /**
   * @property {number} indice - El índice actual del paso.
   * Se inicializa en 1.
   */
  indice: number = 1;

  /**
   * @property {object} TEXTOS - Contiene constantes relacionadas con aviso y firma.
   * Se utiliza para manejar textos estáticos en la aplicación.
   */
  public TEXTOS = {
    AVISO,
    FIRMAR,
  };

  /**
   * Referencia al componente del wizard para controlar su comportamiento.
   * Permite acceder a métodos como avanzar o retroceder pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

   /**
     * Mensaje de error para validación de formularios.
     * @type {string}
     */
   public formErrorAlert!:string;
  
   /**
     * Controla la visibilidad del mensaje de error.
   * @type {boolean}
   */
  esFormaValido: boolean = true;

  /**
     * ID del estado de la solicitud.
     * @type {number | null}
     */
    idSolicitudState: number | null = 0;

  /**
   * Identificador del tipo de trámite.
   * @type {string}
   */
  idTipoTramite: string = '140101';

  /**
   * Subject utilizado para notificar la destrucción del componente.
   * Se utiliza con el operador `takeUntil` para cancelar automáticamente
   * las suscripciones activas cuando el componente es destruido, 
   * evitando así posibles fugas de memoria.
   * 
   * @type {Subject<void>}
   * @example
   * ```typescript
   * // Uso típico con takeUntil
   * this.someObservable$.pipe(
   *   takeUntil(this.destroyNotifier$)
   * ).subscribe();
   * ```
   */
  destroyNotifier$: Subject<void> = new Subject();

    /**
   * Clase CSS para mostrar una alerta de error.
   * @type {string}
   */
  infoError = 'alert-danger';
  
  /**
   * Referencia al componente hijo `DatosComponent` a través de ViewChild.
   * 
   * Este componente se encarga de gestionar los datos del formulario
   * y la validación de los campos requeridos. Se utiliza para acceder
   * a los métodos de validación y obtener el estado del formulario.
   * 
   * @type {DatosComponent | undefined}
   * @ViewChild datosComponent - Referencia obtenida mediante ViewChild con el identificador 'datosComponent'.
   * @example
   * ```typescript
   * // Uso para validar formularios
   * const esValido = this.datosComponent?.validarFormularios();
   * const camposCompletos = this.datosComponent?.formFieldValidado;
   * ```
   */
  @ViewChild('datosComponent', { static: false }) datosComponent: DatosComponent | undefined;
   /**
   * Esta propiedad almacena el mensaje que se muestra al usuario durante el proceso de firma electrónica.
   */
  public firmarMensaje: string = '';

 /**
   * Constructor del componente SolicitantePageComponent.
   * Inicializa las dependencias necesarias para el funcionamiento del componente.
   * 
   * @param toastrService - Servicio para mostrar notificaciones tipo toast al usuario.
   * @param tramite140101Store - Store de Akita para gestionar el estado del trámite 140101.
   * @param tramite140101Query - Query de Akita para consultar el estado del trámite 140101.
   * @param registroSolicitudService - Servicio para realizar el registro de solicitudes en el servidor.
   * 
   * @example
   * ```typescript
   * // El constructor se inyecta automáticamente por Angular
   * constructor(
   *   private toastrService: ToastrService,
   *   private tramite140101Store: Tramite140101Store,
   *   private tramite140101Query: Tramite140101Query,
   *   private registroSolicitudService: RegistroSolicitudService,
   * ) {}
   * ```
   */
  constructor(
    private toastrService: ToastrService,
    private tramite140101Store: Tramite140101Store,
    private tramite140101Query: Tramite140101Query,
    private registroSolicitudService: RegistroSolicitudService,
  ) {}

  /**
   * @property {DatosPasos} datosPasos - Objeto que contiene información sobre los pasos del wizard.
   * Incluye el número total de pasos, el índice actual y los textos de los botones.
   * Se inicializa con los valores predeterminados.
   */
    datosPasos: DatosPasos = {
    // Número total de pasos en el wizard, basado en la longitud del array `pantallasPasos`.
    nroPasos: this.pantallasPasos.length,

    // Índice actual del paso, inicializado con el valor de la propiedad `indice`.
    indice: this.indice,

    // Texto del botón para retroceder al paso anterior.
    txtBtnAnt: 'Anterior',

    // Texto del botón para avanzar al siguiente paso.
    txtBtnSig: 'Continuar',
  };

  /**
   * Maneja la navegación del wizard y ejecuta las validaciones correspondientes.
   * 
   * Este método se encarga de:
   * - Validar los formularios en el primer paso
   * - Ejecutar el proceso de guardado de la solicitud
   * - Manejar la navegación entre pasos del wizard
   * - Mostrar mensajes de error en caso de validaciones fallidas
   * - Actualizar el estado del componente según la respuesta del servidor
   * 
   * @param {AccionBoton} e - Objeto que contiene la información de la acción del botón.
   * @param {number} e.valor - Índice del paso al cual navegar (entre 1 y 4).
   * @param {string} e.accion - Tipo de acción: 'cont' para continuar, 'ant' para retroceder.
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Navegar al siguiente paso
   * this.getValorIndice({ valor: 2, accion: 'cont' });
   * 
   * // Retroceder al paso anterior
   * this.getValorIndice({ valor: 1, accion: 'ant' });
   * ```
   * 
   * @throws {Error} Muestra mensajes de error si la validación falla o hay problemas en el servidor.
   */
  
  getValorIndice(e: AccionBoton): void {
      if (this.indice === 1) {
        const FORM_VALIDO = this.datosComponent?.validarFormularios() || false;
        const FORMFIELDVALIDO = this.datosComponent?.formFieldValidado;
        
        if (!FORM_VALIDO) {
          this.datosPasos.indice = 1;
          this.formErrorAlert = `<div class="text-center">Faltan campos por capturar.</div>`;
          this.esFormaValido = false;
          return;
        }
        
        if (FORM_VALIDO && !FORMFIELDVALIDO) {
          const ERROR_SERVICIO_ALERT = `(Seleccione un programa para realizar la cancelación) es un campo requerido`
          this.formErrorAlert = ServiciosService.generarAlertaDeError(ERROR_SERVICIO_ALERT);
          this.datosPasos.indice = 1;
          this.esFormaValido = false;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }
  
        this.onGuardar().pipe(
          takeUntil(this.destroyNotifier$)
        ).subscribe({
          next: (respuesta: BaseResponse<{ id_solicitud: number }>) => {
            if (respuesta.codigo !== '00') {
              this.formErrorAlert = respuesta.error || 'Error desconocido en la solicitud';
              this.esFormaValido = false;
              this.indice = 1;
              this.datosPasos.indice = 1;
              this.wizardComponent.indiceActual = 1;
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
              return;
            }
              this.esFormaValido = true;
              this.indice = e.valor;
              this.datosPasos.indice = this.indice;
              this.wizardComponent.siguiente();
              if (respuesta.datos?.id_solicitud) {
                this.idSolicitudState = respuesta.datos.id_solicitud;
                this.tramite140101Store.setIdSolicitud(respuesta.datos.id_solicitud);
                this.firmarMensaje = `<p>La solicitud para el trámite 140101 ha sido guardada exitosamente. Tiene 15 días naturales para firmarla, después de ese tiempo desaparecerá del listado de solicitudes pendientes por firmar. Número de solicitud [${respuesta.datos.id_solicitud}]</p>`;
              }
              this.toastrService.success(respuesta.mensaje);
          },
          error: () => {
            this.indice = 1;
            this.datosPasos.indice = this.indice;
            this.wizardComponent.indiceActual = 1;
          }
        });
        
      } else {
        if (e.valor > 0 && e.valor < 5) {
          this.indice = e.valor;
          if (e.accion === 'cont') {
            this.wizardComponent.siguiente();
          } else {
            this.wizardComponent.atras();
          }
        }
      }
    }

  /**
   * Guarda la solicitud del trámite 140101 (Cancelación de Programa IMMEX/PROSEC).
   * 
   * Este método ejecuta el flujo completo de guardado:
   * 1. Obtiene el estado actual del trámite desde el store de Akita
   * 2. Utiliza el adaptador para convertir el estado a formato de payload
   * 3. Envía los datos al servidor mediante el servicio de registro
   * 4. Procesa la respuesta y maneja errores
   * 
   * @returns {Observable<BaseResponse<{ id_solicitud: number }>>} Observable que emite la respuesta del servidor
   *   con el ID de la solicitud creada o actualizada.
   * 
   * @example
   * ```typescript
   * this.onGuardar().pipe(
   *   takeUntil(this.destroyNotifier$)
   * ).subscribe({
   *   next: (respuesta) => {
   *     if (respuesta.codigo === '00') {
   *       console.log('Solicitud guardada con ID:', respuesta.datos.id_solicitud);
   *     }
   *   },
   *   error: (error) => console.error('Error al guardar:', error)
   * });
   * ```
   * 
   * @throws {Error} Si ocurre un error durante el proceso de guardado en el servidor.
   * @see {@link GuardarMappingAdapter.toFormPayload} - Para la conversión de datos
   * @see {@link RegistroSolicitudService.postGuardarDatos} - Para el envío al servidor
   */
      onGuardar(): Observable<BaseResponse<{ id_solicitud: number }>> {
        return this.tramite140101Query.selectSolicitud$.pipe(
          take(1), // Tomar solo el primer valor para evitar loops
          map(ESTADO_ACTUAL => GuardarMappingAdapter.toFormPayload(ESTADO_ACTUAL)),
          switchMap(FORM_PAYLOAD => {
            return (this.registroSolicitudService.postGuardarDatos(this.idTipoTramite, FORM_PAYLOAD) as Observable<BaseResponse<{ id_solicitud?: number }>>).pipe(
              map((response: BaseResponse<{ id_solicitud?: number }>) => {
                return {
                  ...response,
                  datos: {
                    id_solicitud: response.datos?.id_solicitud ?? 0
                  }
                };
              })
            );
          }),
          catchError(error => {
            return throwError(() => error);
          })
        );
      }

  /**
   * Hook del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * 
   * Realiza la limpieza necesaria para evitar fugas de memoria:
   * - Emite una señal a través de `destroyNotifier$`
   * - Cancela todas las suscripciones activas que usen `takeUntil(this.destroyNotifier$)`
   * - Completa el observable `destroyNotifier$`
   * 
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Las suscripciones se cancelan automáticamente
   * ngOnDestroy(): void {
   *   this.destroyNotifier$.next();
   *   this.destroyNotifier$.complete();
   * }
   * ```
   * 
   * @implements {OnDestroy}
   * @lifecycle
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
