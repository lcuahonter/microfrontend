import { ALERTA, ALERTA_BUSCAR_ERROR, ERROR_ALERTA, getAlertaNumFolioAsignacionError } from '@libs/shared/data-access-user/src/tramites/constantes/mensajes-error-formularios';
import { AccionBoton, DatosPasos, JSONResponse, ListaPasosWizard, Notificacion, WizardComponent, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { CUPOS_PASOS, MSG_REGISTRO_EXITOSO } from '../../constantes/cupos-constantes.enum';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Cupos120201State, Tramite120201Store } from '../../../../estados/tramites/tramite120201.store';
import { Subject, take, takeUntil } from 'rxjs';
import { AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/aviso-privacidad.enum';
import { CuposService } from '../../services/cupos/cupos.service';
import { DatosComponent } from '../datos/datos.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite120201Query } from '../../../../estados/queries/tramite120201.query';

/**
 * Componente principal para la gestión de pantallas en el wizard de cupos.
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
  styleUrls: ['./pantallas.component.scss']
})
export class PantallasComponent implements OnInit {
  /**
   * Estado del trámite de expedición de certificados de asignación directa.
   * @type {ExpedicionCertificadosAsignacion120202State}
   */
  solicitudState!: Cupos120201State;
  /**
  * Identificador numérico de la solicitud actual.
  * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
  */
  idSolicitud: number = 0;
  /**
     * Lista de pasos del wizard.
     * @type {ListaPasosWizard[]}
     */
  public pantallasPasos: ListaPasosWizard[] = CUPOS_PASOS;

  /**
   * Índice del paso actual.
   * @type {number}
   * @default 1
   */
  public indice: number = 1;

  /** Identificador del mecanismo utilizado en la solicitud */
  idMecanismo: number = 0;
  /**
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;

  /**
   * Referencia al componente de datos para validar el formulario.
   * @type {DatosComponent}
   */
  @ViewChild('datos') datos!: DatosComponent;

  /**
   * 
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  public infoAlert = 'alert-info';

  /**
   * Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
   */
  TEXTOS = AVISO.Aviso;
  /**
    * Folio temporal de la solicitud.
    * Se utiliza para mostrar el folio en la notificación de éxito.
    */
  public alertaNotificacion!: Notificacion;
  /**
* Estado del tramite Folio
*/
  public folioTemporal: number = 0;
  /**
   * Datos utilizados para el control del wizard.
   * @type {DatosPasos}
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Mensaje de error a mostrar.
   */
  esValido = true;

  /**
   * Una cadena que representa la clase CSS para una alerta de error.
   */
  infoError = 'alert-danger';

  /**
   * Asigna el mensaje de error a mostrar al atributo `ALERTA`.
   */
  ALERTA = ERROR_ALERTA;

  /**
   * Asigna el mensaje de error al atributo `ALERTA_AGREGAR_ERROR`.
   */
  ALERTA_AGREGAR_ERROR = ALERTA;

  /**
   * Asigna el mensaje de error al atributo `ALERTA_BUSCAR_ERROR`.
   */
  ALERTA_BUSCAR_ERROR = ALERTA_BUSCAR_ERROR;

  /**
   * Asigna el mensaje de error al atributo `ALERTA_NUM_FOLIO_ASIGNACION_ERROR`.
   */
  ALERTA_NUM_FOLIO_ASIGNACION_ERROR!: string;

  /**
   * Indica si se debe mostrar un mensaje de error.
   * @type {boolean}
   */
  mostrarError: boolean = false;

  /**
   * Indica si se debe mostrar un mensaje de error al agregar.
   * @type {boolean}
   */
  mostrarNumFolioAsignacionError: boolean = false;

  /**
   * Indica si se debe mostrar un mensaje de error al agregar.
   * @type {boolean}
   */
  mostrarAgregarError: boolean = false;

  /**
  * Notificador para destruir los observables y evitar posibles fugas de memoria.
  * @type {Subject<void>}
  * @private
  */
  destroyNotifier$: Subject<void> = new Subject();

  /** Referencia al componente de datos para acceder a sus métodos y propiedades.
   * @type {DatosComponent}
   */
  @ViewChild('datosRef') datosComponent!: DatosComponent;
  /**
   * Constructor del componente.
   * Se utiliza para la inyección de dependencias.
   * @param store - Almacén para gestionar el estado del trámite 120201.
   * @param cuposService - Servicio para gestionar los cupos.
   * @param toastr - Servicio para mostrar notificaciones.
   * @param tramite120201Query - Consulta para obtener el estado del trámite 120201.
   */
  constructor(private store: Tramite120201Store,
    private cuposService: CuposService,
    private toastr: ToastrService,
    private tramite120201Query: Tramite120201Query
  ) { }


  /**
   * Método de inicialización del componente.
   * Se ejecuta al crear el componente.
   */
  ngOnInit(): void {
       this.tramite120201Query.selectSeccionState$
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe((solicitud) => {
            this.solicitudState = solicitud;
            this.idMecanismo = this.solicitudState.asignacionDatosForm.idMecanismoAsignacion ?? 0;            
          });
  }

  /**
   * Actualiza el índice del paso y maneja la navegación hacia adelante o atrás.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
   * @returns {void}
   */
 public getValorIndice(e: AccionBoton): void {
    this.esValido = false;
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      this.mostrarError = false;
      this.mostrarAgregarError = false;
      this.mostrarNumFolioAsignacionError = false;
      const EXPEDICION_CERTIFICADOS_ASIGNACION = this.datos?.expedicionCertificadosAsignacionDirectaComponent;
      this.esValido = EXPEDICION_CERTIFICADOS_ASIGNACION?.validarFormulario() ?? false;
      if (!this.esValido) {
        this.esValido = true;
        return;
      }
      this.obtenerDatosDelStore()
    }
    else if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
      this.pasoNavegarPor(e);
    }
  }
  /** Obtiene los datos del store y los guarda en el estado del componente. */

  obtenerDatosDelStore(): void {
    this.cuposService.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);
      });
  }

  /**
   * Maneja el evento de error al mostrar un mensaje de error.
   *
   * @param {boolean} event - Indica si se debe mostrar el mensaje de error.
   * @returns {void}
   */
  public mostrarErrorDirectoEvento(event: boolean): void {
    this.esValido = true;
    this.mostrarError = event;
  }

  /**
   * Maneja el evento de error al mostrar un mensaje de error en el número de folio de asignación.
   *
   * @param {mostrarError: boolean, valor: string} event - Indica si se debe mostrar el mensaje de error en el número de folio de asignación.
   * @returns {void}
   */
  mostrarNumFolioAsignacionErrorEvento(event: { mostrarError: boolean, valor: string }): void {
    this.esValido = true;
    this.mostrarError = false;
    this.mostrarNumFolioAsignacionError = event.mostrarError;
    this.ALERTA_NUM_FOLIO_ASIGNACION_ERROR = getAlertaNumFolioAsignacionError(event.valor);
  }

  /**
   * Guarda el estado del trámite en el store.
   * @param item - Estado del trámite a guardar.
   * @returns Promesa con la respuesta del servidor.
   */
  guardar(item: Cupos120201State): Promise<JSONResponse> {
    const SOLICITUD = item;
    const PAYLOAD = this.cuposService.buildPayload(SOLICITUD) as Record<string, unknown>;
    return new Promise((resolve, reject) => {
      this.cuposService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {

          if (esValidObject(response) && esValidObject(response['datos'])) {
            const DATOS = response['datos'] as { id_solicitud?: number };
            if (getValidDatos(DATOS.id_solicitud)) {
              this.folioTemporal = DATOS.id_solicitud ?? 0;
              this.store.setIdSolicitud(DATOS.id_solicitud ?? 0);
              this.pasoNavegarPor({ accion: 'cont', valor: 2 });
            } else {
              this.store.setIdSolicitud(0);
            }
          }
          resolve({
            id: response['id'] ?? 0,
            descripcion: response['descripcion'] ?? '',
            codigo: response['codigo'] ?? '',
            data: response['data'] ?? response['datos'] ?? null,
            ...response,
          } as JSONResponse);
        },
        (error) => {
          reject(error);
          this.toastr.error('Error al buscar Mercancia');
        }
      );
    });
  }
  /**
     * Navega entre los pasos de un asistente (wizard) según la acción recibida.
     *
     * @param e - Objeto de tipo `AccionBoton` que contiene la acción a realizar y el valor del índice del paso.
     *
     * - Actualiza el índice actual y el índice en `datosPasos` con el valor proporcionado.
     * - Si el valor está entre 1 y 4 (inclusive), navega al siguiente paso si la acción es 'cont',
     *   o al paso anterior en caso contrario, utilizando los métodos del componente wizard.
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
   * Maneja el evento de error al agregar un elemento.
   *
   * @param {boolean} event - Indica si se debe mostrar el mensaje de error al agregar.
   * @returns {void}
   */
  public mostrarAgregarErrorEvento(event: boolean): void {
    this.esValido = true;
    this.mostrarAgregarError = event;
  }
}
