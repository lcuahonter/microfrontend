import { AVISO, AccionBoton, PANTA_PASOS } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import {
  DatosPasos,
  JSONResponse,
  ListaPasosWizard,
  Notificacion,
  WizardComponent,
  doDeepCopy,
  esValidObject,
  getValidDatos,
} from '@libs/shared/data-access-user/src';
import {
  ERROR_ALERTA,
  MENSAJE_CORREGIR_ERRORES,
  MSG_REGISTRO_EXITOSO,
  TITULO_MENSAJE,
} from '../../constantes/aviso-de-importacion.enum';
import { Subject, take, takeUntil } from 'rxjs';
import {
  Tramite260603State,
  Tramite260603Store,
} from '../../estados/tramite260603Store.store';
import { AvisoImportacionService } from '../../services/aviso-importacion.service';
import { DatosPageComponent } from '../datos-page/datos-page.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260603Query } from '../../estados/tramite260603Query.query';

/**
 * @component PantallasComponent
 * @description
 * Componente principal para gestionar el flujo de pasos en el wizard del trámite 260514.
 * Permite la navegación entre diferentes pantallas/pasos utilizando el componente Wizard.
 * Controla el índice del paso actual y los datos necesarios para la navegación.
 *
 * @selector app-pantallas
 * @templateUrl ./pantallas.component.html
 * @styleUrl ./pantallas.component.scss
 */
@Component({
  selector: 'app-solicitude',
  templateUrl: './solicitude.component.html',
})
/**
 * @Component SolicitudeComponent
 * @description
 * Componente principal para gestionar el flujo de pasos en el wizard del trámite 260514.
 * Permite la navegación entre diferentes pantallas/pasos utilizando el componente Wizard.
 * Controla el índice del paso actual y los datos necesarios para la navegación.
 */
export class SolicitudeComponent implements OnDestroy{
  /**
   * @property pantallasPasos
   * @type {ListaPasosWizard[]}
   * @description
   * Lista de pasos del wizard, obtenida desde una constante.
   */
  public pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;

  /**
   * @property indice
   * @type {number}
   * @default 1
   * @description
   * Índice del paso actual en el wizard.
   */
  public indice: number = 1;

  /**
   * @property wizardComponent
   * @type {WizardComponent}
   * @description
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   */
  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;

  /**
   * @property datosPageComponent
   * @type {DatosPageComponent}
   * @description
   * Referencia al componente DatosPageComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(DatosPageComponent)
  public datosPageComponent!: DatosPageComponent;

  /**
   * @property datosPasos
   * @type {DatosPasos}
   * @description
   * Datos utilizados para el control del wizard, como el número de pasos, el índice actual y los textos de los botones.
   */
  public datosPasos: DatosPasos = {
    /**
     * @property {number} nroPasos
     * @description Número total de pasos en el wizard.
     */
    nroPasos: this.pantallasPasos.length,
    /**
     * @property {number} indice
     * @description Índice del paso actual en el wizard.
     */
    indice: this.indice,
    /**
     * @property {string} txtBtnAnt
     * @description Texto del botón "Anterior".
     */
    txtBtnAnt: 'Anterior',
    /**
     * @property {string} txtBtnSig
     * @description Texto del botón "Siguiente".
     */
    txtBtnSig: 'Continuar',
  };

  /**
   * Clase CSS para mostrar una alerta de error.
   */
  infoError = 'alert-danger text-center';

  /**
   * @property {string | null} tituloMensaje
   * @description Título del mensaje que se muestra en el wizard.
   * Inicializado con el valor de `TITULOMENSAJE`.
   */
  tituloMensaje: string | null = TITULO_MENSAJE;

  /**
   * @property {string} aviso
   * @description Constante que contiene el aviso relacionado con el trámite.
   */
  aviso: string = AVISO.Aviso;

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
   * @type {Tramite260603State}
   */
  solicitudState!: Tramite260603State;

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
   * Constructor del componente SolicitudeComponent.
   * Inyecta los servicios necesarios para la gestión del estado y notificaciones.
   * @param tramite260603Query - Query para acceder al estado del trámite 260603.
   * @param tramite260603Store - Store para gestionar el estado del trámite 260603.
   * @param toastrService - Servicio para mostrar notificaciones tipo toast.
   * @param avisoImportacionService - Servicio para gestionar las operaciones relacionadas con el aviso de importación.
   */
  constructor(
    private tramite260603Query: Tramite260603Query,
    private tramite260603Store: Tramite260603Store,
    private toastrService: ToastrService,
    public avisoImportacionService: AvisoImportacionService
  ) {
    this.tramite260603Query.selectTramiteState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((solicitudState) => {
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
      const ISVALID = this.validarTodosFormulariosPasoUno();

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
   * @method validarTodosFormulariosPasoUno
   * @description
   * Valida todos los formularios del paso uno.
   * @returns {boolean} true si todos los formularios son válidos, false en caso contrario.
   */
  private validarTodosFormulariosPasoUno(): boolean {
    if (!this.datosPageComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.datosPageComponent.validarPasoUno();
    if (!ISFORM_VALID_TOUCHED) {
      return false;
    }
    return true;
  }

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.avisoImportacionService
      .getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data, e);
      });
  }

  /**
   * Guarda los datos del trámite utilizando el servicio correspondiente.
   * @param item Tramite260603State - Estado actual del trámite.
   * @param e Objeto de tipo `AccionBoton` que contiene la acción a realizar.
   * @returns Promise<JSONResponse> - Promesa con la respuesta del servidor.
   */
  guardar(item: Tramite260603State, e: AccionBoton): Promise<JSONResponse> {
    const PAYLOAD = {
      solicitante: {
        rfc: 'AAL0409235E6',
        nombre: 'ACEROS ALVARADO S.A. DE C.V.',
        actividadEconomica: 'Fabricación de productos de hierro y acero',
        correoElectronico: 'contacto@acerosalvarado.com',
        domicilio: {
          pais: 'México',
          codigoPostal: '06700',
          estado: 'Ciudad de México',
          municipioAlcaldia: 'Cuauhtémoc',
          localidad: 'Centro',
          colonia: 'Roma Norte',
          calle: 'Av. Insurgentes Sur',
          numeroExterior: '123',
          numeroInterior: 'Piso 5, Oficina A',
          lada: '',
          telefono: '123456',
        },
      },
      solicitud: {
        discriminatorValue: 260603,
        declaracionesSeleccionadas: true,
        regimen: item.datosSolicitudFormState.regimen,
        aduanaAIFA: item.datosSolicitudFormState.aduana,
        informacionConfidencial: item.datosSolicitudFormState.publico === 'Si',
      },
      establecimiento: {
        razonSocial: item.datosSolicitudFormState.denominacionRazon,
        correoElectronico: item.datosSolicitudFormState.correoElectronico,
        domicilio: {
          codigoPostal: item.datosSolicitudFormState.codigoPostal,
          entidadFederativa: {
            clave: item.datosSolicitudFormState.estado
          },
          descripcionMunicipio: item.datosSolicitudFormState.municipioAlcaldia,
          informacionExtra: item.datosSolicitudFormState.localidad,
          descripcionColonia: item.datosSolicitudFormState.colonia,
          calle: item.datosSolicitudFormState.calle,
          lada: item.datosSolicitudFormState.lada,
          telefono: item.datosSolicitudFormState.telefono
        },
        avisoFuncionamiento: item.datosSolicitudFormState.aviso,
        numeroLicencia: item.datosSolicitudFormState.licenciaSanitaria,
        aduanas: item.datosSolicitudFormState.adunasDeEntradas
      },

      datosSCIAN: item.scianConfigDatos.map(datos => ({
        cveScian: datos.clave,
        descripcion: datos.descripcion,
        selected: true
      })),

      mercancias: (item.tablaMercanciasConfigDatos ?? []).map(mercancia => ({
        idMercancia: mercancia.id || null,
        idClasificacionProducto: mercancia.claveClasificacionProductoObj?.clave,
        nombreClasificacionProducto: mercancia.claveClasificacionProductoObj?.descripcion,

        ideSubClasificacionProducto: mercancia.especificarClasificacionObj?.clave,
        nombreSubClasificacionProducto: mercancia.especificarClasificacionObj?.descripcion,

        descDenominacionDistintiva: mercancia.marcaComercialODenominacionDistintiva,
        descDenominacionEspecifica: mercancia.denominacionComunInternacional,

        idTipoProductoTipoTramite: mercancia.tipoProductoObj?.clave,
        tipoProductoDescripcionOtros: mercancia.especifique,
        
        idEstadoFisico: mercancia.estadoFisicoObj?.clave,
        estadoFisicoDescripcionOtros: mercancia.especifiqueEstado,

        fraccionArancelaria: {
          clave: mercancia.fraccionArancelaria,
          descripcion: mercancia.descripcionFraccion
        },

        unidadMedidaComercial: {
          clave: mercancia.cantidadUMCObj?.clave,
          descripcion: mercancia.cantidadUMCObj?.descripcion
        },

        cantidadUMCConComas: mercancia.cantidadUmcValor,
        porcentajeConcentracion: mercancia.PorcentajeDeConcentracion,
        presentacion: mercancia.presentacion,
        fechaImpStrExp: mercancia.fechaDeMovimiento,
        nombreCortoPaisDestino: [mercancia.paisDestino],
        nombreCortoPaisOrigen: [mercancia.paisDeOrigen],
        nombreCortoPaisProcedencia: [mercancia.paisProcedencia],
        nombreCortoUsoEspecifico: [mercancia.usoEspecifico?.toString()],
      })),
      
      representanteLegal: {
        rfc: item.datosSolicitudFormState.representanteRfc,
        nombre: item.datosSolicitudFormState.representanteNombre,
        apellidoPaterno: item.datosSolicitudFormState.apellidoPaterno,
        apellidoMaterno: item.datosSolicitudFormState.apellidoMaterno
      },

      gridTerceros_TIPERS_FAC: item.facturadorTablaDatos.map(facturador => ({
        tipo_tercero: "TIPERS.FAB",
        ideTipoTercero: "",
        personaMoral: facturador.tipoPersona === "Moral" ? "1" : "0",
        denominacion: facturador.razonSocial,
        razonSocial: facturador.razonSocial,
        rfc: facturador.rfc,
        curp: facturador.curp,
        nombre: facturador.nombres,
        apellidoPaterno: facturador.primerApellido,
        apellidoMaterno: facturador.segundoApellido,
        telefono: facturador.telefono,
        correoElectronico: facturador.correoElectronico,
        numeroRegistro: "",

        domicilio: {
          pais: {
            clave: facturador.paisObj?.clave,
            nombre: facturador.paisObj?.descripcion
          },
          calle: facturador.calle,
          numeroExterior: facturador.numeroExterior,
          numeroInterior: facturador.numeroInterior,
          colonia: facturador.colonia,
          codigo_postal: facturador.codigoPostal,
          localidad: facturador.localidad,
          municipio: facturador.municipioAlcaldia,
          informacionExtra: "",
          codigoPostal: facturador.codigoPostal,
          descripcionColonia: facturador.colonia
        },

        idSolicitud: item.idSolicitud || 0
      }))
    };

    return new Promise((resolve, reject) => {
      let shouldNavigate = false;
      this.avisoImportacionService.guardarDatos(PAYLOAD).subscribe(
        (response) => {
          this.esFormaValido = false;

          if (response.codigo === '3') {
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
                this.tramite260603Store.setIdSolicitud(
                  API_RESPONSE.datos.id_solicitud
                );
              } else {
                this.tramite260603Store.setIdSolicitud(0);
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
   * Limpia los recursos y restablece el estado del store asociado al trámite 260603.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.tramite260603Store.resetStore();
  }
}
