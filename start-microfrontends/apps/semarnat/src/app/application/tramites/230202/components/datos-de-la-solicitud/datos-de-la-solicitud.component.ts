import {
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  CrossListLable,
  CrosslistComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DatosDetalle, DatosSolicitud } from '../../models/datos-tramite.model';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud230202State, Tramite230202Store } from '../../estados/tramite230202.store';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { PhytosanitaryReexportacionService } from '../../services/phytosanitary-reexportacion.service';
import { Tramite230202Query } from '../../estados/tramite230202.query';

/**
 * Componente principal para gestionar los datos de la solicitud del trámite 230202.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    CrosslistComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {
  /**
   * Formulario principal del trámite.
   */
  solicitudForm!: FormGroup;

  /**
   * Formulario para agregar mercancías.
   */
  agregarMercanciasForm!: FormGroup;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud230202State;

  /**
   * Sujeto para manejar la destrucción de observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de catálogos disponibles para el número de certificado.
   */
  numeroDeCertificado!: Catalogo[];

  /**
   * Lista de catálogos disponibles para aduanas.
   */
  aduana!: Catalogo[];

  /**
   * Lista de catálogos disponibles para países.
   */
  pais!: Catalogo[];

  /**
   * Lista de catálogos disponibles para entidades.
   */
  entidades!: Catalogo[];

  /**
   * Lista de catálogos disponibles para la descripción del producto.
   */
  descripcionProducto!: Catalogo[];

  /**
   * Lista de catálogos disponibles para fracciones arancelarias.
   */
  fraccionArancelaria!: Catalogo[];

  /**
   * Lista de rangos de días seleccionados.
   */
  selectRangoDias: string[] = [];

  /**
   * Lista de entidades seleccionadas.
   */
  selectEntidades: string[] = [];

  /**
   * Lista de catálogos disponibles para géneros.
   */
  genero!: Catalogo[];

  /**
   * Lista de catálogos disponibles para especies.
   */
  especie!: Catalogo[];

  /**
   * Lista de catálogos disponibles para nombres comunes.
   */
  nombreComun!: Catalogo[];

  /**
   * Lista de catálogos disponibles para unidades de medida.
   */
  unidadDeMedida!: Catalogo[];

  /**
   * Lista de catálogos disponibles para medios de transporte.
   */
  medioDeTransporte!: Catalogo[];

  /**
   * Lista de catálogos disponibles para estados.
   */
  estado!: Catalogo[];

  /**
   * Control de formulario para la fecha.
   */
  fecha: FormControl = new FormControl('');

  /**
   * Control de formulario para la fecha seleccionada.
   */
  fechaSeleccionada: FormControl = new FormControl('');

  /**
   * Referencia a los componentes Crosslist en la vista.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * Referencia al modal para agregar mercancías.
   */
  @ViewChild('modalAgregarMercancias', { static: false }) modalRef!: ElementRef;

  /**
   * Referencia al modal de confirmación.
   */
  @ViewChild('modalConfirmacion', { static: false }) modalConfirmacion!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Botones para gestionar la lista de países de origen.
   */
  public paisDeOrigenBotons = this.getCrossListBtn(0);

  /**
   * Botones para gestionar la lista de entidades.
   */
  public entidadesBotons = this.getCrossListBtn(1);

  /**
   * Etiquetas para la lista de países de origen.
   */
  public paisDeOrigenLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de origen:',
    derecha: 'País(es) seleccionado(s)*:',
  };

  /**
   * Etiquetas para la lista de entidades.
   */
  public entidadesLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Entidades disponsibles:',
    derecha: 'Entidades seleccionadas*:',
  };

  /**
   * Lista de datos de la solicitud.
   */
  public datosSolicitud: DatosSolicitud[] = [];

  /**
   * Filas seleccionadas en la tabla de solicitudes.
   */
  selectedRows: number[] = [];

  /**
   * Filas seleccionadas en la tabla de detalles.
   */
  selectedRowsDetalle: number[] = [];

  /**
   * Lista de datos de detalle.
   */
  public datosDetalle: DatosDetalle[] = [];

  /**
   * Configuración de la tabla de selección.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de las columnas de la tabla de solicitudes.
   */
  public encabezadoDeTabla: ConfiguracionColumna<DatosSolicitud>[] = [
    { encabezado: '', clave: (articulo) => articulo.id, orden: 1 },
    {
      encabezado: 'Fracción arancelaria',
      clave: (articulo) => articulo.fraccionArancelaria,
      orden: 2,
    },
    {
      encabezado: 'Cantidad',
      clave: (articulo) => articulo.cantidad,
      orden: 3,
    },
    {
      encabezado: 'Cantidad(letra)',
      clave: (articulo) => articulo.cantidadLetra,
      orden: 4,
    },
  ];

  /**
   * Configuración de las columnas de la tabla de detalles.
   */
  public encabezadoDeTablaDetalle: ConfiguracionColumna<DatosDetalle>[] = [
    { encabezado: '', clave: (articulo) => articulo.id, orden: 1 },
    {
      encabezado: 'Nombre cietifico',
      clave: (articulo) => articulo.nombreCientifico,
      orden: 2,
    },
    {
      encabezado: 'Nombre común',
      clave: (articulo) => articulo.nombreComunDetalle,
      orden: 3,
    },
  ];

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;

  /**
   * @property {boolean} detalles
   * @description Indica si se deben mostrar los detalles de la solicitud.
   * @default undefined
   */
  detalles: never[] | undefined;

  /**
   * @property {boolean} generoEnabled
   * @description Indica si el campo de género está habilitado.
   * @default false
   */
  especieEnabled = false;

  /**
   * @property {boolean} nombreComunEnabled
   * @description Indica si el campo de nombre común está habilitado.
   * @default false
   */
  nombreComunEnabled = false;

  /**
   * @property {boolean} mostrarOtroNombreComun
   * @description Indica si se debe mostrar el campo para otro nombre común.
   * @default false
   */
  mostrarOtroNombreComun = false;

  /**
   * Constructor del componente.
   * @param phytosanitaryReexportacionService Servicio para gestionar datos fitosanitarios.
   * @param store Almacén del estado del trámite.
   * @param query Consulta del estado del trámite.
   * @param fb Constructor de formularios reactivos.
   */
  constructor(
    public phytosanitaryReexportacionService: PhytosanitaryReexportacionService,
    public store: Tramite230202Store,
    public query: Tramite230202Query,
    private consultaioQuery: ConsultaioQuery,
    public fb: FormBuilder
  ) {}

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.inicializaCatalogos();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.inicializarFormulario();
    this.datosSolicitud = this.solicitudState.datosSolicitud;
    
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.updateEstadoFormulario();
        })
      )
      .subscribe();
    this.updateEstadoFormulario();
  }


  /**
   * Actualiza el estado de los formularios del componente según el modo de solo lectura.
   *
   * Si la propiedad `soloLectura` es verdadera, deshabilita todos los formularios asociados
   * (`solicitudForm`, `agregarMercanciasForm`, `exportacionForm`, y `datosMercancia`).
   * Si es falsa, habilita dichos formularios para permitir la edición.
   */
  updateEstadoFormulario(): void {
    if (this.soloLectura) {
      this.solicitudForm.disable();
      this.agregarMercanciasForm.disable();
      this.reexportacionForm?.disable();
      this.datosMercancia?.disable();
    } else {
      this.solicitudForm?.enable();
      this.agregarMercanciasForm?.enable();
      this.reexportacionForm?.enable();
      this.datosMercancia?.enable();
    }
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se utiliza para limpiar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Obtiene el grupo de formulario de datos de mercancía.
   */
  inicializarFormulario(): void {
    this.solicitudForm = this.fb.group({
      reexportacionForm: this.fb.group({
        numeroDeCertificado: [
          {value: this.solicitudState?.numeroDeCertificado, disabled: this.soloLectura },
          [Validators.required],
        ],
        aduana: [{value: this.solicitudState?.aduana, disabled: this.soloLectura}, [Validators.required]],
        pais: [{value: this.solicitudState?.pais, disabled: this.soloLectura}, [Validators.required]],
        entidades: [{value: this.solicitudState?.entidades, disabled: this.soloLectura}, [Validators.required]],
        descripcionProducto: [
          {value: this.solicitudState?.descripcionProducto, disabled: this.soloLectura},
          [Validators.required],
        ],
        unidadDeMedida: [
          {value: this.solicitudState?.unidadDeMedida, disabled: this.soloLectura},
          Validators.required,
        ],
        lungarDeEntrada: [
          {value: this.solicitudState?.lungarDeEntrada, disabled: this.soloLectura},
          Validators.required,
        ],
        medioDeTransporte: [
          {value: this.solicitudState?.medioDeTransporte, disabled: this.soloLectura},
          Validators.required,
        ],
        numeroYDescripcion: [
          {value: this.solicitudState?.numeroYDescripcion, disabled: this.soloLectura},
          Validators.required,
        ],
        codigoPostal: [
          {value: this.solicitudState?.codigoPostal, disabled: this.soloLectura},
          Validators.required,
        ],
        estado: [
          {value: this.solicitudState?.estado, disabled: this.soloLectura},
          Validators.required,
        ],
        calle: [
          {value: this.solicitudState?.calle, disabled: this.soloLectura},
          Validators.required,
        ],
        numeroExterior: [
          {value: this.solicitudState?.numeroExterior, disabled: this.soloLectura},
          Validators.required,
        ],
        numeroInterior: [
          {value: this.solicitudState?.numeroInterior, disabled: this.soloLectura},
          Validators.required,
        ],
        colonia: [
          {value: this.solicitudState?.colonia, disabled: this.soloLectura},
          Validators.required,
        ],
        fechasSeleccionadas: this.fb.array(
          (this.solicitudState?.fechasSeleccionadas ?? []).map(f => this.fb.control(f))
        ),
        entidadesSeleccionadas: this.fb.array(
          (this.solicitudState?.entidadesSeleccionadas ?? []).map(e => this.fb.control(e))
        ),
      }),
    });

    this.agregarMercanciasForm = this.fb.group({
      datosMercancia: this.fb.group({
        fraccionArancelaria: [
          {value: this.solicitudState?.fraccionArancelaria, disabled: this.soloLectura},
          [Validators.required],
        ],
        descripcionfraccionArancelaria: [
          {
            value: this.solicitudState?.descripcionFraccionArancelaria,
            disabled: true,
          },
        ],
        cantidad: [{value: this.solicitudState?.cantidad, disabled: this.soloLectura}, Validators.required],
        cantidadLetra: [
          { value: this.solicitudState?.cantidadLetra, disabled: true },
        ],
        genero: [{ value: this.solicitudState?.genero, disabled: this.soloLectura }, Validators.required],
        especie: [{ value: this.solicitudState?.especie, disabled: this.soloLectura }, Validators.required],
        nombreComun: [{ value: this.solicitudState?.nombreComun, disabled: this.soloLectura }, Validators.required],
        otroNombreComun: [{ value: this.solicitudState?.otroNombreComun, disabled: this.soloLectura }],
      }),
    });
  }

  /**
   * Inicializa los catálogos necesarios para el componente.
   */
  inicializaCatalogos(): void {
    const NUMERO_DE_CERTIFICADO$ = this.phytosanitaryReexportacionService
      .getNumeroDeCertificado()
      .pipe(
        map((resp) => {
          this.numeroDeCertificado = resp.data;
        })
      );

    const ADUANA$ = this.phytosanitaryReexportacionService.getAduana().pipe(
      map((resp) => {
        this.aduana = resp.data;
      })
    );

    const PAIS$ = this.phytosanitaryReexportacionService.getPais().pipe(
      map((resp) => {
        this.pais = resp.data;
        this.selectRangoDias = this.pais.map(
          (pais: Catalogo) => pais.descripcion
        );
      })
    );

    const ENTIDADES$ = this.phytosanitaryReexportacionService
      .getEntidades()
      .pipe(
        map((resp) => {
          this.entidades = resp.data;
          this.selectEntidades = this.entidades.map(
            (entidades: Catalogo) => entidades.descripcion
          );
        })
      );

    const DESCRIPCION_PRODUCTO$ = this.phytosanitaryReexportacionService
      .getDescripcionProducto()
      .pipe(
        map((resp) => {
          this.descripcionProducto = resp.data;
        })
      );

    const FRACCION$ = this.phytosanitaryReexportacionService
      .getFraccionArancelaria()
      .pipe(
        map((resp) => {
          this.fraccionArancelaria = resp.data;
        })
      );

    const GENERO$ = this.phytosanitaryReexportacionService.getGenero().pipe(
      map((resp) => {
        this.genero = resp.data;
      })
    );

    const ESPECIE$ = this.phytosanitaryReexportacionService.getEspecie().pipe(
      map((resp) => {
        this.especie = resp.data;
      })
    );

    const NOMBRE_COMUN$ = this.phytosanitaryReexportacionService
      .getNombreComun()
      .pipe(
        map((resp) => {
          this.nombreComun = resp.data;
        })
      );

    const UNIDAD_DE_MEDIDA$ = this.phytosanitaryReexportacionService
      .getUnidadDeMedida().pipe(
        map((resp) => {
          this.unidadDeMedida = resp.data;
        })
      );

    const MEDIO_DE_TRANSPORTE$ = this.phytosanitaryReexportacionService
      .getMedioDeTransporte()
      .pipe(
        map((resp) => {
          this.medioDeTransporte = resp.data;
        })
      );

    const ESTADO$ = this.phytosanitaryReexportacionService
      .getEstado().pipe(
        map((resp) => {
          this.estado = resp.data;
        })
      );

    merge(
      NUMERO_DE_CERTIFICADO$,
      ADUANA$,
      PAIS$,
      ENTIDADES$,
      DESCRIPCION_PRODUCTO$,
      FRACCION$,
      GENERO$,
      ESPECIE$,
      NOMBRE_COMUN$,
      UNIDAD_DE_MEDIDA$,
      MEDIO_DE_TRANSPORTE$,
      ESTADO$
    )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe();
  }

  /**
   * Obtiene el grupo de formulario relacionado con los datos de mercancía.
   * @returns El grupo de formulario `datosMercancia`.
   */
  get datosMercancia(): FormGroup {
    return this.solicitudForm.get('datosMercancia') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario de exención de impuestos.
   */
  get reexportacionForm(): FormGroup {
    return this.solicitudForm.get('reexportacionForm') as FormGroup;
  }

  /**
   * Maneja la selección del número de certificado.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  numeroDeCertificadoSeleccion(): void {
    const NUMERO_DE_CERTIFICADO = this.solicitudForm.get(
      'reexportacionForm.numeroDeCertificado'
    )?.value;
    this.store.setNumeroDeCertificado(NUMERO_DE_CERTIFICADO);
  }

  /**
   * Maneja la selección de la aduana.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  aduanaSeleccion(): void {
    const ADUANA = this.solicitudForm.get('reexportacionForm.aduana')?.value;
    this.store.setAduana(ADUANA);
  }

  /**
   * Maneja la selección del país.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  paisSeleccion(): void {
    const PAIS = this.solicitudForm.get('reexportacionForm.pais')?.value;
    this.store.setPais(PAIS);
  }

  /**
   * Maneja la selección de las entidades.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  entidadesSeleccion(): void {
    const ENTIDADES = this.solicitudForm.get(
      'reexportacionForm.entidades'
    )?.value;
    this.store.setEntidades(ENTIDADES);
  }

  /**
   * Maneja la selección de la descripción del producto.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  descripcionProductoSeleccion(): void {
    const DESCRIPCION_PRODUCTO = this.solicitudForm.get('reexportacionForm.descripcionProducto')?.value;
    this.store.setDescripcionProducto(DESCRIPCION_PRODUCTO);
  }

  /**
   * Maneja la selección de la fracción arancelaria.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  fraccionArancelariaSeleccion(): void {
    const FRACCION = this.solicitudForm.get(
      'datosMercancia.fraccionArancelaria'
    )?.value;
    this.store.setFraccionArancelaria(FRACCION);
  }

  /**
   * Maneja la selección del género.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  generoSeleccion(): void {
    const GENERO = this.solicitudForm.get('datosMercancia.genero')?.value;
    this.store.setGenero(GENERO);
  }

  /**
   * Maneja la selección de la especie.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  especieSeleccion(): void {
    const ESPECIE = this.solicitudForm.get('datosMercancia.especie')?.value;
    this.store.setEspecie(ESPECIE);
  }

  /**
   * Maneja la selección del nombre común.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  nombreComunSeleccion(): void {
    const NOMBRE_COMUN = this.solicitudForm.get(
      'datosMercancia.nombreComun'
    )?.value;
    this.store.setNombreComun(NOMBRE_COMUN);
  }

  /**
   * Maneja la selección de la unidad de medida.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  unidadDeMedidaSeleccion(): void {
    const UNIDAD_DE_MEDIDA = this.solicitudForm.get(
      'reexportacionForm.unidadDeMedida'
    )?.value;
    this.store.setUnidadDeMedida(UNIDAD_DE_MEDIDA);
  }

  /**
   * Maneja la selección del medio de transporte.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  medioDeTransporteSeleccion(): void {
    const MEDIO_DE_TRANSPORTE = this.solicitudForm.get(
      'reexportacionForm.medioDeTransporte'
    )?.value;
    this.store.setMedioDeTransporte(MEDIO_DE_TRANSPORTE);
  }

  /**
   * Maneja la selección del estado.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  estadoSeleccion(): void {
    const ESTADO = this.solicitudForm.get('reexportacionForm.estado')?.value;
    this.store.setEstado(ESTADO);
  }  
  
  /**
   * Maneja el cambio en el campo de nombre común.
   * Si el valor es 'Otro', muestra un campo adicional para ingresar otro nombre común.
   */    
  onNombreComunChange(event: Event | { value?: string } | undefined): void {
    const VALUE = 'value' in (event ?? {}) ? (event as { value?: string }).value
      : (event && (event as Event).target && ((event as Event).target as HTMLSelectElement).value) || '';
    this.setValoresStore(this.agregarMercanciasForm.get('datosMercancia') as FormGroup, 'nombreComun', 'setNombreComun');
    this.mostrarOtroNombreComun = VALUE === '1';
    
    const OTRO_CONTROL = this.agregarMercanciasForm.get('datosMercancia.otroNombreComun');
    if (OTRO_CONTROL) {
      if (this.mostrarOtroNombreComun) {
        OTRO_CONTROL.setValidators([Validators.required]);
      } else {
        OTRO_CONTROL.clearValidators();
        OTRO_CONTROL.setValue(''); 
      }
      OTRO_CONTROL.updateValueAndValidity();
    }
  }

  /**
   * Cierra el modal de agregar mercancías.
   */
  public getCrossListBtn(index: number): Array<{ btnNombre: string; class: string; funcion: () => void }> {
    return [
      {
        btnNombre: 'Agregar todos',
        class: 'btn-default',
        funcion: (): void => this.crossList.toArray()[index].agregar('t'),
      },
      {
        btnNombre: 'Agregar selección',
        class: 'btn-primary',
        funcion: (): void => this.crossList.toArray()[index].agregar(''),
      },
      {
        btnNombre: 'Restar selección',
        class: 'btn-primary',
        funcion: (): void => this.crossList.toArray()[index].quitar(''),
      },
      {
        btnNombre: 'Restar todos',
        class: 'btn-default',
        funcion: (): void => this.crossList.toArray()[index].quitar('t'),
      },
    ];
  }

  /**
   * Obtiene el array del formulario 'fechasSeleccionadas' del grupo de formulario  'datosServicio'.
   *
   * @returns {FormArray} El array de formulario 'fechasSeleccionadas'.
   */
  get fechasSeleccionadas(): FormArray {
    return this.reexportacionForm.get('fechasSeleccionadas') as FormArray;
  }

  /**
   * Obtiene el array del formulario 'entidadesSeleccionadas' del grupo de formulario  'datosServicio'.
   *
   * @returns {FormArray} El array de formulario 'entidadesSeleccionadas'.
   */
  get entidadesSeleccionadas(): FormArray {
    return this.reexportacionForm.get('entidadesSeleccionadas') as FormArray;
  }

  /**
   * Actualiza la lista de fechas seleccionadas y las almacena en el estado.
   * 
   * @param fechas - Arreglo de fechas a agregar.
   * @returns void
   */
  changeCrosslist(fechas: string[]): void {
    const FECHA = this.fb.array(fechas.map(fecha => this.fb.control(fecha)));
    this.reexportacionForm.setControl('fechasSeleccionadas', FECHA);
    this.store.setFechasSeleccionadas(fechas);
  }

  /**
   * Actualiza la lista de entidades seleccionadas y las almacena en el estado.
   * 
   * @param entidades - Arreglo de entidades a agregar.
   * @returns void
   */
  changeCrosslistEntidades(entidades: string[]): void {
    const FECHA = this.fb.array(entidades.map(entidad => this.fb.control(entidad)));
    this.reexportacionForm.setControl('entidadesSeleccionadas', FECHA);
    this.store.setEntidadesSeleccionadas(entidades);
  }

  /**
   * Agrega un nuevo detalle a la lista de detalles.
   * Obtiene los datos del servicio y los agrega a la lista local y al store.
   */
  agregarDetalle(): void {
    this.phytosanitaryReexportacionService
      .agregarDetalle()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta?.success) {
          respuesta.datos.id = this.datosDetalle.length + 1;
          this.datosDetalle = [...this.datosDetalle, respuesta.datos];
          (
            this.store.setDatosDetalle as unknown as (
              valor: DatosDetalle[]
            ) => void
          )(this.datosDetalle);
        }
      });
  }

  /**
   * Agrega una nueva solicitud a la lista de solicitudes.
   * Obtiene los datos del servicio y los agrega a la lista local y al store.
   * También reinicia el formulario de la solicitud.
   */
  agregarSolicitud(): void {
    if (this.agregarMercanciasForm.valid) {
      this.phytosanitaryReexportacionService.agregarSolicitud().pipe(takeUntil(this.destroyNotifier$))
        .subscribe((respuesta) => {
          if (respuesta?.success) {
            respuesta.datos.id = this.datosSolicitud.length + 1;
            this.datosSolicitud = [...this.datosSolicitud, respuesta.datos];
            this.store.setDatosSolicitud(this.datosSolicitud);
            this.solicitudForm.patchValue({
              fraccionArancelaria: this.solicitudState?.fraccionArancelaria,
              cantidad: this.solicitudState?.cantidad,
              cantidadLetra: this.solicitudState?.cantidadLetra,
            });
            this.solicitudForm.reset();
            this.solicitudForm.markAsUntouched();
            this.solicitudForm.markAsPristine();
            this.cerrarModal();
          }
        });
    } else {
      this.agregarMercanciasForm.markAllAsTouched();
    }
  }

  /**
   * Maneja el cambio de filas seleccionadas en la tabla de solicitudes.
   * @param selectedRows Lista de filas seleccionadas en la tabla de solicitudes.
   */
  onSelectedRowsChange(selectedRows: DatosSolicitud[]): void {
    this.selectedRows = selectedRows.map(row => row.id);
  }

  /**
   * Elimina las filas seleccionadas de la tabla de solicitudes.
   */
  eliminar(): void {
    if (this.selectedRows && this.selectedRows.length > 0) {
      this.datosSolicitud = this.datosSolicitud.filter(row => !this.selectedRows.includes(row.id));
      this.store.setDatosSolicitud(this.datosSolicitud);
      this.selectedRows = [];
    } else {
      if (this.modalConfirmacion) {
        const MODEL = new Modal(this.modalConfirmacion.nativeElement);
        MODEL.show();
      }
    }
  }

  /**
   * Modifica las filas seleccionadas en la tabla de solicitudes.
   * Abre un modal para realizar los cambios.
   */
  modificar(): void {
    if (this.selectedRows && this.selectedRows.length > 0) {
      this.agregarMercanciasForm.patchValue(this.selectedRows);
      if (this.modalRef) {
        const MODEL = new Modal(this.modalRef.nativeElement);
        MODEL.show();
      }
    } else {
      if (this.modalConfirmacion) {
        const MODEL = new Modal(this.modalConfirmacion.nativeElement);
        MODEL.show();
      }
    }
  }

  /**
   * Agrega mercancías al formulario de solicitud.
   * Si no hay descripción del producto, muestra un modal de confirmación.
   * Si hay descripción del producto, muestra el modal para agregar mercancías.
   */
  agregarMercancia(): void {
    const SELECTED_PRODUCTO = this.solicitudForm.get('reexportacionForm.descripcionProducto')?.value;
    if (!SELECTED_PRODUCTO) {
      if (this.modalConfirmacion) {
        const MODEL = new Modal(this.modalConfirmacion.nativeElement);
        MODEL.show();
      }
    } else {
      if (this.modalRef) {
        const MODEL = new Modal(this.modalRef.nativeElement);
        MODEL.show();
      }
    }
  }

  /**
   * Maneja el cambio de filas seleccionadas en la tabla de detalles.
   * @param selectedRowsDetalle Lista de filas seleccionadas en la tabla de detalles.
   */
  onSelectedRows(selectedRowsDetalle: DatosDetalle[]): void {
    this.selectedRowsDetalle = selectedRowsDetalle.map(row => row.id);
  }

  /**
   * Elimina las filas seleccionadas de la tabla de detalles.
   */
  eliminarDetalle(): void {
    if (this.selectedRowsDetalle && this.selectedRowsDetalle.length > 0) { 
      this.datosDetalle = this.datosDetalle.filter(row => !this.selectedRowsDetalle.includes(row.id));
      this.store.setDatosDetalle(this.datosDetalle);
      this.selectedRowsDetalle = [];
    }
  }

  /**
   * Limpiar formulario.
   */
  limpiar(): void {
    this.agregarMercanciasForm.reset();
  }


  /**
   * Cierra el modal actual.
   */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /**
   * Verifica si el control del formulario es inválido y ha sido tocado.
   * @param {string} id El nombre del control del formulario.
   * @returns {boolean | undefined} `true` si el control es inválido y tocado, `null` si no existe el control.
   */
  isInvalid(id: string): boolean | undefined {
    const CONTROL = this.agregarMercanciasForm.get('datosMercancia')?.get(id);
    return CONTROL ? CONTROL.invalid && CONTROL.touched : undefined;
  }

  /**
   * Establece valores en el store del trámite.
   * @param form Formulario del cual se obtiene el valor.
   * @param campo Nombre del campo del formulario.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite230202Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }
}
