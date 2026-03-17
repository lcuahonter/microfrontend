import { AVISO, DatosPasos, JSONResponse, ListaPasosWizard, Notificacion, WizardComponent, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import {
  ERROR_ALERTA,
  MENSAJE_CORREGIR_ERRORES,
  MSG_REGISTRO_EXITOSO,
  PASOS_EXPORTACION,
  TITULO_PASO_DOS,
  TITULO_PASO_TRES,
  TITULO_PASO_UNO,
} from '../../constants/solicitud-importacion-ambulancia.enum';
import { Subject, take, takeUntil } from 'rxjs';
import {
  Tramite130116State,
  Tramite130116Store,
} from '../../../../estados/tramites/tramites130116.store';
import { AccionBoton } from '../../enums/accionbotton.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { SolicitudImportacionAmbulanciaService } from '../../services/solicitud-importacion-ambulancia.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite130116Query } from '../../../../estados/queries/tramite130116.query';

/**
 * Componente para la importación de vehículos usados.
 * Este componente gestiona el flujo de pasos en un asistente (wizard) para la importación de vehículos usados.
 */
@Component({
  selector: 'app-solicitud-importacion-ambulancia',
  templateUrl: './solicitud-importacion-ambulancia.component.html',
})
export class SolicitudImportacionAmbulanciaComponent {


  /**
   * @property pantallasPasos
   * @description
   * Lista de pasos del wizard, representada como un arreglo de objetos `ListaPasosWizard`.
   *
   * @type {ListaPasosWizard[]}
   */
  public pantallasPasos: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * Índice del paso actual en el asistente.
   * Representa el paso en el que se encuentra el usuario.
   * Valor inicial: 1.
   */
  indice: number = 1;

  /**
   * Índice de la pestaña activa.
   * Representa la pestaña seleccionada en el asistente.
   * Valor inicial: 1.
   */
  tabIndex: number = 1;

  /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;

  /**
   * @description
   * Indica si el formulario del paso uno es válido.
   * @type {boolean}
   */
  esFormaValido: boolean = false;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public errorAlerta = ERROR_ALERTA;

  /**
   * @property titulo
   * @description
   * Título del paso actual en el wizard.
   * @type {string}
   */
  public titulo: string = TITULO_PASO_UNO;

  /**
   * @property pasoDosTitulo
   * @description
   * Título del segundo paso en el wizard.
   * @type {string}
   */
  pasoDosTitulo: string = TITULO_PASO_DOS;

  /**
   * @property pasoTresTitulo
   * @description
   * Título del tercer paso en el wizard.
   * @type {string}
   */
  pasoTresTitulo: string = TITULO_PASO_TRES;

  /**
   * @property aviso
   * @type {string}
   *  Texto del aviso de privacidad en formato HTML.
   */

  aviso = AVISO.Aviso;

  /**
   * Indica si la carga de documentos está en progreso.
   * Se inicializa en true para indicar que la carga está en progreso al inicio.
   */
  cargaEnProgreso: boolean = true;

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  /**
   * @property activarBotonCargaArchivos
   * @description
   * Indica si el botón para cargar archivos debe estar activo o no.
   *
   * @type {boolean}
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * @property solicitudState
   * @description
   * Estado del trámite de importaciones agropecuarias.
   *
   * @type {Tramite130116State}
   */
  solicitudState!: Tramite130116State;

  /**
   * Referencia a la función generadora de mensajes de error relacionados
   * con el proceso de cálculo.
   */
  public MENSAJE_CORREGIR_ERRORES = MENSAJE_CORREGIR_ERRORES;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Referencia al componente `WizardComponent` del asistente.
   * Se utiliza para navegar entre los pasos del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente `PasoUnoComponent`.
   * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
   */
  @ViewChild(PasoUnoComponent, { static: false })
  pasoUnoComponent!: PasoUnoComponent;

  /**
   * Datos relacionados con los pasos del asistente.
   * Incluye el número total de pasos, el índice actual y los textos de los botones de navegación.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length, // Número total de pasos
    indice: this.indice, // Índice del paso actual
    txtBtnAnt: 'Anterior', // Texto del botón "Anterior"
    txtBtnSig: 'Continuar', // Texto del botón "Continuar"
  };

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
   * Constructor del componente.
   * Inyecta el servicio de validación de formularios.
   * @param importacionesAgropecuariasService Servicio para gestionar las importaciones agropecuarias.
   * @param tramite130116Store Store para gestionar el estado del trámite 130116.
   * @param tramite130116Query Query para consultar el estado del trámite 130116.
   * @param toastrService Servicio para mostrar notificaciones tipo toast.
   */
  constructor(
    private solicitudImportacionAmbulanciaService: SolicitudImportacionAmbulanciaService,
    private tramite130116Store: Tramite130116Store,
    private tramite130116Query: Tramite130116Query,
    private toastrService: ToastrService
  ) {
    this.tramite130116Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((solicitudState) => {
        this.solicitudState = solicitudState;
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
   * Método para manejar el evento de carga en progreso.
   * @param carga Indica si la carga está en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  siguiente(): void {
    this.wizardComponent.siguiente();
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
      const ISVALID =
        this.pasoUnoComponent?.solicitudComponent?.validarFormulario();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore(e);
    } else if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
      this.pasoNavegarPor(e);
    }
  }

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.solicitudImportacionAmbulanciaService
      .getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data, e);
      });
  }

  /**
   * Guarda los datos del trámite en el servidor.
   * @param item Estado actual del trámite 130107.
   * @param e Acción del botón que indica la navegación entre pasos.
   * @returns Promesa que resuelve la respuesta JSON del servidor.
   */
  guardar(item: Tramite130116State, e: AccionBoton): Promise<JSONResponse> {
    const MERCANCIA =
      this.solicitudImportacionAmbulanciaService.getPayloadDatos(item);

    const PAYLOAD = {
      tipoDeSolicitud: 'guardar',
      tipo_solicitud_pexim: item.defaultSelect,
      mercancia: {
        cantidadComercial: 0,
        cantidadTarifaria: Number(item.cantidad),
        valorFacturaUSD: Number(item.valorFacturaUSD),
        condicionMercancia: item.producto,
        descripcion: item.descripcion,
        usoEspecifico: item.usoEspecifico,
        justificacionImportacionExportacion:
        item.justificacionImportacionExportacion,
        observaciones: item.observaciones,
        unidadMedidaTarifaria: {
        clave: item.unidadMedida,
        },
        fraccionArancelaria: {
          cveFraccion: item.fraccion,
        },
        partidasMercancia: MERCANCIA,
      },
      id_solcitud: this.solicitudState.idSolicitud || 0,
      cve_regimen: item.regimen,
      cve_clasificacion_regimen: item.clasificacion,
      productor: {
        tipo_persona: true,
        nombre: 'Juan',
        apellido_materno: 'López',
        apellido_paterno: 'Norte',
        razon_social: 'Aceros Norte',
        descripcion_ubicacion: 'Calle Acero, No. 123, Col. Centro',
        rfc: 'AAL0409235E6',
        pais: 'SIN',
      },
      solicitante: {
        rfc: 'AAL0409235E6',
        nombre: 'Juan Pérez',
        es_persona_moral: true,
        certificado_serial_number: 'string',
      },
      representacionFederal: {
        cve_entidad_federativa: item.entidad,
        cve_unidad_administrativa: item.representacion,
      },
      entidadFederativa: {
        cveEntidad: item.entidad,
      },
      listaPaises: item.fechasSeleccionadas,
    };

    return new Promise((resolve, reject) => {
      let shouldNavigate = false;
      this.solicitudImportacionAmbulanciaService.guardarDatos(PAYLOAD).subscribe(
        (response) => {
          this.esFormaValido = false;

          if (response.codigo === '3') {
            this.esFormaValido = true;
            this.errorAlerta = this.MENSAJE_CORREGIR_ERRORES(
              (response as unknown as { error: string })['error'] || ''
            );
          }
          shouldNavigate = response.codigo === '00';
          
          const EXTENDED_RESPONSE = response as unknown as { causa?: string };
          if (!shouldNavigate && EXTENDED_RESPONSE.causa) {
            this.esFormaValido = true;
            this.errorAlerta = this.MENSAJE_CORREGIR_ERRORES(EXTENDED_RESPONSE.causa);
          }
          
          if (shouldNavigate) {
            const API_RESPONSE = doDeepCopy(response);
            if (
              esValidObject(API_RESPONSE) &&
              esValidObject(API_RESPONSE.datos)
            ) {
              if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                this.folioTemporal =
                  API_RESPONSE.datos.idSolicitud ||
                  API_RESPONSE.datos.id_solicitud;
                this.tramite130116Store.setIdSolicitud(
                  API_RESPONSE.datos.id_solicitud
                );
              } else {
                this.tramite130116Store.setIdSolicitud(0);
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
                        mensaje: MSG_REGISTRO_EXITOSO(
                          String(this.folioTemporal)
                        ),
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
