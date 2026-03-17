import { CancelacionPeticion261701State, Tramite261701Store } from '../../estados/store/tramite261701.store';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild, inject,} from '@angular/core';
import { ConsultaioQuery, ConsultaioState, ERROR_FORMA_ALERT,JSONResponse,WizardService,doDeepCopy} from '@ng-mf/data-access-user';
import { DatosPasos, ListaPasosWizard, WizardComponent } from '@libs/shared/data-access-user/src';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/aviso-privacidad.enum';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/31601/servicios-pantallas.model';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { CancelacionPeticionService } from '../../services/cancelacion-peticion.service';
import { PANTA_PASOS } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantallas.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite261701Query } from '../../estados/query/tramite261701.query';
/**
 * @component
 * @name PantallasComponent
 * @description
 * Componente que gestiona la visualización de pantallas y permite cambiar entre diferentes pasos o pestañas.
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
})

export class PantallasComponent implements OnInit, OnDestroy {
  
  /**
  * compo doc
  * Lista de pasos del wizard.
  * @type {ListaPasosWizard[]}
  */
  public pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;

  /**
  * compo doc 
  * Índice del paso actual.
  * @type {number}
  * @default 1
  */
  public indice: number = 1;

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

  /**
 * @property formErrorAlert
 * @description
 * Contiene el mensaje de alerta que se muestra cuando ocurre un error en el formulario.
 * 
 * Funcionalidad:
 * - Utiliza el mensaje definido en la constante `ERROR_FORMA_ALERT`.
 * - Este mensaje informa al usuario sobre los errores que deben corregirse en el formulario antes de continuar.
 * 
 * @type {string}
 * 
 * @example
 * <div *ngIf="!esFormaValido">
 *   {{ formErrorAlert }}
 * </div>
 */
  public formErrorAlert = ERROR_FORMA_ALERT;

  
/**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

   /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
    cargarArchivosEvento = new EventEmitter<void>();
  
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
      * Indica si la carga de archivos está en progreso.
      */
    cargaEnProgreso: boolean = true;


  /**
 * @property wizardService
 * @description
 * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
 * @type {WizardService}
 */
  wizardService = inject(WizardService);

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
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  public consultaState!: ConsultaioState;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

    /**
 * @property pestanaDosFormularioValido
 * @description
 * Indica si los formularios asociados a la pestaña dos del wizard son válidos.
 * @type {boolean}
 * @default false
 */
  public pestanaDosFormularioValido: boolean = false;

   /**
   * Indica si el botón padre está habilitado o visible.
   * 
   * @default true
   */
  padreBtn: boolean = true;

  /**
   * Identificador numérico de la solicitud actual.
   * 
   * Este valor se utiliza para referenciar de manera única una solicitud dentro del sistema.
   * Por defecto, se inicializa en 0 hasta que se asigne un identificador válido.
   */
  idSolicitud: number = 0;

   /**
 * @property esFormaValido
 * @description
 * Indica si el formulario actual es válido. Se utiliza para habilitar o deshabilitar la navegación entre pasos en el wizard.
 * @type {boolean}
 * @default false
 */
  public esFormaValido!: boolean;

  /**
   * Estado que representa la información y el flujo de la cancelación de la petición 261701.
   * Utilizado para gestionar y almacenar los datos relevantes durante el proceso de cancelación
   * dentro del componente de pantallas.
   */
  cancelacionPeticion261701State!: CancelacionPeticion261701State;

      /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;
  
  /**
   * Constructor de la clase PantallasComponent.
   * 
   * @param cancelacionPeticionService Servicio para manejar la cancelación de peticiones.
   * @param consultaQuery Consulta de información relacionada.
   * @param tramite261701Store Almacén de estado para el trámite 261701.
   * @param tramite261701Query Consulta de estado para el trámite 261701.
   * @param servicioDeFormularioService Servicio para la gestión de formularios.
   * @param ampliacionServiciosAdapter Adaptador para la ampliación de servicios.
   * @param toastrService Servicio para mostrar notificaciones tipo toast al usuario.
   */
  constructor(private cancelacionPeticionService:CancelacionPeticionService,private consultaQuery: ConsultaioQuery,
    private tramite261701Store:Tramite261701Store,
    private tramite261701Query:Tramite261701Query,
    private servicioDeFormularioService:ServicioDeFormularioService,
    private ampliacionServiciosAdapter:AmpliacionServiciosAdapter,private toastrService: ToastrService) {}


  
/**
 * @method ngOnInit
 * @description
 * Método de inicialización del componente `PantallasComponent`.
 * 
 * Detalles:
 * - Se suscribe al observable `selectConsultaioState$` del store `ConsultaioQuery` para obtener el estado actual de la consulta.
 * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
 * - Actualiza la propiedad `consultaState` con el estado recibido.
 * - Si el estado está en modo solo lectura (`readonly`), marca la pestaña dos como válida (`pestanaDosFormularioValido = true`).
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
          if (this.consultaState.readonly) {
            this.pestanaDosFormularioValido = true
          }
        })
      ).subscribe();

    this.tramite261701Query.selectSolicitudDeRegistroTpl$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.cancelacionPeticion261701State = seccionState;

          if (
            this.cancelacionPeticion261701State &&
            typeof this.cancelacionPeticion261701State === 'object'
          ) {
            this.idSolicitud = this.cancelacionPeticion261701State['idSolicitud'] as number;
          }
        })
      )
      .subscribe();


  }

 /**
 * @method verificarLaValidezDelFormulario
 * @description
 * Este método verifica la validez de los formularios dinámicos asociados a los pasos del wizard.
 * @returns {boolean} - Indica si todos los formularios son válidos.
 */
  verificarLaValidezDelFormulario(): boolean {
    return (
      (this.servicioDeFormularioService.isFormValid('ninoFormGroup') ??
        true)
    );
  }
  
  /**
   * Actualiza el índice del paso y maneja la navegación hacia adelante o atrás.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
   * @returns {void}
   */
  public getValorIndice(e: AccionBoton): void {
  if (!this.consultaState.readonly) {
    this.esFormaValido = this.verificarLaValidezDelFormulario();

    if (!this.esFormaValido) {
      return;
    }

    if (this.esFormaValido) {
      if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
        let NEXT_INDEX = e.valor; // Start with the current value

        // if (e.accion === 'cont') {
        //   NEXT_INDEX = e.valor + 1; // Increment for "continue"
        // } else if (e.accion === 'ant') {
        //   NEXT_INDEX = e.valor - 1; // Decrement for "back"
        // }

        if (e.accion === 'cont') {
          this.shouldNavigate$().subscribe((shouldNavigate) => {
            if (shouldNavigate) {
              NEXT_INDEX = e.valor;
              this.indice =NEXT_INDEX;
              this.datosPasos.indice = NEXT_INDEX;
              this.wizardService.cambio_indice(NEXT_INDEX);
              this.wizardComponent.siguiente();
            } else {
              this.indice = e.valor; // Stay on the current step if navigation is not allowed
              this.datosPasos.indice = e.valor;
            }
          });
        } else if(e.accion === 'ant'){
            NEXT_INDEX = e.valor - 1;
        }else {
          this.indice = NEXT_INDEX;
          this.datosPasos.indice = NEXT_INDEX;
          this.wizardComponent.atras();
        }
      }
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
    return this.cancelacionPeticionService.getAllState().pipe(
      take(1),
      switchMap(data => this.guardar(data)),
      map(response => {
        const DATOS = doDeepCopy(response);
        const OK = response.codigo === '00';
        if (OK) {
          this.toastrService.success(DATOS.mensaje);
        } else {
          this.padreBtn = true;
          this.toastrService.error(DATOS.mensaje);
        }
        return OK;
      })
    );
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
  guardar(data:CancelacionPeticion261701State): Promise<JSONResponse> {
    const PAYLOAD = this.ampliacionServiciosAdapter.toFormGuardarPayload(data);
    return new Promise((resolve, reject) => {
      this.cancelacionPeticionService.guardarDatosPost(PAYLOAD).subscribe(response => {
        const API_RESPONSE = doDeepCopy(response);
        this.tramite261701Store.establecerDatos('idSolicitud', API_RESPONSE.datos?.id_solicitud);
        resolve(API_RESPONSE);
      }, error => {
        reject(error);
      });
    });
  }

    /**
   * compo doc
   * Función que obtiene el índice de la pestaña seleccionada
   * @param {number} event - evento de numero
   * @returns {void}
   */
  pestanaCambiado(event: number): void {
    if (event !== undefined && event !== null && !isNaN(event)) {
      this.indice = event;
    } else {
      this.indice = 1;
    }
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


/** Actualiza el estado de carga en progreso. */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
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
