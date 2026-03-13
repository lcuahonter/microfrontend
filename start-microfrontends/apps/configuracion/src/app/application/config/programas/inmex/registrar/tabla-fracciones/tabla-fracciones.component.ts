import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DocumentosResponse } from "../../../../../core/models/agregar-fraccion/response/documentos-response";
import { FraccionesResponse } from "../../../../../core/models/agregar-fraccion/response/agregar-fraccion";
import { Subject } from "rxjs";

interface Columna {
    campo: keyof FraccionesResponse;
    titulo: string;
}
export enum AccionTable {
    CONSULTAR = "CONSULTAR", 
    ELIMINAR = "ELIMINAR", 
    AGREGAR = "AGREGAR"
}

@Component({
    standalone: true,
    templateUrl: './tabla-fracciones.component.html',
    styleUrl: './tabla-fracciones.component.scss',
    selector: 'tabla-fracciones',
    imports: [CommonModule]
})
export class TablaFraccionesComponent implements OnDestroy, OnChanges, OnInit {
    private destroyed$ = new Subject<void>();


    @Input() datos: FraccionesResponse[] = [];
    @Input() columnas: Columna[] = [];
    @Input() datoDeBusqueda: string = "";
    @Input() accion: AccionTable = AccionTable.CONSULTAR
    @Output() fraccionesAgregadas = new EventEmitter<FraccionesResponse[]>();
    @Output() documentosSeleccionados = new EventEmitter<DocumentosResponse[]>();

    public datosAMostrar: FraccionesResponse[] = [];
    public datosPaginados: FraccionesResponse[][] = [];

    public paginaActual: number = 0;
    public registrosPorPagina: number = 10;
    public totalPaginas: number = 1;

    public datosAEliminar: FraccionesResponse[] = [];
    public checkAll: boolean = false;

    @Output() eliminarSeleccionados = new EventEmitter<FraccionesResponse[]>();


    ngOnChanges(changes: SimpleChanges): void {
        if (changes['datos'] && this.datos) {
            this.inicializarDatos();
        }
    }

    ngOnInit(): void {
        this.inicializarDatos()
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public inicializarDatos(): void {
        this.datosAMostrar = this.datos;
        this.totalPaginas = this.datosAMostrar.length / 10
        this.paginarDatos()
    }

    public paginarDatos(): void {

        if (!this.datosAMostrar || this.datosAMostrar.length === 0) {
            this.datosPaginados = [];
            this.totalPaginas = 0;
            this.paginaActual = 1;
            return;
        }

        const TOTAL_ELEMENTOS = this.datosAMostrar.length;
        const REGISTROS_POR_PAGINA = this.registrosPorPagina;

        this.totalPaginas = Math.ceil(TOTAL_ELEMENTOS / REGISTROS_POR_PAGINA);

        const PAGINAS_GENERADAS: FraccionesResponse[][] = [];

        for (let INDEX = 0; INDEX < this.totalPaginas; INDEX++) {
            const INICIO = INDEX * REGISTROS_POR_PAGINA;
            const FIN = INICIO + REGISTROS_POR_PAGINA;

            PAGINAS_GENERADAS.push(
                this.datosAMostrar.slice(INICIO, FIN)
            );
        }

        this.datosPaginados = PAGINAS_GENERADAS;

        if (this.paginaActual > this.totalPaginas) {
            this.paginaActual = this.totalPaginas;
        }
        if (this.paginaActual < 1) {
            this.paginaActual = 1;
        }

    }

    public cambiarDePagina(CASE: number, PAGINA: string): void {

        switch (CASE) {

            case 1: // siguiente página
                if (this.paginaActual < this.totalPaginas) {
                    this.paginaActual++;
                }
                break;

            case 2: // ir a última página
                this.paginaActual = this.totalPaginas;
                break;

            case 3: // página anterior
                if (this.paginaActual > 1) {
                    this.paginaActual--;
                }
                break;

            case 4: // ir a primera página
                this.paginaActual = 1;
                break;

            case 0: // ir a página específica
                {
                    const NUEVA_PAGINA = Number(PAGINA);

                    if (NUEVA_PAGINA >= 1 && NUEVA_PAGINA <= this.totalPaginas) {
                        this.paginaActual = NUEVA_PAGINA;
                    }
                }
                break;

            default:
                break;
        }
    }


    public buscarPorId(ID: string | number): void {
        if (!ID) {
            this.datosAMostrar = this.datos;
            this.paginarDatos();
            return;
        }
        const ESTA_SELECCIONADO = this.datosAEliminar.some(item => item.id === ID);
        if (ESTA_SELECCIONADO) {
            return;
        }

        this.buscarRecursivo(this.datos, ID);
    }


    private buscarRecursivo(LISTA: FraccionesResponse[], ID: string | number): boolean {

        for (const ITEM of LISTA) {

            if (ITEM.id === ID) {

                this.datosAMostrar = ITEM.children ?? [];
                this.paginarDatos();

                return true;
            }

            if (ITEM.children && ITEM.children.length > 0) {
                const ENCONTRADO = this.buscarRecursivo(ITEM.children, ID);

                if (ENCONTRADO) {
                    return true;
                }
            }
        }

        return false;
    }


    public obtenerRangoMostrado(): string {

        if (!this.datosPaginados || this.datosPaginados.length === 0) {
            return "Mostrando 0 - 0 de 0";
        }

        const TOTAL = this.datosAMostrar.length;

        const INICIO = ((this.paginaActual - 1) * this.registrosPorPagina) + 1;

        let FIN = this.paginaActual * this.registrosPorPagina;

        if (FIN > TOTAL) {
            FIN = TOTAL;
        }

        return `Mostrando ${INICIO} - ${FIN} de ${TOTAL}`;
    }

    public toggleSeleccion(item: FraccionesResponse, event: Event): void {
        const CHECKED = (event.target as HTMLInputElement).checked;

        if (CHECKED) {
            this.datosAEliminar.push(item);
        } else {
            this.datosAEliminar = this.datosAEliminar.filter(x => x.id !== item.id);
            this.checkAll = false;
        }

        this.eliminarSeleccionados.emit(this.datosAEliminar);
    }

    public estaSeleccionado(item: FraccionesResponse): boolean {
        return this.datosAEliminar.some(x => x.id === item.id);
    }

    public toggleSeleccionTodos(event: Event): void {
        this.checkAll = (event.target as HTMLInputElement).checked;

        if (this.checkAll) {
            this.datosAEliminar = [...this.datosAMostrar];
        } else {
            this.datosAEliminar = [];
        }

        this.eliminarSeleccionados.emit(this.datosAEliminar);
    }

    public seleccionarTodos(): void {
        this.datosAEliminar = [...this.datos];
        this.eliminarSeleccionados.emit(this.datosAEliminar);
    }

    @Output() eliminarTodos = new EventEmitter<void>();

    public onEliminarTodos(): void {
        this.eliminarTodos.emit();
    }



}
