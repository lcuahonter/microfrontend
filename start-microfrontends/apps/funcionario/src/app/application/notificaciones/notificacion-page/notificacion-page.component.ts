import { CommonModule } from '@angular/common';
import { Component } from "@angular/core";
import { DatosUsuarioComponent } from "../notificacion-components/datos-usuario/datos-usuario.component";
import { EncabezadoRequerimientoComponent } from "@ng-mf/data-access-user";

@Component({
    templateUrl: './notificacion-page.component.html',
    standalone: true,
    styleUrl: './notificacion-page.component.scss',
    imports: [CommonModule, DatosUsuarioComponent, EncabezadoRequerimientoComponent],
})
export class NotificacionPageComponent {
    readonly TITULO_NOTIFICACION = 'Notificación de trámite';

    numFolioTramite: string = '02309482934723832';
    tipoTramite: string = 'Registro de solicitud de servicios extraordinarios';


}