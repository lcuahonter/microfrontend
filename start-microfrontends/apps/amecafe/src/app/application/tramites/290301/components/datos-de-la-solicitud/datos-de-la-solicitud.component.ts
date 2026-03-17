import {
  BENEFICIOS_TABLA,
  BODEGAS_TABLA,
  CAFE_EXPORTADORES_TABLA,
  RADIO_OPCION,
  REGIONES_TABLA,
} from '../../constants/constants.enum';
import {
  BeneficiosData,
  BodegasData,
  CafeExportadoresData,
  RegionesData,
} from '../../models/filadata.model';
import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConsultaioQuery,
  ConsultaioState,
  InputRadioComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { ReplaySubject, Subscription, map, takeUntil } from 'rxjs';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Solicitud290301State,
  Solicitud290301Store,
} from '../../estados/tramite290301.store';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InputCheckComponent } from '@libs/shared/data-access-user/src';

import { NacionalRegistroDelCafeExportadoresService } from '../../services/nacional-registro-del-cafe-exportadores.service';
import { Solicitud290301Query } from '../../estados/tramite290301.query';

import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    InputRadioComponent,
    TablaDinamicaComponent,
    InputCheckComponent,
    CatalogoSelectComponent
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para los datos de la solicitud */
  datosSolicitudForma!: FormGroup;

                                                                                                                                                          
  /** Formulario reactivo para las regiones */
  regionForm!: FormGroup;

  /** Indica si se muestra el formulario de clave SCIAN */
  public showregionForm: boolean = false;

  /** Formulario reactivo para las regiones */
  beneficiosForm!: FormGroup;

  /** Formulario reactivo para los beneficios */
  bodegaForm!: FormGroup;

  /** Formulario reactivo para los exportadores de café */
  cafeExportForm!: FormGroup;

  /** Opciones de radio para el formulario */
  radioOpcion = RADIO_OPCION;

  /** Tabla de regiones */
  regionesTabla = REGIONES_TABLA;

  /** Tabla de beneficios */
  beneficiosTabla = BENEFICIOS_TABLA;

  /** Tabla de bodegas */
  bodegasTabla = BODEGAS_TABLA;

  /** Tabla de exportadores de café */
  cafeExportadoresTabla = CAFE_EXPORTADORES_TABLA;

  /** Tipo de selección para las tablas */
  tipoSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /** Datos de la tabla de regiones */
  regionesTableDatos: RegionesData[] = [];

  /** Datos de la tabla de beneficios */
  beneficiosTableDatos: BeneficiosData[] = [];

  /** Datos de la tabla de bodegas */
  bodegasTableDatos: BodegasData[] = [];

  /** Datos de la tabla de exportadores de café */
  cafeExportadoresTableDatos: CafeExportadoresData[] = [];

  /** Estado de la solicitud 290301 */
  solicitud290301State: Solicitud290301State = {} as Solicitud290301State;

  /** Estado de los datos de la solicitud */
  dataDeLaSolicitudState!: Solicitud290301State;

  /** Observable para manejar la destrucción del componente */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /** Consulta de estado para la solicitud */
  consultaDatos!: ConsultaioState;
  
  /** Indica si el formulario es de solo lectura */
  esFormularioSoloLectura: boolean = false;

  private subscriptions: Subscription[] = [];
/** Conjunto de filas seleccionadas en la tabla */
  filasSeleccionadas: Set<number> = new Set();
  
    /**
     * Catálogo de productos de café.
     * @type {CatalogosSelect}
     */
    productoCafe: CatalogosSelect = {
      labelNombre: 'Tipo de café',
      required: false,
      primerOpcion: '',
      catalogos: [],
    };
  
    /**
     * Catálogo de estados.
     * @type {CatalogosSelect}
     */
    estado: CatalogosSelect = {
      labelNombre: 'Estado',
      required: false,
      primerOpcion: '',
      catalogos: [],
    };
  
    /**
     * Catálogo de tipos de café.
     * @type {CatalogosSelect}
     */
    descripTipoCafe: CatalogosSelect = {
      labelNombre: 'Cafe compra',
      required: false,
      primerOpcion: '',
      catalogos: [],
    };

     propAlquil: CatalogosSelect = {
    labelNombre: 'Propia o alquilada',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };
  
  constructor(
    /** Constructor para inicializar servicios y dependencias */
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,

    private nacionalRegistroDelCafeExportadoresService: NacionalRegistroDelCafeExportadoresService,
    public solicitud290301Store: Solicitud290301Store,
    public solicitud290301Query: Solicitud290301Query,
    private consultaioQuery: ConsultaioQuery,
    private activatedRoute: ActivatedRoute,
   private router: Router) {}

  /** Método que se ejecuta al inicializar el componente */
  ngOnInit(): void {
    this.solicitud290301Query.selectSolicitud$
  .pipe(
    takeUntil(this.destroyed$),
    map((seccionState: Solicitud290301State) => {
      this.dataDeLaSolicitudState = seccionState;
      this.createForm();
      this.datosSolicitudForma.patchValue({
        productorDeCafe: this.dataDeLaSolicitudState?.productorDeCafe || 'No',
        claveDelPadron: this.dataDeLaSolicitudState?.claveDelPadron || '',
      });
      this.handleProductorDeCafeChange(); 
    
    })
  )
     .subscribe();

    this.getRegionsData();
    this.getBeneficiosData();
    this.getBodegasData();
    this.getCafeExportadoresData();

      this.cargarEstadoCatalog();
    this.cargarProductoCafe();
    this.cargarTipoDeCafe();
    this.cargarPropiaAlquilada();
    
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
        this.consultaDatos = seccionState;
        this.esFormularioSoloLectura = this.consultaDatos.readonly;
        this.inicializarEstadoFormulario(); 
      })
    )   
    .subscribe();   
  
     this.inicializarEstadoFormulario();
     this.handleProductorDeCafeChange();

  }

  /** Método para crear el formulario reactivo */
  createForm(): void {
    this.datosSolicitudForma = this.fb.group({
      justificacion: [
        this.dataDeLaSolicitudState?.justificacion,
        [Validators.required, Validators.maxLength(4000)],
      ], 
      productorDeCafe: [
        this.dataDeLaSolicitudState?.productorDeCafe || 'No', 
      ],
      claveDelPadron: [
        {
          value: this.dataDeLaSolicitudState?.claveDelPadron || '',
          disabled: (this.dataDeLaSolicitudState?.productorDeCafe || 'No') === 'No', // Deshabilitar si el valor predeterminado es 'No'
        },
      ],
      observaciones: [this.dataDeLaSolicitudState?.observaciones,[Validators.required, Validators.maxLength(4000)]],
      requiereInspeccionInmediata: [
        this.dataDeLaSolicitudState?.requiereInspeccionInmediata,
      ],
      informacionConfidencial: [
        this.dataDeLaSolicitudState?.informacionConfidencial,
      ],
    });
      this.regionForm = this.fb.group({
      estado: ['', [Validators.required]],
      productoCafe: ['', [Validators.required]],
      descRegionCompra: ['', [Validators.required, Validators.maxLength(200)]],
      descripTipoCafe: ['', [Validators.required]],
      volumen: ['', [Validators.required, Validators.min(1)]],
    });

    this.beneficiosForm = this.fb.group({
      razonSocial: ['', [Validators.required, Validators.maxLength(200)]],
      propAlquil: ['', [Validators.required]],
      calle: ['', [Validators.required, Validators.maxLength(100)]],
      numeroExterior: ['', Validators.required],
      numeroInterior: ['', Validators.maxLength(50)],
      colonia: ['', [Validators.required, Validators.maxLength(100)]],
      estado: ['', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.maxLength(12)]],
      capacidadAlmacenaje: ['', [Validators.required, Validators.maxLength(20)]],
      volumenAlmacenaje: ['', [Validators.required]],
    });

     this.bodegaForm = this.fb.group({
      razonSocial: ['', [Validators.required, Validators.maxLength(200)]],
      propAlquil: ['', [Validators.required]],
      calle: ['', [Validators.required, Validators.maxLength(100)]],
      numeroExterior: ['', Validators.required],
      numeroInterior: ['', Validators.maxLength(50)],
      colonia: ['', [Validators.required, Validators.maxLength(100)]],
      estado: ['', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.maxLength(12)]],
      capacidadAlmacenaje: ['', [Validators.required, Validators.maxLength(20)]],
    });

    this.cafeExportForm = this.fb.group({
      descripcionMercancia: ['', [Validators.required, Validators.maxLength(200)]],
      propAlquil: ['', [Validators.required]],
      porcentajeConcentracion: ['', [Validators.required, Validators.maxLength(50)]],
    });

  }

  
  /**
 * Método para manejar el envío del formulario de exportadores de café.
 * 
 * Si el formulario es válido, se clonan los datos del formulario, se mapean
 * a la estructura de datos de la tabla y se agregan a la tabla correspondiente.
 * Luego, se reinicia el formulario y se cierra el modal asociado.
 */
onSubmitCafeExportForm(): void {

  if (this.cafeExportForm.valid) {
    // Clonar los datos del formulario
    const FORM_DATA = { ...this.cafeExportForm.value };

    // Mapear los datos del formulario a la estructura de datos de la tabla
   const TABLE_DATA: CafeExportadoresData = {
      id: this.cafeExportadoresTableDatos.length > 0
        ? Math.max(...this.cafeExportadoresTableDatos.map((row) => row.id || 0)) + 1
        : 1,
      marcaComercial: FORM_DATA.descripcionMercancia,
      clasificacion: FORM_DATA.propAlquil,
      volumen: FORM_DATA.porcentajeConcentracion,
    };

    // Agregar los datos procesados a la tabla
    this.cafeExportadoresTableDatos = [...this.cafeExportadoresTableDatos, TABLE_DATA];

    // Reiniciar el formulario después del envío
    this.cafeExportForm.reset();

    // Cerrar el modal
   const MODAL_ELEMENT_1 = document.getElementById('cafeExportFormModal');
if (MODAL_ELEMENT_1) {
  const MODAL_INSTANCE_1 = Modal.getInstance(MODAL_ELEMENT_1) || new Modal(MODAL_ELEMENT_1);
  if (MODAL_INSTANCE_1) {
    MODAL_INSTANCE_1.hide();
  }
}
    // Eliminar los elementos de fondo del modal

const BACKDROP_ELEMENTS = document.querySelectorAll('.modal-backdrop');
BACKDROP_ELEMENTS.forEach((backdrop) => backdrop.remove());
  } 
}
/**
 * Método para manejar el envío del formulario de bodegas.
 * 
 * Si el formulario es válido, se clonan los datos del formulario, se mapean
 * a la estructura de datos de la tabla y se agregan a la tabla correspondiente.
 * Luego, se reinicia el formulario y se cierra el modal asociado.
 */
onSubmitBodegaForm(): void {

  if (this.bodegaForm.valid) {
    // Clonar los datos del formulario
    const FORM_DATA = { ...this.bodegaForm.value };

    // Mapear los datos del formulario a la estructura de datos de la tabla
  const TABLE_DATA: BodegasData = {
      id: this.bodegasTableDatos.length > 0
        ? Math.max(...this.bodegasTableDatos.map((row) => row.id || 0)) + 1
        : 1,
      nombre: FORM_DATA.razonSocial,
      calle: FORM_DATA.calle,
      numeroExterior: FORM_DATA.numeroExterior,
      numeroInterior: FORM_DATA.numeroInterior,
      colonia: FORM_DATA.colonia,
      estado: FORM_DATA.estado,
      codigoPostal: FORM_DATA.codigoPostal,
      propiaoAliquilada: FORM_DATA.propAlquil,
      capacidad: FORM_DATA.capacidadAlmacenaje,
    };


    // Agregar los datos procesados a la tabla
    this.bodegasTableDatos = [...this.bodegasTableDatos, TABLE_DATA];

    // Reiniciar el formulario después del envío
    this.bodegaForm.reset();

    // Cerrar el modal
    const MODAL_ELEMENT_1 = document.getElementById('bodegaFormModal');
if (MODAL_ELEMENT_1) {
  const MODAL_INSTANCE_1 = Modal.getInstance(MODAL_ELEMENT_1) || new Modal(MODAL_ELEMENT_1);
  if (MODAL_INSTANCE_1) {
    MODAL_INSTANCE_1.hide();
  }
}
const BACKDROP_ELEMENTS = document.querySelectorAll('.modal-backdrop');
BACKDROP_ELEMENTS.forEach((backdrop) => backdrop.remove());
  } 
}

/** Método para manejar el envío del formulario de beneficios.
 * 
 * Si el formulario es válido, se clonan los datos del formulario, se mapean
 * a la estructura de datos de la tabla y se agregan a la tabla correspondiente.
 * Luego, se reinicia el formulario y se cierra el modal asociado.
 */
onSubmitBeneficiosForm(): void {

  if (this.beneficiosForm.valid) {
    // Clonar los datos del formulario
    const FORM_DATA = { ...this.beneficiosForm.value };

    // Mapear los datos del formulario a la estructura de datos de la tabla
    const TABLE_DATA: BeneficiosData = {
      id: this.beneficiosTableDatos.length > 0
        ? Math.max(...this.beneficiosTableDatos.map((row) => row.id || 0)) + 1
        : 1,
      nombre: FORM_DATA.razonSocial,
      calle: FORM_DATA.calle,
      numeroExterior: FORM_DATA.numeroExterior,
      numeroInterior: FORM_DATA.numeroInterior,
      colonia: FORM_DATA.colonia,
      estado: FORM_DATA.estado,
      codigoPostal: FORM_DATA.codigoPostal,
      propiaoAliquilada: FORM_DATA.propAlquil,
      capacidad: FORM_DATA.capacidadAlmacenaje,
      volumen: FORM_DATA.volumenAlmacenaje,
    };

    // Agregar los datos procesados a la tabla
    this.beneficiosTableDatos = [...this.beneficiosTableDatos, TABLE_DATA];

    // Reiniciar el formulario después del envío
    this.beneficiosForm.reset();

    // Cerrar el modal
    const MODAL_ELEMENT_1 = document.getElementById('beneficiosFormModal');
if (MODAL_ELEMENT_1) {
  const MODAL_INSTANCE_1 = Modal.getInstance(MODAL_ELEMENT_1) || new Modal(MODAL_ELEMENT_1);
  if (MODAL_INSTANCE_1) {
    MODAL_INSTANCE_1.hide();
  }
}
const BACKDROP_ELEMENTS = document.querySelectorAll('.modal-backdrop');
BACKDROP_ELEMENTS.forEach((backdrop) => backdrop.remove());
  } 
}
/** Método para manejar el envío del formulario de regiones.*/
onSubmitRegionForm(): void {
  if (this.regionForm.valid) {
    const FORM_DATA = { ...this.regionForm.value };

    const TABLE_DATA: RegionesData = {
       id: this.regionesTableDatos.length > 0 
        ? Math.max(...this.regionesTableDatos.map((row) => row.id || 0)) + 1
      : 1,
      estado: this.estado.catalogos.find(
        (item: Catalogo) => String(item.id) === String(FORM_DATA.estado)
      )?.descripcion || 'Not Found',
      cafeCompra: this.productoCafe.catalogos.find(
        (item: Catalogo) => String(item.id) === String(FORM_DATA.productoCafe)
      )?.descripcion || 'Not Found',
      region: FORM_DATA.descRegionCompra,
      tipoDeCafe: this.descripTipoCafe.catalogos.find(
        (item: Catalogo) => String(item.id) === String(FORM_DATA.descripTipoCafe)
      )?.descripcion || 'Not Found',
      volumen: FORM_DATA.volumen,
    };

    this.regionesTableDatos = [...this.regionesTableDatos, TABLE_DATA];

    this.regionForm.reset();
const MODAL_ELEMENT_4 = document.getElementById('regionFormModal');
if (MODAL_ELEMENT_4) {
  const MODAL_INSTANCE_4 = Modal.getInstance(MODAL_ELEMENT_4) || new Modal(MODAL_ELEMENT_4);
  if (MODAL_INSTANCE_4) {
    MODAL_INSTANCE_4.hide();
  }
}
const BACKDROP_ELEMENTS = document.querySelectorAll('.modal-backdrop');
BACKDROP_ELEMENTS.forEach((backdrop) => backdrop.remove());
  } 
}

  /** Método para manejar el cambio de filas seleccionadas. */
  onfilasSeleccionadasChange(filasSeleccionadas: RegionesData[] | BeneficiosData[] | CafeExportadoresData[] | BodegasData[]): void {
    this.filasSeleccionadas = new Set(filasSeleccionadas.map((row) => row.id));
  }

  /** Método que se ejecuta al destruir el componente */
  onDeletedRegionData(): void {
    this.regionesTableDatos = this.regionesTableDatos.filter(
      (row) => !this.filasSeleccionadas.has(row.id)
    );
    this.filasSeleccionadas.clear();
  }

  /** Método que se ejecuta al destruir el componente */
  onDeletedbeneficiosData(): void {
    this.beneficiosTableDatos = this.beneficiosTableDatos.filter(
      (row) => !this.filasSeleccionadas.has(row.id)
    );
    this.filasSeleccionadas.clear();
  }

  /** Método que se ejecuta al destruir el componente */
  onDeletedBodegasData(): void {
    this.bodegasTableDatos = this.bodegasTableDatos.filter(
      (row) => !this.filasSeleccionadas.has(row.id)
    );
    this.filasSeleccionadas.clear();
  }

  /** Método que se ejecuta al destruir el componente */
  onDeletedCafeExportadoresData(): void {
    this.cafeExportadoresTableDatos = this.cafeExportadoresTableDatos.filter(
      (row) => !this.filasSeleccionadas.has(row.id)
    );
    this.filasSeleccionadas.clear();
  }
  /**
   * Método para manejar el cambio del campo "productorDeCafe".
   * Este método habilita o deshabilita el campo "claveDelPadron"
   * dependiendo del valor seleccionado en el radio button.
   *
   * @param event Evento que se dispara al cambiar la selección del radio button.
   */
  handleProductorDeCafeChange(): void {
    const VALUE = this.datosSolicitudForma.get('productorDeCafe')?.value;
    const CLAVE_DEL_PADRON_CONTROL = this.datosSolicitudForma.get('claveDelPadron');
   
  
    if (VALUE === 'No') {
      if (CLAVE_DEL_PADRON_CONTROL?.enabled) {
        CLAVE_DEL_PADRON_CONTROL.disable();
        CLAVE_DEL_PADRON_CONTROL.setValue(''); 

      }
      
    } else if (VALUE === 'Si') {
      if (CLAVE_DEL_PADRON_CONTROL?.disabled) {
        CLAVE_DEL_PADRON_CONTROL.enable();
        CLAVE_DEL_PADRON_CONTROL.setValue(this.dataDeLaSolicitudState?.claveDelPadron || ''); 

      }
    }
    this.setValoresStore(this.datosSolicitudForma, 'productorDeCafe', 'setProductorDeCafe');

  }
  /** Método para obtener los datos de las regiones */
  getRegionsData(): void {
    this.nacionalRegistroDelCafeExportadoresService
      .getRegionsData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.regionesTableDatos = data as RegionesData[];
      });
  }

  /** Método para obtener los datos de los beneficios */
  getBeneficiosData(): void {
    this.nacionalRegistroDelCafeExportadoresService
      .getBeneficiosData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.beneficiosTableDatos = data as BeneficiosData[];
      });
  }

  /** Método para obtener los datos de las bodegas */
  getBodegasData(): void {
    this.nacionalRegistroDelCafeExportadoresService
      .getBodegasData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.bodegasTableDatos = data as BodegasData[];
      });
  }

  /** Método para obtener los datos de los exportadores de café */
  getCafeExportadoresData(): void {
    this.nacionalRegistroDelCafeExportadoresService
      .getCafeExportadoresData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.cafeExportadoresTableDatos = data as CafeExportadoresData[];
      });
  }
  /**
   * Método para inicializar el estado del formulario
   * dependiendo de si es solo lectura o no.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.datosSolicitudForma?.disable();
    }
    else {
      this.datosSolicitudForma?.enable();
      
    }
   
}

    /** Carga el catálogo de productos de café.
     */
  cargarProductoCafe(): void {
    this.nacionalRegistroDelCafeExportadoresService.cargarClasificacion()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.productoCafe.catalogos = data as Catalogo[];
      });
  }
  
    /**
     * Carga el catálogo de tipos de café.
     */
   cargarTipoDeCafe(): void {
    this.nacionalRegistroDelCafeExportadoresService.cargarTipoDeCafe()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.descripTipoCafe.catalogos = data as Catalogo[];
      });
  }
  
    /**
     * Carga el catálogo de estados.
     */
    cargarEstadoCatalog(): void {
    this.nacionalRegistroDelCafeExportadoresService.cargarEstadoCatalog()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estado.catalogos = data as Catalogo[];
      });
  }

    /** Carga el catálogo de propiedad (propia o alquilada).
     */
  cargarPropiaAlquilada(): void {
    this.nacionalRegistroDelCafeExportadoresService.cargarTipoDeCafe()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.propAlquil.catalogos = data as Catalogo[];
      });
  }
  /**
   * Método para establecer valores en el store
   * @param form Formulario reactivo
   * @param campo Campo del formulario
   * @param metodoNombre Método del store
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud290301Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud290301Store[metodoNombre] as (value: unknown) => void)(
      VALOR
    );
  }

  /** Método que se ejecuta al destruir el componente */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
