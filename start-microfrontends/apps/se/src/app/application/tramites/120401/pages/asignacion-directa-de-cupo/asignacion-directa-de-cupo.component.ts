/**
 * Componente que gestiona la asignación directa de cupo.
 * Muestra una serie de pantallas de pasos y utiliza textos predefinidos.
 */
import { AVISO, FIRMAR, doDeepCopy, esValidObject } from '@libs/shared/data-access-user/src';

import { Component, EventEmitter, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
 
import { ASIGNACION } from '@ng-mf/data-access-user';

import { ListaPasosWizard } from '@ng-mf/data-access-user';

import { ConsultaioQuery, ConsultaioState,WizardService } from '@ng-mf/data-access-user';
import { DatosPasos, WizardComponent } from '@libs/shared/data-access-user/src';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { Tramite120401State, Tramite120401Store } from '../../estados/tramites/tramite120401.store';
import { AsignacionDirectaCupoPersonasFisicasPrimeraVezService } from '../../services/asignacion-directa-cupo-personas-fisicas-primera-vez.service';
import { DatosComponent } from '../datos/datos.component';

/**
 * Interface representing the action of a button.
 */
interface AccionBoton {
  /**
   * The action to be performed.
   */
  accion: string;
  /**
   * The value associated with the action.
   */
  valor: number;
}

/**
 * Componente que gestiona la asignación directa de cupo.
 * Muestra una serie de pantallas de pasos y utiliza textos predefinidos.
 */
@Component({
  selector: 'app-asignacion-directa-de-cupo',
  templateUrl: './asignacion-directa-de-cupo.component.html',
})
export class AsignacionDirectaDeCupoComponent implements OnDestroy, OnInit {
    /**
   * Reference to the WizardComponent.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

    /**
   * Obtener el valor de la instrucción e inicializar la variable
   */
  get TEXTOS_FIRMAR(): string {
    return `La solicitud ha quedado registrada con el número temporal [${this.guardarIdSolicitud}]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.`;
  }

  /**   * Reference to the AsignacionComponent.
   */
  @ViewChild(DatosComponent, { static: false }) datosComponent!: DatosComponent;

    /**
   * Servicio para gestión del wizard
   * @type {WizardService}
   * @description Servicio inyectado para manejar la lógica y el estado del componente wizard
   * @readonly
   */
  wizardService = inject(WizardService);
  
  /**
   * Lista de pasos para el asistente (wizard) de asignación directa.
   */
  pantallasPasos: ListaPasosWizard[] = ASIGNACION;

    /**
   * Estado actual de la consulta
   * @type {ConsultaioState}
   * @description Estado de consulta gestionado por el store ConsultaioQuery,
   * contiene información sobre el estado actual de las consultas
   */
  public consultaState!: ConsultaioState;
 
  /**
   * Índice actual del paso en el asistente.
   */
  indice: number = 1;

   /**
   * Identificador de la solicitud guardada
   * @type {number}
   * @description ID numérico asignado a la solicitud cuando se guarda exitosamente
   * @default 0
   */
  guardarIdSolicitud: number = 657646548;

 
  /**
   * Clase CSS para aplicar estilos específicos a los elementos de la interfaz.
   */
  class: string = 'alert-danger';

  /**
   * The data for the steps in the wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
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
   * Notificador para destrucción de componente
   * @type {Subject<void>}
   * @description Subject usado para completar observables y evitar memory leaks
   * al destruir el componente
   * @public
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la sección de carga de documentos
   * @type {boolean}
   * @description Controla si la sección de carga de documentos está activa y visible
   * @default true
   */
  seccionCargarDocumentos: boolean = true;

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
   * Emisor de eventos para carga de archivos
   * @type {EventEmitter<void>}
   * @description Evento que se emite para notificar a componentes hijo que deben
   * realizar una acción de carga de archivos
   */
  cargarArchivosEvento = new EventEmitter<void>();

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

  constructor(
    private consultaQuery: ConsultaioQuery,
    private service:AsignacionDirectaCupoPersonasFisicasPrimeraVezService,
    private tramite120401Store: Tramite120401Store,
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

  /** Variables para manejo de validaciones */
  mostrarMensajeValidacion: boolean = false;
  mensajeValidacion: string = '';
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  /**
   * @property {object} TEXTOS - Contiene constantes relacionadas con aviso y firma.
   * Se utiliza para manejar textos estáticos en la aplicación.
   */
  public TEXTOS = {
    AVISO,
    FIRMAR,
  };

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
    this.esFormaValido = false;
    if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
      if (this.indice === 1 && e.accion === 'cont') {
        const ISVALIDREPRE = this.datosComponent?.asignacionComponent?.representacionFederalComponent.validarFormulario();
        if (!ISVALIDREPRE) {
          this.esFormaValido = true;
          return;
        }
        const ISVALIDCANT = this.datosComponent?.asignacionComponent?.seleccionDelCupoComponent?.cantidadSolicitadaComponent?.validarFormulario();
        if (!ISVALIDCANT) {
          this.esFormaValido = true;
          return;
        }
      }
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
   * Guarda los datos de la solicitud en el servidor
   * @method guardar
   * @description Procesa y estructura los datos de la solicitud para enviarlos al servidor.
   * Transforma los datos del estado en objetos compatibles con la API
   * @param {Tramite120401State} data - Estado completo de la solicitud a guardar
   * @returns {Observable<unknown>} Observable con la respuesta del servidor
   * @public
   */
  public guardar(data:Tramite120401State): Observable<unknown> {
 
    const PAYLOAD = {
      "solicitante": {
        "nombre": "Empresa Ejemplo S.A. de C.V.",
        "rfc": "AAL0409235E6",
        "personaMoral": true,
        "domicilio": {
          "calle": "Av. Reforma",
          "numeroExterior": "123",
          "colonia": "Juárez",
          "codigoPostal": "06600",
          "entidadFederativa": {
            "cveEntidad": data.entidad,
          }
        },
        "telefono": "5512345678",
        "correoElectronico": "contacto@ejemplo.com"
      },
      "representacion_federal": {
        "cve_unidad_administrativa": data.representacion,
        "cve_entidad_federativa": data.entidad
      },
      "solicitud": {
        "solicitante": {
          "nombre": "Empresa Ejemplo S.A. de C.V.",
          "rfc": "AAL0409235E6",
          "personaMoral": true,
          "domicilio": {
            "calle": "Av. Reforma",
            "numeroExterior": "123",
            "colonia": "Juárez",
            "codigoPostal": "06600",
            "entidadFederativa": {
              "cveEntidad": data.entidad,
            }
          },
          "telefono": "5512345678",
          "correoElectronico": "contacto@ejemplo.com"
        },
        "seleccionDelCupo": {
          "cveRegimen": data.regimen,
          "idTratadoAcuerdo": data.tratado,
          "producto": data.nombreProducto,
          "subproducto": data.nombreSubproducto,
          "cuposDisponible": data.datos
        },
        "mecanismoAsignacion": {
          "idMecanismoAsignacion": typeof data.descriptionCupo?.idMecanismoAsignacion === 'string'
            ? Number(data.descriptionCupo?.idMecanismoAsignacion)
            : data.descriptionCupo?.idMecanismoAsignacion,
          "nombreMecanismoAsignacion": data.descriptionCupo?.mecanismoAsignacion,
          "ideTipoMecAsignacion": data.descriptionCupo?.ideTipoCupo,
          "fechaInicioVigencia": data.descriptionCupoDisponible?.mecanismoAsignacion?.fechaInicioVigencia,
          "fechaFinVigencia": data.descriptionCupoDisponible?.mecanismoAsignacion?.fechaFinVigencia,
          "fechaInicioRecepSolicitudes": data.descriptionCupoDisponible?.mecanismoAsignacion?.fechaInicioRecepSolicitudes,
          "fechaFinRecepSolicitudes": data.descriptionCupoDisponible?.mecanismoAsignacion?.fechaFinRecepSolicitudes,
          "activo": true,
          "cupo": {
            "idCupo": data.descriptionCupoDisponible?.mecanismoAsignacion?.cupo?.idCupo,
            "ideTipoCupo": data.descriptionCupoDisponible?.mecanismoAsignacion?.cupo?.ideTipoCupo,
            "producto": {
              "nombre": data.descriptionCupoDisponible?.mecanismoAsignacion?.cupo?.producto?.nombre
            },
            "unidadMedidaOficialCupo": {
              "descripcion": data.descriptionCupoDisponible?.descripcion
            },
            "regimen": data.descriptionCupoDisponible?.mecanismoAsignacion?.cupo?.regimen,
            "tratadoAcuerdo": {
              "nombre": "T-MEC"
            }
          },
          solicitarMercancia: data.descriptionCupoDisponible?.mecanismoAsignacion?.solicitarMercancia,
          "fraccionesPorExpedir": data.descriptionCupoDisponible?.mecanismoAsignacion?.fraccionesPorExpedir,
          "blnRequiereProductor": data.descriptionCupoDisponible?.mecanismoAsignacion?.blnRequiereProductor ?? false,
          "blnRequiereImportador": data.descriptionCupoDisponible?.mecanismoAsignacion?.blnRequiereImportador ?? false,
          "emitePEXIM": data.descriptionCupoDisponible?.mecanismoAsignacion?.emitePEXIM ?? false,
          "emiteCEROR": data.descriptionCupoDisponible?.mecanismoAsignacion?.emiteCEROR ?? false
        },
        "domicilio": {
          "calle": "Av. Reforma",
          "numeroExterior": "123",
          "colonia": "Juárez",
          "codigoPostal": "06600",
          "entidadFederativa": {
            "cveEntidad": data.entidad,
          }
        },
        "recif": typeof data.descriptionCupoDisponible?.recif === 'string' || data.descriptionCupoDisponible?.recif == null
          ? data.descriptionCupoDisponible?.recif
          : String(data.descriptionCupoDisponible?.recif ?? ''),
        cupos: data.datos,
        "operacion": "busqueda",
        entidadFederativa:{
          "cveEntidad": data.entidad,
        },
        "asignacion": {
          "cantidadSolicitada": data.cantidadSolicitada
        }
      }
    }
    
    return this.service.obtenerGuardarSolicitud(PAYLOAD).pipe(
      takeUntil(this.destroyNotifier$),
      map((response) => {
        if(esValidObject(response)) {
          const RESPONSE = doDeepCopy(response);
          this.tramite120401Store.setIdSolicitud(RESPONSE?.datos?.id_solicitud ?? 0);
          this.guardarIdSolicitud = RESPONSE?.datos.id_solicitud;
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
   * Valida los campos obligatorios del paso actual
   * @returns true si todos los campos obligatorios están completos, false en caso contrario
   */
  private validarPasoActual(): boolean {
    switch (this.indice) {
      case 1:
        return this.validarPasoUno();
      case 2:
        return this.validarPasoDos();
      case 3:
        return this.validarPasoTres();
      default:
        return true;
    }
  }

  /**
   * Valida los campos obligatorios del paso 1 (datos)
   * @returns true si todos los campos obligatorios están completos
   */
  private validarPasoUno(): boolean {
    const CAMPOSOBLIGATORIOS = this.verificarCamposObligatoriosPaso1();

    if (!CAMPOSOBLIGATORIOS.valido) {
      this.mensajeValidacion = `La Solicitud ha quedado registrada con el número temporal 202768273. Éste no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la Solicitud al momento en que ésta sea firmada.`;
      return false;
    }
    return true;
  }

  /**
   * Valida los campos obligatorios del paso 2
   * @returns true si todos los campos obligatorios están completos
   */
  private validarPasoDos(): boolean {
    const CAMPOSOBLIGATORIOS = this.verificarCamposObligatoriosPaso2();
    
    if (!CAMPOSOBLIGATORIOS.valido) {
      this.mensajeValidacion = `Para continuar es necesario completar los siguientes campos obligatorios: ${CAMPOSOBLIGATORIOS.camposFaltantes.join(', ')}`;
      return false;
    }
    return true;
  }

  /**
   * Valida los campos obligatorios del paso 3
   * @returns true si todos los campos obligatorios están completos
   */
  private validarPasoTres(): boolean {
    const CAMPOSOBLIGATORIOS = this.verificarCamposObligatoriosPaso3();

    if (!CAMPOSOBLIGATORIOS.valido) {
      this.mensajeValidacion = `Para continuar es necesario completar los siguientes campos obligatorios: ${CAMPOSOBLIGATORIOS.camposFaltantes.join(', ')}`;
      return false;
    }
    return true;
  }

  /**
   * Muestra el mensaje de validación con auto-close después de 5 segundos
   */
  private mostrarMensajeConAutoClose(): void {
    this.mostrarMensajeValidacion = true;
     if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    // Auto-close después de 5 segundos
    this.timeoutId = setTimeout(() => {
      this.cerrarMensajeValidacion();
    }, 5000);
  }

  /**
   * Verifica los campos obligatorios específicos del paso 1
   * @returns objeto con información de validación
   */
  private verificarCamposObligatoriosPaso1(): { valido: boolean; camposFaltantes: string[] } {
    const COMPOSFALTANTES: string[] = [];
  
    COMPOSFALTANTES.push('Campos obligatorios');
    
    return {
      valido: false, 
      camposFaltantes: COMPOSFALTANTES
    };
  }

  /**
   * Verifica los campos obligatorios específicos del paso 2
   * @returns objeto con información de validación
   */
  private verificarCamposObligatoriosPaso2(): { valido: boolean; camposFaltantes: string[] } {
    const COMPOSFALTANTES: string[] = [];
 const CAMPOEJEMPLO = this.obtenerValorCampo('campoEjemploPaso2');

    if (!CAMPOEJEMPLO || CAMPOEJEMPLO === '') {
      COMPOSFALTANTES.push('Campo requerido del paso 2');
    }
    
    return {
      valido: COMPOSFALTANTES.length === 0,
      camposFaltantes: COMPOSFALTANTES
    };
  }

  /**
   * Verifica los campos obligatorios específicos del paso 3
   * @returns objeto con información de validación
   */
  private verificarCamposObligatoriosPaso3(): { valido: boolean; camposFaltantes: string[] } {
    const COMPOSFALTANTES: string[] = [];
 const CAMPOEJEMPLO = this.obtenerValorCampo('campoEjemploPaso3');

    if (!CAMPOEJEMPLO || CAMPOEJEMPLO === '') {
      COMPOSFALTANTES.push('Campo requerido del paso 3');
    }
    
    return {
      valido: COMPOSFALTANTES.length === 0,
      camposFaltantes: COMPOSFALTANTES
    };
  }

  /**
   * Obtiene el valor de un campo específico del formulario
   * @param nombreCampo Nombre del campo a obtener
   * @returns Valor del campo o null si no existe
   */
  private obtenerValorCampo(nombreCampo: string): string | null {
   const ELEMENTO = document.querySelector(`[name="${nombreCampo}"]`) as HTMLInputElement;
    if (ELEMENTO) {
      return ELEMENTO.value;
    }
    
    return null;
  }

  /**
   * Cierra el mensaje de validación
   */
  public cerrarMensajeValidacion(): void {
    this.mostrarMensajeValidacion = false;
    this.mensajeValidacion = '';
    
    // Limpiar timeout si existe
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Cleanup al destruir el componente
   */
  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}