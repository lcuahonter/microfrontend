import { Component, Input } from "@angular/core";

@Component({
    selector: 'lib-requerimiento-informacion',
    standalone: true,
    templateUrl: './requerimiento-informacion.component.html',
    styleUrl: './requerimiento-informacion.component.scss',
})

export class RequerimientoInformacionComponent {
    @Input() fechaRequerimiento!: string;
    @Input() justificacionRequerimiento!: string;

    constructor() {
        // Lógica de inicialización si es necesario
    }
}