import { AVISO, DatosPasos, JSONResponse, ListaPasosWizard, Notificacion, WizardComponent, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { MSG_ERROR_REGISTRO, MSG_REGISTRO_EXITOSO, PASOS_EXPORTACION } from '../../constants/importacion-de-vehiculos-usados-pasos.enum';
import { Subject, take, takeUntil } from 'rxjs';
import { Tramite130111State, Tramite130111Store } from '../../../../estados/tramites/tramites130111.store';
import { AccionBoton } from '../../enums/accionbotton.enum';
import { ImportacionDeVehiculosService } from '../../services/importacion-de-vehiculos.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite130111Query } from '../../../../estados/queries/tramite130111.query';

/**
 * Componente para la importación de vehículos usados.
 * Este componente gestiona el flujo de pasos en un asistente (wizard) para la importación de vehículos usados.
 */
@Component({
  selector: 'app-importacion-de-vehiculos-usados',
  templateUrl: './importacion-de-vehiculos-usados.component.html',
})
export class ImportacionDeVehiculosUsadosComponent implements OnDestroy {
  /**
   * Lista de pasos del asistente (wizard) para solicitar la importación.
   * Los pasos se obtienen de la constante `PASOS_EXPORTACION`.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * Índice del paso actual en el asistente.
   * Representa el paso en el que se encuentra el usuario.
   * Valor inicial: 1.
   */
  indice: number = 1;
  /**
   * @property {object} TEXTOS - Contiene constantes relacionadas con aviso y firma.
   * Se utiliza para manejar textos estáticos en la aplicación.
   */
  public TEXTOS = {
    AVISO,
  };
  /**
   * Índice de la pestaña activa.
   * Representa la pestaña seleccionada en el asistente.
   * Valor inicial: 1.
   */
  tabIndex: number = 1;

  /**
   * Referencia al componente `WizardComponent` del asistente.
   * Se utiliza para navegar entre los pasos del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente `PasoUnoComponent`.
   * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
   */
  @ViewChild(PasoUnoComponent, { static: false }) pasoUnoComponent!: PasoUnoComponent;

  /**
* Indica si el botón para cargar archivos está habilitado.
*/
  activarBotonCargaArchivos: boolean = false;

  /**
   * Datos relacionados con los pasos del asistente.
   * Incluye el número total de pasos, el índice actual y los textos de los botones de navegación.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length, // Número total de pasos
    indice: this.indice, // Índice del paso actual
    txtBtnAnt: 'Anterior', // Texto del botón "Anterior"
    txtBtnSig: 'Continuar', // Texto del botón "Continuar"
  };

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;

  /**
   * @property {Tramite130111State} solicitudState
   * @description
   * Estado actual de la solicitud del trámite 130111.
   */
  solicitudState!: Tramite130111State;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = MSG_ERROR_REGISTRO

  /**
     * Folio temporal de la solicitud.
     * Se utiliza para mostrar el folio en la notificación de éxito.
     */
  public alertaNotificacion!: Notificacion;

  /**
      * Constante que almacena el valor de la nota de privacidad.
      * 
      * @constant AVISO_PRIVACIDAD_ADJUNTAR - Almacena el valor definido en `NOTA.AVISO_PRIVACIDAD_ADJUNTAR`.
      * Se utiliza para adjuntar o gestionar el aviso de privacidad dentro del sistema.
      */
  AVISO_PRIVACIDAD_ADJUNTAR = AVISO.Aviso;

  /**
    * Evento que se emite para cargar archivos.
    * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
    */
  cargarArchivosEvento = new EventEmitter<void>();

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
   * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Folio temporal de la solicitud.
   * @description
   */
  public folioTemporal: number = 0;

  /**
   * @description
   * Constructor de la clase.
   * @param importacionDeVehiculosService
   * @param tramite130105Store
   */
  constructor(private importacionDeVehiculosService: ImportacionDeVehiculosService, private tramite130111Store: Tramite130111Store, private tramite130111Query: Tramite130111Query, private toastrService: ToastrService) {
    this.tramite130111Query.selectSolicitud$.pipe(takeUntil(this.destroyed$)).subscribe((solicitudState) => {
      this.solicitudState = solicitudState;
    });
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
      this.obtenerDatosDelStore();
    } else if (e.valor > 0 && e.valor <= this.pasosSolicitar.length) {
      this.pasoNavegarPor(e);
    }
  }

  /**
    * Obtiene los datos del store y los guarda utilizando el servicio.
    */
  obtenerDatosDelStore(): void {
    this.importacionDeVehiculosService.getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data);
      });
  }


  /**
   * Guarda los datos proporcionados en el parámetro `item` construyendo un objeto payload y enviándolo al servicio backend.
   * El payload incluye información del solicitante, certificado, destinatario y detalles del certificado.
   *
   * @param item - Objeto que contiene todos los datos necesarios para el payload, incluyendo información del certificado, destinatario y detalles adicionales.
   *
   * @remarks
   * Este método muestra el payload construido en la consola y está diseñado para enviarlo al backend mediante `certificadoService.guardarDatosPost`.
   * La llamada al servicio actualmente está comentada.
   */
  guardar(item: Tramite130111State): Promise<JSONResponse> {
    const PAYLOAD = {
      tipoDeSolicitud: "guardar",
      mercancia: this.importacionDeVehiculosService.buildMercancia(item),
      id_solcitud:
        item.mostrarPartidas && item.mostrarPartidas.length > 0
          ? Number(item.mostrarPartidas[0].idSolicitud)
          : 0,
      cve_regimen: item.regimen,
      cve_clasificacion_regimen: item.clasificacion,
      productor: this.importacionDeVehiculosService.buildProductor(),
      solicitante: this.importacionDeVehiculosService.buildSolicitante(),
      representacion_federal: this.importacionDeVehiculosService.buildRepresentacionFederal(item),
      entidades_federativas: this.importacionDeVehiculosService.buildEntidadesFederativas(item),
      lista_paises: item.fechasSeleccionadas ?? [],
      tipo_solicitud_pexim: item.solicitud,
    };

    return new Promise((resolve, reject) => {
      this.importacionDeVehiculosService.guardarDatosPost(PAYLOAD).subscribe(response => {
        const API_RESPONSE = doDeepCopy(response);
        if (esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
          if (getValidDatos(API_RESPONSE.datos.id_solicitud || API_RESPONSE.datos.idSolicitud)) {
            this.folioTemporal = API_RESPONSE.datos.idSolicitud || API_RESPONSE.datos.id_solicitud;
            this.tramite130111Store.setIdSolicitud((API_RESPONSE.datos.id_solicitud || API_RESPONSE.datos.idSolicitud));
            this.pasoNavegarPor({ accion: 'cont', valor: 2 });
          } else {
            this.tramite130111Store.setIdSolicitud(0);
          }
        }
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  /**
       * Navega a través de los pasos del asistente según la acción del botón.
       * @param e Objeto que contiene la acción y el valor del índice al que se desea navegar.
       */
  pasoNavegarPor(e: AccionBoton): void {
    this.indice = e.valor;
    this.datosPasos.indice = e.valor;
    if (e.valor > 0 && e.valor < 5) {
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

  /**
   *  Método para manejar el evento de carga en progreso.
   * @param carga Indica si la carga está en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia los recursos y restablece el estado del store asociado al trámite 130105.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.tramite130111Store.resetStore();
  }
}