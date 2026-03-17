import { AlertComponent } from "@libs/shared/data-access-user/src";
import { Component } from "@angular/core";

@Component({
    standalone: true,
    templateUrl: './pago-derecho-anual.component.html',
    styleUrl: './pago-derecho-anual.component.scss',
    imports: [AlertComponent]
})
export class PagoDerechoAnualComponent {
    public alertMessage: string = 'El periodo autorizado para la consulta de complimiento de pago de derecho anual es del 08/12/2025 al 31/12/2025.'
}