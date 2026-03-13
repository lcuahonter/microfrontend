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
  ERROR_FORMA_ALERT,
  TITULO_PASO_DOS,
  TITULO_PASO_TRES,
} from '../../components/constantes/aviso-enum';
import {
  Solicitud130301State,
  Tramite130301Store,
} from '../../../../estados/tramites/tramite130301.store';
import { Subject, take, takeUntil } from 'rxjs';
import { MSG_REGISTRO_EXITOSO } from '../../constantes/solicitud-prorroga.enum';
import { PASOS } from '@libs/shared/data-access-user/src/core/enums/130301/modificacion.enum';
import { PasoUnoComponent } from '../../pages/paso-uno/paso-uno.component';
import { SolicitudProrrogaService } from '../../services/solicitudProrroga/solicitud-prorroga.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite130301Query } from '../../../../estados/queries/tramite130301.query';

/**
 * Componente para gestionar la página de la solicitud del trámite.
 * Este componente utiliza un asistente (wizard) para guiar al usuario a través de los pasos del trámite.
 */
@Component({
  selector: 'app-solicitud-page',
  templateUrl: './solicitud-page.component.html',
})
/**
 * Clase que representa la página de solicitud del trámite 130301.
 */
export class SolicitudPageComponent implements OnDestroy{
  /**
   * Índice actual del paso en el asistente.
   * Este valor determina el paso activo en el wizard.
   *
   * @type {number}
   */
  indice: number = 1;

  /**
   * Referencia al componente del asistente (wizard).
   * Se utiliza para interactuar con el wizard y controlar su flujo (pasar al siguiente paso, ir al anterior, etc.).
   *
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al PasoUnoComponent para validación cruzada.
   */
  @ViewChild(PasoUnoComponent, { static: false })
  pasoUnoComponent!: PasoUnoComponent;

  /**
   * Lista de pasos del asistente.
   * Contiene un arreglo con los pasos definidos en `PASOS` que será utilizado en el wizard.
   *
   * @type {ListaPasosWizard[]}
   */
  readonly PASOS_WIZARD: ListaPasosWizard[] = PASOS;

  /**
   * Datos de los pasos del asistente.
   * Incluye el número total de pasos, el índice del paso actual y los textos de los botones de navegación (Anterior, Continuar).
   *
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.PASOS_WIZARD.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Indica si el formulario actual es válido. Se utiliza para mostrar alertas cuando faltan campos por capturar.
   * @type {boolean}
   */
  esFormaValido: boolean = false;

  /**
   * Mensaje de alerta para campos obligatorios no capturados.
   * @type {string}
   */
  readonly formErrorAlert: string = ERROR_FORMA_ALERT;

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
   * @property solicitudState
   * @description
   * Estado del trámite 130301.
   *
   * @type {Solicitud130301State}
   */
  solicitudState!: Solicitud130301State;

  /*
   * @property activarBotonCargaArchivos
   * @description
   * Indica si el botón para cargar archivos debe estar activo o no.
   *
   * @type {boolean}
   */
  activarBotonCargaArchivos: boolean = false;

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
   * Constructor del componente.
   * @param solicitudProrrogaService Servicio para gestionar la solicitud de prórroga.
   * @param tramite130301Store Almacén de estado para el trámite 130301.
   * @param tramite130301Query Consulta de estado para el trámite 130301.
   * @param toastrService Servicio para mostrar notificaciones tipo toast.
   */
  constructor(
    private solicitudProrrogaService: SolicitudProrrogaService,
    private tramite130301Store: Tramite130301Store,
    private tramite130301Query: Tramite130301Query,
    private toastrService: ToastrService
  ) {
    this.tramite130301Query.selectSolicitud$
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
        this.pasoUnoComponent?.validarTodosFormulariosPasoUno();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore(e);
    } else if (e.valor > 0 && e.valor <= this.PASOS_WIZARD.length) {
      this.pasoNavegarPor(e);
    }
  }

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.solicitudProrrogaService
      .getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data, e);
      });
  }

  /**
   * Guarda los datos del trámite en el servidor.
   * @param item Estado actual del trámite 130301.
   * @param e Acción del botón que indica la navegación entre pasos.
   * @returns Promesa que resuelve la respuesta JSON del servidor.
   */
  guardar(item: Solicitud130301State, e: AccionBoton): Promise<JSONResponse> {
    const PAYLOAD = {
      tipoDeSolicitud: 'guardar',
      idSolicitud: item.idSolicitud || 0,
      idTipoTramite: 130301,
      numeroFolioTramiteOriginal: item.numeroFolioTramiteOriginal,
      solicitud: {
        datoTramite: {
          solicitud: item.solicitudOpcion,
          regimen: item.regimen,
          clasificacionRegimen: item.clasificacionDelRegimen,
        },
        mercancia: {
          condicionMercancia: item.productoOpcion,
          descripcion: item.descripcionMercancia,
          unidadMedidaTarifaria: item.umt,
          unidadesAutorizadas: item.cantidad,
          importeFacturaAutorizadoUSD: item.valorFactura,
        },
        representacionFederal: item.representacionFederal,
      },
      paisesDivId: item.pais,
      usoEspecificoDiv: item.usoEspecifico,
      justificacionImportacionExportacionDiv: item.justificacionImportacionExportacion,
      observacionesDiv: item.observaciones,
      certificadoKimberly: {
        tramite: {
          solicitud: {
            certificadoKimberlyNumeroRegistros: item.certificadoKimberleyForma?.certificadosEmitidos,
            certificadoKimberly: {
              idCertificadoKimberlyImportacion: item.certificadoKimberleyForma?.numeroCertificadokimberley,
              certificadoKimberlyPKPais: item.certificadoKimberleyForma?.paisEmisorCertificado,
              nombrePaisOrigenIngles: item.certificadoKimberleyForma?.nombreIngles,
              origen: item.certificadoKimberleyForma?.mixed,
              claveOrigen: item.certificadoKimberleyForma?.paisDeOrigen,
              nombreExportador: item.certificadoKimberleyForma?.nombreExportador,
              direccionExportador: item.certificadoKimberleyForma?.direccionExportador,
              nombreImportador: item.certificadoKimberleyForma?.nombreImportador,
              direccionImportador: item.certificadoKimberleyForma?.direccionImportador,
              descripcionNumeroRemesa: item.certificadoKimberleyForma?.numeroEnLetra,
              descripcionNumeroRemesaIngles: item.certificadoKimberleyForma?.numeroEnLetraIngles,
              numeroFacturaRemesa: item.certificadoKimberleyForma?.numeroFactura,
              numeroKilates: item.certificadoKimberleyForma?.cantidadQuilates,
              valorDiamantes: item.certificadoKimberleyForma?.valorDiamantes,
            },
          },
        },
      },
      datosProrroga: {
        folioResolucion: item.folioPermiso,
        cantidadPendiente: item.cantidadProrroga,
        prorrogaIniciaFec: item.fechaInicioProrroga,
        fechaFinProrroga: item.fechaFinProrroga,
        prorroga: {
          motivo: item.motivoJustificacion,
          otrasDeclaraciones: item.otrasDeclaraciones,
        },
      },
      solicitante: {
        rfcSolicitante: 'TSD931210493',
        correoElectronico: 'vucem2.5@hotmail.com',
        razonSocialSolicitante: 'CORPORACION MEXICANA DE COMPUTO S DE RL DE CV',
        actividadEconomicaPreponderante:
          'Fabricación de partes de sistemas de dirección y de suspensión para vehículos automotrices',
        domicilio: {
          pais: 'ESTADOS UNIDOS MEXICANOS',
          codigoPostal: '06700',
          entidadFederativa: 'QUERÉTARO',
          delegacionMunicipio: 'EL MARQUES',
          localidad: 'EL MARQUES',
          colonia: 'PARQUE IND B QUINTANA',
          calle: 'Av. Insurgentes Sur',
          numeroExterior: '123',
          numeroInterior: 'Piso 5, Oficina A',
          telefono: '909/917-1445',
        },
      },
    };

    return new Promise((resolve, reject) => {
      let shouldNavigate = false;
      this.solicitudProrrogaService.guardarDatos(PAYLOAD).subscribe(
        (response) => {
          this.esFormaValido = false;

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
                this.tramite130301Store.setIdSolicitud(
                  API_RESPONSE.datos.id_solicitud
                );
              } else {
                this.tramite130301Store.setIdSolicitud(0);
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
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia los recursos y restablece el estado del store asociado al trámite 130301.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.tramite130301Store.resetStore();
  }
}
