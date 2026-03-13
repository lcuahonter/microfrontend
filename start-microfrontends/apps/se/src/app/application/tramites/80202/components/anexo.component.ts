import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogoServices,
  ConfiguracionColumna,
  ConsultaioQuery,
  Notificacion,
  NotificacionesComponent,
  REGEX_NUMEROS,
  REG_X,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent
} from '@libs/shared/data-access-user/src';
import {
  FRACCION_EXPORTACION,
  FraccionPayload,
  FraccionResponse,
  GuardarFraccionResponse,
  IMMEX_SERVICIO,
  NICO_TABLA,
  NicoInfo,
  fraccionInfo,
  immexInfo,
} from '../models/immex-ampliacion-sensibles.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImmexAmpliacionSensiblesQuery } from '../estados/immex-ampliacion-sensibles.query';
import { ImmexAmpliacionSensiblesStore } from '../estados/immex-ampliacion-sensibles.store';
import { Modal } from 'bootstrap';
import { PermisoImmexDatosService } from '../services/permiso-immex-datos.service';

/**
 * @component AnexoComponent
 * Componente para la gestión de anexos en el trámite 80202.
 */
@Component({
  selector: 'app-anexo',
  templateUrl: './anexo.component.html',
  styleUrls: ['./anexo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    NotificacionesComponent,
    CatalogoSelectComponent,
  ],
})
export class AnexoComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Indica si hay una nueva notificación en la página. */
  pagenuevaNotificacion: boolean = false;
  /** Formulario para datos de exportación. */
  exportacionForm: FormGroup;
  /** Formulario para datos de importación. */
  importacionForm: FormGroup;
  /** Catálogo de NICO para selects. */
  nico: Catalogo[] = [] as Catalogo[];
  /** Indica si el formulario está en modo solo lectura. */
  esFormularioSoloLectura: boolean = false;
  /** Fracción arancelaria seleccionada para importación. */
  selectFraccionArancelaria: immexInfo = {} as immexInfo;
  /** Tipo de selección de tabla: radio. */
  tablaSeleccionRadio: TablaSeleccion = TablaSeleccion.RADIO;
  /** Tipo de selección de tabla: checkbox. */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;
  /** Datos de la tabla de importación IMMEX. */
  immexTableDatos: immexInfo[] = [];
  /** Configuración de columnas para la tabla de permisos IMMEX. */
  permisoImmexTabla: ConfiguracionColumna<immexInfo>[] = IMMEX_SERVICIO;
  /** Configuración de columnas para la tabla de fracciones de exportación. */
  fraccionExportacionTabla: ConfiguracionColumna<fraccionInfo>[] = FRACCION_EXPORTACION;
  /** Datos de la tabla de fracciones de exportación. */
  fraccionTablaDatos: fraccionInfo[] = [];
  /** Datos de la tabla de NICO para importación. */
  nicoTablaDatos: NicoInfo[] = [];
  /** Datos de la tabla de NICO para exportación. */
  nicoTablaDato: NicoInfo[] = [];
  /** NICO seleccionados para importación. */
  selectedNicos: NicoInfo[] = [];
  /** NICO seleccionados para exportación. */
  selectedExportNicos: NicoInfo[] = [];
  /** Fracción seleccionada para exportación. */
  selectExportacion: fraccionInfo = {} as fraccionInfo;
  /** Indica si hay notificación en el formulario de exportación. */
  exportacionFormNotificacion: boolean = false;
  /**
   * @private
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para manejar la desuscripción de observables y evitar memory leaks.
   * Se emite cuando el componente se destruye.
   */
  /** Subject para manejar la destrucción del componente y evitar memory leaks. */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {ConfiguracionColumna<NicoInfo>[]} nicoTabla
   * @description Configuración de las columnas de la tabla para NICO.
   */
  /** Configuración de columnas para la tabla NICO. */
  nicoTabla: ConfiguracionColumna<NicoInfo>[] = NICO_TABLA;
  /**
   * Indica si el formulario está en modo de actualización.
   * Si es `true`, el formulario está en estado de edición/actualización de datos existentes.
   * Si es `false`, el formulario está en modo de alta/nuevo registro.
   *
   * @type {boolean}
   * @memberof Anexo1Component
   */
  /** Indica si el formulario está en modo actualización. */
  esFormularioActualizacion: boolean = false;
  /**
   * Representa una nueva notificación que será utilizada en el componente.
   * @type {Notificacion}
   */
  /** Nueva notificación para mostrar en el componente. */
  public nuevaNotificacion!: Notificacion;

  /** Indica si la primera carga de datos se ha completado. */
  public firstloadCompleted: boolean = false;
  /** Indica si se muestra el mensaje de eliminación en exportación. */
  public deleteMessageExportacion: boolean = false;
  /** Indica si se eliminan datos de la tabla NICO de exportación. */
  public eliminarDatosTablaNicoExp: boolean = false;
  /** Referencia al modal de mercancia de importación. */
  @ViewChild('mercanciaImportacionModal', { static: true })
  /** Referencia al modal de mercancia de importación. */
  mercanciaImportacionModal!: ElementRef;
  /** Instancia del modal de importación. */
  modalInstance!: Modal;
  /** Referencia al modal de mercancia de exportación. */
  @ViewChild('mercanciaExportacionModal', { static: true })
  /** Referencia al modal de mercancia de exportación. */
  mercanciaExportacionModal!: ElementRef;
  /** Instancia del modal de exportación. */
  modalExport!: Modal;
  /** ID del trámite actual. */
  tramiteId: string = '80202';

  /**
   * Constructor del componente AnexoComponent.
   * @param fb FormBuilder para crear formularios.
   * @param permisoImmexDatosService Servicio de datos IMMEX.
   * @param consultaQuery Query para consulta de datos.
   * @param immexRegistroStore Store para el registro IMMEX.
   * @param immexRegistroQuery Query para el registro IMMEX.
   * @param catalogoService Servicio para catálogos.
   */
  constructor(
    private fb: FormBuilder,
    public permisoImmexDatosService: PermisoImmexDatosService,
    public readonly consultaQuery: ConsultaioQuery,
    public immexRegistroStore: ImmexAmpliacionSensiblesStore,
    public immexRegistroQuery: ImmexAmpliacionSensiblesQuery,
    public catalogoService: CatalogoServices
  ) {
    this.exportacionForm = this.fb.group({
      id: [0, Validators.required],
      fraccionImportacion: [''],
      umt: [''],
      descripcionTigie: [''],
      fraccionExportacion: [''],
      descripcionComercialExport: [''],
      nicos: [''],
      descripcionNico: [''],
    });

    this.importacionForm = this.fb.group({
      id: [0, [Validators.required]],
      fraccionArancelaria: [''],
      umt: [''],
      descripcionTigie: [''],
      cantidadAnual: [
        '',
        [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)],
      ],
      capacidadInstalada: [
        '',
        [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)],
      ],
      cantidadPorPeriodo: [
        '',
        [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)],
      ],
      nicos: [''],
      productoDescExportacions: [''],
      fraccionDescExportacion: [''],
    });
  }
  /**
   * Método de inicialización del componente.
   * @memberof AnexoComponent
   */
  /** Inicializa el componente y suscripciones. */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          if (!seccionState.create && seccionState.procedureId === '80203') {
            this.esFormularioSoloLectura = seccionState.readonly;
          }
        })
      )
      .subscribe();
  }
  /**
   * Método que se ejecuta después de que la vista del componente ha sido inicializada.
   * @memberof AnexoComponent
   */
  /** Ejecuta lógica después de inicializar la vista. */
  ngAfterViewInit(): void {
    this.modalInstance = new Modal(
      this.mercanciaImportacionModal.nativeElement,
      { backdrop: 'static' }
    );
    this.modalExport = new Modal(this.mercanciaExportacionModal.nativeElement, {
      backdrop: 'static',
    });
    this.immexRegistroQuery.selectImportacion$.subscribe((data) => {
      this.immexTableDatos = data;
    });
    this.immexRegistroQuery.selectExportacion$.subscribe((data) => {
      this.fraccionTablaDatos = data;
    });
  }
  /**
   * Método que se ejecuta cuando se produce un evento de entrada en un campo numérico.
   * @param event Evento del input.
   * @param formGroupName Nombre del FormGroup al que pertenece el control.
   * @param controlName Nombre del control dentro del FormGroup.
   */
  /** Maneja la entrada numérica en formularios. */
  onNumberInput(
    event: Event,
    formGroupName: string,
    controlName: string
  ): void {
    const INPUT = event.target as HTMLInputElement;
    INPUT.value = INPUT.value.replace(REGEX_NUMEROS, '');
    if (formGroupName === 'exportacionForm') {
      this.exportacionForm
        .get(controlName)
        ?.setValue(INPUT.value, { emitEvent: false });
    } else if (formGroupName === 'importacionForm') {
      this.importacionForm
        .get(controlName)
        ?.setValue(INPUT.value, { emitEvent: false });
    }
  }

  /** Valida que la cantidad por periodo no exceda un tercio de la anual. */
  checkCantidadPorPeriodo(): boolean {
    const CANTIDAD_ANUAL = Number(
      this.importacionForm.get('cantidadAnual')?.value
    );
    const CANTIDAD_POR_PERIODO = Number(
      this.importacionForm.get('cantidadPorPeriodo')?.value
    );
    if (CANTIDAD_POR_PERIODO > CANTIDAD_ANUAL / 3) {
      return false;
    }
    return true;
  }

  /** Agrega un nuevo permiso IMMEX a la tabla. */
  agregarPermisoImmex(): void {
    this.firstloadCompleted = false;
    if (
      this.importacionForm &&
      this.importacionForm.getRawValue().fraccionArancelaria
    ) {
      const EXISTS = this.immexTableDatos.some(
        (row) =>
          row.fraccionArancelaria ===
          this.importacionForm.value.fraccionArancelaria
      );
      if (!EXISTS) {
        this.importacionForm
          .get('id')
          ?.setValue(Math.floor(Math.random() * 1000));
        this.importacionForm.get('fraccionArancelaria')?.disable();
        this.importacionForm.get('umt')?.setValue('PZA', { emitEvent: false });
        this.importacionForm
          .get('descripcionTigie')
          ?.setValue(
            'Máquinas automáticas para tratamiento o procesamiento de datos, portátiles, de peso inferior o igual a 10 kg',
            { emitEvent: false }
          );
        this.pagenuevaNotificacion = false;
        this.importacionForm.get('umt')?.disable();
        this.importacionForm.get('descripcionTigie')?.disable();
        if (!document.querySelector('bs-modal-backdrop')) {
          this.modalInstance.show();
        }
      } else {
        this.pagemostrarNotificacion(
          'La fracción que intenta ingresar ya se encuentra registrada.'
        );
      }
    } else {
      this.pagemostrarNotificacion(
        'Tiene que introducir la Fracción arancelaria.'
      );
    }
  }

/** Guarda los datos de mercancía de importación. */
guardarMercanciaImportacion(): void {
  if (!this.importacionForm.valid) {
    this.mostrarNotificacion('Los campos marcados con (*) son requeridos.');
    return;
  }
  if (!this.checkCantidadPorPeriodo()) {
    this.mostrarNotificacion(
      'La capacidad instalada por periodo debe ser menor o igual a la cantidad anual.'
    );
    return;
  }

const FRACCION = String(this.importacionForm.get('fraccionArancelaria')?.value ?? '').trim();
 const INDEX = this.immexTableDatos.findIndex(r => r?.id === this.importacionForm.getRawValue()?.id);
 if(INDEX !== -1 ){
 const NUEVO_REGISTRO: immexInfo = {
          id: this.importacionForm.getRawValue().id ? this.importacionForm.getRawValue().id : Math.floor(Math.random() * 1_000_000),
          idFraccion: this.importacionForm.getRawValue().idFraccion ?? null,
          fraccionArancelaria: this.importacionForm.getRawValue().cveFraccion || FRACCION,
          umt: this.importacionForm.getRawValue().umt || 
               this.importacionForm.get('umt')?.value || 
               this.selectFraccionArancelaria?.umt || 
               '',
          descripcionTigie: this.importacionForm.getRawValue().descripcion || 
                           this.importacionForm.get('descripcionTigie')?.value || 
                           '',
          
          cantidadAnual: this.importacionForm.get('cantidadAnual')?.value,
          capacidadInstalada: this.importacionForm.get('capacidadInstalada')?.value,
          cantidadPorPeriodo: this.importacionForm.get('cantidadPorPeriodo')?.value,
          nicos: this.importacionForm.get('nicos')?.value,
          productoDescExportacions: this.importacionForm.get('productoDescExportacions')?.value,
          numero: this.immexTableDatos.length + 1,
          nicosTable: this.nicoTablaDatos,
        };
  this.selectFraccionArancelaria = NUEVO_REGISTRO;
          this.immexTableDatos[INDEX] = { 
            ...NUEVO_REGISTRO, 
            numero: this.immexTableDatos[INDEX].numero 
          };
                  this.immexTableDatos = [...this.immexTableDatos];
        
        this.immexRegistroStore.updateImportacion(this.immexTableDatos);

        this.cerrarModalImportacion();
        
        setTimeout(() => {
          this.pagemostrarNotificacion('Debe proporcionar por lo menos un nico.');
        }, 200);
        
 }
 else{
 const PAYLOAD = {
    fraccion: FRACCION,
    tipoSolicitud: "7",
    folioPrograma: "121517", 
    idSolicitud: "202785257"
  };
   this.permisoImmexDatosService
    .guardarFraccion(PAYLOAD)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response: GuardarFraccionResponse) => {
   const NUEVO_REGISTRO: immexInfo = {
          id: response?.datos?.id ? response?.datos?.id : Math.floor(Math.random() * 1_000_000),
          idFraccion: response?.datos?.idFraccion ?? null,
          fraccionArancelaria: response?.datos?.cveFraccion || FRACCION,
          umt: response?.datos?.umt || 
               this.importacionForm.get('umt')?.value || 
               this.selectFraccionArancelaria?.umt || 
               '',
          descripcionTigie: response?.datos?.descripcion || 
                           this.importacionForm.get('descripcionTigie')?.value || 
                           '',
          
          cantidadAnual: this.importacionForm.get('cantidadAnual')?.value,
          capacidadInstalada: this.importacionForm.get('capacidadInstalada')?.value,
          cantidadPorPeriodo: this.importacionForm.get('cantidadPorPeriodo')?.value,
          nicos: this.importacionForm.get('nicos')?.value,
          productoDescExportacions: this.importacionForm.get('productoDescExportacions')?.value,
          numero: this.immexTableDatos.length + 1,
          nicosTable: this.nicoTablaDatos,
        };
        this.immexTableDatos = [...this.immexTableDatos, NUEVO_REGISTRO];
        this.immexTableDatos = [...this.immexTableDatos];
        this.immexRegistroStore.updateImportacion(this.immexTableDatos);
        this.cerrarModalImportacion();
        setTimeout(() => {
          this.pagemostrarNotificacion('La operación se realizó exitosamente.');
        }, 300);
      } 
    });

 }
}

/** Método auxiliar para cerrar el modal de importación */
private cerrarModalImportacion(): void {
  try {
    this.modalInstance?.hide();
    this.resetImportacionForm();
    
    setTimeout(() => {
      const MODAL_ELEMENT = document.querySelector('.modal.show');
      if (MODAL_ELEMENT) {
        MODAL_ELEMENT.classList.remove('show');
        MODAL_ELEMENT.setAttribute('aria-hidden', 'true');
        (MODAL_ELEMENT as HTMLElement).style.display = 'none';
      }
      
      const BACKDROP = document.querySelector('.modal-backdrop');
      if (BACKDROP) {
        BACKDROP.remove();
      }
      
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('padding-right');
      document.body.style.removeProperty('overflow');
    }, 150);
  } catch (error) {
    console.error('Error closing modal:', error);
  }
}

/** Método auxiliar para resetear el formulario de importación */
private resetImportacionForm(): void {
  this.importacionForm.get('id')?.setValue(0);
  this.importacionForm.get('fraccionArancelaria')?.enable();
  this.importacionForm.get('umt')?.enable();
  this.importacionForm.get('descripcionTigie')?.enable();
  this.importacionForm.reset();
  this.firstloadCompleted = false;
  this.eliminarDatosTablaNicoExp = false;
  this.nuevaNotificacion = {} as Notificacion;
  this.nicoTablaDatos = [];
}


  /** Cierra el modal de importación y limpia el formulario. */
  cerrarModal(): void {
    this.eliminarDatosTablaNicoExp = false;
    this.importacionForm.reset();
    this.importacionForm.get('id')?.setValue(0);
    this.importacionForm.get('fraccionArancelaria')?.enable();
    this.importacionForm.get('umt')?.enable();
    this.firstloadCompleted = false;
    this.nuevaNotificacion = {} as Notificacion;
    this.modalInstance.hide();
  }
  /** Muestra una notificación de advertencia. */
  private mostrarNotificacion(mensaje: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.eliminarDatosTablaNicoExp = true;
  }
  /** Muestra una notificación de advertencia en exportación. */
  private exportNotificacion(mensaje: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.exportacionFormNotificacion = true;
  }

  /** Muestra una notificación en la página. */
  private pagemostrarNotificacion(mensaje: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.pagenuevaNotificacion = true;
  }

  /** Selecciona una fila de la tabla de importación. */
  onFilaSeleccionada(event: immexInfo): void {
    this.selectFraccionArancelaria = event;
  }

  /** Agrega una nueva fracción de exportación a la tabla. */
  agregarExportacion(): void {
  const RAW = this.exportacionForm.getRawValue();
  const DESCCOMERCIAL = (RAW.descripcionComercialExport || '').trim();
  const FRACCUINIMPORT = (RAW.fraccionImportacion || '').trim();
 
  if (DESCCOMERCIAL && FRACCUINIMPORT) {
    if (this.selectFraccionArancelaria) {
     
      if (this.selectFraccionArancelaria.fraccionArancelaria === FRACCUINIMPORT) {
        const EXISTS = this.fraccionTablaDatos.some(
          (row) =>
            row.descripcionComercialExport === DESCCOMERCIAL.toUpperCase() &&
            row.fraccionExportacion === this.selectFraccionArancelaria.fraccionArancelaria
        );
 
        if (!EXISTS) {
          const FRACCION = this.exportacionForm.get('fraccionImportacion')?.value || FRACCUINIMPORT;
          const DESC_FRACCION = this.exportacionForm.get('descripcionComercialExport')?.value ||
            (RAW.descripcionTigie || '').trim() ||
            (this.selectFraccionArancelaria.descripcionTigie || '');
          const ID_PRODUCTO_PADRE = String(this.selectFraccionArancelaria?.id ?? 'data');
          const FRACCION_PADRE = this.importacionForm.get('fraccionImportacion')?.value || FRACCION; // o el padre real si aplica
 
          const PAYLOAD : FraccionPayload = {
            fraccion: FRACCION,
            descFraccion: DESC_FRACCION,
            idProductoPadre: ID_PRODUCTO_PADRE,
            fraccionPadre: FRACCION_PADRE,
          };
 
          this.permisoImmexDatosService
            .guardarFraccionExportacion(PAYLOAD)
            .pipe(takeUntil(this.destroyNotifier$))
            .subscribe({
              next: (resp:FraccionResponse) => {
                const NUEVO_REGISTRO: fraccionInfo = {
                  id: Number(resp?.datos?.idFraccion) || Math.floor(Math.random() * 1_000_000) + 1,
                  fraccionExportacion: resp?.datos?.cveFraccion || FRACCION,
                  fraccionImportacion: resp?.datos?.fraccionPadre || FRACCION,
                  umt: resp?.datos?.umt || this.selectFraccionArancelaria.umt,
                  descripcionTigie:  resp?.datos?.descripcion || `Descripción TIGIE ${Math.floor(Math.random() * 1000)}`,
                  descripcionComercialExport:resp?.datos?.descripcionUsuario ? resp?.datos?.descripcionUsuario.toUpperCase() : DESCCOMERCIAL.toUpperCase(),
                  nicos: RAW.nicos,
                  numero: this.fraccionTablaDatos.length + 1,
                  nicosTable: this.nicoTablaDato,
                };
 
                this.fraccionTablaDatos = [...this.fraccionTablaDatos, NUEVO_REGISTRO];
                const DEEPCOPY = [...this.fraccionTablaDatos];
                this.fraccionTablaDatos = [];
                this.fraccionTablaDatos = DEEPCOPY;
 
                this.immexRegistroStore.updateExportacion(this.fraccionTablaDatos);
                this.pagemostrarNotificacion('La operación se realizó exitosamente.');
 
                setTimeout(() => this.exportacionForm.reset(), 100);
              },
              error: () => {
                this.exportNotificacion('Ocurrió un error al guardar. Inténtalo nuevamente.');
              },
            });
        } else {
          this.pagemostrarNotificacion('La fracción que intenta ingresar ya se encuentra registrada.');
        }
      } else {
        this.pagemostrarNotificacion('Debe seleccionar una fracción de importación..');
      }
    } else {
      this.pagemostrarNotificacion('Debe seleccionar una fracción de importación.');
    }
  } else {
    this.pagemostrarNotificacion('Tiene que introducir la Fracción arancelaria y su descripción.');
  }
}
  /** Selecciona una fila de la tabla de exportación. */
  onFilaSeleccionadaExportacion(event: fraccionInfo): void {
    this.selectExportacion = event;
  }

  /** Elimina la fracción de exportación seleccionada. */
  eliminarExportacion(): void {
    if (this.selectExportacion && this.selectExportacion.id) {
      this.fraccionTablaDatos = this.fraccionTablaDatos.filter(
        (row) => row.id !== this.selectExportacion.id
      );
      const DEEPCOPY2 = [...this.fraccionTablaDatos];
      this.fraccionTablaDatos = [];
      this.fraccionTablaDatos = DEEPCOPY2;
      this.selectExportacion = {} as fraccionInfo;
    } else {
      this.pagemostrarNotificacion(
        'Debe seleccionar una fracción de exportación.'
      );
    }
  }
  /** Muestra el detalle de la mercancía seleccionada para importación. */
  mostrarDetalleMercancia(): void {
    if (this.selectFraccionArancelaria && this.selectFraccionArancelaria.id) {
      this.nicoTablaDatos = [];
      this.importacionForm.patchValue({
        id: this.selectFraccionArancelaria.id,
        fraccionArancelaria: this.selectFraccionArancelaria.fraccionArancelaria,
        umt: this.selectFraccionArancelaria.umt,
        descripcionTigie: this.selectFraccionArancelaria.descripcionTigie,
        cantidadAnual: this.selectFraccionArancelaria.cantidadAnual || '',
        capacidadInstalada:
          this.selectFraccionArancelaria.capacidadInstalada || '',
        cantidadPorPeriodo:
          this.selectFraccionArancelaria.cantidadPorPeriodo || '',
        nicos: this.selectFraccionArancelaria.nicos || '',
        productoDescExportacions:
          this.selectFraccionArancelaria.productoDescExportacions || '',
      });
      this.nicoTablaDatos = this.selectFraccionArancelaria.nicosTable
        ? [...this.selectFraccionArancelaria.nicosTable]
        : [];
      this.importacionForm.get('fraccionArancelaria')?.disable();
      this.importacionForm.get('umt')?.disable();
      this.importacionForm.get('descripcionTigie')?.disable();
      this.importacionForm.get('productoDescExportacions')?.disable();
      this.importacionForm.get('id')?.disable();
      this.obtenerIngresoSelectList('importacion');
      this.firstloadCompleted = true;
      if (!document.querySelector('bs-modal-backdrop')) {
        this.modalInstance.show();
      }
    } else {
      this.pagemostrarNotificacion(
        'Debe seleccionar una fracción de importación.'
      );
    }
  }
  /** Selecciona los NICO en la tabla de importación. */
  seleccionTablas(event: NicoInfo[]): void {
    this.selectedNicos = event.map((item) => ({ ...item, estatus: true }));
  }

  /** Genera una descripción aleatoria para el NICO. */
  descripcionNico(): void {
    this.importacionForm
      .get('productoDescExportacions')
      ?.setValue(
        `PRODUCTO-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`
      );
  }

  /** Agrega un NICO a la tabla de importación. */
  agregarNico(): void {
    if (
      this.importacionForm.value.nicos &&
      this.importacionForm.getRawValue().productoDescExportacions
    ) {
      const EXISTS = this.nicoTablaDatos.some(
        (row) => row.NICO_Columna_1 === this.importacionForm.getRawValue().nicos
      );
      if (!EXISTS) {
        this.nicoTablaDatos = [
          ...this.nicoTablaDatos,
          {
            id: Math.floor(Math.random() * 1000000) + 1,
            NICO_Columna_1: this.importacionForm.value.nicos,
            NICO_Columna_2:
              this.importacionForm.getRawValue().productoDescExportacions,
            estatus: false,
          },
        ];
        this.importacionForm.get('nicos')?.setValue('');
        this.importacionForm.get('productoDescExportacions')?.setValue('');
      } else {
        this.mostrarNotificacion(
          'El NICO que intenta ingresar ya se encuentra registrado.'
        );
      }
    } else {
      this.mostrarNotificacion(
        'Debe seleccionar un valor NICO.'
      );
    }
  }
  /** Elimina los NICO seleccionados de la tabla de importación. */
  eliminarNico(): void {
    if (this.selectedNicos && this.selectedNicos.length > 0) {
      const IDS_TO_DELETE = this.selectedNicos.map((nico) => nico.id);
      this.nicoTablaDatos = this.nicoTablaDatos.filter(
        (nico) => !IDS_TO_DELETE.includes(nico.id)
      );
      this.selectedNicos = [];
    } else {
      this.mostrarNotificacion('Debe elegir al menos un nico para eliminar.');
    }
  }
  /** Muestra el detalle de la mercancía seleccionada para exportación. */
  mostrarDetalleMercanciaExportacion(): void {
    if (
      this.selectExportacion &&
      this.selectExportacion.id &&
      this.fraccionTablaDatos.length > 0
    ) {
      this.exportacionForm.patchValue({
        id: this.selectExportacion.id,
        fraccionImportacion: this.selectExportacion.fraccionImportacion,
        umt: this.selectExportacion.umt,
        descripcionTigie: this.selectExportacion.descripcionTigie,
        fraccionExportacion: this.selectExportacion.fraccionExportacion,
        descripcionComercialExport:
          this.selectExportacion.descripcionComercialExport,
        nicos: this.selectExportacion.nicos,
      });
      this.nicoTablaDato = this.selectExportacion.nicosTable
        ? [...this.selectExportacion.nicosTable]
        : [];
      this.exportacionForm.get('fraccionImportacion')?.disable();
      this.exportacionForm.get('umt')?.disable();
      this.exportacionForm.get('descripcionTigie')?.disable();
      this.exportacionForm.get('descripcionNico')?.disable();
      this.exportacionForm.get('id')?.disable();
      this.obtenerIngresoSelectList('exportacion');
      if (!document.querySelector('bs-modal-backdrop')) {
        this.modalExport.show();
      }
    } else {
      this.pagemostrarNotificacion(
        'Debe seleccionar una fracción de importación.'
      );
    }
  }
  /** Cierra el modal de exportación y limpia el formulario. */
  cerrarModalExportacion(): void {
    this.modalExport.hide();
    setTimeout(() => {
      this.exportacionForm.reset();
      this.exportacionForm.get('id')?.setValue(0);
      this.exportacionForm.get('fraccionImportacion')?.enable();
      this.exportacionForm.get('umt')?.enable();
      this.exportacionForm.get('descripcionTigie')?.enable();
      this.exportacionForm.get('descripcionNico')?.enable();
      this.nuevaNotificacion = {} as Notificacion;
    }, 100);
  }
  /** Guarda los datos de mercancía de exportación. */
  guardarMercanciaExportacion(): void {
    if (this.selectExportacion && this.selectExportacion.id) {
      const NUEVO_REGISTRO: fraccionInfo = {
        id:
          this.selectExportacion.id || Math.floor(Math.random() * 1000000) + 1,
        fraccionExportacion:
          this.exportacionForm.getRawValue().fraccionImportacion,
        fraccionImportacion:
          this.exportacionForm.getRawValue().fraccionImportacion,
        umt: this.exportacionForm.getRawValue().umt,
        descripcionTigie: this.exportacionForm.getRawValue().descripcionTigie,
        descripcionComercialExport: this.exportacionForm
          .getRawValue()
          .descripcionComercialExport.toUpperCase(),
        nicos: this.exportacionForm.getRawValue().nicos,
        numero: this.selectExportacion.numero ,
        nicosTable: this.nicoTablaDato,
      };
      const INDEX = this.fraccionTablaDatos.findIndex(
        (row) => row.id === NUEVO_REGISTRO.id
      );
      if (INDEX > -1) {
        this.fraccionTablaDatos[INDEX] = {
          ...NUEVO_REGISTRO,
          numero: this.fraccionTablaDatos[INDEX]?.numero,
        };
        this.fraccionTablaDatos = [...this.fraccionTablaDatos];
      } else {
        this.fraccionTablaDatos = [...this.fraccionTablaDatos, NUEVO_REGISTRO];
      }
      this.immexRegistroStore.updateExportacion(this.fraccionTablaDatos);
      this.selectExportacion = NUEVO_REGISTRO;
      this.modalExport.hide();
      setTimeout(() => {
        this.exportacionForm.reset();
        this.exportacionForm.get('id')?.setValue(0);
        this.exportacionForm.get('fraccionImportacion')?.enable();
        this.exportacionForm.get('umt')?.enable();
        this.exportacionForm.get('descripcionTigie')?.enable();
        this.exportacionForm.get('descripcionNico')?.enable();
        this.nuevaNotificacion = {} as Notificacion;
      }, 100);
    } else {
      this.pagemostrarNotificacion(
        'Debe seleccionar una fracción de importación.'
      );
    }
  }
  /** Actualiza la descripción del NICO en exportación. */
  onNicoChange(): void {
    if (this.exportacionForm.get('nicos')?.value) {
      this.exportacionForm
        .get('descripcionNico')
        ?.setValue(
          `PRODUCTO-${Math.random()
            .toString(36)
            .substring(2, 15)}-${Date.now()}`
        );
    }
  }
  /** Agrega un NICO a la tabla de exportación. */
  agregarNicoExportacion(): void {
    if (
      this.exportacionForm.getRawValue().nicos &&
      this.exportacionForm.getRawValue().descripcionNico
    ) {
      if (
        !this.nicoTablaDato.some(
          (row) =>
            row.NICO_Columna_1 === this.exportacionForm.getRawValue().nicos
        )
      ) {
        this.exportacionFormNotificacion = false;
        this.nicoTablaDato = [
          ...this.nicoTablaDato,
          {
            id: Math.floor(Math.random() * 1000000) + 1,
            NICO_Columna_1: this.exportacionForm.get('nicos')?.value,
            NICO_Columna_2: this.exportacionForm.get('descripcionNico')?.value,
            estatus: false,
          },
        ];

        setTimeout(() => {
          this.exportacionForm.get('nicos')?.setValue('');
          this.exportacionForm.get('descripcionNico')?.setValue('');
        }, 400);
      } else {
        this.exportNotificacion(
          'El NICO que intenta ingresar ya se encuentra registrado.'
        );
      }
    } else {
      this.exportNotificacion('Tiene que introducir el NICO y su descripción.');
    }
  }
  /** Elimina el permiso IMMEX y fracciones asociadas. */
  eliminarPedimentoDatoss(berr: boolean): void {
    if (
      !berr &&
      this.selectFraccionArancelaria &&
      this.selectFraccionArancelaria.id
    ) {
      this.immexTableDatos = this.immexTableDatos.filter(
        (row) => row.id !== this.selectFraccionArancelaria.id
      );
      this.fraccionTablaDatos = this.fraccionTablaDatos.filter(
        (row) =>
          row.fraccionExportacion !==
          this.selectFraccionArancelaria.fraccionArancelaria
      );
      const DEEPCOPY = [...this.immexTableDatos];
      this.immexTableDatos = [];
      this.immexTableDatos = DEEPCOPY;
      const DEEPCOPY2 = [...this.fraccionTablaDatos];
      this.fraccionTablaDatos = [];
      this.fraccionTablaDatos = DEEPCOPY2;
      this.immexRegistroStore.updateExportacion(this.fraccionTablaDatos);
      this.immexRegistroStore.updateImportacion(this.immexTableDatos);
      this.selectFraccionArancelaria = {} as immexInfo;
      this.selectExportacion = {} as fraccionInfo;
      this.modalInstance.hide();
      this.modalExport.hide();
      this.deleteMessageExportacion = false;
      this.firstloadCompleted = false;
      this.importacionForm.reset();
      this.importacionForm.get('id')?.setValue(0);
      this.importacionForm.get('fraccionArancelaria')?.enable();
      this.importacionForm.get('umt')?.enable();
      this.nuevaNotificacion = {} as Notificacion;
    } else {
      this.nuevaNotificacion = {} as Notificacion;
      this.pagenuevaNotificacion = false;
      this.deleteMessageExportacion = false;
    }
  }

  /** Muestra confirmación para eliminar un permiso IMMEX. */
  eliminarPermisoImmex(): void {
    if (this.selectFraccionArancelaria && this.selectFraccionArancelaria.id) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje:
          'Al eliminar el registro de fracción arancelaria, se eliminarán las fracciones de exportación asociadas. ¿Está seguro que desea eliminar la Fracción seleccionada?',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Cancelar',
        txtBtnCancelar: 'Aceptar',
       
      };
      this.deleteMessageExportacion = true;
    } else {
      this.pagemostrarNotificacion(
        'Seleccione la(s) Fracción(es) de Importación a eliminar.'
      );
    }
  }
  /** Elimina los NICO seleccionados de la tabla de exportación. */
  eliminarNicoExportacion(): void {
    if (this.selectedExportNicos && this.selectedExportNicos.length > 0) {
      const IDS_TO_DELETE = this.selectedExportNicos.map((nico) => nico.id);
      this.nicoTablaDato = this.nicoTablaDato.filter(
        (nico) => !IDS_TO_DELETE.includes(nico.id)
      );
      this.selectedExportNicos = [];
    } else {
      this.exportNotificacion('Debe elegir al menos un nico para eliminar.');
    }
  }
  /** Selecciona los NICO en la tabla de exportación. */
  onNicoSeleccionado(event: NicoInfo[]): void {
    this.selectedExportNicos = event.map((item) => ({
      ...item,
      estatus: true,
    }));
  }
  /**
   * @method obtenerIngresoSelectList
   * @description Obtiene la lista de opciones para el select de unidad de medida NICO.
   * Realiza una llamada al servicio nicoService para obtener el menú desplegable desde
   * el archivo 'nico.json' y asigna los datos obtenidos a la propiedad nico del componente.
   * Esta lista se utiliza para poblar los selects relacionados con códigos NICO.
   *
   * @returns {void}
   */
  /** Obtiene la lista de opciones para el select de unidad de medida NICO. */
  obtenerIngresoSelectList(tipo: 'importacion' | 'exportacion'): void {
    const CLAVE_FRACCION = tipo === 'importacion' ? this.selectFraccionArancelaria?.fraccionArancelaria : this.selectExportacion?.fraccionExportacion;
    this.catalogoService
      .nicosCatalogo(this.tramiteId, CLAVE_FRACCION ?? '')
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((datos) => {
          const TRANSFORMED_DATOS = {
            ...datos,
            datos: (datos.datos ?? []).map((item: Catalogo) => ({
              ...item,
              nicoDescription: item.descripcion,
              descripcion: item.clave,
            })),
          };
          return TRANSFORMED_DATOS;
        })
      )
      .subscribe((datos) => {
        this.nico = datos.datos as Catalogo[];
      });
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Se encarga de la limpieza de recursos para evitar memory leaks. Emite una señal a través de
   * destroyNotifier$ para cancelar todas las suscripciones activas y luego completa el subject.
   *
   * @returns {void}
   * @implements {OnDestroy}
   */
  /** Limpia recursos y cancela suscripciones al destruir el componente. */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
