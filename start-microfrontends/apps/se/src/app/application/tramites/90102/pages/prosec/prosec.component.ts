import { AVISO, ERROR_FORMA_ALERT, ListaPasosWizard, PASOS, RegistroSolicitudService, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { AutorizacionProsecStore, ProsecState } from '../../estados/autorizacion-prosec.store';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { AUtorizacionProsecQuery } from '../../queries/autorizacion-prosec.query';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { GuardarMappingAdapter } from '../../adapters/guardar-mapping.adapter';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';

interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Componente principal para la gestión de prosec.
 * Contiene la lógica y la estructura del asistente de prosec.
 */
@Component({
  selector: 'app-prosec',
  templateUrl: './prosec.component.html',
})
export class ProsecComponent implements OnInit, OnDestroy{
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
* Identificador numérico de la solicitud actual.
* Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
*/
idSolicitud: number = 0;
  /**
  * URL de la página actual.
  */
  public solicitudState!: ProsecState;

  /*
  * Indica si hay una carga en progreso.
  */
  cargaEnProgreso: boolean = true;
  /**
   * Identificador del trámite actual.
   */
  tramiteId: string = '90102';
   /**
   * Notificador para gestionar la destrucción de observables.
   */
   destroyNotifier$: Subject<void> = new Subject();
     /**
   * Textos constantes utilizados en el componente.
   */
  TEXTOS = AVISO;
    /**
   * @property {PasoUnoComponent} pasoUnoComponent
   * @description
   * Referencia al componente hijo `PasoUnoComponent` que contiene los formularios del primer paso del trámite PROSEC.
   */
    @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
    /**
   * @property {string} formErrorAlert
   * @description
   * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;
  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario actual es válido. Se utiliza para mostrar alertas cuando faltan campos por capturar.
   */
  esFormaValido: boolean = false;
       /**
   * Clase CSS para mostrar una alerta de error.
   */
  infoError = 'alert-danger text-center';

  /**
   * Constructor del componente.
   */
  constructor(
    private toastrService: ToastrService,
    private registroSolicitudService: RegistroSolicitudService,
    private store: AutorizacionProsecStore,
    public tramiteQuery: AUtorizacionProsecQuery
  ) {
    // Inicializa el estado del trámite y la solicitud.
  }
  /**
   * Método de inicialización del componente.
   * Suscribe a los cambios en el servicio de ampliación de servicios para mostrar u ocultar alertas.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectProsec$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();
    }
  /**
   * Maneja la acción del botón en el asistente.
   * Cambia el paso actual según la acción del botón.
   *
   * @param e - Objeto que contiene la acción y el valor del botón.
   */
  getValorIndice(e: AccionBoton): void {
  if (e.accion === 'cont') {
    let isValid = true;

    if (this.indice === 1 && this.pasoUnoComponent) {
      isValid = this.pasoUnoComponent.validarFormularios();
    }

    if (!isValid) {
      this.formErrorAlert = ERROR_FORMA_ALERT;
      this.esFormaValido = true;
      this.datosPasos.indice = this.indice;
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      return;
    }

    const PAYLOAD = GuardarMappingAdapter.toFormPayload(this.solicitudState);

    this.registroSolicitudService.postGuardarDatos(this.tramiteId, PAYLOAD).subscribe(response => {
      const SHOULD_NAVIGATE = response.codigo === '00';
      if (!SHOULD_NAVIGATE) {
        this.esFormaValido = true;
        this.indice = 1;
        this.datosPasos.indice = 1;
        this.wizardComponent.indiceActual = 1;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }
      this.esFormaValido = false;
      if (esValidObject(response) && esValidObject(response.datos)) {
        const DATOS = response.datos as { id_solicitud?: number };
        const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
        this.solicitudState.idSolicitud = ID_SOLICITUD;
        this.store.setIdSolicitud(ID_SOLICITUD);
      }
      this.toastrService.success(response.mensaje);

      this.indice = 2;
      this.datosPasos.indice = 2;
      this.wizardComponent.siguiente();
    });
  } else {
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
     * Método para navegar a la siguiente sección del wizard.
     * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
     * {void} No retorna ningún valor.
     */
    siguiente(): void {
      // Aqui se hara la validacion de los documentos cargdados
      this.wizardComponent.siguiente();
      this.indice = this.wizardComponent.indiceActual + 1;
      this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
    }
  
    /**
     * Método para navegar a la sección anterior del wizard.
     * Actualiza el índice y el estado de los pasos.
     * {void} No retorna ningún valor.
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
  
    /*
    * Maneja el evento de carga en progreso.
    */
     onCargaEnProgreso(carga: boolean): void {
      this.cargaEnProgreso = carga;
    }
    /**
     * Método que se ejecuta cuando se destruye el componente.
     * Limpia el notifier para evitar fugas de memoria.
     */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}
