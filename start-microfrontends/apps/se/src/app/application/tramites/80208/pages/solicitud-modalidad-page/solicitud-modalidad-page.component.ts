/**
 * @description Este componente es responsable de manejar el flujo de pasos para la elegibilidad de textiles.
 * Incluye la lógica para la navegación entre pasos y la obtención de títulos.
 * @import { PASOS } from 'libs/shared/data-access-user/src/tramites/constantes/80208/solicitud-modalidad.enums';
 * @import { DatosPasos } from 'libs/shared/data-access-user/src/core/models/shared/components.model';
 * @import { ListaPasosWizard } from 'libs/shared/data-access-user/src/core/models/80208/solicitud-modalidad.model';
 * @import { WizardComponent } from '@ng-mf/data-access-user';
 */

import { AVISO, DatosPasos, Usuario, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import {
  CambioModalidadState,
  CambioModalidadStore,
} from '../../estados/tramite80208.store';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import {
  ERROR_FORMA_ALERT,
  ERROR_SERVICIOS_ALERT,
  PASOS,
  USUARIO_INFO,
} from '../../constantes/solicitud-modalidad.enums';
import { ErrorModelo, Payload } from '../../constantes/texto.enum';
import { Observable, Subject, catchError, map, of, switchMap, take, takeUntil, tap } from 'rxjs';
import { CambioModalidadQuery } from '../../estados/tramite80208.query';
import { CambioModalidadService } from '../../service/cambio-modalidad.service';
import { GuardarService } from '../../service/guardar.service';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

import { ResultadoSolicitud } from '../../modelos/solicitud-modalidad.model';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * Interfaz para definir la acción y el valor del botón.
 */
interface AccionBoton {
  /**
   * Tipo de acción del botón (por ejemplo, 'cont' para continuar, 'back' para regresar).
   * @property {string} accion - Tipo de acción del botón (por ejemplo, 'cont' para continuar, 'back' para regresar).
   */
  accion: string;
  /** El índice del paso al que se navega.
   * @property {number} valor - El índice del paso al que se navega.
   */
  valor: number;
}

/**
 * @description Este componente es responsable de manejar el flujo de pasos para la elegibilidad de textiles.
 * Incluye la lógica para la navegación entre pasos y la obtención de títulos.
 */
@Component({
  selector: 'app-solicitud-modalidad-page',
  templateUrl: './solicitud-modalidad-page.component.html',
  styleUrl: './solicitud-modalidad-page.component.scss',
  providers: [ToastrService],
})
export class SolicitudModalidadPageComponent implements OnInit {
  /**
   * @property {Array<ListaPasosWizard>} pasos
   * @description Array de pasos del asistente (wizard).
   */
  pasos: Array<ListaPasosWizard> = PASOS;

  /**
   * @property {WizardComponent} wizardComponent
   * @description Referencia al componente del asistente (wizard).
   */
  @ViewChild("wizardRef") wizardComponent!: WizardComponent;

  /**
   * @property {number} indice
   * @description Índice del paso actual en el asistente.
   */
  indice: number = 1;

  /**
   * @property {DatosPasos} datosPasos
   * @description Datos relacionados con los pasos del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * URL de la página actual.
   */
  public solicitudState!: CambioModalidadState;

  /**
     * Valor del aviso de privacidad.
     * @type {string}
     */
      AVISO_PRIVACIDAD_ADJUNTAR = AVISO.Aviso;

  /**
   * Referencia al componente del primer paso.
   * Permite acceder a los métodos y propiedades del paso uno.
   */
  @ViewChild('pasoUno') pasoUnoComponent!: PasoUnoComponent;

  /**
   * Subject para notificar la destrucción del componente y cancelar suscripciones.
   * Se utiliza para evitar fugas de memoria al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Contiene la información del usuario actual.
   *
   * @type {Usuario}
   * @see USUARIO_INFO
   */
  datosUsuario: Usuario = USUARIO_INFO;

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

  /** Indica la visibilidad del botón Guardar. */
  public btnGuardarVisible: string = 'visible';

  /** Indica si el botón Guardar debe mostrarse o estar habilitado en el formulario. */
  public btnGuardar: boolean = true;

  /**
   * Indica si existe un error en el campo de cambio de modalidad.
   * Se actualiza desde el estado del store para mostrar mensajes de error específicos.
   * @type {boolean}
   */
  cambioError: boolean = false;

  /**
   * Contiene el mensaje HTML de error para el campo de cambio de modalidad.
   * Se utiliza para mostrar alertas de validación al usuario.
   * @type {string}
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Indica si existe un error en el campo de servicios IMMX.
   * Se actualiza desde el estado del store para mostrar mensajes de error específicos.
   * @type {boolean}
   */
  serviciosImmxError: boolean = false;
  
  /**
   * Contiene el mensaje HTML de error para el campo de servicios IMMX.
   * Se utiliza para mostrar alertas de validación cuando faltan servicios requeridos.
   * @type {string}
   */
  public serviciosImmxAlert = ERROR_SERVICIOS_ALERT;

    esFormaValido: boolean = true;

  /**
   * @constructor
   * @description Constructor que inicializa el componente y sus dependencias.
   * @param {CambioModalidadQuery} cambioModalidadQuery - Servicio para consultar el estado del cambio de modalidad.
   */
  constructor(
    public cambioModalidadQuery: CambioModalidadQuery,
    private guardarService: GuardarService,
    private tramite80208Store: CambioModalidadStore,
    private cambioModalidadService: CambioModalidadService,
    private toastrService: ToastrService,
  ) {}

  /**
   * Mantiene la suscripción al estado de CambioModalidadQuery para tener siempre el estado actualizado.
   */
  ngOnInit(): void {
    this.cambioModalidadQuery.selectCambioModalidad$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state: CambioModalidadState) => {
        this.solicitudState = state;
        this.cambioError = state.cambioError ?? false;
        this.serviciosImmxError = state.serviciosImmxError ?? false;

      });
  }

/**
 * Maneja la lógica para actualizar el índice del paso del wizard según el evento del botón de acción proporcionado.
 * 
 * Este método obtiene el estado actual desde `nuevoProgramaIndustrialService`, lo guarda,
 * y muestra un mensaje de éxito o error dependiendo del código de respuesta. Si la respuesta es exitosa
 * y el valor del evento está dentro del rango válido (1 a 4), actualiza el índice del wizard y navega
 * hacia adelante o atrás según el tipo de acción.
 * 
 * @param e - El evento del botón de acción que contiene el valor y el tipo de acción.
 */
getValorIndice(e: AccionBoton): void {
  let shouldNavigate = false;
    if (this.indice === 1) {
      const ISVALID = this.validarTodosFormulariosPasoUno() ?? false;
      this.esFormaValido = ISVALID;

      if (!this.esFormaValido) {
        this.datosPasos.indice = 1;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }

      this.cambioModalidadService.getAllState()
              .pipe(
                take(1),
                tap(data => {
                  //
                }),
              switchMap((data) => this.guardar(data)),
              tap(response => {
                shouldNavigate = response.codigo === '00';
                if (shouldNavigate) {
                  this.esFormaValido = true;
                  this.indice = e.valor;
                  this.datosPasos.indice = this.indice;
                  this.wizardComponent.siguiente();
                  this.toastrService.success(response.mensaje);
                  
                } else {
                  this.toastrService.error(response.mensaje);
                  this.esFormaValido = false;
                  this.indice = 1;
                  this.datosPasos.indice = 1;
                  this.wizardComponent.indiceActual = 1;
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
                }
              })
              )
              .subscribe();      
    } else {
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

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(): void {
    this.cambioModalidadService.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);
      });
  }

  /**
   * Guarda los datos proporcionados enviándolos al servidor mediante el servicio `GuardarService`.
   * 
   * @param data - Los datos que se desean guardar y enviar al servidor.
   * @returns Promise<Payload>
   */
  guardar(data: CambioModalidadState): Promise<Payload> {
    const PAYLOAD = 
    {
      "tipoDeSolicitud": "guardar",
      "idSolicitud": this.solicitudState.idSolicitud,
      "idTipoTramite": 80208,
      "rfc": "AAL0409235E6",
      "cveUnidadAdministrativa": "8208",
      "costoTotal": 10000.5,
      "certificadoSerialNumber": "1234567890ABCDEF",
      "certificado": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A",
      "numeroFolioTramiteOriginal": "TRM-2023-00001",
      "nombre": "Juan",
      "apPaterno": "Pérez",
      "apMaterno": "López",
      "telefono": "5551234567",
      "domicilio": {},
      "empresasNacionales": data.datos?.map((empresa, index) => ({
        "tipoEmpresa": "1",
        "caracterEmpresa": "",
        "montoExportacionesUSD": 0,
        "numeroProgramaDGCESE": "",
        "porcentajeParticipacionAccionaria": 0,
        "porcentajeParticionAccionariaExt": 0,
        "nombre": "",
        "apellidoPaterno": "",
        "apellidoMaterno": "",
        "razonSocial": empresa.razonSocial || "",
        "rfc": empresa.rfc || "",
        "certificada": false,
        "correoElectronico": "trafico@mextrajes.com",
        "idDireccionSol": 112053,
        "testado": false,
        "fechaInicioVigencia": "2025-09-07",
        "fecFinVigencia": "2025-09-07",
        "blnActivo": true,
        "idServicio": index.toString(),
        "descripcionServicio": empresa.descripcionServicio || "",
        "domicilioCompleto": "",
        "numeroPrograma": empresa.numeroPrograma || "",
        "tiempoPrograma": empresa.tiempoPrograma || "",
        "descripcionTestado": "",
        "idCompuestoEmpresa": "",
        "idServicioAutorizado": 0
    })),
      "solicitud": {
      "anioPrograma": data.ano,
      "folioProgramaAutorizado": data.folio,
      "modalidad": data.seleccionaModalidad,
      "modalidadImmex": data.cambioDeModalidad
      },
      "servicios": data.servicios?.map((servicio, index) => ({
      "tipoServicio": servicio.tipoServicio || '',
      "testado": true,
      "claveServicio": Number(servicio.claveServicio) || '',
      "descripcion": servicio.descripcion || '',
      "descripcionTipo": servicio.tipoServicio || '',
      })),
      "discriminatorValue": "80208",
      "solicitante": {}
    }
    return new Promise((resolve, reject) => {
      this.guardarService.postSolicitud(PAYLOAD).subscribe(response => {
        if(esValidObject(response) && esValidObject(response.datos)) {
          if(getValidDatos(response.datos?.id_solicitud)) {
            this.tramite80208Store.setIdSolicitud(response.datos?.id_solicitud || 0);
          } else {
            this.tramite80208Store.setIdSolicitud(0);
          }
        }
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * Envía la solicitud de cambio de modalidad usando los datos del PasoUnoComponent y el estado actual.
   */
  enviaSolicitudRequest(): Observable<ResultadoSolicitud> {
    // Obtiene el estado actual del trámite desde PasoUnoComponent
    const CAMBIO_MODALIDAD_STATE: CambioModalidadState =
      this.pasoUnoComponent?.cambioDeModalidadComponent?.tramiteState;

    // Construye el payload para la solicitud
    const PAYLOAD: CambioModalidadState = {
      idSolicitud: CAMBIO_MODALIDAD_STATE?.idSolicitud ?? null,
      ano: CAMBIO_MODALIDAD_STATE?.ano ?? null,
      folio: CAMBIO_MODALIDAD_STATE?.folio ?? null,
      seleccionaModalidad: CAMBIO_MODALIDAD_STATE?.seleccionaModalidad ?? null,
      seleccionaLaModalidad:
        CAMBIO_MODALIDAD_STATE?.seleccionaLaModalidad ?? null,
      cambioDeModalidad: CAMBIO_MODALIDAD_STATE?.cambioDeModalidad ?? null,
      serviciosImmx: CAMBIO_MODALIDAD_STATE?.serviciosImmx ?? null,
      rfcEmpresa: CAMBIO_MODALIDAD_STATE?.rfcEmpresa ?? null,
      numeroPrograma: CAMBIO_MODALIDAD_STATE?.numeroPrograma ?? null,
      tiempoPrograma: CAMBIO_MODALIDAD_STATE?.tiempoPrograma ?? null,
      datos: CAMBIO_MODALIDAD_STATE?.datos ?? null,
      ServiciosDatos: CAMBIO_MODALIDAD_STATE?.ServiciosDatos ?? null,
      domiciliosSeleccionados: CAMBIO_MODALIDAD_STATE?.domiciliosSeleccionados ?? [],
      empresasSeleccionados: CAMBIO_MODALIDAD_STATE?.empresasSeleccionados ?? [],
      datosAutorizados: CAMBIO_MODALIDAD_STATE?.datosAutorizados ?? null, // <-- Añadido para cumplir con CambioModalidadState
      // Agrega otros campos relevantes según la estructura de CambioModalidadState
    };

    // Llama al servicio para guardar la solicitud
    return this.guardarService.postSolicitud(PAYLOAD).pipe(
      map((response) => {
        if (response?.codigo === '00' && response?.datos?.id_solicitud) {
          // Actualiza el ID de la solicitud en el store si es exitoso
          this.tramite80208Store.setIdSolicitud(response.datos.id_solicitud);
          return { exito: true };
        }
        const MENSAJE =
          response?.error ||
          response?.mensaje ||
          response?.causa ||
          'Ocurrió un error al guardar la solicitud.';
        const ERRORESMODELO = ((response?.errores_modelo as ErrorModelo[]) || []).map(
          (error: ErrorModelo) => ({
            campo: error.campo || 'general',
            errores: Array.isArray(error.errores)
              ? error.errores
              : [String(error.errores)],
          })
        );
        return {
          exito: false,
          MENSAJE,
          erroresModelo: ERRORESMODELO,
        } as ResultadoSolicitud;
      }),
      catchError((error) => {
        const MENSAJE =
          error?.error?.error ||
          error?.message ||
          'Error inesperado al guardar la solicitud.';
        return of({
          exito: false,
          MENSAJE,
          erroresModelo: error?.error?.errores_modelo || [],
        });
      }),
      takeUntil(this.destroyNotifier$)
    );
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

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
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
   * Valida todos los formularios del paso uno antes de permitir la navegación.
   * 
   * @method validarTodosFormulariosPasoUno
   * @description
   * Este método privado verifica que el componente del paso uno existe y que todos sus formularios son válidos.
   * Si el componente pasoUnoComponent no existe, retorna true por defecto (asumiendo validación exitosa).
   * Si existe, ejecuta la validación de todos los formularios del paso uno y retorna el resultado.
   * 
   * @returns {boolean} True si todos los formularios del paso uno son válidos o si el componente no existe, false en caso contrario.
   * @private
   */
  private validarTodosFormulariosPasoUno(): boolean {
    if (!this.pasoUnoComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validarFormularios();
    if (!ISFORM_VALID_TOUCHED) {
      return false;
    }
    return true;
  }
}
