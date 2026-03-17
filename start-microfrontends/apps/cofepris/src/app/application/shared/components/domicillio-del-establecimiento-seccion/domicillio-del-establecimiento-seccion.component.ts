/**
 * compodoc
 * @fileoverview Componente `DomicillioDelEstablecimientoSeccionComponent`
 * Este componente gestiona el formulario relacionado con el domicilio del establecimiento,
 * incluyendo datos como el estado, código postal, municipio, localidad, colonia, calle, teléfono,
 * y otros datos relacionados. También permite la gestión de datos SCIAN y la interacción con un modal.
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  Notificacion,
  NotificacionesComponent,
  ScianDatos,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  DatosDelSolicituteSeccionState,
  DatosDelSolicituteSeccionStateStore,
} from '../../estados/stores/datos-del-solicitute-seccion.store';
import { DatosDelSolicituteSeccionQuery } from '../../estados/queries/datos-del-solicitute-seccion.query';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EstablecimientoService } from '../../services/establecimiento.service';

import { Subject, map, takeUntil } from 'rxjs';
import { ScianModel } from '../../models/datos-de-la-solicitud.model';

import { Modal } from 'bootstrap';
import { SCIAN_TABLE_CONFIG } from '../../constantes/aviso-de-funcionamiento.enum';

import { CatalogoServices, ConsultaioQuery } from '@ng-mf/data-access-user';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
/*
 * @description
 * Componente que gestiona el domicilio del establecimiento.
 */
@Component({
  selector: 'app-domicillio-del-establecimiento-seccion',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    FormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    TooltipModule,
    NotificacionesComponent
  ],
  templateUrl: './domicillio-del-establecimiento-seccion.component.html',
  styleUrl: './domicillio-del-establecimiento-seccion.component.scss',
})
export class DomicillioDelEstablecimientoSeccionComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  /**
   * Referencia al elemento del modal del establecimiento.
   */
  @ViewChild('establecimientoModal', { static: false })
  establecimientoModal!: ElementRef;
    /*
     * Lista de filas seleccionadas del componente tabla de SCIAN.
     * Se utiliza para manejar la selección de filas en la tabla de SCIAN.
     */
    selectedRowsScian: ScianDatos[] = [];

  /**
   * Formulario para gestionar los datos SCIAN.
   */
  scianForm!: FormGroup;

  /**
   * Enumeración para la selección de tablas.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Indica si el formulario debe estar deshabilitado.
   */
  formularioDeshabilitado: boolean = false;

  /**
   * Estado de la solicitud de la sección.
   */
  public solicitudState!: DatosDelSolicituteSeccionState;

  /** Sujeto que emite una notificación al destruir el componente,  
 *  utilizado para completar observables y prevenir fugas de memoria. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Código del trámite recibido desde el componente padre,  
 *  utilizado para controlar la lógica y los datos que se muestran. */
  private _tramites: string = '';
  @Input() set tramites(value: string) {
    this._tramites = value;
    if (value && value !== 'undefined' && value !== 'null' && !isNaN(Number(value))) {
      this.obtenerEstado();
      this.obtenerRegimenDestinara();
      this.obtenerAduanaSalida();
      this.obtenerScian();
      this.obtenerScianDescripcion();
    } else {
      this.estadoDomicillio = [];
      this.regimenQueDestinara = [];
      this.aduanaDeSalida = [];
      this.scianJson = [];
      this.descripcionScianJson = [];
    }
  }
  get tramites(): string {
    return this._tramites;
  }

   /**
     * Controla la visibilidad del modal de alerta.
     * @property {boolean} mostrarAlerta
     */
    public mostrarAlerta: boolean = false;

    /** Nueva notificación relacionada con el RFC. */
    public seleccionarFilaNotificacion!: Notificacion;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para inicializar formularios reactivos.
   * @param establecimientoService Servicio para obtener datos relacionados con el establecimiento.
   * @param domicilioEstablecimientoStore Store para gestionar el estado del domicilio del establecimiento.
   * @param domicilioEstablecimientoQuery Query para obtener el estado inicial del domicilio del establecimiento.
   * @param consultaioQuery Query para obtener el estado de consulta.
   */
  constructor(
    private fb: FormBuilder,
    private establecimientoService: EstablecimientoService,
    private domicilioEstablecimientoStore: DatosDelSolicituteSeccionStateStore,
    private domicilioEstablecimientoQuery: DatosDelSolicituteSeccionQuery,
    private consultaioQuery: ConsultaioQuery,
    private catalogoService: CatalogoServices
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Subject utilizado para destruir las suscripciones y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

  /**
   * Instancia del modal de Bootstrap.
   */
  modalInstance!: Modal;

  /**
   * Datos del catálogo de régimen al que se destinará la mercancía.
   */
  regimenQueDestinara: Catalogo[] = [];

  /**
   * Datos del catálogo de aduanas de salida.
   */
  aduanaDeSalida: Catalogo[] = [];

  /**
   * Formulario para gestionar los datos del domicilio del establecimiento.
   */
  domicilioEstablecimiento!: FormGroup;

  /**
   * Datos del catálogo de estados.
   */
  estadoJson: Catalogo[] = [];

  /**
   * Datos del catálogo de estados.
   */
  estadoDomicillio: Catalogo[] = [];

  /**
   * Datos SCIAN agregados por el usuario.
   */
  personaparas: ScianModel[] = [];

  /**
   * Datos del catálogo SCIAN.
   */
  scianJson: Catalogo[] = [];

  @Input() tramiteID!: string;

  /**
   * Almacena la lista de entradas del catálogo SCIAN como un arreglo de objetos `Catalogo`.
   * Este arreglo se utiliza para representar las descripciones SCIAN relevantes para el componente.
   */
  descripcionScianJson: Catalogo[] = [];

  /**
   * Configuración de las columnas de la tabla dinámica para los datos SCIAN.
   */
  configuracionTabla: ConfiguracionColumna<ScianModel>[] = SCIAN_TABLE_CONFIG;

  /**
   * Índice seleccionado en la tabla SCIAN.
   */
  selectedIndex: number = -1;

  /**
   * Ciclo de vida `AfterViewInit`.
   * Inicializa la instancia del modal de Bootstrap.
   */
  ngAfterViewInit(): void {
    if (this.establecimientoModal) {
      this.modalInstance = new Modal(this.establecimientoModal.nativeElement);
    }
  }

  /**
   * Ciclo de vida `OnInit`.
   * Inicializa los formularios y carga los datos iniciales.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }
  /**
   * Maneja el cambio de valor en un control del formulario.
   * @param controlName Nombre del control que cambió.
   */
  onControlChange(controlName: string): void {
  if (controlName === 'scian') {
    const CLAVE_DATOS = this.scianForm.get('scian')?.value;

    const SCIAN_DATOS = this.scianJson.find(item => item.clave === CLAVE_DATOS);

    this.scianForm.get('descripcionScian')?.setValue(SCIAN_DATOS?.descripcion || '');

    this.descripcionScianJson = SCIAN_DATOS
      ? [{ id: SCIAN_DATOS.id, clave: SCIAN_DATOS.clave, descripcion: SCIAN_DATOS.descripcion }]
      : [];

    this.scianForm.updateValueAndValidity();

  this.domicilioEstablecimientoStore.update({
    scian: CLAVE_DATOS,
    descripcionScian: SCIAN_DATOS?.descripcion || ''
  });
  } else {
    const UPDATED_VALUE = {
      [controlName]: this.domicilioEstablecimiento.get(controlName)?.value,
    };
    this.domicilioEstablecimientoStore.update(UPDATED_VALUE);
  }
}

  /**
   * Carga los datos del catálogo de régimen.
   */
  loadRegimen(): void {
    this.establecimientoService
      .getRegimenData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.regimenQueDestinara = resp;
      });
  }

  /**
   * Carga los datos del catálogo de aduanas de salida.
   */
  loadAduanaDeSalida(): void {
    this.establecimientoService
      .getAduanaDeSalidaData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.aduanaDeSalida = resp;
      });
  }

  /**
   * Carga los datos del catálogo de estados.
   */
  loadEstado(): void {
    this.establecimientoService
      .getEstadoData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.estadoJson = resp;
      });
  }

  /**
   * Carga los datos del catálogo SCIAN.
   */
  loadScian(): void {
    this.establecimientoService
      .getSciandata(this.tramiteID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.scianJson = resp;
      });
  }

  /**
   * Carga los datos de descripción SCIAN (Sistema de Clasificación Industrial de América del Norte)
   * llamando al establecimientoService y asigna el resultado a `descripcionScianJson`.
   * La suscripción se cancela automáticamente cuando el componente es destruido.
   *
   * @remarks
   * Este método utiliza el operador `takeUntil` de RxJS para gestionar el ciclo de vida de la suscripción.
   *
   * @returns void
   */
  loadScianDescription(): void {
    this.establecimientoService
      .getDescripcionScianData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.descripcionScianJson = resp;
      });
  }

  /**
   * Abre el modal SCIAN.
   */
  openScianModal(): void {
    this.modalInstance.show();
  }

  /**
   * Cierra el modal SCIAN.
   */
  closeScianModal(): void {
    this.modalInstance.hide();
  }

  /**
   * Limpia el formulario SCIAN.
   */
  limpiarScianForm(): void {
    this.scianForm.reset();
  }

  /**
   * Guarda un nuevo dato SCIAN y lo agrega a la tabla.
   */
  guardarScian(): void {
    if (!this.scianForm.get('scian')?.value) {
      this.scianForm.markAllAsTouched();
      return;
    }
    const CLAVE_SELECCIONADA = this.scianForm.get('scian')?.value;
    const SCIAN_SELECCIONADA = this.scianJson.find(item => item.clave === CLAVE_SELECCIONADA);

    if (SCIAN_SELECCIONADA) {
      const SCIAN_DATA: ScianModel = {
        claveScian: SCIAN_SELECCIONADA.clave ?? '',
        descripcionScian: SCIAN_SELECCIONADA.descripcion,
      };
      this.personaparas = [...this.personaparas, SCIAN_DATA];
    }

    this.scianForm.reset();

    this.closeScianModal();
  }

  /**
   * Verifica si el checkbox de aviso de funcionamiento está marcado.
   * @returns `true` si está marcado, de lo contrario `false`.
   */
  isCheckboxChecked(): boolean {
    return this.domicilioEstablecimiento.get('avisoDeFuncionamiento')?.value;
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.formularioDeshabilitado) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.formularioDeshabilitado) {
      this.domicilioEstablecimiento.disable();
    } else {
      this.domicilioEstablecimiento.enable();
    }
  }

  /**
   * Inicializa el formulario reactivo para el domicilio del establecimiento y el formulario SCIAN.
   * También carga el estado inicial del formulario desde el store.
   */
  inicializarFormulario(): void {
    this.domicilioEstablecimiento = this.fb.group({
      establecimientoDomicilioEstado: ['', Validators.required],
      establecimientoDomicilioCodigoPostal: ['', Validators.required],
      establecimientoMunicipioYAlcaldia: ['', Validators.required],
      establecimientoDomicilioLocalidad: ['', Validators.required],
      establecimientoDomicilioColonia: ['', Validators.required],
      establecimientoDomicilioCalle: ['', Validators.required],
      establecimientoDomicilioTelefono: ['', Validators.required],
      establecimientoDomicilioLada: ['', Validators.required],
      nombreDelProfesionalResponsable: [''],
      rfcDelProfesionalResponsable: [''],
      noDeLicenciaSanitaria: [''],
      regimenAlQueSeDestinaraLaMercancía: ['', Validators.required],
      aduanaDeSalida: ['', Validators.required],
      avisoDeFuncionamiento: [false],
      noDeLicenciaSanitariaObservaciones: [''],
    });

    this.scianForm = this.fb.group({
      scian: ['', Validators.required],
      descripcionScian: ['', Validators.required],
    });

    this.domicilioEstablecimientoQuery
      .select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.domicilioEstablecimiento.patchValue(state, { emitEvent: false });
      });
  }

  /**
   * Maneja el evento de cambio en el campo de RFC del representante.
   * Llama a la función para buscar el representante por RFC.
   */
  hasError(controlName: string, errorName: string): boolean {
    return Boolean(
      this.domicilioEstablecimiento.get(controlName)?.touched &&
        this.domicilioEstablecimiento.get(controlName)?.hasError(errorName)
    );
  }

  /**
   * Elimina los datos de la licencia sanitaria (limpia los campos).
   */
  eliminarLicenciaSanitaria(): void {
    // Limpia el campo del número de licencia
    this.domicilioEstablecimiento.get('noDeLicenciaSanitaria')?.setValue('');

    // Limpia el área de texto de observaciones
    this.domicilioEstablecimiento
      .get('noDeLicenciaSanitariaObservaciones')
      ?.setValue('');

    // Actualiza el store con los valores limpiados
    this.domicilioEstablecimientoStore.update({
      noDeLicenciaSanitaria: '',
      noDeLicenciaSanitariaObservaciones: '',
    });

    // Dispara los eventos de cambio
    this.onControlChange('noDeLicenciaSanitaria');
    this.onControlChange('noDeLicenciaSanitariaObservaciones');
  }

  /** Obtiene el catálogo de estados según el trámite actual,  
 *  asignando los datos recibidos a la propiedad `estadoDomicillio`. */
    obtenerEstado(): void {
      const TRAMITE = (this.tramites !== undefined && this.tramites !== null) ? String(this.tramites) : '';
      if (!TRAMITE || TRAMITE === 'undefined' || TRAMITE === 'null' || isNaN(Number(TRAMITE))) {
        this.estadoDomicillio = [];
        return;
      }
      this.catalogoService.estadosCatalogo(TRAMITE)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (response) => {
            this.estadoDomicillio = response?.datos ?? [];
          },
        });
  }

  /**
   * Método público para recargar manualmente el catálogo de estados (para troubleshooting UI)
   */
  public reloadEstadosCatalogo(): void {
    this.obtenerEstado();
  }

  /** Obtiene el catálogo de regímenes según el trámite actual,  
 *  almacenando los datos recibidos en la propiedad `regimenQueDestinara`. */
  obtenerRegimenDestinara(): void {
    const TRAMITE = (this.tramites !== undefined && this.tramites !== null) ? String(this.tramites) : '';
    if (!TRAMITE || TRAMITE === 'undefined' || TRAMITE === 'null' || isNaN(Number(TRAMITE))) {
      this.regimenQueDestinara = [];
      return;
    }
    this.catalogoService.regimenesCatalogo(TRAMITE)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          this.regimenQueDestinara = response?.datos ?? [];
        }
      });
  }

  /** Obtiene el catálogo de aduanas de salida según el trámite actual,  
 *  asignando los datos recibidos a la propiedad `aduanaDeSalida`. */
  obtenerAduanaSalida(): void {
    const TRAMITE = (this.tramites !== undefined && this.tramites !== null) ? String(this.tramites) : '';
    if (!TRAMITE || TRAMITE === 'undefined' || TRAMITE === 'null' || isNaN(Number(TRAMITE))) {
      this.aduanaDeSalida = [];
      return;
    }
    this.catalogoService.aduanasCatalogo(TRAMITE)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          this.aduanaDeSalida = response?.datos ?? [];
        }
      });
  }

  /** Obtiene el catálogo de códigos SCIAN según el trámite actual,  
 *  asignando los datos recibidos a la propiedad `scianJson`. */
    obtenerScian(): void {
      const TRAMITE = (this.tramites !== undefined && this.tramites !== null) ? String(this.tramites) : '';
      if (!TRAMITE || TRAMITE === 'undefined' || TRAMITE === 'null' || isNaN(Number(TRAMITE))) {
        this.scianJson = [];
        return;
      }
      this.catalogoService.scianCatalogo(TRAMITE)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (response) => {
            this.scianJson = response?.datos ?? [];
          }
        });
    }

  /** Obtiene el catálogo de descripciones SCIAN según el trámite actual,  
 *  asignando los datos recibidos a la propiedad `descripcionScianJson`. */
    obtenerScianDescripcion(): void {
      const TRAMITE = (this.tramites !== undefined && this.tramites !== null) ? String(this.tramites) : '';
      if (!TRAMITE || TRAMITE === 'undefined' || TRAMITE === 'null' || isNaN(Number(TRAMITE))) {
        this.descripcionScianJson = [];
        return;
      }
      this.catalogoService.scianCatalogo(TRAMITE)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (response) => {
            this.descripcionScianJson = response?.datos ?? [];
          }
        });
    }

/** Valida que los campos obligatorios del formulario de domicilio estén completos,  
 *  marcando todos los controles si falta alguno y devolviendo el resultado. */
validarDomicilioFormularios(): boolean {
  const CAMPOS_OBLIGATORIOS = [
    'establecimientoDomicilioCodigoPostal',
    'establecimientoDomicilioEstado',
    'establecimientoMunicipioYAlcaldia',
    'establecimientoDomicilioCalle',
    'establecimientoDomicilioTelefono',
    'regimenAlQueSeDestinaraLaMercancía',
    'aduanaDeSalida'
  ];

  const ALL_FILLED = CAMPOS_OBLIGATORIOS.every(field => {
    const VALOR = this.domicilioEstablecimiento.get(field)?.value;
    return VALOR !== '' && VALOR !== null && VALOR !== undefined;
  });

  if (ALL_FILLED) {
    return true;
  }
  this.domicilioEstablecimiento.markAllAsTouched();
  return false;
}

/**
 * Valida el código postal del formulario.
 * @returns `true` si el código postal es válido, de lo contrario `false`.
 */
validateCodigoPostal(): boolean {
  const CODIGO_POSTAL_CONTROL = this.domicilioEstablecimiento.get('establecimientoDomicilioCodigoPostal');
  const CODIGO_POSTAL_VALUE = CODIGO_POSTAL_CONTROL?.value;
  const CODIGO_POSTAL_REGEX = /^[0-9]{5}$/; 
  return CODIGO_POSTAL_REGEX.test(CODIGO_POSTAL_VALUE);
}

/**
 * Valida el teléfono del formulario.
 * @returns `true` si el teléfono es válido, de lo contrario `false`.
 */
validateTelefono(): boolean {
  const TELEFONO_CONTROL = this.domicilioEstablecimiento.get('establecimientoDomicilioTelefono');
  const TELEFONO_VALUE = TELEFONO_CONTROL?.value;
  const TELEFONO_REGEX = /^[0-9]{10}$/;
  return TELEFONO_REGEX.test(TELEFONO_VALUE);
}

/**
 * Valida el correo electrónico del formulario.
 * @returns `true` si el correo electrónico es válido, de lo contrario `false`.
 */
validateCorreoElectronico(): boolean {
  const CORREO_CONTROL = this.domicilioEstablecimiento.get('correoElectronico');
  const CORREO_VALUE = CORREO_CONTROL?.value;
  const CORREO_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; 
  return CORREO_REGEX.test(CORREO_VALUE);
}

  /**
   * Ciclo de vida `OnDestroy`.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Elimina un dato SCIAN de la tabla.
   * @param index Índice del dato a eliminar.
   */
  eliminarScian(index: number): void {
    if (index >= 0 && index < this.personaparas.length) {
      this.personaparas.splice(index, 1);
      this.personaparas = [...this.personaparas]; // Actualiza la referencia para que Angular detecte el cambio.
    }
  }

  eliminarScianConfirmacion(): void {
    if (this.selectedRowsScian.length > 0) {
      this.mostrarAlerta = true;
        this.seleccionarFilaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: '¿Estás seguro de que deseas eliminar los registros marcados?',
          cerrar: true,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
          alineacionBtonoCerrar:'flex-row-reverse'
        }
    }
  }

  cerrarModal(value: boolean): void {
    if (value) {
      this.eliminarSeleccionadosScian();
      this.mostrarAlerta = false;
    } else {
      this.mostrarAlerta = false;
    }
  }

  /**
   * Elimina las filas seleccionadas de la tabla SCIAN.
   */
  eliminarSeleccionadosScian(): void {
    const SELECTEDINDICES= this.selectedRowsScian.map((selectedRow) => {
      return this.personaparas.findIndex(
        (row) => row.claveScian === selectedRow.clave && row.descripcionScian === selectedRow.descripcion
      );
    });

    this.personaparas = this.personaparas.filter((_, index) => !SELECTEDINDICES.includes(index));
    this.selectedRowsScian = []; 
  }

  /**
   * Maneja la selección de una fila en la tabla SCIAN.
   * @param index Índice de la fila seleccionada.
   */
  onRowSelect(index: number): void {
    this.selectedIndex = index;
  }
  /**
     * Maneja el evento de cambio en la tabla de SCIAN.
     * Actualiza la lista de filas seleccionadas.
     * @param selected Filas seleccionadas en la tabla.
     */
    onSeleccionChangeScian(selected: ScianDatos[]): void {
      this.selectedRowsScian = selected;
    }

    /**
       * Maneja el evento cuando se agrega un registro SCIAN desde un componente externo.
       * Actualiza el valor de "licenciaSanitaria" y selecciona la opción de régimen si está disponible.
       *
       * @param event - El evento recibido, que puede contener la clave SCIAN.
       */
      onScianRecordAdded(event: unknown): void {
        const CLAVE_SCIAN = Array.isArray(event) && event.length > 0 ? (event[0] as { claveScian?: string; clave?: string })['claveScian'] || (event[0] as { clave?: string })['clave'] : null;
        const LICENCIA_SANITARIA_CONTROL = this.domicilioEstablecimiento.get('licenciaSanitaria');
        if (CLAVE_SCIAN) {
          LICENCIA_SANITARIA_CONTROL?.setValue(CLAVE_SCIAN);
        } 
       
        } 
      /**
   * Convierte los datos de tipo `ScianModel` a `ScianDatos`.
   * @param scianModels Lista de datos de tipo `ScianModel`.
   * @returns Lista de datos convertidos a tipo `ScianDatos`.
   */
  convertirScianModelADatos(scianModels: ScianModel[]): ScianDatos[] {
    return scianModels.map((model) => ({
      clave: model.claveScian,
      descripcion: model.descripcionScian,
    }));
  }
      }


