/* eslint-disable no-unused-expressions */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';

import { Subject, firstValueFrom, map, takeUntil } from 'rxjs';

import {
  Catalogo,
  ConsultaioQuery,
  ConsultaioState,
  Notificacion,
  TablaSeleccion,
  ValidacionesFormularioService
} from '@ng-mf/data-access-user';

import {
  UNIDAD_TABLA_CONFIG,
  VEHICULOS_TABLA_CONFIG
} from '../../enum/transportista-terrestre.enum';
import { Chofer40103Service } from '../../estados/chofer40103.service';

import {
  CatalogoLista,
  DatosUnidad,
  DatosVehiculo,
  VehiculoTablaDatos
} from '../../models/registro-muestras-mercancias.model';

import {
  Tramite40103Store
} from '../../estados/tramite40103.store';

import { Tramite40103Query } from '../../estados/tramite40103.query';
import { modificarTerrestreService } from '../services/modificacar-terrestre.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss',
})
export class VehiculosComponent implements OnInit, OnDestroy {
  /**
   * Lista de vehículos que se muestran en la tabla.
   * @type {DatosVehiculo[]}
   */
  VehiculoTabla: DatosVehiculo[] = [];
  /**
   * Referencia al modal de vehículo en el DOM.
   * @type {ElementRef}
   */
  @ViewChild('vehiculoModal') vehiculoModal!: ElementRef;
  /**
   * Referencia al modal de unidad de arrastre en el DOM.
   * @type {ElementRef}
   */
  @ViewChild('unidadModal') unidadModal!: ElementRef;
  /**
   * Instancia del modal de vehículo para control programático.
   * @type {Modal | null}
   */
  public vehiculoModalInstance: Modal | null = null;
  /**
   * Instancia del modal de unidad para control programático.
   * @type {Modal | null}
   */
  public unidadModalInstance: Modal | null = null;
  /**
   * Formulario reactivo para la captura y edición de datos de vehículos.
   * @type {FormGroup}
   */
  vehiculoFormulario!: FormGroup;
  /**
   * Formulario reactivo para la captura y edición de datos de unidades de arrastre.
   * @type {FormGroup}
   */
  unidadFormulario!: FormGroup;
  /**
   * Sujeto utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  public destroyNotifier$: Subject<void> = new Subject();
  /**
   * Catálogo de tipos de vehículo disponibles.
   * @type {Catalogo[]}
   */
  tipoDeVehiculoCatalogo: Catalogo[] = [];
  /**
   * Catálogo de tipos de arrastre disponibles.
   * @type {Catalogo[]}
   */
  tipoArrastre: Catalogo[] = [];
  /**
   * Catálogo de tipos de unidad de arrastre disponibles.
   * @type {Catalogo[]}
   */
  tipoArrastreCatalogo: Catalogo[] = [];
  /**
   * Catálogo de años disponibles para selección.
   * @type {Catalogo[]}
   */
  anoCatalogo: Catalogo[] = [];
  /**
   * Catálogo de países emisores disponibles.
   * @type {Catalogo[]}
   */
  paisEmisorCatalogo: Catalogo[] = [];
  /**
   * Catálogo de colores de vehículos disponibles.
   * @type {Catalogo[]}
   */
  colorVehiculoCatalogo: Catalogo[] = [];
  /**
   * Objeto de notificación actual para mostrar alertas y mensajes al usuario.
   * @type {Notificacion}
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * Nombre de la pestaña seleccionada actualmente en la interfaz.
   * @type {string}
   */
  selectedTab: string = 'Parque vehicular';
  /**
   * Identificador de la pestaña activa actualmente.
   * @type {string}
   */
  activeTab: string = 'parquevehicular';
  /**
   * Tipo de selección utilizado en las tablas (checkbox, radio, etc.).
   * @type {TablaSeleccion}
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;
  /**
   * Referencia al botón de cierre del modal de vehículo.
   * @type {ElementRef}
   */
  @ViewChild('closeModal') public closeModal!: ElementRef;
  /**
   * Referencia al botón de cierre del modal de unidad de arrastre.
   * @type {ElementRef}
   */
  @ViewChild('closeUnidadModal') public closeUnidadModal!: ElementRef;
  /**
   * Indica si el formulario o componente está en modo solo lectura.
   * @type {boolean}
   */
  esSoloLectura: boolean = false;
  /**
   * Almacena el estado de consulta actual obtenido del query de consulta.
   * @type {ConsultaioState}
   */
  datosConsulta!: ConsultaioState;

  /**
   * Constructor del componente `VehiculosComponent`.
   * @constructor
   * @param {FormBuilder} fb - Servicio para la creación y gestión de formularios reactivos.
   * @param {Tramite40103Store} store - Store del trámite 40103 para la gestión del estado global.
   * @param {Tramite40103Query} tramiteQuery - Query para consultar el estado del trámite 40103.
   * @param {modificarTerrestreService} modificarTerrestreService - Servicio para modificar y obtener datos terrestres.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validaciones personalizadas de formularios.
   * @param {ConsultaioQuery} consultaioQuery - Servicio para consultar el estado de consulta y determinar el modo de solo lectura.
   */
  constructor(
    public fb: FormBuilder,
    public store: Tramite40103Store,
    public tramiteQuery: Tramite40103Query,
    public modificarTerrestreService: modificarTerrestreService,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery,
    private chofer40103Service: Chofer40103Service
  ) { 
    this.initializeEmptyForms();
  }

  /**
   * Inicializa formularios vacíos para prevenir errores de FormControl antes de que los datos asíncronos se carguen.
   * @private
   */
  private initializeEmptyForms(): void {
    this.vehiculoFormulario = this.fb.group({
      idDeVehiculo: [{ value: 1, disabled: true }],
      numero: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      tipoDeVehiculo: ['', [Validators.required]],
      numeroPlaca: ['', [Validators.required]],
      paisEmisor: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      ano: ['', [Validators.required]],
      transponder: ['', [Validators.required]],
      colorVehiculo: ['', [Validators.required]],
      numeroEconomico: ['', [Validators.required]],
      numero2daPlaca: [''],
      estado2daPlaca: [''],
      paisEmisor2daPlaca: [''],
      descripcion: [''],
    });

    this.unidadFormulario = this.fb.group({
      vinVehiculo: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      tipoDeUnidadArrastre: ['', [Validators.required]],
      idDeVehiculoUnidad: [{ value: 1, disabled: true }],
      numeroEconomico: ['', [Validators.required]],
      numeroPlaca: ['', [Validators.required]],
      paisEmisor: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      colorVehiculo: ['', [Validators.required]],
      numero2daPlaca: [''],
      estado2daPlaca: [''],
      paisEmisor2daPlaca: [''],
      descripcion: [''],
    });

    this.vehiculoFormulario.get('descripcion')?.disable();
    this.unidadFormulario.get('descripcion')?.disable();
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    VehiculosComponent.cleanupModalInstances();
    
    this.tramiteQuery.select(state => state.parque_vehicular_alta)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(data => {
        this.vehiculosTablaConfig.datos = data || [];
      });

    this.tramiteQuery.select(state => state.unidades_arrastre_alta)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(data => {
        this.unidadesTablaConfig.datos = data || [];
      });

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          if (seccionState.readonly) {
            this.datosConsulta = seccionState;
            this.esSoloLectura = this.datosConsulta.readonly;
          }
        })
      ).subscribe();

    this.setupFormValueSubscriptions();
    this.seleccionarPestana('parquevehicular');
    this.cargarTipoDeVehiculo();
  }

  vehiculosTablaConfig = { ...VEHICULOS_TABLA_CONFIG };
  unidadesTablaConfig = { ...UNIDAD_TABLA_CONFIG };

  /**
   * Cambia la pestaña seleccionada y activa en el componente.
   * @param {string} tabName - Identificador de la pestaña a seleccionar.
   * @returns {string} El identificador de la pestaña activa.
   */
  seleccionarPestana(tabName: string): string {
    this.selectedTab =
      tabName === 'parquevehicular' ? 'Parque vehicular' : 'Unidad de arrastre';
    this.activeTab = tabName;
    return this.activeTab;
  }

  /**
   * Elimina todos los registros de la tabla de vehículos y restablece el formulario.
   */
  eliminarPedimento(): void {
    this.store.setParqueVehicularAlta([]);
    this.editIndex = null;
    this.vehiculoFormulario.reset();
  }

  /**
   * Elimina todos los registros de la tabla de unidades de arrastre y restablece el formulario.
   */
  eliminarUnidadPedimento(): void {
    this.store.setUnidadesArrastreAlta([]);
    this.editUnidadIndex = null;
    this.unidadFormulario.reset();
  }

  /**
   * Limpia cualquier instancia de modal existente del DOM.
   * @private
   */
  private static cleanupModalInstances(): void {
    try {
      const ELEMENTOMODALVEHICULO = document.getElementById('vehiculoModal');
      if (ELEMENTOMODALVEHICULO) {
        const MODALVEHICULOEXISTENTE = Modal.getInstance(ELEMENTOMODALVEHICULO);
        if (MODALVEHICULOEXISTENTE) {
           MODALVEHICULOEXISTENTE.dispose();
        }
      }
      
      const ELEMENTOMODALUNIDAD = document.getElementById('unidadModal');
      if (ELEMENTOMODALUNIDAD) {
        const MODALUNIDADEXISTENTE = Modal.getInstance(ELEMENTOMODALUNIDAD);
        if (MODALUNIDADEXISTENTE) {
          MODALUNIDADEXISTENTE.dispose();
        }
      }
      
      const FONDOS = document.querySelectorAll('.modal-backdrop');
      FONDOS.forEach(backdrop => backdrop.remove());
      
      document.body.classList.remove('modal-open');
    } catch (error) {
      // Manejo silencioso de errores
    }
  }

  /**
   * Fuerza el cierre del modal de vehículo.
   * @private
   */
  private forceCloseVehiculoModal(): void {
    try {
      if (this.vehiculoModalInstance) {
        this.vehiculoModalInstance.hide();
      }
    } catch (error) {
      // Manejo silencioso de errores
    }
  }

  /**
   * Abre el modal para agregar o editar un vehículo.
   */
  abrirModalPedimento(): void {
    if (this.vehiculoModal) {
      this.vehiculoModalInstance = new Modal(this.vehiculoModal.nativeElement);
      this.vehiculoModalInstance.show();
    }
  }

  /**
   * Abre el modal para agregar o editar una unidad de arrastre.
   */
  abrirModalPedimentoUnidad(): void {
    if (this.unidadModal) {
      this.unidadModalInstance = new Modal(this.unidadModal.nativeElement);
      this.unidadModalInstance.show();
    }
  }

  /**
   * Valida si un campo específico del formulario es válido.
   * @param {FormGroup} form - Formulario reactivo a validar
   * @param {string} field - Nombre del campo a validar
   * @returns {boolean | null} true si es válido, false si es inválido, null si no existe
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * Valida que exista al menos un vehículo y una unidad registrados.
   * @returns {boolean} true si hay al menos un vehículo y una unidad registrados, false en caso contrario.
   */
  public validarFormularios(): boolean {
    const TIENEVEHICULOS = this.vehiculosTablaConfig?.datos && this.vehiculosTablaConfig.datos.length > 0;
    const TIENEUNIDADES = this.unidadesTablaConfig?.datos && this.unidadesTablaConfig.datos.length > 0;
    return Boolean(TIENEVEHICULOS && TIENEUNIDADES);
  }

  /**
   * Índice de edición para la tabla de vehículos.
   * @type {number | null}
   */
  editIndex: number | null = null;

  /**
   * Inicia la edición de un vehículo existente o abre el modal para agregar uno nuevo.
   * @param {number | null} index - Índice del vehículo a editar (null para agregar nuevo)
   */
  iniciarEdicionVehiculo(index: number | null): void {
    if (index === null || index === undefined) {
      this.editIndex = null;
      this.limpiarDatosVehiculo();
      this.abrirModalPedimento();
      return;
    }
    
    this.editIndex = index;
    const VEHICLEDATOS = this.vehiculosTablaConfig.datos[index];
    this.vehiculoFormulario.patchValue(VEHICLEDATOS);
    this.abrirModalPedimento();
  }

  /**
   * Agrega o actualiza un vehículo en la tabla de vehículos.
   */
  agregarDatosVehiculo(): void {
    if (this.vehiculoFormulario.valid) {
      const DATOSFORMULARIO = this.vehiculoFormulario.getRawValue();
      const VEHICULOS = [...this.vehiculosTablaConfig.datos];

      if (this.editIndex !== null) {
        VEHICULOS[this.editIndex] = DATOSFORMULARIO;
      } else {
        VEHICULOS.push(DATOSFORMULARIO);
      }
      this.store.setParqueVehicularAlta(VEHICULOS);
      this.editIndex = null;
      this.forceCloseVehiculoModal();
      this.vehiculoFormulario.reset();
    } else {
      this.vehiculoFormulario.markAllAsTouched();
    }
  }

  /**
   * Índice de edición para la tabla de unidades de arrastre.
   * @type {number | null}
   */
  editUnidadIndex: number | null = null;

  /**
   * Inicia la edición de una unidad de arrastre existente o abre el modal para agregar una nueva.
   * @param {number | null} index - Índice de la unidad a editar (null para agregar nueva)
   */
  iniciarEdicionUnidad(index: number | null): void {
    if (index === null || index === undefined) {
      this.editUnidadIndex = null;
      this.limpiarDatosUnidad();
      this.abrirModalPedimentoUnidad();
      return;
    }
    this.editUnidadIndex = index;
    const DATOSUNIDAD = this.unidadesTablaConfig.datos[index];
    // Mapea las claves del store a las claves para el formulario.
    const TIPODEUNIDADARRASTRE_CLAVE = this.tipoArrastreCatalogo.find(c => c.clave === DATOSUNIDAD.tipoDeUnidadArrastre)?.clave || '';
    const PAISEMISOR_CLAVE = this.paisEmisorCatalogo.find(c => c.clave === DATOSUNIDAD.paisEmisor)?.clave || '';
    const COLORVEHICULO_CLAVE = this.colorVehiculoCatalogo.find(c => c.clave === String(DATOSUNIDAD.colorVehiculo))?.clave || '';
    const PAISEMISOR2DAPLACA_CLAVE = this.paisEmisorCatalogo.find(c => c.clave === DATOSUNIDAD.paisEmisor2daPlaca)?.clave || '';


    this.unidadFormulario.patchValue({
        ...DATOSUNIDAD,
        tipoDeUnidadArrastre: TIPODEUNIDADARRASTRE_CLAVE,
        paisEmisor: PAISEMISOR_CLAVE,
        colorVehiculo: COLORVEHICULO_CLAVE,
        paisEmisor2daPlaca: PAISEMISOR2DAPLACA_CLAVE
    });
    this.abrirModalPedimentoUnidad();
  }

  /**
   * Agrega o actualiza una unidad de arrastre en la tabla de datos.
   */
  agregarDatosUnidad(): void {
    if (this.unidadFormulario.valid) {
      const FORM_DATA = this.unidadFormulario.getRawValue();
      
      // Mapea las claves del formulario para el store.
      const DATOS_UNIDAD = {
        ...FORM_DATA,
        tipoDeUnidadArrastre: this.tipoArrastreCatalogo.find(c => c.clave === FORM_DATA.tipoDeUnidadArrastre)?.clave || '',
        paisEmisor: this.paisEmisorCatalogo.find(c => c.clave === FORM_DATA.paisEmisor)?.clave || '',
        colorVehiculo: this.colorVehiculoCatalogo.find(c => c.clave === FORM_DATA.colorVehiculo)?.clave || '',
        paisEmisor2daPlaca: this.paisEmisorCatalogo.find(c => c.clave === FORM_DATA.paisEmisor2daPlaca)?.clave || ''
      };

      const UNIDADES = [...this.unidadesTablaConfig.datos];

      if (this.editUnidadIndex !== null) {
        UNIDADES[this.editUnidadIndex] = DATOS_UNIDAD;
      } else {
        UNIDADES.push(DATOS_UNIDAD);
      }
      // eslint-disable-next-line no-console
      console.log('Unidades de arrastre actualizadas:', UNIDADES);
      this.store.setUnidadesArrastreAlta(UNIDADES);
      this.editUnidadIndex = null;
      if (this.unidadModalInstance) {
        this.unidadModalInstance.hide();
      }
      this.unidadFormulario.reset();
    } else {
      this.unidadFormulario.markAllAsTouched();
    }
  }
  /**
   * Carga los datos del pedimento en la tabla de vehículos desde el servicio.
   * @public
   */
  public cargarPedimentoTabla(): void {
    this.modificarTerrestreService
      .obtenerPedimentoTabla()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: VehiculoTablaDatos) => {
        this.store.setParqueVehicularAlta(datos.datos);
      });
  }

  /**
   * Limpia el formulario de vehículo y restablece campos clave a su estado adecuado.
   */
  limpiarDatosVehiculo(): void {
    this.editIndex = null;
    this.vehiculoFormulario.reset();
  }
  /**
   * Limpia el formulario de unidad de arrastre y deshabilita campos de descripción.
   */
  limpiarDatosUnidad(): void {
    this.editUnidadIndex = null;
    this.unidadFormulario.reset();
  }
  /**
   * Abre una notificación modal con los parámetros predefinidos.
   * @public
   */
  public abrirModal(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'El registro fue agregado correctamente.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
  /**
   * Carga el catálogo de tipos de vehículo.
   * @public
   */
  public async cargarTipoDeVehiculo(): Promise<void> {
    this.modificarTerrestreService
      .obtenerTipoDeVehiculo()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.tipoDeVehiculoCatalogo = datos.datos;
      });
    /**
     * Carga los catálogos de tipo de arrastre, año y país emisor.
     */
    this.modificarTerrestreService
      .obtenerTipoArrastre()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.tipoArrastre = datos.datos as Catalogo[];
        this.tipoArrastreCatalogo = datos.datos as Catalogo[];
      });

    this.modificarTerrestreService
      .obtenerAno()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.anoCatalogo = datos.datos as Catalogo[];
      });
      
     const DATOS = await firstValueFrom(
            this.chofer40103Service
              .getPaisEmisor()
              .pipe(takeUntil(this.destroyNotifier$))
          );
          this.paisEmisorCatalogo = DATOS || [];
    /**
     * Carga el catálogo de colores de vehículos si el servicio está disponible.
     */
    if (this.modificarTerrestreService.obtenerColorVehiculo) {
      this.modificarTerrestreService.obtenerColorVehiculo()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((datos: CatalogoLista) => {
          this.colorVehiculoCatalogo = datos.datos as Catalogo[];
        });
    }
  }

  selectedVehiculoIndex: number | null = null;
  selectedUnidadIndex: number | null = null;

  /**
   * Configuración de suscripciones a cambios de valores en formularios.
   */
  setupFormValueSubscriptions(): void {
    if (!this.vehiculoFormulario || !this.unidadFormulario) {
      return;
    }

    /**
     * Deshabilita el campo 'descripcion' del formulario de vehículo y lo habilita solo si el tipo seleccionado es 1.
     */
    this.vehiculoFormulario.get('descripcion')?.disable();
    this.vehiculoFormulario.get('tipoDeVehiculo')?.valueChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((selectedValue) => {
        const ID = Number(selectedValue);
        const DESCRIPCION_CONTROL = this.vehiculoFormulario.get('descripcion');
        
        if (ID === 60) {
          DESCRIPCION_CONTROL?.enable();
        } else {
          DESCRIPCION_CONTROL?.disable();
          DESCRIPCION_CONTROL?.setValue(''); 
        }
      });

    /**
     * Deshabilita el campo 'descripcion' del formulario de unidad de arrastre y lo habilita solo si el tipo seleccionado es 70.
     */
    this.unidadFormulario.get('descripcion')?.disable();
    this.unidadFormulario.get('tipoDeUnidadArrastre')?.valueChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((selectedValue) => {
        const ID = Number(selectedValue);
        const DESCRIPCION_CONTROL = this.unidadFormulario.get('descripcion');
        if (ID === 70) {
          DESCRIPCION_CONTROL?.enable();
        } else {
          DESCRIPCION_CONTROL?.disable();
          DESCRIPCION_CONTROL?.setValue('');
        }
      });

    /**
     * Verifica y ajusta el estado inicial de los campos de descripción después de la inicialización.
     */
    setTimeout(() => {
      const CURRENT_VEHICULO_VALUE = this.vehiculoFormulario.get('tipoDeVehiculo')?.value;
      if (CURRENT_VEHICULO_VALUE) {
        const ID = Number(CURRENT_VEHICULO_VALUE);
        const DESCRIPCION_CONTROL = this.vehiculoFormulario.get('descripcion');
        
        if (ID === 1) {
          DESCRIPCION_CONTROL?.enable();
        } else {
          DESCRIPCION_CONTROL?.disable();
        }
      }

      const CURRENT_UNIDAD_VALUE = this.unidadFormulario.get('tipoDeUnidadArrastre')?.value;
      if (CURRENT_UNIDAD_VALUE) {
        const ID = Number(CURRENT_UNIDAD_VALUE);
        const DESCRIPCION_CONTROL = this.unidadFormulario.get('descripcion');
        
        if (ID === 1) {
          DESCRIPCION_CONTROL?.enable();
        } else {
          DESCRIPCION_CONTROL?.disable();
        }
      }
    }, 100);
  }
  /**
   * Maneja la selección de filas en la tabla de vehículos.
   * @param {any} event - Evento de selección que contiene los datos del vehículo seleccionado
   */
  onVehiculoRowSelected(event: DatosVehiculo[]): void {
    if (Array.isArray(event) && event.length > 0) {
      this.selectedVehiculoIndex = this.vehiculosTablaConfig.datos.indexOf(event[0] as DatosVehiculo);
    } else {
      this.selectedVehiculoIndex = null;
    }
  }
  /**
   * Maneja la selección de filas en la tabla de unidades de arrastre.
   * @param {any} event - Evento de selección que contiene los datos de la unidad seleccionada
   */
  onUnidadRowSelected(event: DatosUnidad[]): void {
    
    if (Array.isArray(event) && event.length > 0) {
      this.selectedUnidadIndex = this.unidadesTablaConfig.datos.indexOf(event[0] as DatosUnidad);
    } else {
      this.selectedUnidadIndex = null;
    }
  }

  /**
   * Elimina el vehículo seleccionado de la tabla de datos.
   */
  eliminarVehiculoRow(): void {
    if (this.selectedVehiculoIndex !== null && this.selectedVehiculoIndex >= 0) {
      const VEHICULOS = this.vehiculosTablaConfig.datos.filter((_, index) => index !== this.selectedVehiculoIndex);
      this.store.setParqueVehicularAlta(VEHICULOS);
      this.selectedVehiculoIndex = null;
    }
  }

  eliminarUnidadRow(): void {
    if (this.selectedUnidadIndex !== null && this.selectedUnidadIndex >= 0) {
      const UNIDADES = this.unidadesTablaConfig.datos.filter((_, index) => index !== this.selectedUnidadIndex);
      this.store.setUnidadesArrastreAlta(UNIDADES);
      this.selectedUnidadIndex = null;
    }
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    
    if (this.vehiculoModalInstance) {
      this.vehiculoModalInstance.dispose();
      this.vehiculoModalInstance = null;
    }
    
    if (this.unidadModalInstance) {
      this.unidadModalInstance.dispose();
      this.unidadModalInstance = null;
    }
  }
}
