import { ANEXAR, REQUISITOS } from '@libs/shared/data-access-user/src/core/enums/constantes-alertas.enum';
import { AlertComponent, BtnContinuarComponent, RegistroSolicitudService, SolicitanteStore, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ID_PROCEDIMIENTO, PANTA_PASOS, PASO_DOS, PASO_TRES, PASO_UNO } from '../../../../shared/constantes/shared2603/certificados-licencias-permisos.enum';
import { Solicitud260304State, Tramite260304Store } from '../../estados/stores/tramite260304.store';
import { Solicitud2603State, Tramite2603Store } from '../../../../shared/estados/stores/2603/tramite2603.store';
import { Subject, takeUntil } from 'rxjs';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/301/servicios-pantallas.model';
import { CATALOGOS_ID } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogosService } from '@libs/shared/data-access-user/src/core/services/shared/catalogos/catalogos.service';
import { CommonModule } from '@angular/common';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { GuardarAdapter_260304 } from '../../adapters/guardar-payload.adapter';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src/core/models/forma-render.model';
import { PagoDerechosState } from '../../../../shared/estados/stores/pago-de-derechos.store';
import { PasoCargaDocumentoComponent } from '@libs/shared/data-access-user/src/tramites/components/paso-carga-documento/paso-carga-documento.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src/tramites/components/paso-firma/paso-firma.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Tramite260304Query } from '../../estados/queries/tramite260304.query';
import { Tramite2603Query } from '../../../../shared/estados/queries/2603/tramite2603.query';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';

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
    BtnContinuarComponent,
    PasoUnoComponent, 
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    WizardComponent
  ],
  templateUrl: './todospasos.component.html',
})
export class TodospasosComponent implements OnDestroy, OnInit {

  /**
* Esta variable se utiliza para almacenar la lista de pasos.
*/
 pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;
 /**
  * Esta variable se utiliza para almacenar el índice del paso.
  */
 indice: number = 1;

/**
 * Representa el título del paso actual en el proceso.
 * El valor se inicializa como `PASO_UNO`, que probablemente
 * corresponde al primer paso en un flujo de trabajo de múltiples pasos.
 */
 titulo: string = PASO_UNO;

   /**
    * Notificador para destruir observables activos.
    */
   private destroyed$ = new Subject<void>();


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
 * Un array de objetos Catalogo que representa el catálogo de documentos.
 * Este array está inicialmente vacío y puede ser poblado con instancias de Catalogo.
 */
  public catalogoDocumentos: Catalogo[] = [];
  
  /**
   * Estado de los datos del store.
   */
  storeData: Solicitud260304State = { idSolicitud: 0 } as Solicitud260304State;

  /**
   * URL de la página actual.
   */
  // public solicitudState!: Solicitud260304State;

  /** Estado de la solicitud */
  public datosState!: Solicitud2603State;

  /** Estado del pago de derechos */
  public pagoState!: PagoDerechosState;

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
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   */
  isSaltar: boolean = false;

  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   */
  esFormaValido: boolean = false;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert!: string;

  /**
   * Referencia al componente PasoUnoComponent para validaciones.
   */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /**
   * @property {string} idProcedimiento
   * @description Identificador del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Almacena todos los valores del solicitanteStore al cargar el componente.
   */
  public solicitanteStoreValues: any;

   /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();
  
  /**
   * Constructor de la clase TodospasosComponent.
   * @param catalogosServices - Servicio para manejar catálogos.
   * @param tramite260304Query - Query para el trámite 260304.
   * @param tramite260304Store - Store para el trámite 260304.
   * @param registroSolicitudService - Servicio para registrar solicitudes.
   * @param toastrService - Servicio para mostrar notificaciones toastr.
   */
  constructor(
    private catalogosServices: CatalogosService,
    private tramite260304Query: Tramite260304Query,
    private tramite260304Store: Tramite260304Store,
    public registroSolicitudService: RegistroSolicitudService,
    private toastrService: ToastrService,
    private tramite2603Query: Tramite2603Query,
    private tramite2603Store: Tramite2603Store,
    private solicitanteStore: SolicitanteStore
  ) {
      this.solicitanteStoreValues = this.solicitanteStore.getValue ? this.solicitanteStore.getValue() : undefined;
  }

  ngOnInit(): void {
    if (this.solicitanteStore._select) {
      this.solicitanteStore._select((store: any) => store)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data: any) => {
          this.solicitanteStoreValues = data;
        });
    }
  }

   /**
   * Este método se utiliza para inicializar el componente.
   */
   public getValorIndice(e: AccionBoton):void{
    if (e.accion === 'cont') {
      let isValid = true;

      if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = true;
      }

      if (!isValid) {
        this.formErrorAlert = 'Por favor corrija los errores en el formulario antes de continuar.';
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

  public getStoreData(): void {
    this.tramite260304Query.selectSolicitud$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.storeData = data;
    });
  }

  /**
   * Obtiene todos los valores actuales del store Tramite2603Store.
   * Puedes usar este método para acceder a todos los datos del store.
   */
  public getAllTramite2603StoreValues(): void {
   this.datosState = this.tramite2603Store.getStoreTableData();
  }

  /**
   * Método que se ejecuta después de validar y guarda los datos mediante la API.
   * Maneja la navegación del wizard basada en la respuesta del servicio.
   * @param {AccionBoton} e - Objeto que contiene información de la acción del botón.
   */
  postGuardarDatos(e: AccionBoton): void {
    this.getStoreData();
    this.getAllTramite2603StoreValues();
    const PAYLOAD = GuardarAdapter_260304.toFormPayload(this.storeData, this.datosState, this.solicitanteStoreValues, this.pagoState);
    let shouldNavigate = false;
    
    this.registroSolicitudService.postGuardarDatos(String(this.idProcedimiento), PAYLOAD).subscribe(response => {
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
            this.tramite260304Store.setIdSolicitud(DATOS.id_solicitud ?? 0);
            this.storeData.idSolicitud = DATOS.id_solicitud ?? null;
          } else {
            this.tramite260304Store.setIdSolicitud(0);
          }
        }
        
        let indiceActualizado = e.valor;
        if (e.accion === 'cont') {
          indiceActualizado = e.valor;
        }
        
        this.toastrService.success(response.mensaje);
        
        if (indiceActualizado > 0 && indiceActualizado < 5) {
          this.indice = indiceActualizado;
          this.datosPasos.indice = indiceActualizado;
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
   * Genera HTML para mostrar alertas de error con formato específico.
   * @param {string} mensajes - Mensaje de error a mostrar.
   * @returns {string} HTML formateado para la alerta de error.
   */
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
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado del botón de carga de archivos.
   * @param carga - Indica si la carga de documentos está activa o no.
   * @returns {void} No retorna ningún valor.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   * @param cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * @returns {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Método para manejar el evento de carga en progreso.
   * @param carga - Indica si la carga está en progreso.
   * @returns {void} No retorna ningún valor.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Método para manejar el evento de documentos obligatorios en blanco.
   * Actualiza la bandera `isSaltar` basada en el estado recibido.
   * @param enBlanco - Indica si hay documentos obligatorios en blanco.
   * @returns {void}
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

  /**
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
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * @returns {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
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
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
    ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
    }

}
