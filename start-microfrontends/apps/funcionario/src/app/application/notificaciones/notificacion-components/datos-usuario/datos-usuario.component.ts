import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
@Component({
    selector: 'lib-datos-usuario',
    standalone: true,
    templateUrl: './datos-usuario.component.html',
    styleUrl: './datos-usuario.component.scss',
    imports: [CommonModule, ReactiveFormsModule]
})

export class DatosUsuarioComponent implements OnInit {
    @Input() numFolioTramite!: string;
    @Input() tipoTramite!: string;

    form!: FormGroup

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.crearFormulario();
    }

    /**
     * Crea y configura el formulario con valores predeterminados y campos deshabilitados.
     * 
     * El formulario contiene los siguientes campos:
     * - `razonSocial`: Nombre completo del usuario, deshabilitado por defecto.
     * - `solicitudPersonaRfc`: RFC de la persona, deshabilitado por defecto.
     * - `fechaHoraNotificacion`: Fecha y hora de la notificación, deshabilitado por defecto.
     * 
     * @returns {void} No retorna ningún valor.
     */
    crearFormulario(): void {
        this.form = this.fb.group({
            razonSocial: [{value: 'Ignacio Eduardo Leos Quiñones', disabled: true}],
            solicitudPersonaRfc: [{ value:'LEQI81011314S7', disabled: true}],
            fechaHoraNotificacion: [{ value: '08/06/2024 | 09:00', disabled: true}],
        });
    }

    /**
     * Navega a la ruta 'aga/pago/firmar' utilizando el enrutador.
     * 
     * @returns {void} No retorna ningún valor.
     */
    continuar() : void {
        this.router.navigate(['funcionario/notificaciones/firmar']);
    }
}