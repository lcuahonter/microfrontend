/**
 * el cual implementa un wizard (asistente) para guiar al usuario a través del proceso de solicitud
 * de modificación de un permiso de salida del territorio. Utiliza componentes y servicios compartidos
 * para la presentación y la gestión del flujo del asistente.
 */
import { ANEXAR, AVISO, REQUISITOS } from '@libs/shared/data-access-user/src';
import {
  CatalogosService,
  DatosPasos, 
  ListaPasosWizard, 
  RegistroSolicitudService,
  SolicitanteStore,
  WizardComponent,
  esValidObject,
  getValidDatos
} from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { PASO_DOS, PASO_TRES, PASO_UNO } from '../../constantes/solicitud.enum';
import { Solicitud261402State, Tramite261402Store } from '../../estados/tramite261402.store';
import { Solicitud2614State, Tramite2614Store } from '../../../../estados/tramites/tramite2614.store';
import { Subject, takeUntil } from 'rxjs';
import { AccionBoton } from '../../../../shared/constantes/shared2614/accion-botton.enum';
import { CATALOGOS_ID } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { GuardarAdapter_261402 } from '../../adapters/guardar-payload.adapter';
import { PASOS_EXPORTACION } from '../../../../shared/constantes/shared2614/solicitud-modificacion-permiso-salida-territorio.enum';
import { PagoDerechosState } from '../../../../shared/estados/stores/pago-de-derechos.store';
import { ToastrService } from 'ngx-toastr';
import { Tramite261402Query } from '../../estados/tramite261402.query';

/**
 * Decorador que define el componente Angular para la solicitud de modificación de permiso de internación.
 * Incluye el selector del componente y la ruta de su plantilla HTML.
 */
@Component({
  selector: 'app-solicitud-modificacion-permiso-internacion',
  templateUrl: './solicitud-modificacion-permiso-internacion.component.html',
})
export class SolicitudModificacionPermisoInternacionComponent implements OnInit, OnDestroy {
  /**
   * Lista de pasos del asistente para la solicitud de modificación de permiso.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * Índice del paso actual en el asistente.
   */
  indice: number = 1;

  /**
   * Índice de la pestaña seleccionada.
   */
  tabIndex: number = 1;

  /**
   * Notificador para destruir observables activos.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Referencia al componente del asistente (wizard).
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Mensaje de alerta utilizado en el componente.
   * Puede ser asignado a cualquiera de las claves definidas en TEXTOS.
   */
  public alert_message: string = AVISO.Aviso;

  /**
   * Una propiedad pública que contiene el texto de los requisitos para la aplicación.
   */
  public TEXTOS = REQUISITOS;

  /**
   * Una propiedad pública que contiene el texto de los ANEXAR para la aplicación.
   */
  public TEXTOS2 = ANEXAR;

  /**
   * Un array de objetos Catalogo que representa el catálogo de documentos.
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * Estado de los datos del store.
   */
  storeData: Solicitud261402State = { idSolicitud: 0 } as Solicitud261402State;

  /** Estado de la solicitud */
  public datosState!: DatosDelSolicituteSeccionState;

  /** Estado del pago de derechos */
  public pagoState!: PagoDerechosState;

  /** Estado de los propietarios */
  public solicitud2614State!: Solicitud2614State;

  /**
   * Indica si la sección de carga de documentos está activa.
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
   * Indica si se debe saltar al paso de firma.
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
   * Identificador del procedimiento.
   */
  public readonly idProcedimiento = '261402';
  
  /**
   * Almacena todos los valores del solicitanteStore al cargar el componente.
   */
  public solicitanteStoreValues: any;

  /**
   * Evento que se emite para cargar archivos.
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Representa el título del paso actual en el proceso.
   * El valor se inicializa como `PASO_UNO`, que probablemente
   * corresponde al primer paso en un flujo de trabajo de múltiples pasos.
   */
  titulo: string = PASO_UNO;

  /**
   * Datos relacionados con los pasos del asistente.
   * Incluye el número total de pasos, el índice actual y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor de la clase SolicitudModificacionPermisoInternacionComponent.
   */
  constructor(
    private catalogosServices: CatalogosService,
    public registroSolicitudService: RegistroSolicitudService,
    private toastrService: ToastrService,
    private solicitanteStore: SolicitanteStore,
    private tramite2614Store: Tramite2614Store,
    private tramite261402Query: Tramite261402Query,
    private tramite261402Store: Tramite261402Store,
    private datosDelSolicituteSeccionQuery: DatosDelSolicituteSeccionQuery,
    private datosDelSolicituteSeccionStore: DatosDelSolicituteSeccionStateStore
  ) {
    this.solicitanteStoreValues = this.solicitanteStore.getValue ? this.solicitanteStore.getValue() : undefined;
  }
  
  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se inicializa.
   */
  ngOnInit(): void {
    this.datosDelSolicituteSeccionQuery.selectSolicitud$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.datosState = data;
    });
      if (this.solicitanteStore._select) {
      this.solicitanteStore._select((store) => store)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data) => {
          this.solicitanteStoreValues = data;
        });
    }
  }
  
  /**
   * Cambia el índice del paso actual en el asistente.
   * Si la acción es "cont", avanza al siguiente paso.
   * Si la acción no es "cont", retrocede al paso anterior.
   * 
   * Param e Objeto que contiene la acción y el valor del índice.
   */
  getValorIndice(e: AccionBoton): void {
    this.postGuardarDatos(e);
    // if (e.accion === 'cont') {
    //   let isValid = true;

    //   if (this.indice === 1) {
    //     isValid = true;
    //   }

    //   if (!isValid) {
    //     this.formErrorAlert = 'Por favor corrija los errores en el formulario antes de continuar.';
    //     this.esFormaValido = true;
    //     this.datosPasos.indice = this.indice;
    //     return;
    //   }

    //   this.esFormaValido = false;
    //   this.postGuardarDatos(e);
    // } else {
    //   this.indice = e.valor;
    //   this.datosPasos.indice = this.indice;
    //   this.getHeaderDatos();
    //   this.wizardComponent.atras();
    // }
  }
  
  /**
   * Obtiene todos los datos del store Tramite261402Store.
   */
  public getStoreData(): void {
    this.tramite261402Query.selectSolicitud$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.storeData = data;
    });
  }

  /**
   * Obtiene todos los datos del solicitante/seccion store.
   */
  public getDatosDelSolicituteSeccionValues(): void {
    this.datosDelSolicituteSeccionQuery.selectSolicitud$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.datosState = data;
    });
  }
  
  /**
   * Obtiene todos los valores actuales del store Tramite2614Store.
   * Puedes usar este método para acceder a todos los datos del store.
   */
  public getAllTramite2614StoreValues(): void {
    this.solicitud2614State = this.tramite2614Store.getStoreTableData();
  }
  
  /**
   * Método que se ejecuta después de validar y guarda los datos mediante la API.
   * Maneja la navegación del wizard basada en la respuesta del servicio.
   * @param {AccionBoton} e - Objeto que contiene información de la acción del botón.
   */
  postGuardarDatos(e: AccionBoton): void {
    this.getStoreData();
    this.getDatosDelSolicituteSeccionValues();
    this.getAllTramite2614StoreValues();

    const PAYLOAD = GuardarAdapter_261402.toFormPayload(this.storeData, this.datosState, this.solicitud2614State, this.solicitanteStoreValues, this.pagoState);

    let shouldNavigate = false;
    
    this.registroSolicitudService.postGuardarDatos(String(this.idProcedimiento), PAYLOAD).subscribe(response => {
      shouldNavigate = response.codigo === '00';
      
      if (!shouldNavigate) {
        const ERROR_MESSAGE = response.error || 'Error desconocido en la solicitud';
        this.formErrorAlert = SolicitudModificacionPermisoInternacionComponent.generarAlertaDeError(ERROR_MESSAGE);
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
            this.storeData.idSolicitud = DATOS.id_solicitud ?? 0;
          } else {
            this.storeData.idSolicitud = 0;
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
  public getHeaderDatos(): void {
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
   * Método para navegar al paso anterior del wizard.
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyed$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
