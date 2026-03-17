import { Component, EventEmitter, OnInit, ViewChild, inject } from '@angular/core';
import { ListaPasosWizard, PASOS, WizardService, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Observable, map, switchMap, take } from 'rxjs';
import { Solicitud260505State, Tramite260505Store } from '../../../../estados/tramites/260505/tramite260505.store';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Shared2605Service } from '../../../../shared/services/shared2605/shared2605.service';
import { TEXTO_DE_PELIGRO } from '../../constantes/260505constante.enum';
import { ToastrService } from 'ngx-toastr';
import { Tramite260505Query } from '../../../../estados/queries/260505/tramite260505.query';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';

interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Componente principal para la gestión de plaguicidas.
 * Contiene la lógica y la estructura del asistente de plaguicidas.
 */
@Component({
  selector: 'app-plaguicidas',
  templateUrl: './plaguicidas.component.html',
})
export class PlaguicidasComponent implements OnInit {
  /**
     * Indica si se debe mostrar el componente secundario o sección específica en la vista.
     * Se utiliza para controlar la visibilidad dinámica de componentes en el flujo del wizard.
     */
    public shwComponent: boolean = false; 
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  public idProcedimiento: number = 260505;
  /** Identificador numérico para guardar la solicitud.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  public guardarIdSolicitud: number = 0;
  /**
   * Lista de pasos del asistente.
   * Se obtiene de una constante definida en otro archivo.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Indice actual del paso en el asistente.
   * Se inicializa en 1.
   */
  indice: number = 1;

  /**
   * Título del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Título del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

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
    * Estado local que representa la solicitud actual.
    */
    public solicitudState!: Solicitud260505State;

    /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  public isContinuarTriggered: boolean = false;

    /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;


  /**
   * @param sharedSvc Servicio compartido para funcionalidades comunes.
   * @param toastrService Servicio para mostrar notificaciones tipo toast.
   * @param store Store para gestionar el estado del trámite 260505.
   * @param query Query para acceder al estado del trámite 260505.
   */
  constructor(
        private sharedSvc: Shared2605Service,
        private toastrService: ToastrService,
        private store: Tramite260505Store,
        private query: Tramite260505Query
  ) {}


  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de la solicitud para mantener el estado local actualizado.
   * {void} No retorna ningún valor.
   */
  ngOnInit(): void {
    this.query.selectSolicitud$.pipe().subscribe((data) => {
      this.solicitudState = data;
      this.isContinuarTriggered = this.solicitudState['continuarTriggered'] ?? false;
    });
  }
  /**
   * Indica si se debe mostrar un mensaje de peligro.
   */
  public isPeligro: boolean = false;

  /** Texto de advertencia que se muestra cuando hay condiciones peligrosas. */
  public textoPeligro: string = TEXTO_DE_PELIGRO;

  /**
   * Referencia al componente `PasoUnoComponent`.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

  /**
   * Maneja la acción del botón en el asistente.
   * Cambia el paso actual según la acción del botón.
   *
   * @param e - Objeto que contiene la acción y el valor del botón.
   */
  getValorIndice(e: AccionBoton): void {
    this.shwComponent = true;
    const NEXT_INDEX =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor;
    if (this.indice === 1 && e.accion === 'cont') {
      this.store.setContinuarTriggered(true); 
      setTimeout(() => { 
      const ES_VALIDO = this.validarFormulariosPasoActual();
      if (!ES_VALIDO) {
        this.isPeligro = true;
        return;
      }
      this.isPeligro = false;
      }, 1000);
    }
    if (e.valor > 0 && e.valor < this.pasos.length) {
      if (e.accion === 'cont') {
        if (this.indice === 1) {
            this.shouldNavigate$()
          .subscribe((shouldNavigate) => {
            if (shouldNavigate) {
              this.indice = NEXT_INDEX;
              this.datosPasos.indice = NEXT_INDEX;
              this.wizardService.cambio_indice(NEXT_INDEX);
              this.wizardComponent.siguiente();
            } else {
              this.indice = e.valor;
              this.datosPasos.indice = e.valor;
            }
          });
        } else {
          this.indice = NEXT_INDEX;
          this.datosPasos.indice = NEXT_INDEX;
          this.wizardService.cambio_indice(NEXT_INDEX);
          this.wizardComponent.siguiente();
        }
      } else {
        this.indice = NEXT_INDEX;
        this.datosPasos.indice = NEXT_INDEX;
        this.wizardComponent.atras();
      }
      this.isPeligro = false;
    }
  }

  /**
   * Valida los formularios del paso actual antes de permitir continuar.
   * @returns {boolean} - `true` si los formularios son válidos, `false` en caso contrario.
   */
  public validarFormulariosPasoActual(): boolean {
    if (this.indice === 1) {
      return this.pasoUnoComponent?.validarFormularios() ?? true;
    }
    return true;
  }

  /**
   * Verifica si se debe navegar al siguiente paso.
   * Realiza una llamada para guardar los datos actuales y determina si la navegación es posible.
   * @return {Observable<boolean>} Un observable que emite true si se puede navegar, false en caso contrario.
   */
  private shouldNavigate$(): Observable<boolean> {
      return this.sharedSvc.getAllState().pipe(
        take(1),
        switchMap(data => this.guardar(data)),
        map((response) => {
          const API_DATOS = doDeepCopy(response)
          const OK = API_DATOS.codigo === '00';
          if (OK) {
            this.toastrService.success(API_DATOS.mensaje);
          } else {
            this.toastrService.error(API_DATOS.mensaje);
          }
          return OK;
        })
      );
    }

      /**
       * Guarda los datos proporcionados mediante una solicitud HTTP POST.
       * @param data - Los datos que se desean guardar.
       * @returns {Promise<unknown>} Una promesa que se resuelve con la respuesta de la solicitud POST.
       */
    public guardar(data: Record<string, unknown>): Promise<unknown> {
       const PAYLOAD = this.sharedSvc.buildPayload(data, this.idProcedimiento);
        return new Promise((resolve, reject) => {
          this.sharedSvc.guardarDatosPost(PAYLOAD,this.idProcedimiento.toString()).subscribe({
            next: (response) => {
              const RESPONSE = doDeepCopy(response);
              if (esValidObject(RESPONSE) && esValidObject(RESPONSE['datos'])) {
                const DATOS = RESPONSE['datos'] as { id_solicitud?: number };
                if (getValidDatos(DATOS.id_solicitud)) {
                  this.guardarIdSolicitud = DATOS.id_solicitud ?? 0;
                  this.store.setIdSolicitud(DATOS.id_solicitud ?? 0);
                } else {
                  this.store.setIdSolicitud(0);
                }
              }
              resolve(response);
            },
            error: (error) => {
              reject(error);
            }
          });
        });
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
}
