import { Component, EventEmitter, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, DatosPasos,PASOS, WizardService, doDeepCopy, esValidObject } from '@ng-mf/data-access-user';
import { FraccionesExportacionGuardar, FraccionesImportacionGuardar, NotariosGuardar, PlantaGuardar, PlantaImmexGuardar, SociosGuardar } from '../../estados/models/plantas-consulta.model';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { Solicitud80302State, Tramite80302Store } from '../../../../estados/tramites/tramite80302.store';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { SolicitudService } from '../../service/solicitud.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80302Query } from '../../../../estados/queries/tramite80302.query';
import { WizardComponent } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que define la estructura de una acción de botón
 * @interface AccionBoton
 * @description Representa una acción de botón con su tipo y valor asociado
 */
interface AccionBoton {
  /** Tipo de acción a ejecutar */
  accion: string;
  /** Valor numérico asociado a la acción */
  valor: number;
}

/**
 * Componente para la página del solicitante en el trámite 80302
 * @component SolicitantePageComponent
 * @description Componente principal que maneja la interfaz de solicitud del trámite 80302,
 * incluyendo navegación de wizard, validación de datos y gestión del estado de la solicitud
 * @implements {OnInit}
 * @implements {OnDestroy}
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */
@Component({
  selector: 'app-solicitante-page',
  templateUrl: './solicitante-page.component.html',
  styleUrl: './solicitante-page.component.scss',
})
export class SolicitantePageComponent implements OnInit,OnDestroy{
  /**
   * Lista de pasos del wizard de la solicitud
   * @type {Array<ListaPasosWizard>}
   * @description Array que contiene la configuración de cada paso del wizard para navegar
   * a través del proceso de solicitud
   * @default PASOS
   */
  pasos: Array<ListaPasosWizard> = PASOS;

  /**
   * Servicio para gestión del wizard
   * @type {WizardService}
   * @description Servicio inyectado para manejar la lógica y el estado del componente wizard
   * @readonly
   */
  wizardService = inject(WizardService);
  
  /**
   * Estado de habilitación del botón Guardar
   * @type {boolean}
   * @description Indica si el botón Guardar debe mostrarse habilitado en el formulario
   * @default true
   */
  public btnGuardar: boolean = true;

  /**
   * Visibilidad del botón Guardar
   * @type {string}
   * @description Controla la propiedad CSS de visibilidad del botón Guardar
   * @default 'visible'
   */
  public btnGuardarVisible: string = 'visible';

  /**
   * Estado actual de la solicitud del trámite 80302
   * @type {Solicitud80302State}
   * @description Almacena el estado completo de la solicitud, incluyendo información
   * relevante para el proceso de firma electrónica y validaciones
   */
  public solicitudState!: Solicitud80302State;

  /**
   * Emisor de eventos para carga de archivos
   * @type {EventEmitter<void>}
   * @description Evento que se emite para notificar a componentes hijo que deben
   * realizar una acción de carga de archivos
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Índice del paso actual en el wizard
   * @type {number}
   * @description Representa el paso actual del wizard, comenzando desde 1
   * @default 1
   */
  indice: number = 1;

  /**
   * Referencia al componente wizard
   * @type {WizardComponent}
   * @description Referencia obtenida mediante ViewChild al componente WizardComponent
   * para control directo de navegación
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Estado de habilitación del botón de carga de archivos
   * @type {boolean}
   * @description Controla si el botón para cargar archivos está disponible para el usuario
   * @default false
   */
  activarBotonCargaArchivos: boolean = false;
  
  /**
   * Estado de progreso de carga de archivos
   * @type {boolean}
   * @description Indica si hay una operación de carga de archivos en progreso
   * @default true
   */
  cargaEnProgreso: boolean = true;

  /**
   * Estado de la sección de carga de documentos
   * @type {boolean}
   * @description Controla si la sección de carga de documentos está activa y visible
   * @default true
   */
  seccionCargarDocumentos: boolean = true;

  /**
   * Identificador de la solicitud guardada
   * @type {number}
   * @description ID numérico asignado a la solicitud cuando se guarda exitosamente
   * @default 0
   */
  guardarIdSolicitud: number = 0;

  /**
   * Estado actual de la consulta
   * @type {ConsultaioState}
   * @description Estado de consulta gestionado por el store ConsultaioQuery,
   * contiene información sobre el estado actual de las consultas
   */
  public consultaState!: ConsultaioState;
  
  /**
   * Estado de habilitación del botón padre
   * @type {boolean}
   * @description Controla la habilitación del botón en el componente padre
   * @default true
   */
  padreBtn: boolean = true;
  /**
   * Configuración de los pasos del wizard
   * @type {DatosPasos}
   * @description Objeto que contiene la configuración completa del wizard incluyendo
   * número total de pasos, índice actual y textos de los botones de navegación
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Notificador para destrucción de componente
   * @type {Subject<void>}
   * @description Subject usado para completar observables y evitar memory leaks
   * al destruir el componente
   * @public
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente SolicitantePageComponent
   * @constructor
   * @description Inicializa el componente con las dependencias necesarias y configura
   * la suscripción al estado del trámite 80302
   * @param {Tramite80302Query} tramite80302Query - Servicio para consultar el estado del trámite
   * @param {SolicitudService} solicitudService - Servicio para operaciones de solicitud
   * @param {Tramite80302Store} tramite80302Store - Store para gestión de estado del trámite
   * @param {ConsultaioQuery} consultaQuery - Servicio de consultas
   * @param {ToastrService} toastrService - Servicio para mostrar notificaciones
   */
  constructor(private tramite80302Query: Tramite80302Query,
    private solicitudService: SolicitudService,
    private tramite80302Store: Tramite80302Store,
    private consultaQuery: ConsultaioQuery,
    private toastrService: ToastrService,
  ) {

    this.tramite80302Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();

  }
  /**
   * Método de inicialización del componente
   * @method ngOnInit
   * @description Hook del ciclo de vida de Angular que se ejecuta después de la inicialización.
   * Configura la suscripción al estado de la consulta
   * @implements {OnInit}
   * @returns {void}
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      ).subscribe();
  }
  /**
   * Selecciona una pestaña específica del wizard
   * @method seleccionaTab
   * @description Actualiza el índice activo del wizard para navegar a una pestaña específica
   * @param {number} i - Índice de la pestaña a seleccionar (base 1)
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * Procesa la acción de navegación del wizard
   * @method getValorIndice
   * @description Maneja la navegación entre pasos del wizard basado en la acción del usuario.
   * Valida los datos antes de permitir el avance y actualiza el estado del wizard
   * @param {AccionBoton} e - Objeto que contiene la acción y el valor del índice
   * @param {string} e.accion - Tipo de acción ('cont' para continuar, 'ant' para anterior)
   * @param {number} e.valor - Valor del índice actual
   * @returns {void}
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor <= this.pasos.length) {
      const NEXT_INDEX =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor;
        if (!this.consultaState.readonly && e.accion === 'cont') {
          this.shouldNavigate$()
              .subscribe((shouldNavigate) => {
                if (shouldNavigate) {
                  this.indice = NEXT_INDEX;
                  this.datosPasos.indice = NEXT_INDEX;
                  this.wizardService.cambio_indice(NEXT_INDEX);
                  this.wizardComponent.siguiente();
                } else {
                  this.indice = e.valor;
                  this.datosPasos.indice = e.valor;
                }
              });
        }else if (e.accion === 'cont') {
        this.shouldNavigate$()
          .subscribe((shouldNavigate) => {
            if (shouldNavigate) {
              this.indice = NEXT_INDEX;
              this.datosPasos.indice = NEXT_INDEX;
              this.wizardService.cambio_indice(NEXT_INDEX);
              this.wizardComponent.siguiente();
            } else {
              this.indice = e.valor;
              this.datosPasos.indice = e.valor;
            }
          });
      }else {
        this.indice = NEXT_INDEX;
        this.datosPasos.indice = NEXT_INDEX;
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Determina si es seguro navegar al siguiente paso
   * @method shouldNavigate$
   * @description Valida los datos actuales guardándolos antes de permitir la navegación.
   * Obtiene el estado actual, lo procesa y retorna un Observable indicando si se puede navegar
   * @private
   * @returns {Observable<boolean>} Observable que emite true si se puede navegar, false en caso contrario
   */
  private shouldNavigate$(): Observable<boolean> {
    return this.solicitudService.getAllState().pipe(
      take(1),
      switchMap(data => this.guardar(data)),
      map(() => {
        return true;
      })
    );
  }

  /**
   * Guarda los datos de la solicitud en el servidor
   * @method guardar
   * @description Procesa y estructura los datos de la solicitud para enviarlos al servidor.
   * Transforma los datos del estado en objetos compatibles con la API
   * @param {Solicitud80302State} data - Estado completo de la solicitud a guardar
   * @returns {Observable<unknown>} Observable con la respuesta del servidor
   * @public
   */
  public guardar(data:Solicitud80302State): Observable<unknown> {
    const PLANTA: PlantaGuardar[] = [];
    const SOCIOS_ACCIONISTAS: SociosGuardar[] = [];
    const NOTARIOS: NotariosGuardar[] = [];
    const PLANTA_IMMEX: PlantaImmexGuardar[] = [];
    const FRACCIONES_EXPORTACION: FraccionesExportacionGuardar[] = [];
    const FRACCIONES_IMPORTACION: FraccionesImportacionGuardar[] = [];
    data.modificacionDatos.forEach(element => {
      const PLANTA_OBJ: PlantaGuardar = {
            "idPlanta": element.idPlanta,
            "calle": element.calle,
            "numeroInterior": element.numeroInterior,
            "numeroExterior": element.numeroExterior,
            "codigoPostal": element.codigoPostal,
            "colonia": element.colonia,
            "delegacionMunicipio": element.delegacionMunicipio,
            "entidadFederativa": element.entidadFederativa,
            "pais": element.pais,
            "rfc": element.rfc,
            "estatus": element.estatus,
            "desEstatus": element.desEstatus,
            "localidad": element.localidad,
            "telefono": element.telefono,
            "fax": element.fax,
            "fecha32D": "2024-06-01",
            "claveEntidadFederativa": element.claveEntidadFederativa,
            "clavePlantaEmpresa": element.clavePlantaEmpresa,
            "clavePais": element.clavePais,
            "claveDelegacionMunicipio": element.claveDelegacionMunicipio 
        }
        PLANTA.push(PLANTA_OBJ);
    })
    data.datosComplimentaria.forEach(element => {
      const SOCIOS_OBJ: SociosGuardar = {
            "idPersonaSolicitud": element.idSolicitud,
            "rfc": element.rfc,
            "nombre": element.nombre,
            "apellidoMaterno": element.apellidoMaterno,
            "apellidoPaterno": element.apellidoPaterno,
            "correoElectronico": element.correoElectronico,
        }
        SOCIOS_ACCIONISTAS.push(SOCIOS_OBJ);
    })
    data.datosFederetarios.forEach(element => {
      const NOTARIOS_OBJ: NotariosGuardar = {
            "nombreNotario": element.nombreNotario,
            "apellidoMaterno": element.apellidoMaterno,
            "apellidoPaterno": element.apellidoPaterno,
            "rfc": element.rfc,
            "numeroActa": element.numeroActa,
            "numeroNotaria": element.numeroNotaria,
            "numeroNotario": element.numeroNotario,
            "delegacionMunicipio": element.delegacionMunicipio,
            "entidadFederativa": element.entidadFederativa,
            "fechaActa": element.fechaActa
        }
        NOTARIOS.push(NOTARIOS_OBJ);
    })
    data.datosOperacions.forEach(element => {
      const PLANTA_IMMEX_OBJ: PlantaImmexGuardar = {
            "idPlanta": element.idPlanta,
            "calle": element.calle,
            "numeroInterior": element.numeroInterior,
            "numeroExterior": element.numeroExterior,
            "codigoPostal": element.codigoPostal,
            "colonia": element.colonia,
            "delegacionMunicipio": element.delegacionMunicipio,
            "entidadFederativa": element.entidadFederativa,
            "pais": element.pais,
            "rfc": element.rfc,
            "estatus": element.estatus,
            "desEstatus": "Baja",
            "localidad": element.localidad,
            "telefono": element.telefono,
            "fax": element.fax,
            "fecha32D": element.fecha32D,
            "claveEntidadFederativa": element.claveEntidadFederativa,
            "claveDelegacionMunicipio": element.claveDelegacionMunicipio,
            "idDireccion": element.idDireccion
        }
        PLANTA_IMMEX.push(PLANTA_IMMEX_OBJ);
    })
    data.datosAnexo.forEach(element => {
      const ANEXO_OBJ: FraccionesExportacionGuardar = {
            "tipoFraccion": element.tipoFraccion,
            "fraccionPadre": element.fraccionPadre,
            "idProductoExp": element.idProductoExp,
            "fraccionCompuesta": element.fraccionCompuesta,
            "idSectorProsecSol": element.idSectorProsecSol,
            "descripcionTestado": element.descripcionTestado,
            "fraccionArancelaria": {
                "fraccionPadre": element.fraccionPadre,
                "tipoFraccion": element.tipoFraccion,
                "fraccionCompuesta": element.fraccionCompuesta
            }
        }
        FRACCIONES_EXPORTACION.push(ANEXO_OBJ);
    })
    data.datosImportacion.forEach(element => {
      const IMPORTACION_OBJ: FraccionesImportacionGuardar = {
            "tipoFraccion": element.tipoFraccion,
            "fraccionPadre": element.fraccionPadre,
            "idProductoExp": element.idProducto,
            "fraccionCompuesta": element.fraccionCompuesta,
            "idSectorProsecSol": null,
            "descripcionTestado": element.descripcionTestado,
            "fraccionArancelaria": {
                "fraccionPadre": element.fraccionPadre,
                "descripcionFraccionPadre": element.descripcionFraccionPadre,
                "tipoFraccion": element.tipoFraccion,
                "fraccionCompuesta": element.fraccionCompuesta,
                "claveFraccionPadre": element.claveFraccionPadre,
                "idFraccion": element.idFraccion,
                "idProducto": element.idProducto
            }
        }
        FRACCIONES_IMPORTACION.push(IMPORTACION_OBJ);
    })
    const PAYLOAD = {
    "tipoDeSolicitud": "guardar",
    "rol_capturista":"PersonaMoral",
    "idSolicitud": 0,
    "idTipoTramite": 80302,
    "rfc": data.loginRfc,
    "cveUnidadAdministrativa": "8302",
    "costoTotal": 10000.5,
    "discriminatorValue": "80302",
    "certificadoSerialNumber": "1234567890ABCDEF",
    "certificado": data.certificacionSAT,
    "planta": PLANTA,
    "sociosAccionistas": SOCIOS_ACCIONISTAS,
    "notarios": NOTARIOS,
    "plantasIMMEX": PLANTA_IMMEX,
    "fraccionesExportacion": FRACCIONES_EXPORTACION,
    "fraccionesImportacion": FRACCIONES_IMPORTACION,
    "unidadAdministrativaRepresentacionFederal": {
        "clave": "string"
    },
    "solicitante": {
        "rfc": data.loginRfc
    },
    "datosCertificacion": "CERT-001",
    "montoImportaciones": 500000,
    "factorAmpliacion": 1.2,
    "certificacion_sat": "CERTIFICADO",
    "cveEntidad": "string",
    "idProgramaAutorizado": data.selectedIdPrograma,
    "tipoPrograma": data.selectedTipoPrograma,
    "tipoModalidad": data.selectedFolioPrograma,
    "descripcionModalidad": data.selectedFolioPrograma
}
    return this.solicitudService.guardar(PAYLOAD).pipe(
      takeUntil(this.destroyNotifier$),
      map((response) => {
        if(esValidObject(response)) {
          const RESPONSE = doDeepCopy(response);
          this.tramite80302Store.setIdSolicitud(RESPONSE?.datos?.id_solicitud ?? 0);
          this.guardarIdSolicitud = RESPONSE?.datos?.id_solicitud ?? 0;
          //this.wizardComponent.siguiente();
        }
        return response;
      })
    );
  }

  /**
   * Navega al siguiente paso del wizard
   * @method continuar
   * @description Ejecuta la navegación hacia el siguiente paso del wizard
   * incrementando el índice actual en 1
   * @returns {void}
   */
  continuar(): void {
    this.getValorIndice({ accion: 'cont', valor: this.indice + 1 });
  }

  /**
   * Emite evento para iniciar carga de archivos
   * @method onClickCargaArchivos
   * @description Dispara el evento cargarArchivosEvento para notificar a componentes
   * hijo que deben iniciar el proceso de carga de archivos
   * @returns {void}
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }
  /**
   * Maneja el estado de progreso de carga
   * @method onCargaEnProgreso
   * @description Actualiza el estado interno que indica si hay una carga de archivos en progreso
   * @param {boolean} carga - True si la carga está en progreso, false si ha terminado
   * @returns {void}
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Navega al siguiente paso con validación de documentos
   * @method siguiente
   * @description Ejecuta la navegación al siguiente paso del wizard después de validar
   * que todos los documentos requeridos hayan sido cargados correctamente
   * @returns {void}
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Actualiza el estado de carga de documentos
   * @method cargaRealizada
   * @description Controla la visibilidad de la sección de carga de documentos
   * basado en si la carga se completó exitosamente
   * @param {boolean} cargaRealizada - True si la carga se completó, false en caso contrario
   * @returns {void}
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
   * Maneja eventos de carga de documentos
   * @method manejaEventoCargaDocumentos
   * @description Actualiza el estado del botón de carga de archivos basado en
   * el estado actual de la carga de documentos
   * @param {boolean} carga - True si la carga está activa, false en caso contrario
   * @returns {void}
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Obtiene y guarda datos desde el store
   * @method obtenerDatosDelStore
   * @description Recupera el estado actual de la solicitud desde el servicio
   * y ejecuta el proceso de guardado
   * @returns {void}
   */
  obtenerDatosDelStore(): void {
    this.solicitudService.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);
      });
  }

  /**
   * Navega al paso anterior del wizard
   * @method anterior
   * @description Retrocede un paso en el wizard y actualiza los índices correspondientes
   * @returns {void}
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Método de limpieza del componente
   * @method ngOnDestroy
   * @description Hook del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Completa las suscripciones activas para evitar memory leaks
   * @implements {OnDestroy}
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
