import {
  AlertComponent,
  BtnContinuarComponent,
  ConsultaioQuery,
  ConsultaioState,
  DatosPasos,
  ListaPasosWizard,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  WizardComponent,
  WizardService,
  doDeepCopy,
  esValidObject,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FraccionTrade, Notarios, PlantaIDC } from '../../models/plantas-consulta.model';
import { Observable, Subject,map, switchMap, take, takeUntil } from 'rxjs';
import { PASOS, TITULOMENSAJE } from '../../constantes/modificacion.enum';
import { Tramite80308Store, TramiteState } from '../../estados/tramite80308.store';
import { ModificacionSolicitudeService } from '../../services/modificacion-solicitude.service';
import { PasoCuatroComponent } from '../paso-cuatro/paso-cuatro.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { Tramite80308Query } from '../../estados/tramite80308.query';

/**
 * Interfaz que define la estructura de una acción de botón.
 */
interface AccionBoton {
  /**
   * La acción que se realizará.
   */
  accion: string;

  /**
   * El valor asociado a la acción.
   */
  valor: number;
}

/**
 * @component
 * @name SolicitudPageComponent
 * @description Componente de la página de solicitud
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
  host: {},
  imports: [
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoCuatroComponent,
    BtnContinuarComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    AlertComponent,
  ],
  standalone: true
})
/**
 * Componente que representa la página de solicitud.
 */
/**
 * @class SolicitudPageComponent
 * @implements OnDestroy
 * @implements OnInit
 */
export class SolicitudPageComponent implements OnDestroy, OnInit {

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  /**
   * @property {Subject<void>} destroyNotifier$
   */
  destroyNotifier$: Subject<void> = new Subject();

      /**
   * Obtener el valor de la instrucción e inicializar la variable
   */
  /**
   * @readonly
   */
  get TEXTOS_FIRMAR(): string {
    return `La solicitud ha quedado registrada con el número temporal [${this.guardarIdSolicitud}]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.`;
  }

    /**
   * Servicio para gestión del wizard
   * @type {WizardService}
   * @description Servicio inyectado para manejar la lógica y el estado del componente wizard
   * @readonly
   */
  /**
   * @readonly
   */
  wizardService = inject(WizardService);

  /**
   * Lista de pasos del asistente.
   */
  /**
   * @property {ListaPasosWizard[]} pasos
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual.
   */
  /**
   * @property {number} indice
   */
  indice: number = 1;

    /**
   * Estado de la sección de carga de documentos
   * @type {boolean}
   * @description Controla si la sección de carga de documentos está activa y visible
   * @default true
   */
  /**
   * @property {boolean} seccionCargarDocumentos
   */
  seccionCargarDocumentos: boolean = true;

   /**
   * Estado de habilitación del botón de carga de archivos
   * @type {boolean}
   * @description Controla si el botón para cargar archivos está disponible para el usuario
   * @default false
   */
  /**
   * @property {boolean} activarBotonCargaArchivos
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Estado de progreso de carga de archivos
   * @type {boolean}
   * @description Indica si hay una operación de carga de archivos en progreso
   * @default true
   */
  /**
   * @property {boolean} cargaEnProgreso
   */
  cargaEnProgreso: boolean = true;

   /**
   * Identificador de la solicitud guardada
   * @type {number}
   * @description ID numérico asignado a la solicitud cuando se guarda exitosamente
   * @default 0
   */
  /**
   * @property {number} guardarIdSolicitud
   */
  guardarIdSolicitud: number = 0;

  /**
   * Emisor de eventos para carga de archivos
   * @type {EventEmitter<void>}
   * @description Evento que se emite para notificar a componentes hijo que deben
   * realizar una acción de carga de archivos
   */
  /**
   * @property {EventEmitter<void>} cargarArchivosEvento
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Referencia al componente del asistente.
   */
  /**
   * @property {WizardComponent} wizardComponent
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos de los pasos del asistente.
   */
  /**
   * @property {DatosPasos} datosPasos
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Título del mensaje principal.
   * @property {string | null} tituloMensaje - Título que se muestra en la parte superior del formulario.
   */
  /**
   * @property {string} tituloMensaje
   */
  tituloMensaje: string = TITULOMENSAJE;

    /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  /**
   * @property {boolean} esFormaValido
   */
  esFormaValido: boolean = false;

      /**
   * Estado actual de la consulta
   * @type {ConsultaioState}
   * @description Estado de consulta gestionado por el store ConsultaioQuery,
   * contiene información sobre el estado actual de las consultas
   */
  /**
   * @property {ConsultaioState} consultaState
   */
  public consultaState!: ConsultaioState;

  /**
   * @constructor
   */
  constructor(private tramiteQuery: Tramite80308Query, private seccion: SeccionLibStore,
    public consultaQuery: ConsultaioQuery, private service: ModificacionSolicitudeService,
    private tramite80308Store: Tramite80308Store
  ) {

    // this.tramiteQuery.FormaValida$.pipe(takeUntil(this.destroyNotifier$)).subscribe(res => {
    //   this.seccion.establecerSeccion([true]);
    //   this.seccion.establecerFormaValida([res]);
    // })
  }

     /**
   * Método de inicialización del componente
   * @method ngOnInit
   * @description Hook del ciclo de vida de Angular que se ejecuta después de la inicialización.
   * Configura la suscripción al estado de la consulta
   * @implements {OnInit}
   * @returns {void}
   */
  /**
   * @method ngOnInit
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
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  /**
   * @method seleccionaTab
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
  /**
   * @method getValorIndice
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
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
  /**
   * @method shouldNavigate$
   * @private
   */
  private shouldNavigate$(): Observable<boolean> {
    return this.service.getAllState().pipe(
      take(1),
      switchMap(data => 
        this.guardar(data)
    ),
      map(() => {
        return true;
      })
    );
  }

  /**
   * @method guardar
   */
  public guardar(data:TramiteState): Observable<unknown> {
    const NOTARIOS: Notarios[] = []
    data.datosFederetarios?.forEach(nota => {
      const NOTARIO_OBJ = {
            "apellidoPrimer": nota.apellidoPrimer || "",
            "apellidoSegundo": nota.apellidoSegundo || "",
            "numeroActa": nota.numeroActa || "",
            "fetchActa": nota.fetchActa || "",
            "numeroNotaria": nota.numeroNotaria || "",
            "municipioDelegacion": nota.municipioDelegacion || "",
            "estado": nota.estado || "",
            "nombreNotarios": nota.nombre || "",
        }
        NOTARIOS.push(NOTARIO_OBJ);
    })
    const PLANTAS:PlantaIDC[] = []
    data.datosOperaciones?.forEach(op => {
      const PLANTA_OBJ = {
              "idPlanta": op.idPlanta || "",
              "calle": op.calle || "",
              "numeroInterior": op.numeroInterior || "",
              "numeroExterior": op.numeroExterior || "",
              "codigoPostal": op.codigoPostal || "",
              "colonia": op.colonia || null,
              "delegacionMunicipio": op.delegacionMunicipio || "",
              "entidadFederativa": op.entidadFederativa || "",
              "pais": op.pais || "",
              "rfc": op.rfc || "",
              "domicilioFiscal": null,
              "razonSocial": op.razonSocial || "",
              "claveDelegacionMunicipio": null,
              "estatus": op.estatus,
              "desEstatus": op.desEstatus,
              "localidad": op.localidad || "",
              "telefono": op.telefono || "",
              "idSolicitud": typeof op.idSolicitud === 'number' ? op.idSolicitud : (op.idSolicitud ? Number(op.idSolicitud) : undefined),
              "fax": null,
              "idDireccion": null,
              "testadoP": 0,
          }
          PLANTAS.push(PLANTA_OBJ);
      
    })
    const SUBMANUFACTURERA: PlantaIDC[] = []
    data.datosEmpresas?.forEach(emp => {
      const PLANTA_OBJ = {
              "calle": emp.calle || "",
              "numeroInterior": emp.numeroInterior || "",
              "numeroExterior": emp.numeroExterior || "",
              "codigoPostal": emp.codigoPostal || "",
              "colonia": emp.colonia || null,
              "entidadFederativa": emp.entidadFederativa || "",
              "pais": emp.pais || "",
              "rfc": emp.rfc || "",
              "domicilioFiscal": emp.domicilioFiscal || null,
              "localidad": emp.localidad || "",
              "telefono": emp.telefono || "",
          }
          SUBMANUFACTURERA.push(PLANTA_OBJ);
    })
    const EMPRASA_SUBMANUFACTURERA: PlantaIDC[] = []
    data.datosPlantas?.forEach(pla => {
      const PLANTA_OBJ = {
              "calle": pla.calle || "",
              "numeroInterior": pla.numeroInterior || "",
              "numeroExterior": pla.numeroExterior || "",
              "codigoPostal": pla.codigoPostal || "",
              "colonia": pla.colonia || null,
              "delegacionMunicipio": pla.municipioDelegacion || "",
              "pais": pla.pais || "",
              "rfc": pla.rfc || "",
              "domicilioFiscal": pla.fiscalSolicitante || null,
              "razonSocial": pla.razonSocial || "",
              
              "estatus": pla.estatus,
              "desEstatus": pla.desEstatus,
              "localidad": pla.localidad || "",
          }
          EMPRASA_SUBMANUFACTURERA.push(PLANTA_OBJ);
    })
    const EXPORTACION:FraccionTrade[] = [];
    data.datosExportacion?.forEach(exp => {
      const FRACCION_OBJ = {
        "tipoFraccion": exp.tipoFraccion,
        "fraccionArancelaria": {
            
            "descripcionFraccionPadre": exp.descripcion,
            "tipoFraccion": exp.fraccionArancelariaExportacion,
            "fraccionCompuesta": exp.fraccionArancelariaImportacion,
            "claveFraccionPadre": exp.valoresAnteriores,
        }
      }
      EXPORTACION.push(FRACCION_OBJ);
    })
    const PLANTAS_SUBMANUFACTURERA: FraccionTrade[] = [];
    data.datosImportacion?.forEach(imp => {
      const PLANTA_OBJ = {
          "tipoFraccion": imp.tipoFraccion,
          "fraccionArancelaria": {
              "descripcionFraccionPadre": imp.descripcion,
              "tipoFraccion": imp.fraccionArancelariaExportacion,
              "fraccionCompuesta": imp.fraccionArancelariaImportacion,
              "claveFraccionPadre": imp.valoresAnteriores,
          }
        }
        PLANTAS_SUBMANUFACTURERA.push(PLANTA_OBJ);
    })
    const PAYLOAD = {
      "tipoDeSolicitud": "guardar",
      "idSolicitud": 0,
      "idTipoTramite": 80308,
      "rfc": "AAL0409235E6",
      "cveUnidadAdministrativa": "8308",
      "costoTotal": 10000.5,
      "discriminatorValue": "80308",
      "certificadoSerialNumber": "1234567890ABCDEF",
      "certificado": "certificacionSAT",
      "solicitud": {
          "modalidad": "",
          "booleanGenerico": true,
          "descripcionSistemasMedicion": "Web",
          "descripcionLugarEmbarque": "Localisation",
          "numeroPermiso": "SI",
          "fechaOperacion": "2025-09-19",
          "nomOficialAutorizado": ""
      },
      "sociosAccionistas": data?.datosSocios || [],
      "notarios": NOTARIOS,
      "plantasIDC": PLANTAS,
      "empresaSubmanufacturera": SUBMANUFACTURERA,
      "plantasSubmanufacturera": EMPRASA_SUBMANUFACTURERA,
      "fraccionesExportacion": EXPORTACION,
      "fraccionesImportacion": PLANTAS_SUBMANUFACTURERA,
      "servicios": [],
      "unidadAdministrativaRepresentacionFederal": {
          "clave": ""
      },
    "domicilio": {
          "calle": data.domicilios[0]?.calle || "",
          "numeroExterior": data.domicilios[0]?.numeroExterior || "",
          "numeroInterior": data.domicilios[0]?.numeroInterior || "",
          "codigoPostal": data.domicilios[0]?.codigoPostal || "",
          "clave": data.domicilios[0]?.entidadFederativa || "",
          "cveLocalidad": data.domicilios[0]?.localidad || "",
          "cveDelegMun": data.domicilios[0]?.delegacionMunicipio || "",
          "cveEntidad": data.domicilios[0]?.entidadFederativa || "",
          "cvePais": data.domicilios[0]?.pais || "",
          "telefono": data.domicilios[0]?.telefono || "",
          "municipio": data.domicilios[0]?.delegacionMunicipio || "",
          "colonia": data.domicilios[0]?.colonia || "",
          "telefonos": data.domicilios[0]?.telefono || "",
      },
      "solicitante": {
          "rfc": "AAL0409235E6"
      },
      "datosCertificacion": "CERT-001",
      "montoImportaciones": 500000,
      "factorAmpliacion": 1.2,
      "certificacion_sat": data?.certificacionSAT || "",
      "cveEntidad": typeof data?.estado === 'string' ? data.estado : (data?.estado?.clave || ""),
      "idProgramaAutorizado": 122280,
      "tipoPrograma": "TICPSE.IMMEX",
      "tipoModalidad": "Alta",
      "descripcionModalidad": "Domicilio de una planta"
  }
    return this.service.guardarDatos80308(PAYLOAD).pipe(
      takeUntil(this.destroyNotifier$),
      map((response) => {
        if(esValidObject(response)) {
          const RESPONSE = doDeepCopy(response);
          this.tramite80308Store.setIdSolicitud(RESPONSE?.datos?.id_solicitud ?? 0);
          this.guardarIdSolicitud = RESPONSE?.datos?.id_solicitud ?? 0;
        }
        return response;
      })
    );
  }
 
   /**
   * Navega al paso anterior del wizard
   * @method anterior
   * @description Retrocede un paso en el wizard y actualiza los índices correspondientes
   * @returns {void}
   */
  /**
   * @method anterior
   */
  anterior(): void {
    this.wizardComponent.atras();
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
  /**
   * @method cargaRealizada
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }
  
   /**
   * Emite evento para iniciar carga de archivos
   * @method onClickCargaArchivos
   * @description Dispara el evento cargarArchivosEvento para notificar a componentes
   * hijo que deben iniciar el proceso de carga de archivos
   * @returns {void}
   */
  /**
   * @method onClickCargaArchivos
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Navega al siguiente paso con validación de documentos
   * @method siguiente
   * @description Ejecuta la navegación al siguiente paso del wizard después de validar
   * que todos los documentos requeridos hayan sido cargados correctamente
   * @returns {void}
   */
  /**
   * @method siguiente
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

   /**
   * Maneja eventos de carga de documentos
   * @method manejaEventoCargaDocumentos
   * @description Actualiza el estado del botón de carga de archivos basado en
   * el estado actual de la carga de documentos
   * @param {boolean} carga - True si la carga está activa, false en caso contrario
   * @returns {void}
   */
  /**
   * @method manejaEventoCargaDocumentos
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

    /**
   * Maneja el estado de progreso de carga
   * @method onCargaEnProgreso
   * @description Actualiza el estado interno que indica si hay una carga de archivos en progreso
   * @param {boolean} carga - True si la carga está en progreso, false si ha terminado
   * @returns {void}
   */
  /**
   * @method onCargaEnProgreso
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }


  /**
   * Obtiene el título para cada página según el índice.
   * @method obtenerNombreDelTítulo
   * @param {number} valor - El índice de la página.
   * @returns {void}
   */
  /**
   * @method obtenerNombreDelTítulo
   */
  obtenerNombreDelTítulo(valor: number): void {
    switch (valor) {
      case 1:
        this.tituloMensaje = TITULOMENSAJE;
        break;
      case 2:
        this.tituloMensaje = this.pasos[1].titulo;
        break;
      case 3:
        this.tituloMensaje = this.pasos[2].titulo;
        break;
      case 4:
        this.tituloMensaje = this.pasos[3].titulo;
        break;
      default:
        this.tituloMensaje = TITULOMENSAJE;
    }
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Utiliza un Subject para notificar a todos los observables suscritos que deben completarse.
   * Esto ayuda a evitar posibles fugas de memoria al completar el Subject y finalizar las suscripciones.
   */
  /**
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
