/**
 * Importamos los módulos necesarios y constantes.
 * Estos incluyen datos relacionados con el asistente de pasos (wizard) y las enumeraciones específicas de la aplicación. 
 */
import { AccionBoton, FORM_ERROR_ALERT } from '../../enums/accion-botton.enum';
import { CALCULATE_ALERT_ERROR, MSG_REGISTRO_EXITOSO, PASOS_EXPORTACION } from '../../constants/control-permisos-previos-exportacion.enum';
import { Component, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { DatosPasos, JSONResponse, ListaPasosWizard, Notificacion, WizardComponent, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Subject, take, takeUntil } from 'rxjs';
import { Tramite130217State, Tramite130217Store } from '../../../../estados/tramites/tramite130217.store';
import { ControlPermisosPreviosExportacionService } from '../../services/control-permisos-previos-exportacion.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite130217Query } from '../../../../estados/queries/tramite130217.query';

 /**
   * Selector para usar este componente dentro de otras partes de la aplicación.
   * Ruta al archivo HTML que define la plantilla de este componente.
   */
@Component({
  selector: 'app-control-permisos-previos-exportacion',
  templateUrl: './control-permisos-previos-exportacion.component.html',
})
export class ControlPermisosPreviosExportacionComponent implements OnDestroy {
  /**
   * Lista de pasos requeridos para el asistente,
   * inicializados desde una constante predefinida.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * Índice del paso actual en el asistente.
   * Representa el paso activo en el que el usuario está navegando.
   */
  indice: number = 1;

  /**
   * Índice de la pestaña actual.
   * Puede ser utilizado para gestionar la navegación de pestañas si aplica.
   */
  tabIndex: number = 1;

  /**
   * Referencia al componente hijo `WizardComponent`.
   * Permite interactuar directamente con los métodos del asistente,
   * como `siguiente()` o `atras()`.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Objeto que contiene detalles sobre los pasos en el asistente.
   * Incluye el número total de pasos, el índice actual y el texto para los botones de navegación.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length, // Número total de pasos en el asistente.
    indice: this.indice, // Índice actual del paso activo.
    txtBtnAnt: 'Anterior', // Texto para el botón "Anterior".
    txtBtnSig: 'Continuar', // Texto para el botón "Continuar".
  };

   /**
     * Folio temporal de la solicitud.
     * Se utiliza para mostrar el folio en la notificación de éxito.
     */
  public alertaNotificacion!: Notificacion;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = FORM_ERROR_ALERT;

  /**
   * Indica si la carga de documentos está en progreso.
   * Se inicializa en true para indicar que la carga está en progreso al inicio.
   */
  cargaEnProgreso: boolean = true;

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;

  /**
  * Indica si la sección de carga de documentos está activa.
  * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
  */
  seccionCargarDocumentos: boolean = true;

  /**
  * Indica si el botón para cargar archivos está habilitado.
  */
  activarBotonCargaArchivos: boolean = false;

  /**
    * Evento que se emite para cargar archivos.
    * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
    */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * @property {Tramite130217State} solicitudState
   * @description
   * Estado actual de la solicitud del trámite 130217.
   */
  solicitudState!: Tramite130217State;
  /**
   * Referencia al componente `PasoUnoComponent`.
   * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
   */
  @ViewChild(PasoUnoComponent, { static: false }) pasoUnoComponent!: PasoUnoComponent;
  
  /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public folioTemporal: string | number = '';

  /**
   * Función para calcular alertas de error personalizadas.
   */
  public CALCULATE_ALERT_ERROR = CALCULATE_ALERT_ERROR;
  
  /**
   * @description
   * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();
  
  /**
   * @description
   * Constructor de la clase.
   * @param controlPermisosPreviosExportacionService
   * @param tramite130217Store
   */
  constructor(private controlPermisosPreviosExportacionService: ControlPermisosPreviosExportacionService,
     private tramite130217Store: Tramite130217Store,
     private tramite130217Query: Tramite130217Query,
     private toastrService: ToastrService) {
    this.tramite130217Query.selectSolicitud$.pipe(takeUntil(this.destroyed$)).subscribe((solicitudState) => {
      this.solicitudState = solicitudState;
    });
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
    } else if (e.valor > 0 && e.valor <= this.pasosSolicitar.length) {
      this.pasoNavegarPor(e);
    }
  }

  /**
  * Obtiene el valor del índice de la acción del botón.
  * @param e Acción del botón.
  */
  pasoNavegarPor(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }
  /**
    * Obtiene los datos del store y los guarda utilizando el servicio.
    */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.controlPermisosPreviosExportacionService.getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data, e);
      });
  }
  /**
   * Guarda los datos del formulario en el backend.
   * @param item - Objeto que contiene todos los datos necesarios para el payload
   * @param e - Acción del botón para determinar el flujo de navegación
   * @returns Promise con la respuesta del servicio
   */
  guardar(item: Tramite130217State, e: AccionBoton): Promise<JSONResponse> {
    const MERCANCIA = this.controlPermisosPreviosExportacionService.getPayloadMercancia(item);
    const PRODUCTOR = this.controlPermisosPreviosExportacionService.getPayloadProductor();
    const SOLICITANTE = this.controlPermisosPreviosExportacionService.getPayloadSolicitante();
    const REPRESENTACION_FEDERAL = this.controlPermisosPreviosExportacionService.getPayloadRepresentacionFederal(item);
    const ENTIDAD_FEDERATIVA = this.controlPermisosPreviosExportacionService.getPayloadEntidadFederativa(item);
    const PAYLOAD = {
      "tipoDeSolicitud": "guardar",
      "tipo_solicitud_pexim": item.defaultSelect,
      "mercancia": MERCANCIA,
      "id_solcitud": this.solicitudState.idSolicitud || 0,
      "cve_regimen": item.regimen,
      "cve_clasificacion_regimen": item.clasificacion,
      "productor": PRODUCTOR,
      "solicitante": SOLICITANTE,
      "representacion_federal": REPRESENTACION_FEDERAL,
      "entidades_federativas": ENTIDAD_FEDERATIVA,
      "lista_paises": item.fechasSeleccionadas
    };

    return new Promise((resolve, reject) => {
      let shouldNavigate = false;
      this.controlPermisosPreviosExportacionService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {
          this.esFormaValido = false;
          if(response.codigo === '3'){
            this.esFormaValido = true;
            this.formErrorAlert = this.CALCULATE_ALERT_ERROR((response as unknown as { error: string })['error'] || '');
          }
          shouldNavigate = response.codigo === '00';
          if (shouldNavigate) {
            const API_RESPONSE = doDeepCopy(response);
            if (
              esValidObject(API_RESPONSE) &&
              esValidObject(API_RESPONSE.datos)
            ) {
              if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                this.folioTemporal = API_RESPONSE.datos.id_solicitud;
                this.tramite130217Store.setIdSolicitud(API_RESPONSE.datos.id_solicitud);
              } else {
                this.tramite130217Store.setIdSolicitud(0);
              }
              if (e.valor > 0 && e.valor < 5) {
                this.indice = e.valor;

                if (e.valor > 0 && e.valor < 5) {
                  this.indice = e.valor;
                  if (e.accion === 'cont') {
                    this.wizardComponent.siguiente();
                    if (e.valor > 0 && e.valor < 5) {
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

                    }
                  } else {
                    this.wizardComponent.atras();
                  }
                }
              }
            }
            this.toastrService.success(response.mensaje);
            resolve(response);
          } else {
            this.toastrService.error(response.mensaje);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   *  Método para manejar el evento de carga en progreso.
   * @param carga Indica si la carga está en progreso.
   */
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
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado del botón de carga de archivos.
   *  carga - Indica si la carga de documentos está activa o no.
   * {void} No retorna ningún valor.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia los recursos y restablece el estado del store asociado al trámite 130217.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.tramite130217Store.resetStore();
  }

}
