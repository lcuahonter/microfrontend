import { Component, Input, input, output } from "@angular/core";

/**
 * Componente genérico PickList.
 *
 * Permite mover elementos entre una lista de disponibles y una lista
 * de seleccionados, emitiendo eventos para que el componente padre
 * controle el estado real de ambas listas.
 *
 * El componente es completamente genérico y reutilizable gracias
 * al uso de tipos genéricos `<T>`.
 * 
 * Es obligatorio el uso de signals.
 *
 * @typeParam T Tipo de objeto que manejarán las listas.
 */
@Component({
    standalone: true,
    templateUrl: './pick-list.component.html',
    styleUrl: './pick-list.component.scss',
    selector: 'app-pick-list'
})
export class PickListComponent<T> {
    /**
     * Título que se muestra en la sección de elementos disponibles.
     */
    @Input() tituloDisponibles: string = "";
    /**
     * Título que se muestra en la sección de elementos seleccionados.
     */
    @Input() tituloSeleccionados: string = "";
    /**
     * Lista de elementos disponibles.
     *
     * Se recibe desde el componente padre y se renderiza
     * en la sección de disponibles.
     */
    public listaDisponibles = input<T[]>([]);
    /**
     * Lista de elementos seleccionados.
     *
     * Se recibe desde el componente padre y se renderiza
     * en la sección de seleccionados.
     */
    public listaSeleccionados = input<T[]>([]);
    /**
     * Función utilizada para obtener el texto visible de cada elemento.
     *
     * Permite personalizar cómo se muestra un item sin acoplar
     * el componente a una estructura específica.
     */
    public displayWith = input.required<(item: T) => string>();
    /**
     * Elemento actualmente seleccionado en la lista de disponibles.
     *
     * Se mantiene en memoria hasta que se ejecute una acción.
     */
    public itemDisponibleSeleccionado: T | undefined = undefined;
    /**
     * Elemento actualmente seleccionado en la lista de seleccionados
     * para ser eliminado.
     */
    public itemAEliminarSeleccionado: T | undefined = undefined;

    /**
 * Elementos seleccionados en disponibles.
 */
    public disponiblesSeleccionados: T[] = [];

    /**
     * Elementos seleccionados en seleccionados.
     */
    public seleccionadosSeleccionados: T[] = [];


    /**
     * Función utilizada para optimizar el renderizado de listas.
     *
     * Se usa como `trackBy` para evitar renders innecesarios.
     */
    public trackBy = input.required<(item: T) => unknown>();
    /**
     * Evento emitido al solicitar agregar un elemento.
     *
     * Emite el item seleccionado desde la lista de disponibles.
     */
    public agregar = output<T>();
    /**
     * Evento emitido al solicitar agregar todos los elementos disponibles.
     */
    public agregarTodos = output();
    /**
     * Evento emitido al solicitar eliminar un elemento.
     *
     * Emite el item seleccionado desde la lista de seleccionados.
     */
    public eliminar = output<T>();
    /**
     * Emite el evento para eliminar todos los elementos de la lista seleccionados.
     */
    public eliminarTodos = output();
    /**
     * Emite el evento de agregar un elemento seleccionado.
     *
     * Si no hay un elemento seleccionado, no ejecuta ninguna acción.
     */
    public Agregar(): void {
        if (!this.disponiblesSeleccionados.length) { return }

        this.disponiblesSeleccionados.forEach(item =>
            this.agregar.emit(item)
        );

        this.disponiblesSeleccionados = [];
    }

    /**
     * Emite el evento para agregar todos los elementos disponibles.
     */
    public AgregarTodos(): void {
        this.agregarTodos.emit();
        this.disponiblesSeleccionados = [];
    }

    /**
     * Emite el evento para eliminar un elemento seleccionado.
     *
     * Si no hay un elemento seleccionado, no ejecuta ninguna acción.
     */
    public Eliminar(): void {
        if (!this.seleccionadosSeleccionados.length) { return }

        this.seleccionadosSeleccionados.forEach(item =>
            this.eliminar.emit(item)
        );

        this.seleccionadosSeleccionados = [];
    }

    /**
     * Emite el evento para eliminar todos los elementos seleccionados.
     */
    public EliminarTodos(): void {
        this.eliminarTodos.emit();
        this.seleccionadosSeleccionados = [];
    }

    /**
     * Obtiene el texto a mostrar de un elemento.
     *
     * Usa la función `displayWith` si está definida.
     *
     * @param item Elemento a mostrar.
     * @returns Texto representativo del elemento.
     */
    public display(item: T): string {
        return this.displayWith()?.(item) ?? '';
    }
    /**
     * Obtiene la clave de seguimiento de un elemento.
     *
     * Usa la función `trackBy` si está definida.
     *
     * @param item Elemento a rastrear.
     * @returns Identificador único del elemento.
     */
    public track(item: T): T {
        return (this.trackBy()?.(item) ?? item) as T;
    }
    /**
     * Selecciona un elemento según el contexto de la acción.
     *
     * @param item Elemento seleccionado.
     * @param caso Indica si el elemento será agregado o eliminado.
     */
    public seleccionarItem(item: T, caso: 'AGREGAR' | 'ELIMINAR'): void {
        switch (caso) {
            case 'AGREGAR':
                this.itemDisponibleSeleccionado = item;
                break;
            case 'ELIMINAR':
                this.itemAEliminarSeleccionado = item;
                break;
            default:
                break
        }
    }

    private obtenerSeleccion(
        event: Event,
        lista: T[]
    ): T[] {
        const SELECT = event.target as HTMLSelectElement;

        const SELECTED_KEYS = Array.from(SELECT.selectedOptions).map(
            option => option.value
        );

        return lista.filter(item =>
            SELECTED_KEYS.includes(String(this.track(item)))
        );
    }


    public onSelectDisponibles(event: Event): void {
        this.disponiblesSeleccionados =
            this.obtenerSeleccion(event, this.listaDisponibles());
    }

    public onSelectSeleccionados(event: Event): void {
        this.seleccionadosSeleccionados =
            this.obtenerSeleccion(event, this.listaSeleccionados());
    }



}
