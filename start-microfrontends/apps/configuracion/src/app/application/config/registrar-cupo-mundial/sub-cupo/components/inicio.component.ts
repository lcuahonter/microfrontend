import { Component } from "@angular/core";
import { FormCupo } from "../../../../shared/models/form-cupo";
import { FormCupoComponent } from "../../../../shared/components/form-cupo/inicio.component";
import { TipoForm } from "../../../../shared/enum/form-cupo";

@Component({
    standalone: true,
    templateUrl: './inicio.component.html',
    imports: [FormCupoComponent]
})
export class SubCupoComponent {
    /**
     * tipo del formulario
     */
    public TipoForm = TipoForm.SUBCUPO
    /**
     * datos del formulario
     */
    public data: FormCupo | undefined = undefined;
    /**
     * Metodo para recibir los datos del formulario.
     * @param form Formulario cupo
     */
    public enviarForm(form: FormCupo): void {
        this.data = form
    }
}