import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { AgregarFraccionService } from "../../../../../core/services/agregar-fraccion.service";
import { CommonModule } from "@angular/common";
import { FraccionesResponse } from "../../../../../core/models/agregar-fraccion/response/agregar-fraccion";
import { Subject } from "rxjs";

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'agregar-fraccion-component',
    templateUrl: './agregar-fraccion.component.html',
    styleUrl: './agregar-fraccion.component.scss',
})
export class AgregarFraccionComponent implements OnInit, OnDestroy, OnChanges {
    /**
     * Subject utilizado para controlar la destrucción del componente
     * y cancelar suscripciones activas, evitando fugas de memoria.
     *
     * Se emite y completa normalmente en el método `ngOnDestroy`.
     */
    private destroyed$ = new Subject<void>();

    /**
     * Indica si el modal de selección de fracciones debe mostrarse.
     *
     * @default false
     */
    public mostrarModal: boolean = false;

    /**
     * Lista completa de fracciones disponibles para mostrar y seleccionar.
     *
     * Se obtiene generalmente desde un servicio o componente padre.
     */
    public fracciones: FraccionesResponse[] = [];

    /**
     * Lista de fracciones seleccionadas por el usuario dentro del modal.
     *
     * Se utiliza para llevar el control de la selección antes de confirmar.
     */
    public fraccionesSelecionadas: FraccionesResponse[] = [];

    /**
     * Emite al componente padre la lista de fracciones confirmadas por el usuario.
     *
     * Se dispara cuando el usuario acepta o confirma la selección.
     */
    @Output()
    fraccionesConfirmadas = new EventEmitter<FraccionesResponse[]>();

    /**
     * Lista de fracciones previamente seleccionadas recibidas desde el componente padre.
     *
     * Se utiliza para inicializar o marcar fracciones como seleccionadas
     * cuando el modal se abre.
     */
    @Input()
    fraccionesPreviamentSeleccionadas: FraccionesResponse[] = [];


    constructor(
        public agregarFraccionesService: AgregarFraccionService
    ) { }

    ngOnInit(): void {
        this.agregarFraccionesService.getFracciones()
            .subscribe((res) => {
                this.fracciones = res;
                this.restaurarSeleccionPrevia();
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['fraccionesPreviamentSeleccionadas'] && !changes['fraccionesPreviamentSeleccionadas'].firstChange) {
            this.restaurarSeleccionPrevia();
        }
    }

    abrirModalAgregarfraccion(): void {
        this.mostrarModal = true;
    }

    public confirmarFracciones(): void {
        this.fraccionesConfirmadas.emit(this.fraccionesSelecionadas);
    }
    /**
     * Maneja la selección/deselección de fracciones
     */
    selectFraccion(event: Event, ITEM: FraccionesResponse): void {
        const INPUT = event.target as HTMLInputElement;
        const CHECKED = INPUT.checked;

        if (CHECKED) {
            this.addFraccionRecursive(ITEM);
        } else {
            this.removeFraccionRecursive(ITEM.id);
        }

        const CONTAINER = document.getElementById('sub-' + ITEM.id);
        if (CONTAINER) {
            if (CHECKED) {
                CONTAINER.classList.add('open');
            } else {
                CONTAINER.classList.remove('open');
            }

            const INPUTS = CONTAINER.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            INPUTS.forEach((child) => { child.checked = CHECKED });
        }
    }
    /**
     * Agrega una fracción y actualiza el árbol de seleccionados
     */
    private addFraccionRecursive(ITEM: FraccionesResponse): void {
        const PARENT_ID = this.getParentId(ITEM.id);

        if (PARENT_ID) {
            this.updateParentChildren(this.fraccionesSelecionadas, PARENT_ID, ITEM);
        } else {
            const EXISTING_INDEX = this.fraccionesSelecionadas.findIndex(f => f.id === ITEM.id);
            if (EXISTING_INDEX === -1) {
                this.fraccionesSelecionadas.push(JSON.parse(JSON.stringify(ITEM)));
            }
        }
    }

    /**
     * Actualiza los children de un padre en el árbol
     */
    private updateParentChildren(
        items: FraccionesResponse[],
        PARENT_ID: string,
        newChild: FraccionesResponse
    ): boolean {
        for (const ITEM of items) {
            if (ITEM.id === PARENT_ID) {
                const CHILD_INDEX = ITEM.children.findIndex(c => c.id === newChild.id);
                if (CHILD_INDEX === -1) {
                    ITEM.children.push(JSON.parse(JSON.stringify(newChild)));
                }
                return true;
            }

            if (ITEM.children.length > 0) {
                if (this.updateParentChildren(ITEM.children, PARENT_ID, newChild)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Elimina una fracción y todos sus hijos del árbol de seleccionados
     */
    private removeFraccionRecursive(itemId: string | number): void {
        const ROOT_INDEX = this.fraccionesSelecionadas.findIndex(f => f.id === itemId);
        if (ROOT_INDEX !== -1) {
            this.fraccionesSelecionadas.splice(ROOT_INDEX, 1);
            return;
        }

        this.removeFromChildren(this.fraccionesSelecionadas, itemId);
    }

    /**
     * Busca y elimina un ITEM de los children recursivamente
     */
    private removeFromChildren(items: FraccionesResponse[], itemId: string | number): boolean {
        for (const ITEM of items) {
            const CHILD_INDEX = ITEM.children.findIndex(c => c.id === itemId);
            if (CHILD_INDEX !== -1) {
                ITEM.children.splice(CHILD_INDEX, 1);
                return true;
            }

            if (ITEM.children.length > 0) {
                if (this.removeFromChildren(ITEM.children, itemId)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Obtiene el ID del padre basándose en el ID del hijo
     */
    private getParentId(childId: string | number): string | null {
        const ID_STR = childId.toString();

        const PARENT = this.findParentInTree(this.fracciones, ID_STR);
        return PARENT ? PARENT.id.toString() : null;
    }

    /**
     * Busca el padre de un ITEM en el árbol
     */
    private findParentInTree(items: FraccionesResponse[], childId: string): FraccionesResponse | null {
        for (const ITEM of items) {
            const HAS_CHILD = ITEM.children.some(c => c.id.toString() === childId);
            if (HAS_CHILD) {
                return ITEM;
            }

            if (ITEM.children.length > 0) {
                const ENCONTRADO = this.findParentInTree(ITEM.children, childId);
                if (ENCONTRADO) { return ENCONTRADO }
            }
        }
        return null;
    }

    private restaurarSeleccionPrevia(): void {
        if (this.fraccionesPreviamentSeleccionadas.length === 0 || this.fracciones.length === 0) {
            return;
        }
        this.fraccionesSelecionadas = JSON.parse(JSON.stringify(this.fraccionesPreviamentSeleccionadas));
        setTimeout(() => {
            this.marcarCheckboxesRecursivo(this.fraccionesSelecionadas);
        }, 100);
    }

    private marcarCheckboxesRecursivo(items: FraccionesResponse[]): void {
        items.forEach(item => {
            const CHECKBOX = document.getElementById(String(item.id)) as HTMLInputElement;
            if (CHECKBOX) {
                CHECKBOX.checked = true;

                if (item.children.length > 0) {
                    const CONTAINER = document.getElementById('sub-' + item.id);
                    if (CONTAINER) {
                        CONTAINER.classList.add('open');
                    }
                    this.marcarCheckboxesRecursivo(item.children);
                }
            }
        });
    }


    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}

