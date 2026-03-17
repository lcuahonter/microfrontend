import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AgregarFraccionService } from "../../../../../core/services/agregar-fraccion.service";
import { DocumentosResponse } from "../../../../../core/models/agregar-fraccion/response/documentos-response";
import { ModalComponent } from "@libs/shared/data-access-user/src";

enum VistaDocumento {
    AGREGADOS = "AGREGADOS",
    BUSQUEDA = "BUSQUEDA"
}

@Component({
    selector: 'documentos-fraccion-component',
    templateUrl: './documentos-fraccion.component.html',
    styleUrl: './documentos-fraccion.component.scss',
    standalone: true,
    imports: [ReactiveFormsModule, ModalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DocumentosFraccionesComponent {
    public VistaDocumento = VistaDocumento;
    /**
     * documentosAgregados - arreglo de documentos que el usuario ha agregado
     */
    @Input() public documentosAgregados: DocumentosResponse[] = []
    /**
     * documentosObtenidos - arreglo de documentos obtenidos por la busqueda del usuario, una vez usada, debe setearse a array vacio.
     */
    public documentosObtenidos: DocumentosResponse[] = []
    /**
     * documentosEnEspera - arreglo de documentos en espera de ser seteados a documentos Agregados
     */
    public documentosEnEspera: DocumentosResponse[] = []
    /**
     * datos a mostrar de la tabla, 
     * AGREGADOS (default) - muestra los documentos agregados.
     * BUSQUEDA - muestra los documentos de busqueda a agregar.
     */
    public vista: VistaDocumento = VistaDocumento.AGREGADOS;
    /**
     * Indica si el modal debe mostrarse
     */
    @Input() public showModal: boolean = false;
    /**
     * variable que almacena el valor del campo descripcion
     */
    public descripcion = new FormControl('')
    /**
     * output para emitir cuando el modal se abre o cierra
     */
    @Output() cerrar = new EventEmitter<void>();

    @Output() mensajeAlertaCerrado = new EventEmitter<void>();

    @Output() enviarDocumentos = new EventEmitter<DocumentosResponse[]>();

    public mostrarAlerta:boolean=false;

    /**
     * 
     * @param agregarFraccion 
     */
    constructor(
        public agregarFraccion: AgregarFraccionService
    ) { }

    /**
     * Método encargado de cambiar la visibilidad del modal
     */
    public cerrarModal(): void {
        this.cerrar.emit();
    }

    public cambioDeTabla(TABLA: VistaDocumento): void {
        switch (TABLA) {
            case VistaDocumento.AGREGADOS: {
                this.vista = VistaDocumento.AGREGADOS;
                break;
            }

            case VistaDocumento.BUSQUEDA: {
                this.vista = VistaDocumento.BUSQUEDA;
                break;
            }

            default: {
                break;
            }
        }
    }


    public buscarDocumento(): void {
        if (this.vista === VistaDocumento.AGREGADOS) {
            return;
        }
        if (this.vista === VistaDocumento.BUSQUEDA) {
            this.agregarFraccion.getDocumentos().subscribe((res) => {
                this.documentosObtenidos = res
            })
        }
    }

    public marcarDocumento(DOCUMENTO: DocumentosResponse, EVENT: Event): void {
        const CHECKED = (EVENT.target as HTMLInputElement).checked;

        const EXISTE_EN_ESPERA = this.documentosEnEspera
            .some(item => item.id === DOCUMENTO.id);

        if (CHECKED && !EXISTE_EN_ESPERA) {
            this.documentosEnEspera.push(DOCUMENTO);
        }

        if (!CHECKED && EXISTE_EN_ESPERA) {
            this.documentosEnEspera = this.documentosEnEspera
                .filter(item => item.id !== DOCUMENTO.id);
        }
    }

    public marcarTodos(EVENT: Event): void {
        const CHECKED = (EVENT.target as HTMLInputElement).checked;

        const DOCUMENTOS_VISIBLES =
            this.vista === VistaDocumento.AGREGADOS
                ? this.documentosAgregados
                : this.documentosObtenidos;

        if (CHECKED) {
            DOCUMENTOS_VISIBLES.forEach((DOC) => {
                const EXISTE = this.documentosEnEspera
                    .some(item => item.id === DOC.id);

                if (!EXISTE) {
                    this.documentosEnEspera.push(DOC);
                }
            });
        } else {
            const IDS_VISIBLES = DOCUMENTOS_VISIBLES.map(doc => doc.id);

            this.documentosEnEspera = this.documentosEnEspera
                .filter(doc => !IDS_VISIBLES.includes(doc.id));
        }
    }

    public get documentosVisibles(): DocumentosResponse[] {
        return this.vista === VistaDocumento.AGREGADOS
            ? this.documentosAgregados
            : this.documentosObtenidos;
    }


    public get todosSeleccionados(): boolean {
        return this.documentosVisibles.length > 0 &&
            this.documentosVisibles.every(doc =>
                this.documentosEnEspera.some(d => d.id === doc.id)
            );
    }


    public estaSeleccionado(DOCUMENTO: DocumentosResponse): boolean {
        return this.documentosEnEspera
            .some(item => item.id === DOCUMENTO.id);
    }

    public get parcialmenteSeleccionados(): boolean {
        return this.documentosVisibles.length > 0 &&
            this.documentosVisibles.some(doc =>
                this.estaSeleccionado(doc)
            ) &&
            !this.todosSeleccionados;
    }

    public agregarDocumentos(): void {

        this.documentosEnEspera.forEach((DOCUMENTO) => {

            const YA_EXISTE = this.documentosAgregados
                .some(item => item.id === DOCUMENTO.id);

            if (!YA_EXISTE) {
                this.documentosAgregados.push(DOCUMENTO);
            }

        });

        this.documentosEnEspera = [];

    }

    public aceptarDocumentos():void{
        if(this.documentosAgregados.length > 0){
            this.enviarDocumentos.emit(this.documentosAgregados)
            this.cerrarModal()
            return;
        }
        this.mostrarAlerta = true;
    }

    public eliminarDocumentos():void{
        this.documentosAgregados = []
    }

    public cerrarAlerta():void{
        this.cerrarModal()
    }

}