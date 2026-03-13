import { ANEXAR, REQUISITOS } from '@libs/shared/data-access-user/src/core/enums/constantes-alertas.enum';
import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, doDeepCopy, esValidObject, getValidDatos, PasoCargaDocumentoComponent, PasoFirmaComponent,RegistroSolicitudService, WizardService } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnDestroy,OnInit, ViewChild,inject } from '@angular/core';
import { Observable, Subject,map,switchMap, take, takeUntil } from 'rxjs';
import { PANTA_PASOS, PASO_DOS, PASO_TRES, PASO_UNO } from '../../services/certificados-licencias-permisos.enum';
import { Solicitud260302State, Tramite260302Store } from '../../estados/stores/tramites260302.store';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/301/servicios-pantallas.model';
import { CATALOGOS_ID } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogosService } from '@libs/shared/data-access-user/src/core/services/shared/catalogos/catalogos.service';
import { CommonModule } from '@angular/common';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { DatosSolicitudService } from '../../../../shared/services/shared2603/datos-solicitud.service';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src/core/models/forma-render.model';
import { PasoCuatroComponent } from '../paso-cuatro/paso-cuatro.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramites260302Query } from '../../estados/queries/tramites260302.query';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { GuardarAdapter_260302 } from '../../adapters/guardar-payload.adapter';
import { Tramite2603Store } from '../../../../shared/estados/stores/2603/tramite2603.store';
import {Solicitud260302StateUno} from '../../estados/stores/tramite260302.store'
import {Tramite260302Query} from '../../estados/queries/tramite260302.query'

/**
 * PasoUnoComponent es responsable de manejar el primer paso del proceso.
 * para actualizar el componente actual que se está mostrando.
 */
@Component({
  selector: 'app-todospasos',
  standalone: true,
  imports: [
    CommonModule, 
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    PasoUnoComponent, 
    PasoCuatroComponent,
    WizardComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],
  templateUrl: './todospasos.component.html',
})
export class TodospasosComponent implements OnDestroy, OnInit {
   /** Texto de advertencia que se muestra cuando hay condiciones peligrosas. */
    public textoPeligro: string = '<strong>¡Error de registro!</strong> Faltan campos por capturar';
  /**
   * Indica si se debe mostrar un mensaje de peligro.
   */
  public isPeligro: boolean = false;
    /**
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;
 /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
   public idProcedimiento: number = 260302;
  /**
* Esta variable se utiliza para almacenar la lista de pasos.
*/
 pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;
 /**
  * Esta variable se utiliza para almacenar el índice del paso.
  */
 indice: number = 1;
   /**
   * Referencia al componente `PasoUnoComponent`.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
/**
 * Representa el título del paso actual en el proceso.
 * El valor se inicializa como `PASO_UNO`, que probablemente
 * corresponde al primer paso en un flujo de trabajo de múltiples pasos.
 */
 titulo: string = PASO_UNO;
   /**
 * Indica si la sección de carga de documentos está activa.
 * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
 */
  seccionCargarDocumentos: boolean = true;
   /**
    * Notificador para destruir observables activos.
    */
   private destroyed$ = new Subject<void>();

   tableStore:any;


   /**
   * Esta variable se utiliza para almacenar el componente wizard.
   * @param wizardComponent - El componente wizard.
   */
   @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

   /**
    * Esta variable se utiliza para almacenar los datos de los pasos.
    * @param datosPasos - Los datos de los pasos.
    * @param nroPasos - El número de pasos.
    * @param indice - El índice.
    * @param txtBtnAnt - El texto del botón anterior.
    * @param txtBtnSig - El texto del botón siguiente.
    */

  /**
   * Represents the data for the steps in the process.
   * 
   * @property {number} nroPasos - The number of steps.
   * @property {number} indice - The current index of the step.
   * @property {string} txtBtnAnt - The text for the "Previous" button.
   * @property {string} txtBtnSig - The text for the "Continue" button.
   */
   public datosPasos: DatosPasos = {
     nroPasos: this.pantallasPasos.length,
     indice: this.indice,
     txtBtnAnt: 'Anterior',
     txtBtnSig: 'Continuar',
   };
/**
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;

  esFormaValido : boolean = false;

  isSaltar: boolean = false;

  /**
   * Una propiedad pública que contiene el texto de los requisitos para la aplicación.
   * Se inicializa con el valor de la constante `REQUISITOS`.
   */
   public TEXTOS = REQUISITOS;

  /**
   * Una propiedad pública que contiene el texto de los ANEXAR para la aplicación.
   * Se inicializa con el valor de la constante `ANEXAR`.
   */
   public TEXTOS2 = ANEXAR;

  /**
     * Almacena todos los valores del solicitanteStore al cargar el componente.
     */
  public solicitanteStoreValues: any;
     /**
        * Estado de la solicitud.
        */
       public solicitudState!: Solicitud260302State;

    public solicitudStateUno!: Solicitud260302StateUno;
       /** Identificador numérico para guardar la solicitud.
 * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
 */
   public guardarIdSolicitud: number = 0;
   public formErrorAlert!: string;
/**
 * Un array de objetos Catalogo que representa el catálogo de documentos.
 * Este array está inicialmente vacío y puede ser poblado con instancias de Catalogo.
 */
  public catalogoDocumentos: Catalogo[] = [];
  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  public isContinuarTriggered: boolean = false;
  constructor(private catalogosServices: CatalogosService,
   private _store: Tramite260302Store,
      private _query: Tramites260302Query,
       private toastrService: ToastrService,
       private _sharedSvc: DatosSolicitudService,
        public tramite2603Store: Tramite2603Store,
        public tramitefieldQuery: Tramite260302Query,
        private registroSolicitudService: RegistroSolicitudService
  ) {
//
  }
    /**
   * @property wizardService
   * @description
   * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
   * @type {WizardService}
   */
    wizardService = inject(WizardService);
  /**   
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de la solicitud para mantener el estado local actualizado.
   * {void} No retorna ningún valor.
   */
  ngOnInit(): void {
    this._query.selectSolicitud$.pipe().subscribe((data) => {
      this.solicitudState = data;
      this.isContinuarTriggered = this.solicitudState['continuarTriggered'] ?? false;
    });
  }

   /**
   * Este método se utiliza para inicializar el componente.
   */
   /*public getValorIndice(e: AccionBoton):void{
 
     const NEXT_INDEX =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor;
        
   if (this.indice === 1 && e.accion === 'cont') {
      this._store.setContinuarTriggered(true);
     // const ES_VALIDO = this.validarFormulariosPasoActual();
     const ES_VALIDO = true;
      if (!ES_VALIDO) {
        this.isPeligro = true;
        return;
      }
      this.isPeligro = false;
    }
      if (e.valor > 0 && e.valor < this.pantallasPasos.length) {
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
    }
  }*/
  
   /**
   * Verifica si se debe navegar al siguiente paso.
   * Realiza una llamada para guardar los datos y determina si la navegación es exitosa.
   * @returns {Observable<boolean>} Observable que emite true si se debe navegar, false en caso contrario.
   *
  private shouldNavigate$(): Observable<boolean> {
      return this._sharedSvc.getAllState().pipe(
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
      */

    
    public getStoreData(): void {
      this.tramitefieldQuery.selectSolicitud$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
        this.solicitudStateUno = data;
        console.log('Store Data:', this.solicitudState);
      });
    }

      /**
   * Obtiene todos los valores actuales del store Tramite2603Store.
   * Puedes usar este método para acceder a todos los datos del store.
   */
  public getAllTramite2603StoreValues(): void {
    this.tableStore = this.tramite2603Store.getStoreTableData();
   }

   public getValorIndice(e: AccionBoton):void{
    if (e.accion === 'cont') {
      let isValid = true;

      if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = this.pasoUnoComponent.validarPasoUno();
       
      }

      if (!isValid) {
        this.formErrorAlert = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';
        this.esFormaValido = true;
        this.datosPasos.indice = this.indice;
        return;
      }

      this.esFormaValido = false;
      this.postGuardarDatos(e);
    } else {
      this.indice = e.valor;
      this.datosPasos.indice = this.indice; this.getHeaderDatos();
      this.wizardComponent.atras();
    }
  }


     postGuardarDatos(e: AccionBoton): void {
        this.getStoreData();
         this.getAllTramite2603StoreValues();
        const PAYLOAD = GuardarAdapter_260302.toFormPayload(this.solicitudStateUno, this.tableStore);
        let shouldNavigate = false;
        
        this.registroSolicitudService.postGuardarDatos('260302', PAYLOAD).subscribe(response => {
          shouldNavigate = response.codigo === '00';
          
          if (!shouldNavigate) {
            const ERROR_MESSAGE = response.error || 'Error desconocido en la solicitud';
            this.formErrorAlert = TodospasosComponent.generarAlertaDeError(ERROR_MESSAGE);
            this.esFormaValido = true;
            this.indice = 1;
            this.datosPasos.indice = 1;
            this.wizardComponent.indiceActual = 1;
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            return;
          }
          
          if (shouldNavigate) {
            if (esValidObject(response) && esValidObject(response.datos)) {
              const DATOS = response.datos as { id_solicitud?: number };
              if (getValidDatos(DATOS.id_solicitud)) {
                this._store.setIdSolicitud(DATOS.id_solicitud ?? 0);
                this.solicitudState.idSolicitud = DATOS.id_solicitud ?? null;
              } else {
                this._store.setIdSolicitud(0);
              }
            }
            
            let indiceActualizado = e.valor;
            if (e.accion === 'cont') {
              indiceActualizado = e.valor;
            }
            
            this.toastrService.success(response.mensaje);
            
            if (indiceActualizado > 0 && indiceActualizado < 5) {
              this.indice = indiceActualizado+1;
              this.datosPasos.indice = indiceActualizado+1;
              this.getHeaderDatos();
              
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
      }
      /**
   * Guarda los datos proporcionados mediante una solicitud HTTP POST.
   * @param data - Los datos que se desean guardar.
   * @returns {Promise<unknown>} Una promesa que se resuelve con la respuesta de la solicitud POST.
   */
  /*  public guardar(data: Record<string, unknown>): Promise<unknown> {
       const PAYLOAD = this._sharedSvc.buildPayload(data, this.idProcedimiento);
       
        return new Promise((resolve, reject) => {
          this._sharedSvc.guardarDatosPost(PAYLOAD, this.idProcedimiento.toString()).subscribe({
            next: (response) => {
              const RESPONSE = doDeepCopy(response);
              if (esValidObject(RESPONSE) && esValidObject(RESPONSE['datos'])) {
                const DATOS = RESPONSE['datos'] as { id_solicitud?: number };
                if (getValidDatos(DATOS.id_solicitud)) {
                  this.guardarIdSolicitud = DATOS.id_solicitud ?? 0;
                  this._store.setIdSolicitud(DATOS.id_solicitud ?? 0);
                } else {
                  this._store.setIdSolicitud(0);
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
        */

      onBlancoObligatoria(enBlanco: boolean): void {
        this.isSaltar = enBlanco;
      }
/**
   * Valida los formularios del paso actual antes de permitir continuar.
   * @returns {boolean} - `true` si los formularios son válidos, `false` en caso contrario.
   */
  
validarFormulariosPasoActual(): boolean {
    if (this.indice === 1) {
      return this.pasoUnoComponent?.validarFormularios() ?? true;
    }
    return true;
  }
  /**
   * Actualiza la propiedad `titulo` en función del valor actual de `indice`.
   * 
   * El método utiliza una declaración `switch` para determinar el valor apropiado
   * de `titulo` según los siguientes casos:
   * - `indice` igual a 1: Establece `titulo` como `PASO_DOS`.
   * - `indice` igual a 2: Establece `titulo` como `PASO_TRES`.
   * - Caso por defecto: Establece `titulo` como `PASO_UNO`.
   */
  public getHeaderDatos():void {
    switch (this.indice) {
      case 1: {
        this.titulo = PASO_DOS;
        break;
      }
      case 2: {
        this.titulo = PASO_TRES;
        break;
      }
      default: {
        this.titulo = PASO_UNO;
        break;
      }
    }
  }

  public static generarAlertaDeError(mensajes: string): string {
    const ALERTA = `
      <div class="d-flex justify-content-center text-center">
        <div class="col-md-12 p-3  border-danger  text-danger rounded">
          <div class="mb-2 text-secondary" >Corrija los siguientes errores:</div>

          <div class="d-flex justify-content-start mb-1">
            <span class="me-2">1.</span>
            <span class="flex-grow-1 text-center">${mensajes}</span>
          </div>  
        </div>
      </div>
      `;
      return ALERTA;
  }

   /**
   * Obtiene el catálogo de tipos de documentos del servicio de catálogos.
   * 
   * Este método recupera el catálogo de tipos de documentos identificado por 
   * `CATALOGOS_ID.CAT_TIPO_DOCUMENTO` del `catalogosServices`. 
   * Si la respuesta contiene algún elemento, los asigna a `catalogoDocumentos`.
   * 
   * @returns {void}
   */
   public getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyed$)).subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
        error: (_error): void => { 
          //
        },
      });
  }
  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();
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
    /** Actualiza el estado de carga en progreso. */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
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
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
    ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
    }

}
