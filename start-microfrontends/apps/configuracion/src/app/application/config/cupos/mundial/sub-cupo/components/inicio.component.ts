import { Component } from "@angular/core";
import { FormCupoComponent } from "../../../../../shared/components/form-cupo/inicio.component";
import { TipoForm } from "../../../../../shared/enum/form-cupo";

@Component({
    standalone:true,
    templateUrl: './inicio.component.html',
    imports: [FormCupoComponent]
})
export class SubCupoComponent {
    public TipoForm = TipoForm.SUBCUPO
}