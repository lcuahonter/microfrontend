import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, DatosPasos, WizardService, doDeepCopy, esValidObject } from '@ng-mf/data-access-user';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { Tramite80306Store, TramiteState } from '../../estados/tramite80306.store';
import { EventEmitter } from '@angular/core';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { WizardComponent } from '@libs/shared/data-access-user/src';

/**
 * Texto de alerta para terceros.
 */
const TERCEROS_TEXTO_DE_ALERTA =
  'La solicitud ha quedado registrada con el número temporal 202757598 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.';
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
 * Componente que representa la página de solicitud.
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
})
/**
 * Componente que representa la página de solicitud.
 */
export class SolicitudPageComponent implements OnInit, OnDestroy{
    /**
   * Servicio para gestión del wizard
   * @type {WizardService}
   * @description Servicio inyectado para manejar la lógica y el estado del componente wizard
   * @readonly
   */
  wizardService = inject(WizardService);
    /**
   * Estado actual de la consulta
   * @type {ConsultaioState}
   * @description Estado de consulta gestionado por el store ConsultaioQuery,
   * contiene información sobre el estado actual de las consultas
   */
  public consultaState!: ConsultaioState;

  /**   * Texto de alerta para terceros.
   * @type {string}
   */
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;
  /**
   * Lista de pasos del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS;
  /**
   * Título principal de la página.
   */
  titulo: string = 'Registro de solicitud modificación programa IMMEX (Baja de servicios)';

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Referencia al componente del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

    /**
   * Identificador de la solicitud guardada
   * @type {number}
   * @description ID numérico asignado a la solicitud cuando se guarda exitosamente
   * @default 0
   */
  guardarIdSolicitud: number = 0;
  
  /**
   * Estado de la sección de carga de documentos
   * @type {boolean}
   * @description Controla si la sección de carga de documentos está activa y visible
   * @default true
   */
  seccionCargarDocumentos: boolean = true;

    /**
   * Emisor de eventos para carga de archivos
   * @type {EventEmitter<void>}
   * @description Evento que se emite para notificar a componentes hijo que deben
   * realizar una acción de carga de archivos
   */
  cargarArchivosEvento = new EventEmitter<void>();

    /**
   * Estado de progreso de carga de archivos
   * @type {boolean}
   * @description Indica si hay una operación de carga de archivos en progreso
   * @default true
   */
  cargaEnProgreso: boolean = true;

    /**
   * Estado de habilitación del botón de carga de archivos
   * @type {boolean}
   * @description Controla si el botón para cargar archivos está disponible para el usuario
   * @default false
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Datos de los pasos del asistente.
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

  constructor(private consultaQuery: ConsultaioQuery,
    private solicitudService: ImmerModificacionService,
    private tramite80306Store: Tramite80306Store,
  ) {}

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
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
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
              .subscribe((shouldNavigate: unknown) => {
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
          .subscribe((shouldNavigate: unknown) => {
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
  public guardar(data:TramiteState): Observable<unknown> {

    const PAYLOAD = {
      "tipoDeSolicitud": "guardar",
      "rol_capturista":"PersonaMoral",
      "cveRolCapturista":"PersonaMoral",
      "idSolicitud": 0,
      "idTipoTramite": 80306,
      "rfc": data.loginRfc,
      "cveUnidadAdministrativa": null,
      "costoTotal": null,
      "discriminatorValue": "80306",
      "certificadoSerialNumber": null,
      "certificado": data.certificacionSAT,
      "numeroFolioTramiteOriginal": null,
      "actividadSeleccionada": "string",
      "idProgramaAutorizado": data.selectedIdPrograma,
      "tipoPrograma": data.selectedTipoPrograma,
      "tipoModalidad": data.selectedFolioPrograma,
      "descripcionModalidad": data.selectedFolioPrograma,
      "folioPrograma": data.selectedFolioPrograma,
      "factorAmpliacion": 1.2,
      "montoImportaciones": 500000,
      "solicitante": {
          "solicitanteDomicilio": {},
          "rfc": data.loginRfc
      },
      "plantasIDC": data.datosOperacions,
      "fraccionesExportacion": data.datosExportacion,
      "fraccionesImportacion": data.datosImportacion,
      "empresaSubmanufacturera": data.datosEmpresas,
      "servicios": data.datosServicios
  }
    return this.solicitudService.guardar(PAYLOAD).pipe(
      takeUntil(this.destroyNotifier$),
      map((response) => {
        if(esValidObject(response)) {
          const RESPONSE = doDeepCopy(response);
          this.tramite80306Store.setIdSolicitud(RESPONSE?.datos?.id_solicitud ?? 0);
          this.guardarIdSolicitud = RESPONSE?.datos?.id_solicitud ?? 0;
          //this.wizardComponent.siguiente();
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
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
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
