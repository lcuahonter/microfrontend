import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, OnDestroy, OnInit, Output, computed, signal, } from "@angular/core";
import { ConfiguracionColumna, ModalComponent, TablaDinamicaComponent, TablaSeleccion } from "@libs/shared/data-access-user/src";
import { FraccionesRestrucuradas, ModalFracciones, ModalesHabilitados } from "../../enum/fracciones-arancelarias";
import { Subject, buffer, debounceTime, filter, map, takeUntil } from "rxjs";
import { FraccionArancelaria } from "../../models/fracciones-response.model";
import { FraccionesArancelariasService } from "../../services/fracciones-arancelarias.service";


@Component({
    standalone: true,
    selector: 'app-fracciones-arancelarias',
    templateUrl: 'fracciones-arancelarias.component.html',
    styleUrl: 'fracciones-arancelarias.component.scss',
    imports: [ModalComponent, TablaDinamicaComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FraccionesArancelariasComponent implements OnInit, OnDestroy {
    /**
     * Output que emite al padre los valores de las fracciones seleccionadas.
     */
    @Output() fraccionesSeleccionadas = new EventEmitter<FraccionesRestrucuradas[]>();
    public ModalFracciones = ModalFracciones;
    @Input() ModalesHabilitados:ModalesHabilitados[] = [
        {
            modal : ModalFracciones.AGREGAR,
            habilitado: true
        },
        {
            modal : ModalFracciones.CONSULTAR,
            habilitado: true
        },
        {
            modal : ModalFracciones.ELIMINAR,
            habilitado: true
        }
    ]
    /**
     * variables para controlar la visivilidad de los modales agregar, eliminar y consultar.
     * Establecidos true por defecto
     */
    public mostrarAgregar: boolean = false;
    public mostrarEliminar: boolean = false;
    public mostrarConsultar: boolean = false;
    /**
     * Fracciones arancelarias
     */
    public fracciones: FraccionArancelaria[] = [];
    /**
     * itemes seleccionados
     */
    public selectedItems = new Set<string>();
    /**
     * controladores de alerta
     */
    public mostrarAlerta: boolean = false;
    public alertaMensaje: string = '';
    /**
     * Configuracion de tipos para la seleccion de la tabla
     */
    public TablaSeleccion = TablaSeleccion;
    /**
     * Variable para almacenar las filas seleccionadas
     */
    public filasSeleccionadas: FraccionesRestrucuradas[] = []
    /**
     * Variable para almacenar el numero de fracion a buscar
     */
    public numeroBusqueda: string = "";
    /**
     * Variable para controlar la visivilidad de las fracciones
     */
    public fraccionPadreActual = signal<string>("0");
    /**
     * Signal que almacena los datos que se van a mostrar
     */
    public datosDeTabla = signal<FraccionesRestrucuradas[]>([]);
    /**
     * Variable que alacena las filas a eliminar
     */
    public filasSeleccionadasAEliminar: FraccionesRestrucuradas[] = [];

    /** Stream de clicks */
    private click$ = new Subject<FraccionesRestrucuradas>();

    /** Stream de destrucción */
    private destroy$ = new Subject<void>();

    constructor(private fraccionesService: FraccionesArancelariasService) { }
    /**
     * controlador de la visivilida del modal - apertura
     * @param modal 
     * 'AGREGAR' | 'ELIMINAR' | 'CONSULTAR' 
     */
    public abrirModal(modal: 'AGREGAR' | 'ELIMINAR' | 'CONSULTAR'): void {
        switch (modal) {
            case ("AGREGAR"):
                if(!this.esModalHabilitado(ModalFracciones.AGREGAR)){ break }
                this.mostrarAgregar = true;
                this.cargarArbolPrincipal();
                break;
            case "ELIMINAR":
                if(!this.esModalHabilitado(ModalFracciones.ELIMINAR)){ break }
                this.mostrarEliminar = true;
                break;
            case "CONSULTAR":
                if(!this.esModalHabilitado(ModalFracciones.CONSULTAR)){ break }
                this.mostrarConsultar = true;
                break;
            default:
                break;
        }
    }
    /**
     * controlador de la visivilidad del modal - cierre
     * @param modal 
     */
    public cerrarModal(modal: 'AGREGAR' | 'ELIMINAR' | 'CONSULTAR'): void {
        switch (modal) {
            case "AGREGAR":
                this.mostrarAgregar = false;
                break;
            case "ELIMINAR":
                this.mostrarEliminar = false;
                this.fraccionPadreActual.set("0")
                break;
            case "CONSULTAR":
                this.mostrarConsultar = false;
                break;
            default:
                break;
        }
    }
    /**
     * Permite cargar el arbol de fracciones por fracción
     */
    private cargarArbolPrincipal(): void {
        this.fracciones = [];
        this.selectedItems.clear();

        this.fraccionesService.obtenerFracciones(null).subscribe({
            next: (fracciones) => {
                this.fracciones = fracciones.map(f => ({ ...f, level: 0 }));
            },
            error: (err) => {
                console.error('Error cargando fracciones:', err);
                this.mostrarAlerta = true;
                this.alertaMensaje = 'Error al cargar las fracciones arancelarias';
            }
        });
    }
    /**
     * permite expandir el nodo y mostrar las fracciones hijas
     * @param fraccion - fraccion arancelaria seleccionada
     * @returns 
     */
    public expandirArbol(fraccion: FraccionArancelaria): void {
        if (!fraccion.hasChildren) { return }
        fraccion.isExpanded = !fraccion.isExpanded;
    }
    /**
     * metodo para cargar las fracciones hijas del padre marchado
     * @param fraccion 
     * @param autoCheck 
     */
    private cargarFraccionhija(fraccion: FraccionArancelaria, autoCheck: boolean = false): void {
        fraccion.isLoading = true;

        this.fraccionesService.obtenerFracciones(fraccion.id).subscribe({
            next: (children) => {
                fraccion.children = children.map(child => ({
                    ...child,
                    level: (fraccion.level || 0) + 1
                }));
                fraccion.isExpanded = true;
                fraccion.isLoading = false;

                if (autoCheck) {
                    this.marcarTodosLosHijos(fraccion);
                }
            },
            error: (err) => {
                console.error('Error cargando hijos:', err);
                fraccion.isLoading = false;
                this.mostrarAlerta = true;
                this.alertaMensaje = 'Error al cargar las sub-fracciones';
            }
        });
    }
    /**
     * metodo que permite marcar como check = true a todos los hijos de la fraccion seleccionada
     * @param fraccion 
     * @returns 
     */
    private marcarTodosLosHijos(fraccion: FraccionArancelaria): void {
        if (!fraccion.children) { return }

        for (const CHILD of fraccion.children) {
            this.selectedItems.add(CHILD.id);
        }
    }
    /**
     * Metodo que se ejecuta cada que el checkbox cambia de valor
     * @param fraccion - fraccion arancelaria de quien cambió
     * @param event - evento html
     */
    public checkCambio(fraccion: FraccionArancelaria, event: Event): void {
        event.stopPropagation();
        const CHECKED = (event.target as HTMLInputElement).checked;

        if (CHECKED) {
            this.selectedItems.add(fraccion.id);

            if (fraccion.hasChildren) {
                if (fraccion.children && fraccion.children.length > 0) {
                    fraccion.isExpanded = true;
                    this.marcarTodosLosHijos(fraccion);
                } else {
                    this.cargarFraccionhija(fraccion, true);
                }
            }
        } else {
            this.selectedItems.delete(fraccion.id);
        }
    }
    /**
     * metodo que retorna un booleano para saber si la fraccion está seleccionada
     * @param fraccion - fraccion arancelaria seleccionada
     * @returns 
     */
    public esSeleccionada(fraccion: FraccionArancelaria): boolean {
        return this.selectedItems.has(fraccion.id);
    }
    /**
     * metodo auxiliar para la creacion de el nuevo arreglo de fracciones
     * @returns 
     */
    public fraccionesAdapter(): FraccionArancelaria[] {
        const RESULT: FraccionArancelaria[] = [];

        const FLATTEN = (items: FraccionArancelaria[]): void => {
            for (const ITEM of items) {
                RESULT.push(ITEM);
                if (ITEM.isExpanded && ITEM.children) {
                    FLATTEN(ITEM.children);
                }
            }
        };

        FLATTEN(this.fracciones);
        return RESULT;
    }
    /**
     * metodo para calcular la fraccion padre de una lista de fracciones de acuerdo a los ultimos dos digitos
     * @param id - id de la fracción
     * @returns 
     */
    private calcularParent(id: string): string {
        const LONGITUD = id.length;

        if (LONGITUD === 2) {
            return '0';
        }

        if (LONGITUD === 4) {
            return id.slice(0, 2);
        }

        if (LONGITUD === 6) {
            return id.slice(0, 4);
        }

        return id.slice(0, -2);
    }
    /**
     * Metodo auxiliar para calcular el nivel del árbol
     * @param id 
     * @returns 
     */
    private calcularNivel(id: string): number {
        return id.length / 2;
    }
    /**
     * Metodo principal para converir la respuesta de las fracciones un json plano que añade propiedad parent para identificar el nivel
     * @param selectedItems 
     * @param todasLasFracciones 
     * @returns 
     */
    private convertirAFraccionesConParent(
        selectedItems: Set<string>,
        todasLasFracciones: Map<string, { titulo: string; level: number }>
    ): FraccionesRestrucuradas[] {

        const RES: FraccionesRestrucuradas[] = [];

        for (const ID of selectedItems) {
            const METADATA = todasLasFracciones.get(ID);

            RES.push({
                id: ID,
                titulo: METADATA?.titulo || ID,
                parent: this.calcularParent(ID),
                level: METADATA?.level ?? this.calcularNivel(ID)
            });
        }

        return RES;
    }
    /**
     * Metodo para confirmar la seleccion actual de fracciones.
     */
    public confirmarSeleccion(): void {
        const METADATA = new Map();

        this.fraccionesAdapter().forEach(fraccion => {
            if (this.selectedItems.has(fraccion.id)) {
                METADATA.set(fraccion.id, {
                    titulo: fraccion.title,
                    level: fraccion.level || 0
                });
            }
        });

        const FRACCIONES = this.convertirAFraccionesConParent(
            this.selectedItems,
            METADATA
        );

        this.fraccionesSeleccionadas.emit(FRACCIONES);
        this.datosDeTabla.set(FRACCIONES)

        this.mostrarAgregar = false;
    }
    /**
     * Configuracion de la tabla a mostrar para las fracciones
     */
    public configuracionTabla: ConfiguracionColumna<FraccionesRestrucuradas>[] = [
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
     * verifica si el string es numero
     * @param valor - valor string
     * @returns 
     */
    private esNumeroString(valor: string): boolean {
        return /^[0-9]+$/.test(valor);
    }
    /**
     * Permite navegar entre niveles de fracciones arancelarias
     * @param numeroClasificacion - numero de fraccion padre
     * @returns 
     */
    public consultarDatosPorFraccion(numeroClasificacion: string): void {
        if (!this.esNumeroString(numeroClasificacion)) {
            console.warn('Número inválido');
            return;
        }
        this.fraccionPadreActual.set(numeroClasificacion);
    }
    /**
     * datos a mostrar en la tabla
     */
    public datos = computed<FraccionesRestrucuradas[]>(() => {
        const RESULTADO = this.datosDeTabla().filter(
            fraccion => fraccion.parent === this.fraccionPadreActual()
        );
        return RESULTADO;
    });
    /**
     * permite la consulta de los hijos de la fraccion al segundo click
     * @param fila Fila seleccionada
     */
    public consultaFila(fila: FraccionesRestrucuradas): void {
        this.click$.next(fila);
    }
    /**
     * p
     * @param fila 
     */
    private alDobleClick(fila: FraccionesRestrucuradas): void {
        this.fraccionPadreActual.set(fila.id.toString());
    }
    /**
     * Método que setea las fracciones arancelarias a eliminar en filasSeleccionadasAEliminar
     * @param filas filas seleccionadas a eliminar
     */
    public seleccionarAEliminar(filas: FraccionesRestrucuradas[]): void {
        this.filasSeleccionadasAEliminar = filas;
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

        this.filasSeleccionadasAEliminar.forEach(fila => {
            IDS_A_ELIMINAR.push(...OBTENER_IDS_A_ELIMINAR(fila.id));
        });
        const NUEVOS_DATOS = DATOS.filter(item => !IDS_A_ELIMINAR.includes(item.id));
        this.datosDeTabla.set(NUEVOS_DATOS);
        this.filasSeleccionadasAEliminar = [];
    }

    /**
     * Metodo para verificar si un modal está habilitado.
     * @param tipoModal - 'AGREGAR', 'ELIMINAR','CONSULTAR'
     * @returns {boolean}
     */
    public esModalHabilitado(tipoModal:ModalFracciones):boolean{
        const MODAL = this.ModalesHabilitados.find((m)=>m.modal === tipoModal)
        if(MODAL===undefined){
            return false
        }
        return MODAL?.habilitado
    }

    ngOnInit(): void {
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}



