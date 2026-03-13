import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Output } from "@angular/core";
import { FraccionArancelaria } from "../../models/fracciones-response.model";
import { FraccionesArancelariasService } from "../../services/fracciones-arancelarias.service";
import { FraccionesRestrucuradas } from "../../enum/fracciones-arancelarias";
import { ModalComponent } from "@libs/shared/data-access-user/src";
import { ModalControl } from "../../enum/modal-control";

@Component({
    standalone: true,
    selector: 'modal-agregar-fracciones',
    templateUrl: './modal-agregar-fracciones.component.html',
    styleUrl: './modal-agregar-fracciones.component.scss',
    imports: [ModalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalAgregarFraccionesComponent {
    /**
     * Output que emite al padre los valores de las fracciones seleccionadas.
     */
    @Output() fraccionesSeleccionadas = new EventEmitter<FraccionesRestrucuradas[]>();
    /**
     * Tipos para controlar la visibilida del modal.
     */
    public ModalControl = ModalControl;
    /**
     * Variable que controla la visibilidad del modal.
     */
    public mostrarModal: boolean = false;
    /**
     * Fracciones arancelarias
     */
    public fracciones: FraccionArancelaria[] = [];
    /**
     * itemes seleccionados
     */
    public selectedItems = new Set<string>();

    constructor(private fraccionesService: FraccionesArancelariasService) { }

    /**
     * Funcion que permite controlar la visibilidad del modal.
     * @param opcion - { ModalControl } 
     */
    public modalControler(opcion: ModalControl): void {
        if (opcion === this.ModalControl.ABRIR) {
            this.mostrarModal = true
        }
        if (opcion === this.ModalControl.CERRAR) {
            this.mostrarModal = false
        }
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
     * permite expandir el nodo y mostrar las fracciones hijas
     * @param fraccion - fraccion arancelaria seleccionada
     * @returns 
     */
    public expandirArbol(fraccion: FraccionArancelaria): void {
        if (!fraccion.hasChildren) { return }
        fraccion.isExpanded = !fraccion.isExpanded;
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
            }
        });
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
}