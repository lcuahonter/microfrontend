/**
 * Componente que representa los pasos de datos en un proceso de múltiples pasos. 
 * */
import { Component, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { DatosPasos, ListaPasosWizard, Notificacion, WizardComponent, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { MSG_REGISTRO_EXITOSO, PASOS_EXPORTACION } from '../../constants/importacion-otros-vehiculos-usados-pasos.enum';
import { Subject, take, takeUntil } from 'rxjs';
import { Tramite130104State, Tramite130104Store } from '../../../../estados/tramites/tramite130104.store';
import { AccionBoton } from '../../enums/accionbotton.enum';
import { ImportacionOtrosVehiculosUsadosService } from '../../services/importacion-otros-vehiculos-usados.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite130104Query } from '../../../../estados/queries/tramite130104.query';

/**
 * Componente que representa los pasos de datos en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-importacion-otros-vehiculos-usados-page',
 templateUrl: './importacion-otros-vehiculos-usados-page.component.html',
})
export class ImportacionOtrosVehiculosUsadosPageComponent implements OnDestroy {
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
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;

  /**
   * Folio temporal de la solicitud.
   * @description
   */
  public folioTemporal: number = 0;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
     <b>¡Error de registro!</b> Faltan campos por capturar.
    </div>
  </div>
</div>
`

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;

  /**
   * Referencia al componente `PasoUnoComponent`.
   * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
   */
  @ViewChild(PasoUnoComponent, { static: false }) pasoUnoComponent!: PasoUnoComponent;

  /**
   * Lista de pasos del asistente (wizard) para solicitar la importación.
   * Los pasos se obtienen de la constante `PASOS_EXPORTACION`.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * @description
   * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * @property {Tramite130104State} solicitudState
   * @description
   * Estado actual de la solicitud del trámite 130104.
   */
  solicitudState!: Tramite130104State;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de carga de documentos.
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  activarBotonCargaArchivos: boolean = false;

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
   * Constructor de la clase.
   * @param ImportacionOtrosVehiculosUsadosService
   * @param tramite130104Store
   */
  constructor(private importacionOtrosVehiculosUsadosService: ImportacionOtrosVehiculosUsadosService, 
    private tramite130104Store: Tramite130104Store, 
    private tramite130104Query: Tramite130104Query, 
    private toastrService: ToastrService) {
    this.tramite130104Query.selectSolicitud$.pipe(
      takeUntil(this.destroyed$)).subscribe((solicitudState) => {
        this.solicitudState = solicitudState;
    });
  }

  /**
   * Navega a través de los pasos del asistente según la acción del botón.
   * @param e Objeto que contiene la acción y el valor del índice al que se desea navegar.
   */
  pasoNavegarPor(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
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
      } else {
        this.wizardComponent.atras();
      }
    }
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
      const ISVALID = this.pasoUnoComponent?.solicitudComponent?.validarFormulario();
      
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore(e);
    } 
    else if (e.valor > 0 && e.valor <= this.pasosSolicitar.length) {
      this.pasoNavegarPor(e);
    } 
  }
  
  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.importacionOtrosVehiculosUsadosService.getAllState()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.guardar(data, e);
        },
        error: (error) => {
          console.error('Error getting state data:', error);
        }
      });
  }

  /**
   * Guarda los datos del trámite enviando el payload al backend.
   * Este método muestra el payload construido en la consola y está diseñado para enviarlo al backend mediante `importacionOtrosVehiculosUsadosService.guardarDatosPost`.
   * @param item Datos del estado del trámite 130104
   * @param e Acción del botón para navegación
   * @returns Promise con la respuesta JSON del servidor
   */  
  guardar(item: Tramite130104State, e: AccionBoton): Promise<Record<string, unknown>> {
    const MERCANCIA = this.importacionOtrosVehiculosUsadosService.getPayloadMercancia(item);
    const PRODUCTOR = this.importacionOtrosVehiculosUsadosService.getPayloadProductor();
    const SOLICITANTE = this.importacionOtrosVehiculosUsadosService.getPayloadSolicitante();
    const REPRESENTACION_FEDERAL = this.importacionOtrosVehiculosUsadosService.getPayloadRepresentacionFederal(item);
    const ENTIDAD_FEDERATIVA = this.importacionOtrosVehiculosUsadosService.getPayloadEntidadFederativa(item);
    
    const PAYLOAD = {
      "tipoDeSolicitud": "guardar",
      "mercancia": MERCANCIA,
      "id_solcitud": this.solicitudState.idSolicitud || 0,
      "cve_regimen": item.regimen,
      "cve_clasificacion_regimen": item.clasificacion,
      "productor": PRODUCTOR,
      "solicitante": SOLICITANTE,
      "representacionFederal": REPRESENTACION_FEDERAL,
      "entidadFederativa": ENTIDAD_FEDERATIVA,
      "listaPaises": item.fechasSeleccionadas,
      "tipo_solicitud_pexim": item.defaultSelect
    };
    
    return new Promise((resolve, reject) => {
      this.importacionOtrosVehiculosUsadosService.guardarDatosPost(PAYLOAD).subscribe({
        next: (response) => {
          const API_RESPONSE = doDeepCopy(response);
          if (
            esValidObject(API_RESPONSE) &&
            esValidObject(API_RESPONSE.datos)
          ) {
            if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
              this.folioTemporal = API_RESPONSE.datos.idSolicitud || API_RESPONSE.datos.id_solicitud;
              this.tramite130104Store.setIdSolicitud(API_RESPONSE.datos.id_solicitud);
            } else {
              this.tramite130104Store.setIdSolicitud(0);
            }
            
            if (e.valor > 0 && e.valor < 5) {
              this.indice = e.valor;
              
              if (e.accion === 'cont') {
                this.wizardComponent.siguiente();
                this.indice = 2;
                this.datosPasos.indice = 2;
                
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
              } else {
                this.wizardComponent.atras();
              }
            }
          }
          
          this.toastrService.success(typeof response['mensaje'] === 'string' ? response['mensaje'] : '');
          resolve(response);
        },
        error: (error) => {
          console.error('Error saving data:', error);
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
 * @method siguiente
 * @description
 * Método para navegar programáticamente al siguiente paso del wizard.
 * Ejecuta la transición forward en el componente wizard y actualiza los
 * índices correspondientes para mantener sincronización de estado.
 * 
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
 */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
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
   * Método para manejar el evento de carga en progreso.
   * @param carga Indica si la carga está en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia los recursos y restablece el estado del store asociado al trámite 130104.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.tramite130104Store.resetStore();
  }

}
