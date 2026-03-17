import { AccionTable, TablaFraccionesComponent } from "../tabla-fracciones/tabla-fracciones.component";
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FraccionesResponse } from "../../../../../core/models/agregar-fraccion/response/agregar-fraccion";
import { ModalComponent } from "@libs/shared/data-access-user/src";

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
    selector: 'eliminar-fraccion-component',
    templateUrl: './eliminar-fraccion.component.html',
    styleUrl: './eliminar-fraccion.component.scss',
    imports: [TablaFraccionesComponent, ModalComponent, FormsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EliminarFraccionComponent {
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
     * constante de accion de la tabla que permitira acceder a las funciones de eliminar o consultar
     */
    public accion: AccionTable = AccionTable.ELIMINAR
    /**
     * id del padre de los hijos mostrados en el arbol o tabla
     */
    public idBusqueda: string = "";

    @ViewChild(TablaFraccionesComponent)
    public tabla!: TablaFraccionesComponent;
    /**
     * columnas de la tabla
     */
    public columnas: Columna[] = [
        { campo: 'id', titulo: 'FRACCIÓN' },
        { campo: 'title', titulo: 'DESCRIPCIÓN' }
    ];
    /**
     * metodo para cerrar el modal
     */
    public cerrarModal(): void {
        this.cerrar.emit();
    }
    /**
     * variable de los datos seleccionados a eliminar
     */
    public seleccionados: FraccionesResponse[] = [];
    /**
     * Metodo para recirbir todos los seleccionados
     * @param lista - lista de se objetos seleccionados
     */
    public recibirSeleccionados(lista: FraccionesResponse[]): void {
        this.seleccionados = lista;
    }
    /**
     * variable que recibe el nuevo arreglo de datos una vez eliminados los seleccionados
     */
    public nuevosDatos: FraccionesResponse[] = []
    /**
     * Metodo que setea a un array vacio indicando que todos los datos han sido eliminados
     */
    public eliminarTodo(): void {
        this.nuevosDatos = [];
        this.actualizarDatos.emit(this.nuevosDatos);
    }
    /**
     * Metodo para eliminar los datos seleccionados de la lista
     * 
     */
    public eliminarDatosSeleccionados(): void {

        if (this.seleccionados.length === 0) {
            return;
        }

        const IDS_A_ELIMINAR = new Set(
            this.seleccionados.map(x => String(x.id))
        );

        this.nuevosDatos = this.eliminarRecursivo(this.datos, IDS_A_ELIMINAR);

        this.actualizarDatos.emit(this.nuevosDatos);

    }


    private eliminarRecursivo(
        lista: FraccionesResponse[],
        ids: Set<string>
    ): FraccionesResponse[] {

        const RESULTADO: FraccionesResponse[] = [];

        for (const ITEM of lista) {

            if (ids.has(String(ITEM.id))) {
                continue;
            }

            const NUEVOS_HIJOS = ITEM.children?.length
                ? this.eliminarRecursivo(ITEM.children, ids)
                : [];

            RESULTADO.push({
                ...ITEM,
                children: NUEVOS_HIJOS
            });
        }

        return RESULTADO;
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