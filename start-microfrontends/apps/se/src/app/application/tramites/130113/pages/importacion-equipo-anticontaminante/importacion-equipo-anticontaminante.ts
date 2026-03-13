import { Component, EventEmitter, ViewChild } from '@angular/core';
import { DatosPasos, JSONResponse, ListaPasosWizard, Notificacion, WizardComponent, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { ID_PROCEDIMIENTO, MSG_REGISTRO_EXITOSO, PASOS_IMPORTACION } from '../../constants/importacion-equipo-anticontaminante.enum';
import { Subject, take, takeUntil } from 'rxjs';
import { Tramite130113State, Tramite130113Store } from '../../estados/tramites/tramites130113.store';
import { AVISO } from '@libs/shared/data-access-user/src';
import { AccionBoton } from '../../enums/accion-botton.enum';
import { ImportacionEquipoAnticontaminanteService } from '../../services/importacion-equipo-anticontaminante.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite130113Query } from '../../estados/queries/tramite130113.query';

/**
 * Componente para gestionar el asistente de importación de equipo anticontaminante.
 * Contiene la lógica para manejar los pasos del asistente y la navegación entre ellos.
 * Autor: Equipo de Desarrollo
 * Versión: 1.0.0
 * Fecha: 2023-10-01
 */
/**
 * Componente para gestionar el asistente de importación de equipo anticontaminante.
 * Contiene la lógica para manejar los pasos del asistente y la navegación entre ellos.
 * @export
 * @class ImportacionEquipoAnticontaminanteComponent
 */
@Component({
  selector: 'app-importacion-equipo-anticontaminante',
  templateUrl: './importacion-equipo-anticontaminante.component.html',
  styleUrl: './importacion-equipo-anticontaminante.component.scss',
})
export class ImportacionEquipoAnticontaminanteComponent {
  /**
   * @descripcion
   * Lista de pasos del asistente para el trámite.
   * @type {ListaPasosWizard[]}
   */
  /**
   * Lista de pasos del asistente para el trámite.
   * @type {ListaPasosWizard[]}
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_IMPORTACION;

  /** Constante para el aviso de privacidad */
  /**
   * Constante para el aviso de privacidad.
   * @type {string}
   */
  AVISO_DE_PRIVACIDAD = AVISO.Aviso;

  // Índice del paso actual en el asistente.
  /**
   * Índice del paso actual en el asistente.
   * @type {number}
   */
  indice: number = 1;
  /**
   * jest.spyOnIdentificador del procedimiento actual.
   * @type {number}
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  // Índice de la pestaña activa.
  /**
   * Índice de la pestaña activa.
   * @type {number}
   */
  tabIndex: number = 1;


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
    * @property {Tramite130113State} solicitudState
    * @description
    * Estado actual de la solicitud del trámite 130113.
    */
  solicitudState!: Tramite130113State;

  /**
   * Referencia al componente del asistente (wizard).
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /** Subject para notificar la destrucción del componente. */
    private destroyNotifier$: Subject<void> = new Subject();

      /**
         * Folio temporal de la solicitud.
         * Se utiliza para mostrar el folio en la notificación de éxito.
         */
      public alertaNotificacion!: Notificacion;
      
  /**
   * Datos relacionados con los pasos del asistente.
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;

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
     * Referencia al componente `PasoUnoComponent`.
     * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
     */
  @ViewChild(PasoUnoComponent, { static: false }) pasoUnoComponent!: PasoUnoComponent;

  /**
 * Folio temporal generado durante el proceso de captura de la solicitud.
 *
 * Se utiliza como referencia provisional antes de que se asigne un
 * folio definitivo por parte del sistema.
 *
 * @type {string}
 */
  folioTemporal: string = '';
  /**
   * Constructor del componente.
   *
   * Inicializa los servicios y stores necesarios para la gestión del trámite
   * 130113. Además, se suscribe al estado de la solicitud mediante el query
   * `tramite130113Query` para mantener sincronizada la información del componente.
   *
   * @param {ImportacionEquipoAnticontaminanteService} importacionEquipoAnticontaminanteService
   *        Servicio encargado de consultar información relacionada con fracciones,
   *        catálogos y operaciones del trámite.
   *
   * @param {Tramite130113Store} tramite130113Store
   *        Store encargado de manejar el estado global del trámite 130113.
   *
   * @param {Tramite130113Query} tramite130113Query
   *        Query utilizado para obtener observables del estado del trámite,
   *        incluyendo la información de la solicitud.
   *
   * @param {ToastrService} toastrService
   *        Servicio utilizado para mostrar notificaciones tipo *toast*
   *        (éxito, error, advertencia, etc.).
   */
  constructor(public importacionEquipoAnticontaminanteService: ImportacionEquipoAnticontaminanteService, public tramite130113Store: Tramite130113Store, public tramite130113Query: Tramite130113Query, public toastrService: ToastrService) { 
      this.tramite130113Query.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$)).subscribe((solicitudState) => {
        this.solicitudState = solicitudState;
    });
  }

  /**
   * Avanza al siguiente paso del wizard.
   *
   * Este método ejecuta la lógica para continuar con el flujo del formulario,
   * actualizando el índice del wizard y el objeto `datosPasos`.  
   * 
   * Nota: En este punto se realizará posteriormente la validación de los
   * documentos cargados antes de permitir avanzar.
   *
   * @returns {void}
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
   * Retrocede al paso anterior del wizard.
   *
   * Ejecuta la acción de regresar un paso en el flujo del formulario mediante
   * el componente `wizardComponent`. También actualiza el índice local y el
   * índice almacenado en `datosPasos` para mantener la navegación sincronizada.
   *
   * @returns {void}
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
      this.obtenerDatosDelStore(e);
    } else if (e.valor > 0 && e.valor <= this.pasosSolicitar.length) {
      this.pasoNavegarPor(e);
    }
  }

  /**
    * Obtiene los datos del store y los guarda utilizando el servicio.
    */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.importacionEquipoAnticontaminanteService.getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data, e);
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
  guardar(item: Tramite130113State, e: AccionBoton): Promise<JSONResponse> {
    const MERCANCIA = this.importacionEquipoAnticontaminanteService.getPayloadDatos(item);
    const PAYLOAD = {
      "tipoDeSolicitud": "guardar",
      "tipo_solicitud_pexim": item.defaultSelect,
      "mercancia": {
        "cantidadComercial": Number(item.cantidad),
        "cantidadTarifaria": Number(item.cantidad),
        "valorFacturaUSD": Number(item.valorFacturaUSD),
        "condicionMercancia": item.producto,
        "descripcion": item.descripcion,
        "usoEspecifico": item.usoEspecifico,
        "justificacionImportacionExportacion": item.justificacionImportacionExportacion,
        "observaciones": item.observaciones,
        "unidadMedidaTarifaria": {
          "clave": item.unidadMedida
        },
        "fraccionArancelaria": {
          "cveFraccion": item.fraccion
        },
        "fraccionTigiePartidasDeLaMercancia": item.fraccionDescripcionPartidasDeLaMercancia,
        "partidasMercancia": MERCANCIA,
      },
      "id_solcitud": item.idSolicitud || 0,
      "idTipoTramite":this.idProcedimiento,
      "cve_regimen": item.regimen,
      "cve_clasificacion_regimen": item.clasificacion,
      "productor": {
        "tipo_persona": true,
        "nombre": "Juan",
        "apellido_materno": "López",
        "apellido_paterno": "Norte",
        "razon_social": "Aceros Norte",
        "descripcion_ubicacion": "Calle Acero, No. 123, Col. Centro",
        "rfc": "AAL0409235E6",
        "pais": "SIN"
      },
      "solicitante": {
          "actividad": "",
          "calle": "",
          "codigoPostal": "83600",
          "colonia": "OTRA NO ESPECIFICADA EN EL CATALOGO",
          "correo": "brpomskyldi@etllpqhpyrpks.zgi",
          "estado": "26",
          "lada": "Fijo",
          "localidad": "REGION ARROYO SECO",
          "municipio": "CABORCA",
          "numeroExterior": "1353",
          "numeroInterior": "",
          "pais": "ESTADOS UNIDOS MEXICANOS",
          "razonSocial": "INTEGRADORA DE URBANIZACIONES SIGNUM",
          "rfc": "MAVL621207C95",
          "telefono": ""
      },
      "representacion_federal": {
        "cve_entidad_federativa": item.entidad,
        "cve_unidad_administrativa": item.representacion
      },
      "entidades_federativas": {
        "cveEntidad": item.entidad
      },
      "lista_paises": item.fechasSeleccionadas
    };

    return new Promise((resolve, reject) => {
      let shouldNavigate = false;
      this.importacionEquipoAnticontaminanteService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {
          shouldNavigate = response.codigo === '00';
          if (shouldNavigate) {
            const API_RESPONSE = doDeepCopy(response);
            if (
              esValidObject(API_RESPONSE) &&
              esValidObject(API_RESPONSE.datos)
            ) {
              if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                this.folioTemporal = API_RESPONSE.datos.idSolicitud || API_RESPONSE.datos.id_solicitud;
                this.tramite130113Store.actualizarEstado({ idSolicitud: API_RESPONSE.datos.id_solicitud});
              } else {
                this.tramite130113Store.actualizarEstado({ idSolicitud: 0 });
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
}
