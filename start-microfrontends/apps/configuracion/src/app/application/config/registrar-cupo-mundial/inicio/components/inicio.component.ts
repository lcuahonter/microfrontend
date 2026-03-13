import { Component } from "@angular/core";
import { FormCupo } from "../../../../shared/models/form-cupo";
import { FormCupoComponent } from "../../../../shared/components/form-cupo/inicio.component";


@Component({
    standalone: true,
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.scss',
    imports: [FormCupoComponent],
})
export class MundialComponent {
    /**
     * Variable que almacena los datos del formulario registrar cupo.
     */
    public datosDelForm: FormCupo | undefined = undefined;
    /**
     * Funcion que recibe los datos del form cupo mundial
     * @param form Formulario cupo sin procesar
     */
    public enviarForm(form: FormCupo): void {
        this.datosDelForm = form
    }

}