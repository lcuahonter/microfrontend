import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output } from "@angular/core";
import { ModalComponent } from "@libs/shared/data-access-user/src";

@Component({
    standalone: true,
    selector: 'cargar-archivo-component',
    templateUrl: './cargar-archivo.component.html',
    styleUrl: './cargar-archivo.component.scss',
    imports: [ModalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class CargarArchivoComponent {
    /**
     * Input para controlar la visivilidad del modal desde el padre
     */
    @Input() public showModal: boolean = false;
    /**
     * Output para controlar la visivilidad desde el padre
     */
    @Output() cerrar = new EventEmitter<void>();
    
    /**
     * metodo para cerrar el modal
     */
    public cerrarModal(): void {
        this.cerrar.emit();
    }
}