import { BusquedaTramiteComponent } from "./busqueda-tramite/busqueda-tramite.component";
import { Component } from "@angular/core";
import { DetallesDelTramiteComponent } from "./detalles-tramite/detalles-tramite.component";
import { FormsModule } from "@angular/forms";
import { RegistrosResponse } from "../../../../../core/models/agregar-fraccion/response/registros-response";

@Component({
    standalone: true,   
    templateUrl: './consultar.component.html',
    styleUrl: './consultar.component.scss',
    imports: [FormsModule, DetallesDelTramiteComponent, BusquedaTramiteComponent],
})
export class ConsultarComponent {


    public tramiteSeleccionado: RegistrosResponse | undefined = undefined;

    public tieneTramiteSeleccionado: boolean = false;

    onTramiteSeleccionado(event: RegistrosResponse):void{
        this.tramiteSeleccionado = event;
        this.tieneTramiteSeleccionado = true;
    }

    public accionRegresar():void{
        this.tieneTramiteSeleccionado = false;
        this.tramiteSeleccionado = undefined
    }
}