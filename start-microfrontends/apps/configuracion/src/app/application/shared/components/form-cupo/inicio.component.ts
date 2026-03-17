import { AlertComponent, ConfiguracionColumna, InputFecha, InputFechaComponent, ModalComponent, PickListComponent, TablaDinamicaComponent, TablaSeleccion } from "@libs/shared/data-access-user/src";
import { CUSTOM_ELEMENTS_SCHEMA, Component, DestroyRef, EventEmitter, Input, OnInit, Output, WritableSignal, computed, inject, signal } from "@angular/core";
import { DatosDelMonto, FormCupo, FormCupoControls, FormMontoControls, ProductoFormCupo } from "../../models/form-cupo";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FraccionesRestrucuradas, ModalFracciones, ModalesHabilitados } from "../../enum/fracciones-arancelarias";
import { Observable, Subject, buffer, debounceTime, filter, map, takeUntil } from "rxjs";
import { TipoForm, TipoModal } from "../../enum/form-cupo";
import { AsyncPipe } from "@angular/common";
import { FormTextilControls } from "../../models/form-textil";
import { FraccionesArancelariasComponent } from "../fracciones/fracciones-arancelarias.component";
import { FraccionesArancelariasOutput } from "../../models/fracciones-arancelarias.model";
import { ListaSelect } from "../../../core/models/certificados/configuracion/registrar/response/listaSelect";
import { ModalAgregarFraccionesComponent } from "../modal-agregar-fracciones/modal-agregar-fracciones.component";
import { ModalControl } from "../../enum/modal-control";
import { MundiaService } from "../../services/mundial.service";
import { Producto } from "../../models/productos.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { tratadosSelectService } from "../../../core/services/selects/tratados.service";

interface CategoriaTexitil {
    codigo: string,
    descripcion: string
}
@Component({
    standalone: true,
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.scss',
    imports: [PickListComponent, AsyncPipe, ModalComponent, TablaDinamicaComponent, AlertComponent, ReactiveFormsModule, InputFechaComponent, FraccionesArancelariasComponent, ModalAgregarFraccionesComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    selector: 'lib-form-cupo'
})
export class FormCupoComponent implements OnInit {
    /**
     * Output que emite al componente padre los datos del formulario de cupo.
     *
     * Se dispara normalmente cuando el formulario es enviado o confirmado,
     * permitiendo al componente padre procesar o persistir la información.
     */
    @Output() EnviarForm = new EventEmitter<FormCupo>();
    /**
     * Define el titulo del formulario.
     */
    @Input() TituloForm: string = 'Registrar Configuración de Instrumento-CUPO'
    /**
     * Formulario reactivo de cupo.
     *
     * Contiene la definición y los controles necesarios para la captura
     * de la información relacionada con el cupo.
     */
    public formCupo!: FormGroup<FormCupoControls>;
    public formTextil!: FormGroup<FormTextilControls>;
    /**
     * Referencia para controlar el ciclo de vida del componente.
     *
     * Se utiliza para gestionar la destrucción automática de recursos
     * y suscripciones asociadas al componente mediante `DestroyRef`.
     */
    private destroyRef = inject(DestroyRef);

    /**
     * Signal para manejar las alertas
     */
    public alerta = signal<{ mensaje: string, tipo: string, visible: boolean, alerta: 'GENERAL' | 'MODAL' }>({
        mensaje: '',
        tipo: 'alert-danger' as const,
        visible: false,
        alerta: 'GENERAL'
    });
    /**
     * establece los tipos de modales
     */
    public TipoModal = TipoModal;

    // @Output() formRes
    /**
     * Observable que contiene la lista de tratados disponibles.
     *
     * Se utiliza generalmente para poblar un componente de selección
     * (por ejemplo, un `select`) mediante el uso de `async pipe`.
     */
    public listaTratados$: Observable<ListaSelect[]>;
    /**
     * Signal que contiene la lista de elementos disponibles.
     *
     * Representa los países que pueden ser seleccionados y se utiliza
     * como fuente de datos para el componente PickList.
     */
    public disponibles = signal<ListaSelect[]>([]);
    /**
     * Varibales para controlar la visivilidad, clase y mensaje del modal.
     */
    public mensajeAlerta: string = "";
    public customClass: string = "alert-danger";
    public alertaVisible: boolean = false;
    /**
     * controladores de visivilidad de modales
     */

    public modalesVisibles: Record<TipoModal, boolean> = {
        [TipoModal.PRODUCTOS]: false,
        [TipoModal.MONTO]: false,
        [TipoModal.TEXTIL]: false,
        [TipoModal.FRACCIONES_ARANCELARIAS]: false,
        [TipoModal.FRACCIONES_USA]: false
    }

    public ModalControl = ModalControl;

    /**
     * input del valor de intrumento solo asignado por el padre
     */
    @Input() instrumento: string = "Cupo Mundial";
    public TipoForm = TipoForm;
    /**
     * Input para definir el tipo de formulario
     */
    @Input() formType: TipoForm = TipoForm.REGISTRAR_CUPO;
    /**
     * Variable para almacenar el array de productos seleccionados
     */
    private productoSeleccionado: Producto[] = [];
    /**
     * Variable para almacenar los productos obtenido del fetch
     */
    public productos: Producto[] = [];
    /**
     * Formulario de monto.
     */
    public FormMonto!: FormGroup<FormMontoControls>;
    /**
     * Configuración del input de fecha de inicio.
     *
     * Define las propiedades y comportamiento del componente
     * de fecha utilizado para capturar la fecha inicial.
     */

    public fechaInicioInput: InputFecha = {
        labelNombre: 'Fecha Inicio',
        habilitado: true,
        required: true,
    };
    public fechaFinInput: InputFecha = {
        labelNombre: 'Fecha Fin',
        habilitado: true,
        required: true,
    };

    /**
     * Configuración de la tabla de selección.
     */
    TablaSeleccion = TablaSeleccion;

    public configuracionTabla: ConfiguracionColumna<Producto>[] = [
        {
            encabezado: 'NOMBRE PRODUCTO',
            clave: (data) => data.nombre,
            orden: 0
        },
        {
            encabezado: "DESCRIPCIÓN",
            clave: (data) => data.descripcion,
            orden: 1
        },
        {
            encabezado: "CÓDIGO",
            clave: (data) => data.clave,
            orden: 2
        }
    ]
    public configuracionTablaTextil: ConfiguracionColumna<CategoriaTexitil>[] = [
        {
            encabezado: 'CÓDIGO',
            clave: (data) => data.codigo,
            orden: 1
        },
        {
            encabezado: 'DESCRIPCIÓN',
            clave: (data) => data.descripcion,
            orden: 2
        }
    ]
    public configuracionTablaFraccionesTextil: ConfiguracionColumna<FraccionesRestrucuradas>[] = [
        {
            encabezado: 'FRACCIÓN',
            clave: (dato) => dato.id,
            orden: 1
        },
        {
            encabezado: 'DESCRIPCIÓN',
            clave: (dato) => dato.titulo,
            orden: 2
        }
    ]
    /**
     * Observable para cargar las opciones de seleccion de medidas
     */

    public medidas$: Observable<ListaSelect[]>;


    constructor(
        private fb: FormBuilder,
        private selectService: tratadosSelectService,
        private mundialService: MundiaService
    ) {
        this.listaTratados$ = this.selectService.obtenerListaTratados();
        this.medidas$ = this.selectService.obtenerMedidas();
    }
    /**
     * Metodo para inicializar el formulario principal
     */
    private inicializarForm(): void {
        this.formCupo = this.fb.group<FormCupoControls>({
            instrumento: this.fb.control(this.instrumento, { nonNullable: true }),
            clasificacionRegimen: this.fb.control('', { nonNullable: true }),
            clasificacionSubProducto: this.fb.group({
                clasificacion: ['', { nonNullable: true }],
                otro: ['', { nonNullable: true }]
            }, { nonNullable: true }),
            tratadoAcuerdo: this.fb.control('', { nonNullable: true }),
            listaTratados: this.fb.control<ListaSelect[]>([], { nonNullable: true }),
            producto: this.fb.control<ProductoFormCupo>({
                id: 0,
                clave: 0,
                nombre: "",
                descripcion: "",
                sigla: ""
            }, { nonNullable: true }),
            unidadMedida: this.fb.control('', { nonNullable: true }),
            unidadMedidaComercializacion: this.fb.control(false, { nonNullable: true }),
            datosDelMonto: this.fb.control<DatosDelMonto>({
                montoTotalCupo: "",
                montoTotalSubCupo: "",
                saldoExpedidoCupo: "",
                saldoEjercidoCupo: "",
                saldoEjercidoMCE: "",
                saldoCupo: "",
                saldoSubCupo: "",
                fundamentoCupo: "",
                fundamentoSubCupo: ""
            }, { nonNullable: true }),
            fraccionesArancelarias: this.fb.control<FraccionesArancelariasOutput[]>([], { nonNullable: true }),
            vigenciaInicio: this.fb.control('', { nonNullable: true }),
            vigenciaFin: this.fb.control('', { nonNullable: true }),
            fundamento: this.fb.control('', { nonNullable: true })
        });
    }

    public inicializarFormTextil(): void {
        this.formTextil = this.fb.group<FormTextilControls>({
            categoriaTextil: this.fb.control('', { nonNullable: true }),
            tipoFraccion: this.fb.control('', { nonNullable: true }),
            fraccionesArancelarias: this.fb.control([], { nonNullable: true })
        })
    }

    /**
     * Obtiene la lista de países o bloques de países.
     *
     * Consume el servicio correspondiente y asigna la información
     * recibida a la variable `listaBloquePais`, la cual se utiliza
     * para renderizar los datos en la vista.
     */
    public obtenerListaPais(): void {
        this.selectService.obtenerListaPais().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => { this.disponibles.set(res); })
    }
    /**
     * Signal que contiene la lista de elementos seleccionados.
     *
     * Almacena los países que han sido elegidos por el usuario y se
     * utiliza para renderizar la lista de seleccionados.
     */
    public seleccionados = signal<ListaSelect[]>([]);
    /**
     * Función utilizada para identificar de forma única cada país.
     *
     * Se emplea como función `trackBy` para optimizar el renderizado
     * de las listas y evitar recreaciones innecesarias del DOM.
     *
     * @param pais País a identificar.
     * @returns Identificador único del país.
     */
    trackByPais = (pais: ListaSelect): string => pais.value;
    /**
     * Función utilizada para obtener el texto visible de un país.
     *
     * Se emplea como función `displayWith` para mostrar el nombre
     * legible del país dentro del componente PickList.
     *
     * @param pais País a mostrar.
     * @returns Etiqueta visible del país.
     */
    displayPais = (pais: ListaSelect): string => pais.label;

    private actualizarSeleccionados(): void {
        this.formCupo.get('listaTratados')?.setValue(this.seleccionados())
    }
    /**
     * Agrega un elemento a seleccionados y lo quita de disponibles
     */
    public agregar(item: ListaSelect): void {
        this.moverItems([item], this.seleccionados, this.disponibles);
    }
    /**
     * Agrega todos los disponibles a seleccionados
     */
    public agregarTodos(): void {
        this.moverItems(this.disponibles(), this.seleccionados, this.disponibles, true);
    }
    /**
     * Elimina un elemento de seleccionados y lo regresa a disponibles
     */
    public eliminar(item: ListaSelect): void {
        this.moverItems([item], this.disponibles, this.seleccionados);
    }
    /**
     * Elimina todos los seleccionados y los regresa a disponibles
     */
    public eliminarTodos(): void {
        this.moverItems(this.seleccionados(), this.disponibles, this.seleccionados, true);
    }

    /**
     * Mueve items de una lista origen a una lista destino
     */
    private moverItems(
        items: ListaSelect[],
        destino: WritableSignal<ListaSelect[]>,
        origen: WritableSignal<ListaSelect[]>,
        vaciarOrigen = false
    ): void {
        destino.update(list => {
            const EXISTENTES = new Set(list.map(i => i.value));
            const NUEVOS = items.filter(item => !EXISTENTES.has(item.value));
            return [...list, ...NUEVOS];
        });
        if (vaciarOrigen) {
            origen.set([]);
        } else {
            const VALORES_A_REMOVER = new Set(items.map(i => i.value));
            origen.update(list => list.filter(i => !VALORES_A_REMOVER.has(i.value)));
        }
        this.actualizarSeleccionados();
    }
    /**
     * Metodo para obtener la lista de productos
     */
    public obtenerProductos(): void {
        this.mundialService.obtenerProductos().subscribe((res) => { this.productos = res })
    }
    /**
     * metodo para seleccionar prodcutos y asignarlos a la variable productoSeleccionado
     * @param productos - array de productos seleccionados
     */
    public seleccionarProductos(productos: Producto[]): void {
        this.productoSeleccionado = productos
    }
    private accionesAbrirModal: Partial<Record<TipoModal, () => void>> = {
        [TipoModal.MONTO]: () => this.inicializarFormMonto(),
        [TipoModal.TEXTIL]: () => this.inicializarFormTextil()
    }
    public modalControler(modal: TipoModal, accion: ModalControl): void {
        if (accion === ModalControl.ABRIR) {
            this.accionesAbrirModal[modal]?.();
            this.modalesVisibles[modal] = true;
        }

        if (accion === ModalControl.CERRAR) {
            this.modalesVisibles[modal] = false;
        }
    }
    /**
     * metodo para aceptar los productos selecciondos, cuenta con validaciones que no permite seleccionar mas de un producto y no acepta listas vacias
     * @returns {void} 
     */
    public aceptarProductoSeleccionado(): void {
        this.alertaVisible = false;

        if (this.productoSeleccionado.length === 0) {
            this.alertaVisible = true;
            this.mensajeAlerta = "Debe seleccionar al menos un registro.";
            return;
        }

        if (this.productoSeleccionado.length > 1) {
            this.alertaVisible = true;
            this.mensajeAlerta = "Solo puede seleccionar un producto.";
            return;
        }
        this.formCupo.get('producto')?.setValue(this.productoSeleccionado[0]);
        this.modalControler(TipoModal.PRODUCTOS, ModalControl.CERRAR);
    }
    /**
     * Método para inicializar el form del monto
     */
    private inicializarFormMonto(): void {
        this.FormMonto = this.fb.group<FormMontoControls>(
            {
                montoTotalCupo: this.fb.control('', { nonNullable: true }),
                montoTotalSubCupo: this.fb.control('', { nonNullable: true }),
                saldoExpedidoCupo: this.fb.control('', { nonNullable: true }),
                saldoEjercidoCupo: this.fb.control('', { nonNullable: true }),
                saldoEjercidoMCE: this.fb.control('', { nonNullable: true }),
                saldoCupo: this.fb.control('', { nonNullable: true }),
                saldoSubCupo: this.fb.control('', { nonNullable: true }),
                fundamentoCupo: this.fb.control('', { nonNullable: true }),
                fundamentoSubCupo: this.fb.control('', { nonNullable: true })
            }
        )
    }
    /**
     * getter para obtener la medida el campo unida de medida
     */
    get medida(): string | undefined {
        return this.formCupo.get('unidadMedida')?.value
    }
    /**
     * metodo para asignar valores del monto de formluario monto a formulario general
     * @returns {void} 
     */
    public asignarMonto(): void {
        if (!this.FormMonto.valid) {
            this.mostrarAlerta('MODAL', 'Complete todos los campos requeridos');
            return;
        }

        const MONTO = this.FormMonto.value;

        this.formCupo.patchValue({
            datosDelMonto: {
                montoTotalCupo: MONTO.montoTotalCupo ?? "",
                montoTotalSubCupo: MONTO.saldoSubCupo ?? "",
                saldoExpedidoCupo: MONTO.saldoExpedidoCupo ?? "",
                saldoEjercidoCupo: MONTO.saldoEjercidoCupo ?? "",
                saldoEjercidoMCE: MONTO.saldoEjercidoMCE ?? "",
                saldoCupo: MONTO.saldoCupo ?? "",
                saldoSubCupo: MONTO.saldoSubCupo ?? "",
                fundamentoCupo: MONTO.fundamentoCupo ?? "",
                fundamentoSubCupo: MONTO.fundamentoSubCupo ?? ""
            }
        });

        this.modalControler(TipoModal.MONTO, ModalControl.CERRAR);
    }
    /**
     * 
     * @param fracciones recibe las fracciones del componente hijo y las setea al formuario
     */
    public fraccionesRecibidas(fracciones: FraccionesRestrucuradas[]): void {
        this.formCupo.get('fraccionesArancelarias')?.setValue(fracciones)
    }
    /**
     * 
     * @param nuevaFecha - nueva fecha de entrada
     * @param tipoFecha - fipo de fecha 'FIN' para vigencia final e 'INICIO' para vigencia inicial
     */
    public cambioFechas(nuevaFecha: string, tipoFecha: 'INICIO' | 'FIN'): void {
        switch (tipoFecha) {
            case 'INICIO':
                this.formCupo.get('vigenciaInicio')?.setValue(nuevaFecha)
                break;
            case 'FIN':
                this.formCupo.get('vigenciaFin')?.setValue(nuevaFecha)
                break;
            default:
                break;
        }
    }
    /**
     * Metodo para enviar datos del form al padre
     */
    public enviarDatosDelForm(): void {
        const DATA: FormCupo = this.formCupo.getRawValue();
        this.EnviarForm.emit(DATA)

    }
    /**
     * 
     * @param alerta - recibe el parametro 'GENERAL' | 'MODAL' para mostrar una alerta en modal o una alerta general.
     * @param mensaje - mensaje a mostrar en la alerta
     * @param tipo - clase de la alerta
     */
    private mostrarAlerta(alerta: 'GENERAL' | 'MODAL', mensaje: string, tipo: 'alert-danger' | 'alert-success' = 'alert-danger'): void {
        this.alerta.set({ mensaje, tipo, visible: true, alerta });
    }

    get cargarModalesHabilitados(): ModalesHabilitados[] {
        return [
            {
                modal: ModalFracciones.AGREGAR,
                habilitado: this.formType === TipoForm.REGISTRAR_CUPO
            },
            {
                modal: ModalFracciones.CONSULTAR,
                habilitado: true
            },
            {
                modal: ModalFracciones.ELIMINAR,
                habilitado: true
            }
        ]
    }
    /**
     * getter para obtener los datos del prodcuto
     * 
     * @returns { Producto } obtiene los datos del compo producto.
     */
    get datosProducto(): Producto {
        const PRODUCTO = this.formCupo.get('producto')?.value;
        if (Array.isArray(PRODUCTO) && PRODUCTO.length > 0) {
            return PRODUCTO[0];
        }
        if (PRODUCTO && !Array.isArray(PRODUCTO)) {
            return PRODUCTO;
        }
        return {
            id: 0,
            clave: 0,
            nombre: "",
            descripcion: "",
            sigla: ""
        };
    }
    /**
     * metodo para obtener datos del monto
     * @returns {DatosDelMonto | undefined}
     */
    get datosDelMonto(): DatosDelMonto | undefined {
        return this.formCupo.get('datosDelMonto')?.value
    }

    get seleccionOtro(): boolean {
        return this.formCupo.get('clasificacionSubProducto.clasificacion')?.value === 'OTRO';
    }
    /* Logica modal eliminar fracciones en textil */
    private destroy$ = new Subject<void>();
    public filasSeleccionadasAEliminarFraccionesTextil: FraccionesRestrucuradas[] = [];
    /** Stream de clicks */
    private click$ = new Subject<FraccionesRestrucuradas>();
    /**
     * Variable para controlar la visivilidad de las fracciones
     */
    public fraccionPadreActualTextil = signal<string>("0");
    /**
     * Signal que almacena los datos que se van a mostrar
     */
    public datosDeTabla = signal<FraccionesRestrucuradas[]>([]);
    /**
     * datos a mostrar en la tabla
     */
    public datosFraccionesTextil = computed<FraccionesRestrucuradas[]>(() => {
        const RESULTADO = this.datosDeTabla().filter(
            fraccion => fraccion.parent === this.fraccionPadreActualTextil()
        );
        return RESULTADO;
    });
    /**
     * permite la consulta de los hijos de la fraccion al segundo click
     * @param fila Fila seleccionada
     */
    public consultaFilaTextil(fila: FraccionesRestrucuradas): void {
        this.click$.next(fila);
    }
    /**
     * p
     * @param fila 
     */
    private alDobleClick(fila: FraccionesRestrucuradas): void {
        this.fraccionPadreActualTextil.set(fila.id.toString());
    }
    /**
     * Método que setea las fracciones arancelarias a eliminar en filasSeleccionadasAEliminar
     * @param filas filas seleccionadas a eliminar
     */
    public seleccionarAEliminarTextil(filas: FraccionesRestrucuradas[]): void {
        this.filasSeleccionadasAEliminarFraccionesTextil = filas;
    }
    /**
     * Metodo que permite eliminar las fracciones seleccionadas.
     * @param type "TODO" - elimina todas las fracciones seleccionadas "SELECCION" - solo elimina las fracciones seleccioandas
     * @returns 
     */
    public eliminarSeleccion(type: "TODO" | "SELECCION"): void {
        if (type === "TODO") {
            this.datosDeTabla.set([])
            return;
        }
        const DATOS = this.datosDeTabla();
        const OBTENER_IDS_A_ELIMINAR = (idPadre: string): string[] => {
            const A_ELIMINAR: string[] = [idPadre];
            const HIJOS = DATOS.filter(item => item.parent === idPadre);
            HIJOS.forEach(hijo => {
                A_ELIMINAR.push(...OBTENER_IDS_A_ELIMINAR(hijo.id));
            });
            return A_ELIMINAR;
        };
        const IDS_A_ELIMINAR: string[] = [];

        this.filasSeleccionadasAEliminarFraccionesTextil.forEach(fila => {
            IDS_A_ELIMINAR.push(...OBTENER_IDS_A_ELIMINAR(fila.id));
        });
        const NUEVOS_DATOS = DATOS.filter(item => !IDS_A_ELIMINAR.includes(item.id));
        this.datosDeTabla.set(NUEVOS_DATOS);
        this.filasSeleccionadasAEliminarFraccionesTextil = [];
    }

    ngOnInit(): void {
        this.inicializarForm();
        this.click$
            .pipe(
                buffer(this.click$.pipe(debounceTime(500))),
                filter(clicks => clicks.length === 2 && clicks[0].id === clicks[1].id),
                map(clicks => clicks[0]),
                takeUntil(this.destroy$)
            )
            .subscribe(fila => {
                this.alDobleClick(fila);
            });
    }


}