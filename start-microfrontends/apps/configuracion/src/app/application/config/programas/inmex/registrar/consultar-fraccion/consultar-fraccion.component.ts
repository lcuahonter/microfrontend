
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FraccionesResponse } from "../../../../../core/models/agregar-fraccion/response/agregar-fraccion";
import { ModalComponent } from "@libs/shared/data-access-user/src";
import { TablaFraccionesComponent } from "../tabla-fracciones/tabla-fracciones.component";


interface ItemFraccion {
    id: string;
    title: string;
    children: ItemFraccion[];
}

interface Columna {
    campo: keyof ItemFraccion;
    titulo: string;
}

@Component({
    standalone: true,
    selector: 'consultar-fraccion-component',
    templateUrl: './consultar-fraccion.component.html',
    styleUrl: './consultar-fraccion.component.scss',
    imports: [FormsModule, ModalComponent, TablaFraccionesComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultarFraccionComponent {
    /**
     * Recibe los datos de las fracciones seleccionadas
     */
    @Input() public datos: FraccionesResponse[] = []

    /**
     * Input para controlar la visivilidad del modal desde el padre
     */
    @Input() public showModal: boolean = false;
    /**
     * Output para controlar la visivilidad desde el padre
     */
    @Output() cerrar = new EventEmitter<void>();
    /**
     * Output para enviar los datos nuevos al padre
     */
    @Output() actualizarDatos = new EventEmitter<FraccionesResponse[]>();
    /**
     * id del padre de los hijos mostrados en el arbol o tabla
     */
    public idBusqueda: string = "";
    /**
     * columnas de la tabla
     */
    public columnas: Columna[] = [
        { campo: 'id', titulo: 'FRACCIÓN' },
        { campo: 'title', titulo: 'DESCRIPCIÓN' }
    ];


    @ViewChild(TablaFraccionesComponent)
    public tabla!: TablaFraccionesComponent;

    /**
     * metodo para cerrar el modal
     */
    public cerrarModal(): void {
        this.cerrar.emit();
    }
        /**
     * 
     *  metodo para consultar por id y mostrar los hijos del id
     */
    public consultarPorId(): void {
        if (!this.idBusqueda) {
            return;
        }

        const TABLA = this.tabla;

        if (TABLA) {
            TABLA.buscarPorId(this.idBusqueda);
        }
    }



}