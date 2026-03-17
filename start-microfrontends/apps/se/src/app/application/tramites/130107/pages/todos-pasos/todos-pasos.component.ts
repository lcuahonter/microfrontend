import {
  AccionBoton,
  DatosPasos,
  JSONResponse,
  ListaPasosWizard,
  Notificacion,
  WizardComponent,
  doDeepCopy,
  esValidObject,
  getValidDatos,
} from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import {
  ERROR_ALERTA,
  MENSAJE_CORREGIR_ERRORES,
  MSG_REGISTRO_EXITOSO,
  PANTA_PASOS,
  TITULO_PASO_DOS,
  TITULO_PASO_TRES,
  TITULO_PASO_UNO,
} from '../../constantes/importaciones-agropecuarias.enum';
import { Subject, take, takeUntil } from 'rxjs';
import {
  Tramite130107State,
  Tramite130107Store,
} from '../../../../estados/tramites/tramite130107.store';
import { AVISO } from '../../constantes/importaciones-agropecuarias.enum';
import { ImportacionesAgropecuariasService } from '../../services/importaciones-agropecuarias.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite130107Query } from '../../../../estados/queries/tramite130107.query';

/**
 * @component TodosPasosComponent
 * @description
 * Componente encargado de gestionar la navegación entre todos los pasos del trámite 130107.
 * Este componente incluye la lógica para manejar el flujo del wizard, actualizar los títulos
 * de los pasos y controlar la navegación entre ellos.
 *
 * @selector app-todos-pasos
 * @templateUrl ./todos-pasos.component.html
 */
@Component({
  selector: 'app-todos-pasos',
  templateUrl: './todos-pasos.component.html',
})
/**
 * Componente para gestionar todos los pasos del trámite.
 * Incluye la lógica para la navegación entre pasos y la gestión del estado del trámite.
 */
export class TodosPasosComponent implements OnDestroy {
  /**
   * @property pantallasPasos
   * @description
   * Lista de pasos del wizard, representada como un arreglo de objetos `ListaPasosWizard`.
   *
   * @type {ListaPasosWizard[]}
   */
  public pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;

  /**
   * @property indice
   * @description
   * Índice del paso actual en el wizard.
   *
   * @type {number}
   */
  public indice: number = 1;

  /**
   * @property aviso
   * @type {string}
   *  Texto del aviso de privacidad en formato HTML.
   */

  aviso = AVISO.Aviso;

  /**
   * @property titulo
   * @description
   * Título del paso actual en el wizard.
   * Se actualiza dinámicamente según el paso seleccionado.
   *
   * @type {string}
   */
  public titulo: string = TITULO_PASO_UNO;

  /**
   * @property pasoDosTitulo
   * @description
   * Título del segundo paso en el wizard.
   * 
   * @type {string}
   */
  pasoDosTitulo: string = TITULO_PASO_DOS;

  /**
   * @property pasoTresTitulo
   * @description
   * Título del tercer paso en el wizard.
   * 
   * @type {string}
   */
  pasoTresTitulo: string = TITULO_PASO_TRES;

  /**
   * @property wizardComponent
   * @description
   * Referencia al componente `WizardComponent` para controlar la navegación entre pasos.
   *
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente `PasoUnoComponent`.
   * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
   */
  @ViewChild(PasoUnoComponent, { static: false })
  pasoUnoComponent!: PasoUnoComponent;

  /**
   * @property datosPasos
   * @description
   * Datos relacionados con los pasos del wizard, como el número total de pasos,
   * el índice actual y los textos de los botones de navegación.
   *
   * @type {DatosPasos}
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @property activarBotonCargaArchivos
   * @description
   * Indica si el botón para cargar archivos debe estar activo o no.
   *
   * @type {boolean}
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * @property esFormaValido
   * @description
   * Indica si el formulario del paso uno es válido.
   *
   * @type {boolean}
   */
  esFormaValido: boolean = false;

  /**
   * @property solicitudState
   * @description
   * Estado del trámite de importaciones agropecuarias.
   *
   * @type {Tramite130107State}
   */
  solicitudState!: Tramite130107State;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public errorAlerta = ERROR_ALERTA;

  /**
   * Referencia a la función generadora de mensajes de error relacionados
   * con el proceso de cálculo.
   */
  public MENSAJE_CORREGIR_ERRORES = MENSAJE_CORREGIR_ERRORES;

  /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;

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
* @property {boolean} isSaltar
* @description
* Indica si se debe saltar al paso de firma. Controla la navegación
* directa al paso de firma en el wizard.
* @default false - No salta por defecto
*/
  isSaltar: boolean = false;

  /**
   * @description
   * Constructor del componente.
   * Inyecta el servicio de validación de formularios.
   * @param importacionesAgropecuariasService Servicio para gestionar las importaciones agropecuarias.
   * @param tramite130107Store Store para gestionar el estado del trámite 130107.
   * @param tramite130107Query Query para consultar el estado del trámite 130107.
   * @param toastrService Servicio para mostrar notificaciones tipo toast.
   */
  constructor(
    private importacionesAgropecuariasService: ImportacionesAgropecuariasService,
    private tramite130107Store: Tramite130107Store,
    private tramite130107Query: Tramite130107Query,
    private toastrService: ToastrService
  ) {
    this.tramite130107Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((solicitudState) => {
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
    this.importacionesAgropecuariasService
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
  guardar(item: Tramite130107State, e: AccionBoton): Promise<JSONResponse> {
    const MERCANCIA =
      this.importacionesAgropecuariasService.getPayloadDatos(item);

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
      this.importacionesAgropecuariasService
        .guardarDatos(PAYLOAD)
        .subscribe(
          (response) => {
            this.esFormaValido = false;

            if (response.codigo === '3' || response.codigo === 'APP-S001') {
              this.esFormaValido = true;
              this.errorAlerta = this.MENSAJE_CORREGIR_ERRORES(
                (response as unknown as { error: string })['error'] || ''
              );
            }
            shouldNavigate = response.codigo === '00';
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
                  this.tramite130107Store.setIdSolicitud(
                    API_RESPONSE.datos.id_solicitud
                  );
                } else {
                  this.tramite130107Store.setIdSolicitud(0);
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

  /**
 * @method saltar
 * @description
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
   * @method blancoObligatoria
   * @description Método para manejar el evento de documentos obligatorios en blanco.
   * Actualiza la bandera `isSaltar` basada en el estado recibido.
   * @param {boolean} enBlanco - Indica si hay documentos obligatorios en blanco.
   * @return {void}
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia los recursos y restablece el estado del store asociado al trámite 130107.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    // this.tramite130107Store.resetStore();
  }
}
