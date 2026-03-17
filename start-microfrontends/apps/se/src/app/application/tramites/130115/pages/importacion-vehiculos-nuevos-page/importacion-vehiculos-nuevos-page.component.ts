// Importaciones necesarias para el componente
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { DatosPasos, JSONResponse, ListaPasosWizard, Notificacion, WizardComponent, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { MSG_ERROR_REGISTRO, MSG_REGISTRO_EXITOSO, PASOS_EXPORTACION } from '../../constants/importacion-vehiculos-nuevos-pasos.enum';

import { Subject, take, takeUntil } from 'rxjs';
import { Tramite130115State, Tramite130115Store } from '../../../../estados/tramites/tramite130115.store';
import { AccionBoton } from '../../enums/accionbotton.enum';
import { ImportacionVehiculosNuevosService } from '../../services/importacion-vehiculos-nuevos.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite130115Query } from '../../../../estados/queries/tramite130115.query';

// Decorador que define el componente y su configuración
@Component({
  selector: 'app-importacion-vehiculos-nuevos-page', // Selector del componente
  templateUrl: './importacion-vehiculos-nuevos-page.component.html' // Ruta de la plantilla HTML
})
export class ImportacionVehiculosNuevosPageComponent {
  // Lista de pasos del asistente, obtenida de una constante
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

  // Índice del paso actual en el asistente (inicia en 1)
  indice: number = 1;

  // Índice de la pestaña activa (inicia en 1)
  tabIndex: number = 1;

  // Referencia al componente WizardComponent para controlar la navegación
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  // Datos relacionados con los pasos del asistente
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length, // Total de pasos
    indice: this.indice, // Paso actual
    txtBtnAnt: 'Anterior', // Texto del botón "Anterior"
    txtBtnSig: 'Continuar', // Texto del botón "Continuar"
  };

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = MSG_ERROR_REGISTRO

  /**
   * Referencia al componente `PasoUnoComponent`.
   * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
   */
  @ViewChild(PasoUnoComponent, { static: false }) pasoUnoComponent!: PasoUnoComponent;

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
   * Indica si el formulario actual es válido.
   */
  esFormaValido: boolean = false;

  /**
  * Notificador para destruir los observables y evitar posibles fugas de memoria.
  * @private
  * @type {Subject<void>}
  */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud 130112.
   *
   * Esta propiedad mantiene la información de la solicitud en curso y
   * se sincroniza de manera reactiva con el store correspondiente.
   * Contiene los datos necesarios para representar y manipular
   * la solicitud dentro del componente.
   *
   * @type {Tramite130112State}
   * @public
   */
  public solicitudState!: Tramite130115State;

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
   * Indica si la carga de datos está en progreso.
   * Se utiliza para mostrar indicadores de carga o deshabilitar acciones mientras se realiza una operación asíncrona.
   */
  cargaEnProgreso: boolean = true;

  /**
   * jest.spyOnIdentificador del procedimiento actual.
   * @type {number}
   */
  idProcedimiento: number = Number(130112);

  /**
   * Constructor del componente.
   */
  constructor(
    public importacionVehiculosNuevosService: ImportacionVehiculosNuevosService,
    private query: Tramite130115Query,
    private store: Tramite130115Store,
    private toastr: ToastrService
  ) {
      this.query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });
  }

  /**
   * Método para actualizar el índice del paso actual y navegar entre pasos.
   * @param e Objeto con el nuevo índice y la acción ('cont' o 'ant')
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
    this.importacionVehiculosNuevosService.getAllState()
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
  guardar(item: Tramite130115State): Promise<JSONResponse> {
    const PAYLOAD = {
      tipoDeSolicitud: "guardar",
      mercancia: this.importacionVehiculosNuevosService.buildMercancia(item),
      id_solcitud:
        item.idSolicitud || 0,
      cve_regimen: item.regimen,
      cve_clasificacion_regimen: item.clasificacion,
      productor: this.importacionVehiculosNuevosService.buildProductor(),
      solicitante: this.importacionVehiculosNuevosService.buildSolicitante(),
      representacion_federal: this.importacionVehiculosNuevosService.buildRepresentacionFederal(item),
      entidades_federativas: this.importacionVehiculosNuevosService.buildEntidadesFederativas(item),
      lista_paises: item.fechasSeleccionadas ?? [],
      tipo_solicitud_pexim: item.solicitud,
    };

    return new Promise((resolve, reject) => {
      this.importacionVehiculosNuevosService.guardarDatosPost(PAYLOAD).subscribe(response => {
        const API_RESPONSE = doDeepCopy(response);
        if (esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
          if (getValidDatos(API_RESPONSE.datos.id_solicitud || API_RESPONSE.datos.idSolicitud)) {
            this.folioTemporal = API_RESPONSE.datos.idSolicitud || API_RESPONSE.datos.id_solicitud;
            this.store.setIdSolicitud((API_RESPONSE.datos.id_solicitud || API_RESPONSE.datos.idSolicitud));
            this.pasoNavegarPor({ accion: 'cont', valor: 2 });
          } else {
            this.store.setIdSolicitud(0);
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
    * Actualiza el estado de la carga en progreso.
    *
    * @param carga - Indica si la carga está en progreso (`true`) o no (`false`).
    */
   onCargaEnProgreso(carga: boolean): void {
     this.cargaEnProgreso = carga;
   }
}