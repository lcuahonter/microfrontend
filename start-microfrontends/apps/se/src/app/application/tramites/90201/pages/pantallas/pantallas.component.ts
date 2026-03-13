import { AutorizacionProsecStore, ProsecState } from '../../estados/autorizacion-prosec.store';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { AUtorizacionProsecQuery } from '../../estados/autorizacion-prosec.query';
import { CATALOGOS_ID } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogosService } from '@libs/shared/data-access-user/src/core/services/shared/catalogos/catalogos.service';
import { DatosComponent } from '../datos/datos.component';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { ERROR_FORMA_ALERT } from '../../constantes/prosec.module';
import { GuardarMappingAdapter } from '../../adapters/guardar-mapping.adapter';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { PANTAPASOS } from '@libs/shared/data-access-user/src/core/services/90201/expansion-de-productores.enum';
import { RegistroSolicitudService } from '@ng-mf/data-access-user';
import { Solicitud90201State } from '../../../../estados/tramites/tramite90201.store.js';
import { ToastrService } from 'ngx-toastr';
import { Tramite90201Query } from '../../../../estados/queries/tramite90201.query';
import { Tramite90201Store } from '../../../../estados/tramites/tramite90201.store';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
/**
 * Interfaz que representa un botón de acción.
 */
interface AccionBoton {
  /**
   * La acción que debe realizar el botón.
   */
  accion: string;

  /**
   * El valor asociado con la acción.
   */
  valor: number;
}



/**
 * Componente encargado de gestionar la lógica y visualización de los pasos (wizard) 
 * en el trámite 90201. Permite la navegación entre pantallas, el manejo de los índices 
 * de pasos, y la obtención de catálogos de documentos requeridos.
 * 
 * @remarks
 * Este componente utiliza el servicio `CatalogosService` para obtener información 
 * de catálogos y el componente hijo `WizardComponent` para controlar la navegación 
 * entre pasos.
 * 
 * @example
 * <app-pantallas></app-pantallas>
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
})
export class PantallasComponent implements OnInit, OnDestroy {

    /**
     * @property {Subject<void>} destroyNotifier$
     * @description
     * Notificador para destruir los observables y evitar posibles fugas de memoria.
     * Utilizado con el operador takeUntil para completar suscripciones automáticamente
     * cuando el componente se destruye.
     * 
     * @memory_management Prevención de memory leaks
     * @observable_cleanup Limpieza automática de suscripciones
     * @lifecycle_control Control de ciclo de vida de observables
     * @private Uso interno del componente
     */
    destroyNotifier$: Subject<void> = new Subject();
    
     /**
   * @property {string | null} tituloMensaje
   * @description
   * Título mostrado en la parte superior del wizard.
   */
  tituloMensaje: string | null = 'Zoosanitario para importación';

    /**
     * @property {PasoUnoComponent} pasoUnoComponent
     * @description
     * Referencia al componente hijo `PasoUnoComponent` que contiene los formularios del primer paso del trámite PROSEC.
     */
    @ViewChild('datosRef') datosComponent!: DatosComponent;
  


  /**
 * @property {Tramite80207State} solicitudState
 * @description
 * Estado completo de la solicitud del trámite 90201 obtenido desde el store Akita.
 * Contiene toda la información capturada durante el proceso incluyendo datos del
 * subcontratista, plantas seleccionadas y validaciones.
 * 
 * @state_container Contenedor del estado completo del trámite
 * @akita_integration Integración con store de Akita
 * @reactive_data Datos reactivos del proceso
 * @business_data Información de negocio completa
 */
public solicitudState: Solicitud90201State = {} as Solicitud90201State;


  /**
   * Esta variable se utiliza para almacenar la lista de pasos.
   */
  public pantallasPasos: ListaPasosWizard[] = PANTAPASOS;
  /**
   * Esta variable se utiliza para almacenar el índice del paso.
   */
  public indice: number = 1;

      /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario actual es válido. Se utiliza para mostrar alertas cuando faltan campos por capturar.
   */
  esFormaValido: boolean = false;

  /**
   * @property {ProsecState} storeData
   * @description Estado de la tienda para el trámite 260218.
   */
    storeData!: ProsecState;

       /**
   * Identificador del tipo de trámite.
   * @type {string}
   */
  idTipoTramite: string = '90201';

  /**
     * ID del estado de la solicitud.
     * @type {number | null}
     */
    idSolicitudState!: number | null;

      /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
esMostrarAlerta: boolean = false;

/**
   * @property {boolean} activarBotonCargaArchivos
   * @description
   * Indica si el botón para cargar archivos está habilitado. Controla la
   * disponibilidad de la funcionalidad de carga de documentos según el
   * estado actual del proceso.
   * 
   * @ui_control Control de habilitación de botón
   * @file_upload_state Estado de disponibilidad de carga
   * @default false - Deshabilitado por defecto
   */
 activarBotonCargaArchivos: boolean = false;

  /**
     * @property {boolean} cargaEnProgreso
     * @description
     * Indica si hay una operación de carga en progreso. Utilizado para mostrar
     * indicadores de carga y prevenir acciones concurrentes durante procesos.
     * 
     * @loading_indicator Estado de carga en progreso
     * @ui_feedback Feedback visual para usuario
     * @concurrent_prevention Prevención de operaciones concurrentes
     * @default true - Inicia con carga activa
     */
  cargaEnProgreso: boolean = true;

    /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

  /**
   * @property {boolean} seccionCargarDocumentos
   * @description
   * Indica si la sección de carga de documentos está activa. Controla la
   * visibilidad y disponibilidad de la interfaz de carga de documentos.
   * 
   * @section_visibility Control de visibilidad de sección
   * @document_upload_ui Estado de interfaz de carga
   * @default true - Activa al inicio para mostrar sección inicial
   */
  seccionCargarDocumentos: boolean = true;

  /**
     * @property {EventEmitter<void>} cargarArchivosEvento
     * @description
     * Evento que se emite para iniciar el proceso de carga de archivos. Notifica a
     * componentes hijos o servicios que deben activar la funcionalidad de carga
     * de documentos requeridos para el trámite.
     * 
     * @event_emission Emisión de evento para carga de documentos
     * @file_upload_trigger Disparador de funcionalidad de carga
     * @component_communication Comunicación entre componentes padre-hijo
     */
    cargarArchivosEvento = new EventEmitter<void>();


/**
   * @property {string} formErrorAlert
   * @description
   * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;
  
  /**
   * Una referencia a la instancia de WizardComponent dentro de la plantilla.
   * Esta propiedad está decorada con `@ViewChild` para permitir el acceso a los
   * métodos y propiedades públicos de WizardComponent.
   * 
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;


  /**
   * Un objeto que representa los datos de los pasos para el componente.
   * 
   * @property {number} nroPasos - El número de pasos, derivado de la longitud de `pantallasPasos`.
   * @property {number} indice - El índice actual del paso.
   * @property {string} txtBtnAnt - El texto para el botón "Anterior".
   * @property {string} txtBtnSig - El texto para el botón "Continuar".
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Un array de objetos Catalogo que representa el catálogo de documentos.
   * Este array está inicialmente vacío y puede ser poblado con instancias de Catalogo.
   */
  public catalogoDocumentos: Catalogo[] = [];



  /**
   * Constructor de la clase PantallasComponent.
   * 
   * @param catalogosServices Servicio inyectado para gestionar operaciones relacionadas con catálogos.
   */
  constructor(
    private catalogosServices: CatalogosService,
    private tramite90201Query: Tramite90201Query,  
    public tramiteQuery: AUtorizacionProsecQuery,
    private store: Tramite90201Store,
    private toastrService: ToastrService,
    private registroSolicitudService: RegistroSolicitudService,
    public tramiteStore: AutorizacionProsecStore,
    
    
  ) {
  }

     /**
       * @method ngOnInit
       * @description
       * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
       * Configura la suscripción principal al estado de la sección para mantener
       * sincronizado el estado local con el store centralizado del trámite.
       * 
       * @lifecycle_hook Hook de inicialización de Angular
       * @state_synchronization Sincronización con estado centralizado
       * 
       * @subscription_setup
       * Configura suscripción a:
       * - `selectSeccionState$`: Observable del estado completo de la sección
       * - Mapeo automático del estado a propiedad local `solicitudState`
       * - Limpieza automática con `takeUntil(destroyNotifier$)`
       * 
       * @reactive_pattern
       * Implementa patrón reactivo para:
       * - Mantener sincronización automática de datos
       * - Responder a cambios de estado en tiempo real
       * - Actualizar UI automáticamente con nuevos datos
       * - Evitar consultas manuales repetitivas
       * 
       * @memory_safety
       * La suscripción se cancela automáticamente cuando:
       * - Se emite valor en `destroyNotifier$`
       * - El componente se destruye
       * - Se completa el ciclo de vida
       * 
       * @void
       * @implements OnInit
       */
      ngOnInit(): void {
        this.tramite90201Query.selectSolicitud$
          .pipe(
            takeUntil(this.destroyNotifier$),
            map((seccionState) => {
              this.solicitudState = seccionState;
              
            })
          ).subscribe();
           this.tramiteQuery.selectProsec$.pipe().subscribe((data) => {
      this.storeData = data;
    });
      }
  

  /**
   * Actualiza la propiedad `indice` en función del valor del objeto `AccionBoton` proporcionado.
   * Si la propiedad `valor` de `AccionBoton` está entre 1 y 4 (inclusive), establece `indice` en `valor`.
   * Dependiendo de la propiedad `accion` de `AccionBoton`, mueve el componente del asistente hacia adelante o hacia atrás.
   *
   * @param {AccionBoton} e - El objeto del botón de acción que contiene las propiedades `valor` y `accion`.
   */
 public getValorIndice(e: AccionBoton):void{
  
    if (e.accion === 'cont') {
      let isValid = true;      
      if (this.datosComponent) {
          isValid = this.datosComponent.validarFormularios();
      }
    
      if (!isValid) {
      this.formErrorAlert = ERROR_FORMA_ALERT;
      this.esFormaValido = true;
      this.datosPasos.indice = this.indice;
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      return;
      }
      this.esFormaValido = false;
            const PAYLOAD = GuardarMappingAdapter.toFormPayload(this.storeData);
            let shouldNavigate = false;
            this.registroSolicitudService.postGuardarDatos(this.idTipoTramite, PAYLOAD).subscribe(response => {
              shouldNavigate = response.codigo === '00';
              if (!shouldNavigate) {
                const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
                this.formErrorAlert = PantallasComponent.generarAlertaDeError(ERROR_MESSAGE);
                this.esFormaValido = true;
                this.indice = 1;
                this.datosPasos.indice = 1;
                this.wizardComponent.indiceActual = 1;
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
                return;
              }
              if(shouldNavigate) {
                if(esValidObject(response) && esValidObject(response.datos)) {
                  this.esFormaValido = false;
                  const DATOS = response.datos as { id_solicitud?: number };
                  const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
                  this.idSolicitudState = ID_SOLICITUD;
                  this.tramiteStore.setIdSolicitud(ID_SOLICITUD);
                }
                // Calcular el nuevo índice basado en la acción
                let indiceActualizado = e.valor;
                if (e.accion === 'cont') {
                  indiceActualizado = e.valor;
                }
                this.toastrService.success(response.mensaje);
                if (indiceActualizado > 0 && indiceActualizado < 5) {
                  this.indice = indiceActualizado;
                  this.datosPasos.indice = indiceActualizado;
                  this.esFormaValido = false;
                  if (e.accion === 'cont') {
                    this.wizardComponent.siguiente();
                  } else {
                    this.wizardComponent.atras();
                  }
                }
              } else {
                this.toastrService.error(response.mensaje);
              }
            });
          }else{
            this.indice = e.valor;
            this.datosPasos.indice = this.indice;
            this.wizardComponent.atras();
          }
  }





  /**
   * Genera una alerta de error con los mensajes proporcionados.
   * @param mensajes Mensajes de error a mostrar en la alerta.
   * @returns HTML de la alerta de error.
   */
static generarAlertaDeError(mensajes:string): string {

    const ALERTA = `
      <div class="row">
<div class="col-md-12 justify-content-center text-center">
  <div class="row">
    <div class="col-md-12">
    <p>Corrija los siguientes errores:</p>
    <ol>
    <li>${mensajes}</li>
    </ol>
    </div>
  </div>
</div>
</div>
`;
return ALERTA;
  }


    /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Implementa limpieza de recursos para prevenir memory leaks mediante
   * finalización de observables y completado de suscripciones.
   * 
   * @lifecycle_hook Hook de destrucción de Angular
   * @memory_cleanup Limpieza de memoria y recursos
   * 
   * @observable_cleanup
   * Realiza limpieza mediante:
   * - `destroyNotifier$.next()`: Emite señal de destrucción
   * - `destroyNotifier$.complete()`: Completa el Subject
   * - Finalización automática de todas las suscripciones con `takeUntil`
   * 
   * @memory_leak_prevention
   * Previene memory leaks de:
   * - Suscripciones a observables del store
   * - Suscripciones a servicios HTTP
   * - Event listeners y timers
   * - Referencias a componentes hijos
   * 
   * @subscription_management
   * Todas las suscripciones con `takeUntil(this.destroyNotifier$)` se:
   * - Completan automáticamente
   * - Liberan recursos
   * - Evitan callbacks en componente destruido
   * 
   * @resource_cleanup
   * Garantiza limpieza de:
   * - Observables RxJS
   * - Suscripciones a servicios
   * - Referencias circulares
   * - Event emitters
   * 
   * @best_practices
   * Implementa mejores prácticas de:
   * - Gestión de ciclo de vida Angular
   * - Prevención de memory leaks
   * - Limpieza de recursos reactivos
   * - Finalización ordenada de procesos
   * 
   * @void
   * @implements OnDestroy
   * @cleanup_method
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
