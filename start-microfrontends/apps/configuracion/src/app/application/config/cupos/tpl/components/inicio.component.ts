import { Component } from "@angular/core";
import { FormCupo } from "../../../../shared/models/form-cupo";
import { FormCupoComponent } from "../../../../shared/components/form-cupo/inicio.component";

@Component({
    standalone: true,
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.scss',
    imports: [FormCupoComponent],
})
export class TPLComponent {
    private datosDelformulario!: FormCupo;
    public enviarForm(event: FormCupo): void {
        this.datosDelformulario = event
    }
}