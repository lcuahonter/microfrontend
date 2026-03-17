import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { TablePaginationComponent } from '../table-pagination/table-pagination.component';

import { PAGINATION_MODE } from '../../..';


export interface ColumnConfig {
    encabezado: string;
    clave: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

@Component({
    selector: 'app-tabla-expandida',
    standalone: true,
    imports: [CommonModule, TablePaginationComponent],
    templateUrl: './tabla-dinamica-exp.component.html',
    styleUrls: ['./tabla-dinamica-exp.component.scss'],
    animations: [
        trigger('expandCollapse', [
            state('void', style({
                height: '0',
                opacity: 0
            })),
            state('*', style({
                height: '*',
                opacity: 1
            })),
            transition('void <=> *', animate('200ms ease-in-out'))
        ])
    ]
})
export class TablaDinamicaExpandidaComponent<T extends { [key: string]: unknown } = { [key: string]: unknown }> implements OnInit {
    /**
     * Un arreglo de objetos de configuración de columnas que se utiliza para definir
     * la estructura y el comportamiento de la tabla dinámica. Cada objeto en el arreglo
     * debe cumplir con la interfaz `ColumnConfig`, especificando propiedades como el encabezado
     * de la columna, el mapeo de campos, el formato y otras opciones de visualización.
     *
     * @ejemplo
     * columns = [
     *   { encabezado: 'Nombre', clave: 'nombre' },
     *   { encabezado: 'Edad', clave: 'edad', width: '100px' }
     * ];
     */
    @Input() columns: ColumnConfig[] = [];
    /**
         * Un arreglo de objetos que representa las filas de la tabla.
         * Cada objeto debe contener las claves definidas en la configuración de columnas.
         *
         * @ejemplo
         * data = [
         *   { nombre: 'Juan', edad: 30 },
         *   { nombre: 'Ana', edad: 25 }
         * ];
         */
    @Input() data: T[] = [];
    /**
     * Indica si la tabla es expandible o no.
     * Cuando es `true`, permite expandir filas para mostrar información adicional.
     * Valor por defecto: `false`.
     */
    @Input() expandible = false;
    /**
     * Permite inyectar un TemplateRef personalizado para mostrar contenido anidado
     * dentro de la fila expandida de la tabla. Si se proporciona, este template se
     * renderizará cuando una fila esté expandida.
     *
     * @ejemplo
     * <ng-template #detalle let-elemento>
     *   <div>Detalles: {{ elemento | json }}</div>
     * </ng-template>
     * <app-tabla-expandida [nestedContent]="detalle"></app-tabla-expandida>
     */
    @Input() nestedContent: TemplateRef<unknown> | null = null;

    /**
     * Evento que se emite cuando una fila es expandida.
     * El valor emitido es el objeto de datos correspondiente a la fila expandida.
     */
    @Output() rowExpanded = new EventEmitter<T>();

    /**
     * Índice de la fila actualmente expandida.
     * Si no hay ninguna fila expandida, su valor es -1.
     */
    expandedIndex: number = -1;

    /**
   * Almacena el ID de la fila seleccionada.
   * Este valor se establece cuando el usuario selecciona una fila en la tabla.
   *
   * @type {number}
   */
    idFilaSeleccionada: number | null = null;

    /**
     * Almacena un array de los índices de las filas seleccionadas.
     * Cada índice corresponde a una fila que ha sido seleccionada por el usuario.
     *
     * @type {number[]}
     */
    @Input() filasSeleccionadas: number[] = [];

    /**
   * Evento que se emite cuando el usuario selecciona o deselecciona una fila de la tabla.
   * Este evento envía un array con todas las filas seleccionadas (objetos completos) al componente padre.
   *
   * @type {EventEmitter<T[]>}
   */
    @Output() listaDeFilaSeleccionada: EventEmitter<T[]> = new EventEmitter<T[]>(
        true
    );

    /**
     * Este input permite deshabilitar la selección de filas mediante checkboxes en la tabla.
     * Si se establece en `true`, los checkboxes de selección estarán deshabilitados.
     */
    @Input() disableSeleccionTablaCheckBox: boolean = false;

    /** Indica si se muestra la paginación en la tabla dinámica. */
    @Input() showPagination: boolean = false;

    /**
   * Número total de elementos en la tabla.
  */
    @Input() totalItems: number = 0;

    /**
     * Cantidad de elementos por página en la paginación.
    */
    @Input() itemsPerPage: number = 5;

    /**
     * Página actual de la paginación.
    */
    @Input() currentPage: number = 1;

    /** Modo de paginación: 'client' o 'server' */
    @Input() mode: string = PAGINATION_MODE.SERVER;

    /** Evento que se emite cuando el usuario cambia de página en la tabla. */
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();


    /** Almacena los datos paginados que se mostrarán en la tabla según la página actual y los filtros aplicados. */
    public paginatedDatos: T[] = [];

    /** Almacena los datos filtrados localmente según el término de búsqueda ingresado por el usuario. */
    private datosFiltrados: T[] = [];

    /** Almacena el conjunto original de datos antes de aplicar filtros o búsquedas, para restaurar el estado inicial si es necesario. */
    private originalDatos: T[] = [];

    /** Evento que se emite cuando el usuario cambia la cantidad de elementos por página en la tabla. */
    @Output() itemsPerPageChange: EventEmitter<number> = new EventEmitter<number>();


    /**
     * Identificador único para la tabla. Esta propiedad de entrada se utiliza para
     * distinguir y gestionar el estado o el comportamiento del componente de la tabla.
     * 
     * @input
     */
    @Input() tableId!: string;


    ngOnInit(): void {
        this.paginatedDatos = [...this.data];

        // Si no se ha proporcionado un ID de tabla, se genera uno aleatorio.
        this.tableId = this.tableId ? this.tableId : 'tabla_' + Math.floor(Math.random() * 1000000);
        this.getUpdatePagination();
    }

    /**
     * Alterna la expansión de una fila en la tabla dinámica.
     * 
     * Si la fila especificada por el índice ya está expandida, la colapsa.
     * Si no está expandida, la expande y emite el evento `rowExpanded` con los datos de la fila seleccionada.
     * 
     * @param index - Índice de la fila a expandir o colapsar.
     */
    toggleRow(index: number): void {
        if (this.expandedIndex === index) {
            this.expandedIndex = -1;
        } else {
            this.expandedIndex = index;
            this.rowExpanded.emit(this.data[index]);
        }
    }

    @Output() selectionChange = new EventEmitter<number[]>();

    selectedRows: Set<number> = new Set();

    onSelectAll(event: Event): void {
        const CHECKBOX = event.target as HTMLInputElement;
        if (CHECKBOX.checked) {
            this.selectedRows = new Set(this.data.map((_, index) => index));
        } else {
            this.selectedRows.clear();
        }
        this.emitSelection();
    }

    onSelectRow(event: Event, index: number): void {
        const CHECKBOX = event.target as HTMLInputElement;
        if (CHECKBOX.checked) {
            this.selectedRows.add(index);
        } else {
            this.selectedRows.delete(index);
        }
        this.emitSelection();
    }

    isSelected(index: number): boolean {
        return this.selectedRows.has(index);
    }

    private emitSelection(): void {
        this.selectionChange.emit(Array.from(this.selectedRows));
    }

    /**
   * Este método se llama cuando el usuario selecciona o deselecciona el checkbox de "seleccionar/desmarcar todo".
   * Si el checkbox está marcado, se seleccionan todos los índices. Si está desmarcado, se deseleccionan todos.
   *
   * @param event - El evento que contiene el checkbox de "seleccionar/desmarcar todo".
   * @returns {void} - No retorna nada,
   */
    seleccionarDeseleccionarTodos(event: Event): void {
        const CHECKBOX = event.target as HTMLInputElement; // Obtener el checkbox desde el evento

        if (CHECKBOX.checked) {
            // Si el checkbox de "seleccionar todo" está marcado, agregamos todos los índices al array
            this.filasSeleccionadas = this.data.map((_, indice) => indice);
            this.listaDeFilaSeleccionada.emit(
                this.data.filter((_, indice) =>
                    this.filasSeleccionadas.includes(indice)
                )
            );
        } else {
            // Si el checkbox de "seleccionar todo" está desmarcado, limpiamos el array de índices seleccionados
            this.filasSeleccionadas = [];
            this.listaDeFilaSeleccionada.emit([]);
        }
    }

    /**
     * Método que se ejecuta cuando se cambia de página en la paginación.
     * @param {number} page - Número de la página seleccionada.
     */
    onPageChange(page: number): void {
        this.currentPage = page;
        if (this.mode === PAGINATION_MODE.CLIENT) {
            this.getUpdatePagination();
        } else {
            this.pageChange.emit(page);
        }
    }

    /**
       * Actualiza la paginación de la tabla de establecimientos.
       * Corta los datos de la tabla según la página actual y el número de elementos por página.
       */
    getUpdatePagination(): void {
        const SOURCE = this.datosFiltrados.length ? this.datosFiltrados : this.data;
        this.paginatedDatos = [];
        if (this.showPagination) {
            if (this.mode !== PAGINATION_MODE.CLIENT) {
                this.paginatedDatos = [...SOURCE];
            } else {
                const STARTINDEX = (this.currentPage - 1) * this.itemsPerPage;
                this.paginatedDatos = SOURCE.slice(STARTINDEX, STARTINDEX + this.itemsPerPage);
                this.originalDatos = SOURCE.slice(STARTINDEX, STARTINDEX + this.itemsPerPage);
            }
        } else {
            this.paginatedDatos = [...SOURCE];
        }
    }

    /**
 * Método que se ejecuta cuando cambia el número de elementos por página.
 * @param {number} itemsPerPage - Número de elementos a mostrar por página.
 */
    onItemsPerPageChange(itemsPerPage: number): void {
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        if (this.mode === PAGINATION_MODE.CLIENT) {
            this.getUpdatePagination();
        } else {
            this.itemsPerPageChange.emit(itemsPerPage)
        }

    }

}


