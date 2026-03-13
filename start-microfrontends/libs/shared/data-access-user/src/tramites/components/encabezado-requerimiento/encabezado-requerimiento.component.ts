import { Component, Input } from "@angular/core";

@Component({
    selector: 'lib-encabezado-requerimiento',
    standalone: true,
    templateUrl: './encabezado-requerimiento.component.html',
    styleUrl: './encabezado-requerimiento.component.scss',
})

export class EncabezadoRequerimientoComponent {
    @Input() isAturorizar!: boolean;
    @Input() numFolioTramite!: string;
    @Input() tipoTramite!: string;

    constructor() {
        // Lógica de inicialización si es necesario
     }
}