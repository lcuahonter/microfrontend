import { AlertComponent,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  CrosslistComponent,
  InputRadioComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  ValidacionesFormularioService
} from '@libs/shared/data-access-user/src'
import {
  Catalogo,
  Solicitud10301State,
  Tramite10301Store,
} from '../../estados/tramite10301.store';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DatosMercancia, RespuestaCatalog } from '../../models/importador-exportador.model';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, Subscription, map, merge, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImportadorExportadorService } from '../../services/importador-exportador.service';
import { Modal } from 'bootstrap';
import { Solicitud10301Service } from '../../services/solicitud10301.service';
import { Tramite10301Query } from '../../estados/tramite10301.query';

/** Texto de adjuntar para terceros */
const TERCEROS_TEXTO_DE_ADJUNTAR =
  'Debes capturar la descripción de la mercancía en los mismos términos de la carta de donación';

/**
 * @component DatosDelTramiteComponent
 * @description Componente para gestionar datos del trámite 10301
 */
@Component({
  selector: 'app-datos-del-tramite',
  templateUrl: './datos-del-tramite.component.html',
  styleUrls: ['./datos-del-tramite.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    TituloComponent,
    TablaDinamicaComponent,
    AlertComponent,
    CrosslistComponent,
    InputRadioComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class DatosDelTramiteComponent implements OnInit, OnDestroy {
  /** Indica si se está editando una mercancía */
  isEditando = false;
  /** ID de la mercancía que se está editando */
  idEditando: number | null = null;
 
  /** Suscripciones a observables */
  private subscriptions: Subscription[] = [];

  /** Estado de la solicitud */
  public solicitudState!: Solicitud10301State;

  /** Notificador para destruir observables */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Suscripción para obtener el catálogo de aduanas */
  getAduanaIngresaraSubscription!: Subscription;

  /** Suscripción para obtener el catálogo de años */
  getAnoSubscription!: Subscription;

  /** Suscripción para obtener el catálogo de condiciones */
  getCondicionSubscription!: Subscription;

  /** Suscripción para obtener el catálogo de países */
  getPaisSubscription!: Subscription;

  /** Texto de adjuntar para terceros */
  TEXTO_DE_ADJUNTAR: string = TERCEROS_TEXTO_DE_ADJUNTAR;

  /** Lista de fines elegidos */
  finesElegidos: string[] = [];

  /** Lista de fines elegidos seleccionados */
  elegidosSeleccionados: string[] = [];

  /** Catálogo de aduanas */
  aduana!: Catalogo[];

  /** Catálogo de años */
  ano!: Catalogo[];

  /** Catálogo de condiciones */
  condicion!: Catalogo[];

  /** Catálogo de países */
  pais!: Catalogo[];

  /** Lista de rangos de días seleccionados */
  selectRangoDias: string[] = [];

  /** Control de formulario para la fecha */
  fecha: FormControl = new FormControl('');

  /** Control de formulario para la fecha seleccionada */
  fechaSeleccionada: FormControl = new FormControl('');

  /** Formulario de trámite */
  tramiteForm!: FormGroup;

  /** Valor seleccionado del radio */
  valorSeleccionado!: string;

  /** Indica si el formulario está en modo solo lectura */
  esFormularioSoloLectura: boolean = false;

  /** Indica si el formulario es de solo lectura */
  formularioDeshabilitado: boolean = true;

  /** Indica si es país */
  isPais: boolean = false;

  /** Indica si es desplegable de países */
  isDesplegableDepaises: boolean = false;

  /** Indica si es aduana de mercancía */
  isAdunaMarcancia: boolean = false;

  /** Referencia a los componentes Crosslist en la vista */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /** Botones para gestionar la lista de países de origen */
  public finesDeMercanciaBotons = this.obtenerCrossListBtn();

  /**
   * Devuelve la configuración de los botones para gestionar la lista de países de origen en el Crosslist
   * @returns Configuración de botones del crosslist
   */
  public obtenerCrossListBtn(): Array<{ btnNombre: string; class: string; funcion: () => void }> {
    return [
      {
        btnNombre: 'Agregar todos',
        class: 'btn-default',
        funcion: (): void => this.crossList.forEach(cmp => cmp.agregar('t')),
      },
      {
        btnNombre: 'Agregar selección',
        class: 'btn-primary',
        funcion: (): void => this.crossList.forEach(cmp => cmp.agregar('')),
      },
      {
        btnNombre: 'Restar selección',
        class: 'btn-primary',
        funcion: (): void => this.crossList.forEach(cmp => cmp.quitar('')),
      },
      {
        btnNombre: 'Restar todos',
        class: 'btn-default',
        funcion: (): void => this.crossList.forEach(cmp => cmp.quitar('t')),
      },
    ];
  }

  /**
   * Lista de catálogos disponibles para países.
   */
  fines!: Catalogo[];

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Referencia al elemento del modal para agregar mercancías.
   */
  @ViewChild('modalAgregarMercancias') modalElement!: ElementRef;

  /**
  * Referencia al modal de confirmación.
  */
  @ViewChild('modalConfirmacion', { static: false }) modalConfirmacion!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal Confirmacion.
   */
  @ViewChild('closeModalConfirmacion') closeModalConfirmacion!: ElementRef;

  /**
   * Formulario para agregar mercancías.
   */
  agregarMercanciasForm!: FormGroup;

  /**
   * Filas seleccionadas en la tabla.
   */
  filaSeleccionadas: number[] = [];

  /**
   * Configuración de la tabla de selección.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Lista de datos de la solicitud.
   */
  public mercanciaDatos: DatosMercancia[] = [];

  /**
   * Configuración de las columnas de la tabla de solicitudes.
   */
  public encabezadoDeTabla: ConfiguracionColumna<DatosMercancia>[] = [
    { encabezado: '', clave: (articulo) => articulo.id, orden: 1 },
    {
      encabezado: 'Fines a los que se destinará la mercancía',
      clave: (articulo) => articulo.fines,
      orden: 2,
    },
    {
      encabezado: 'Tipo de mercancía',
      clave: (articulo) => articulo.tipoMercancia,
      orden: 3,
    },
    {
      encabezado: 'Año',
      clave: (articulo) => articulo.ano,
      orden: 4,
    },
    {
      encabezado: 'Modelo',
      clave: (articulo) => articulo.modelo,
      orden: 5,
    },
    {
      encabezado: 'Marca',
      clave: (articulo) => articulo.marca,
      orden: 6,
    },
    {
      encabezado: 'Número de serie',
      clave: (articulo) => articulo.serie,
      orden: 7,
    },
    {
      encabezado: 'Uso específico de la mercancía',
      clave: (articulo) => articulo.usoEspecifico,
      orden: 8,
    },
    {
      encabezado: 'Condición de la mercancía',
      clave: (articulo) => articulo.condicion,
      orden: 9,
    }
  ];

  /**
   * Constructor que se utiliza para la inyección de dependencias.
   * Constructor que se utiliza para la inyección de dependencias.
   * @param importarExportar Servicio de importador/exportador.
   * @param importarExportar Servicio de importador/exportador.
   * @param store Store de Akita para gestionar el estado.
   * @param query Query de Akita para seleccionar el estado.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param validacionesService Servicio de validaciones de formularios.
   * * Este componente se encarga de manejar los datos del trámite 10301, incluyendo la gestión de fechas,
   * * la selección de aduanas, años, condiciones y países, así como la validación del formulario.
   * @remarks
   * Este componente se encarga de manejar los datos del trámite 10301, incluyendo la gestión de fechas,
   * la selección de aduanas, años, condiciones y países, así como la validación del formulario.
   * Este componente es parte de la aplicación de gestión de trámites aduaneros y se
   * utiliza para capturar y validar la información relacionada con el trámite 10301.
   */
  constructor(
    private consultaioQuery: ConsultaioQuery,
    private importarExportar: ImportadorExportadorService,
    private store: Tramite10301Store,
    private query: Tramite10301Query,
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private solicitud10301Service: Solicitud10301Service
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Este método se utiliza para marcar los controles del formulario como tocados. - 10301
   */
  validarDestinatarioFormulario(): void {
    if (this.tramiteForm.invalid) {
      this.tramiteForm.markAllAsTouched();
    }
  }

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.donanteDomicilio();
    this.inicializaCatalogos();
    this.inicializarEstadoFormulario();
    this.cargarDatosTablaData();
  }

  /**
   * Inicializa el estado del formulario según si es de solo lectura o no.
   * Si es de solo lectura, guarda los datos del formulario; de lo contrario, inicializa el formulario con los datos del donante y domicilio.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.tramiteForm.disable();
    } else {
      this.tramiteForm.enable();
    }
  }

  /**
   * Opciones de radio.
   */
  radioOpcions = [
    { label: 'Sí', value: 'sí' },
    { label: 'No', value: 'no' },
  ];

  /**
   * Cargar datos de la tabla.
   */
  cargarDatosTablaData(): void {
    this.solicitud10301Service
      .obtenerDatosTableData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: RespuestaCatalog[]) => {
        this.mercanciaDatos = data as unknown as DatosMercancia[];
      });
  }

  /**
   * Cambia el valor seleccionado del radio.
   * @param value Valor seleccionado.
   */
  cambiarRadio(value: string | number): void {
    this.valorSeleccionado = value as string;
    this.store.setValorSeleccionado(this.valorSeleccionado);
  }

  /**
   * Inicializa los catálogos necesarios para el componente.
   */
  inicializaCatalogos(): void {
    const FINES$ = this.importarExportar.getFinesDeMercancia().pipe(
      map((resp) => {
        this.fines = resp.data;
        this.selectRangoDias = this.fines.map(
          (fines: Catalogo) => fines.descripcion
        );
      })
    );

    const CONDICION$ = this.importarExportar
      .getCondicion()
      .pipe(
        map((resp) => {
          this.condicion = resp.data;
        })
      );

    const ADUANA$ = this.importarExportar
      .getAduanaIngresara()
      .pipe(
        map((resp) => {
          this.aduana = resp.data;
        })
      );

    const ANO$ = this.importarExportar
      .getAno()
      .pipe(
        map((resp) => {
          this.ano = resp.data;
        })
      );

    const PAIS$ = this.importarExportar
      .getPais()
      .pipe(
        map((resp) => {
          this.pais = resp.data;
        })
      );

    merge(FINES$, CONDICION$, ADUANA$, ANO$, PAIS$).pipe(takeUntil(this.destroyNotifier$)).subscribe();
  }

  /**
   * Maneja el cambio de filas seleccionadas en la tabla de solicitudes.
   * @param filaSeleccionadas Lista de filas seleccionadas en la tabla de solicitudes.
   */
  onSelectedRowsChange(filaSeleccionadas: DatosMercancia[]): void {
    this.filaSeleccionadas = filaSeleccionadas.map(row => row.id);
  }

  /**
   * Verifica si un campo del formulario es válido.
   *
   * @param {FormGroup} form - El formulario que contiene el campo.
   * @param {string} field - El nombre del campo a verificar.
   * @returns {boolean} - Retorna true si el campo es válido, de lo contrario false.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Establece los valores en el store de tramite10301.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite10301Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
    this.importadorExportador.get(campo)?.updateValueAndValidity();

  }
  /**
   * Obtiene el grupo de formulario de importador/exportador.
   *
   * @returns {FormGroup} - El grupo de formulario de importador/exportador.
   */
  get importadorExportador(): FormGroup {
    return this.tramiteForm.get('importadorExportador') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario de datos de mercancía.
   *
   * @returns {FormGroup} - El grupo de formulario de datos de mercancía.
   */
  get datosMercancia(): FormGroup {
    return this.agregarMercanciasForm.get('datosMercancia') as FormGroup;
  }

  /**
   * Inicializa el formulario de donante y domicilio con los valores del estado de la solicitud.
   */
  donanteDomicilio(): void {

    this.tramiteForm = this.fb.group({
      importadorExportador: this.fb.group({
        aduana: [this.solicitudState?.aduana, Validators.required],
        nombre: [
          this.solicitudState?.nombre,
          [Validators.required, Validators.maxLength(50)],
        ],
        manifesto: [this.solicitudState?.manifesto, Validators.required],
        calle: [
          this.solicitudState?.calle,
          [Validators.required, Validators.maxLength(100)],
        ],
        numeroExterior: [
          this.solicitudState?.numeroExterior,
          [Validators.required, Validators.maxLength(10)],
        ],
        numeroInterior: [
          this.solicitudState?.numeroInterior,
          [Validators.maxLength(10)],
        ],
        telefono: [
          this.solicitudState?.telefono,
          [Validators.required, Validators.pattern(/^\d{10}$/)],
        ],
        correoElectronico: [
          this.solicitudState?.correoElectronico,
          [Validators.required, Validators.email],
        ],
        pais: [this.solicitudState?.pais, Validators.required],
        codigoPostal: [
          this.solicitudState?.codigoPostal,
          [Validators.required, Validators.pattern(/^\d{5}$/)],
        ],
        estado: [
          this.solicitudState?.estado,
          [Validators.required, Validators.maxLength(50)],
        ],
        colonia: [
          this.solicitudState?.colonia,
          [Validators.required, Validators.maxLength(50)],
        ],
        opcion: [this.solicitudState?.opcion],
      }),
    });

    this.agregarMercanciasForm = this.fb.group({
      datosMercancia: this.fb.group({
        finesElegidos: [this.solicitudState?.finesElegidos, Validators.required],
        tipoMercancia: [
          this.solicitudState?.tipoMercancia,
          [Validators.required, Validators.maxLength(100)],
        ],
        usoEspecifico: [
          this.solicitudState?.usoEspecifico,
          [Validators.required, Validators.maxLength(512)],
        ],
        condicion: [this.solicitudState?.condicion, Validators.required],
        marca: [
          this.solicitudState?.marca,
          [Validators.required, Validators.maxLength(50)],
        ],
        ano: [this.solicitudState?.ano, [Validators.required]],
        modelo: [
          this.solicitudState?.modelo,
          [Validators.required, Validators.maxLength(50)],
        ],
        serie: [
          this.solicitudState?.serie,
          [Validators.required, Validators.maxLength(50)],
        ],
        fechasSeleccionadas: this.fb.array([])
      }),
    });

  }

  /** Cierra el modal actual */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /** Agrega una nueva mercancía al listado */
  agregarMercancia(): void {
    const FINES = this.agregarMercanciasForm.value.datosMercancia.finesElegidos;
    const TIPOMERCANCIA = this.agregarMercanciasForm.value.datosMercancia.tipoMercancia;
    const USOESPECIFICO = this.agregarMercanciasForm.value.datosMercancia.usoEspecifico;
    const CONDICION = this.agregarMercanciasForm.value.datosMercancia.condicion;

    if (FINES && TIPOMERCANCIA && USOESPECIFICO && CONDICION) {
      this.importarExportar.agregarMercancia().pipe(takeUntil(this.destroyNotifier$)).subscribe(
        (respuesta) => {
          if (respuesta?.success) {
            respuesta.datos.id = this.mercanciaDatos.length + 1;
            this.mercanciaDatos = [...this.mercanciaDatos, respuesta.datos];
            (this.store.setDatosMercancia as (valor: DatosMercancia[]) => void)(this.mercanciaDatos);
            this.agregarMercanciasForm.reset();
            this.agregarMercanciasForm.markAsUntouched();
            this.agregarMercanciasForm.markAsPristine();
            this.cerrarModal();
            if (this.modalConfirmacion) {
              const MODEL = new Modal(this.modalConfirmacion.nativeElement);
              MODEL.show();
            }
          }
        }
      );
    } else {
      this.agregarMercanciasForm.markAllAsTouched();
    }
  }

  /**
   * Abre el modal de confirmación.
   */
  condicionSeleccion(): void {
    const CONDICION = this.agregarMercanciasForm.get('datosMercancia.condicion')?.value;
    this.store.setCondicion(CONDICION);
  }

  /** Maneja la selección de aduana */
  aduanaSeleccion(): void {
    const ADUANA = this.tramiteForm.get('importadorExportador.aduana')?.value;
    this.store.setAduana(ADUANA);
  }

  /**
   * Maneja la selección de la ano.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  anoSeleccion(): void {
    const ANO = this.agregarMercanciasForm.get('datosMercancia.ano')?.value;
    this.store.setAduana(ANO);
  }
  /**
   * Maneja la selección de la pais.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  paisSeleccion(): void {
    const PAIS = this.tramiteForm.get('importadorExportador.pais')?.value;
    this.store.setAduana(PAIS);
  }

  /**
   * Limpiar mercancias del formulario.
   */
  limpiarMercancias(): void {
    this.agregarMercanciasForm.reset();
  }

  /**
   * Elimina las filas seleccionadas de la tabla de solicitudes.
   */
  eliminar(): void {
    if (this.filaSeleccionadas && this.filaSeleccionadas.length > 0) {
      this.mercanciaDatos = this.mercanciaDatos.filter(row => !this.filaSeleccionadas.includes(row.id));
      this.store.setDatosMercancia(this.mercanciaDatos);
      this.filaSeleccionadas = [];
    }
  }

  /**
 * Modifica las filas seleccionadas en la tabla de solicitudes.
 * Abre un modal para realizar los cambios.
 */
  modificar(): void {
    if (this.filaSeleccionadas && this.filaSeleccionadas.length > 0) {
      const SELECTEDID= this.filaSeleccionadas[0];
      const SELECTEDDATA = this.mercanciaDatos.find(row => row.id === SELECTEDID);
      if (SELECTEDDATA) {
        this.agregarMercanciasForm.patchValue({ datosMercancia: SELECTEDDATA });
        this.isEditando = true;
        this.idEditando = SELECTEDID;
      }
      if (this.modalElement) {
        const MODEL = new Modal(this.modalElement.nativeElement);
        MODEL.show();
      }
    } else {
      const MODELMODIFICARELEMENT = document.getElementById('modalModificar');
      if (MODELMODIFICARELEMENT) {
        const MODELMODIFICAR = new Modal(MODELMODIFICARELEMENT);
        MODELMODIFICAR.show();
      }
    }
  }

  /**
   * @method guardarEdicion
   * @description Guarda los cambios realizados en la edición de una mercancía seleccionada en la tabla.
   * Actualiza el registro correspondiente en la lista, reinicia el formulario y cierra el modal de edición.
   * Si no hay un elemento seleccionado, no realiza ninguna acción.
   */
  guardarEdicion(): void {
    if (this.idEditando !== null) {
      const INDEX = this.mercanciaDatos.findIndex(row => row.id === this.idEditando);
      if (INDEX !== -1) {
        const DATOSEDITADOS= this.agregarMercanciasForm.value.datosMercancia;
        DATOSEDITADOS.id = this.idEditando;
        this.mercanciaDatos[INDEX] = { ...this.mercanciaDatos[INDEX], ...DATOSEDITADOS };
        this.mercanciaDatos = [...this.mercanciaDatos]; 
        (this.store.setDatosMercancia as (valor: DatosMercancia[]) => void)(this.mercanciaDatos);
        this.isEditando = false;
        this.idEditando = null;
        this.agregarMercanciasForm.reset();
        this.agregarMercanciasForm.markAsUntouched();
        this.agregarMercanciasForm.markAsPristine();
        this.cerrarModal();
      }
    }
  }

  /**
   * Obtiene el array del formulario 'fechasSeleccionadas' del grupo de formulario  'datosServicio'.
   *
   * @returns {FormArray} El array de formulario 'fechasSeleccionadas'.
   */
  get fechasSeleccionadas(): FormArray {
    return (this.tramiteForm.get('fechasSeleccionadas') as FormArray) ?? this.fb.array([]);
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
   * Actualiza la lista de fechas seleccionadas y las almacena en el estado.
   * 
   * @param fechas - Arreglo de fechas a agregar.
   * @returns void
   */
  changeCrosslist(fechas: string[]): void {
    const FECHAS = new FormArray([...fechas.map(fecha => new FormControl(fecha))]);
    (this.agregarMercanciasForm.get('datosMercancia') as FormGroup).setControl('fechasSeleccionadas', FECHAS);
    this.store.setFechasSeleccionadas(fechas);
  }

  /**
   * Método de limpieza que se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    if (this.getAduanaIngresaraSubscription) {
      this.getAduanaIngresaraSubscription.unsubscribe();
    }
    if (this.getAnoSubscription) {
      this.getAnoSubscription.unsubscribe();
    }
    if (this.getPaisSubscription) {
      this.getPaisSubscription.unsubscribe();
    }
    if (this.getCondicionSubscription) {
      this.getCondicionSubscription.unsubscribe();
    }
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}