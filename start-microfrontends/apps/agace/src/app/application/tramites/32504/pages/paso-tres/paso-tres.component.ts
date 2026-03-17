import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from "@ng-mf/data-access-user";
import { TEXTO_ANEXAR_REQUISITOS } from '../../constants/aviso.enum';

@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
  standalone: true,
  imports: [FirmaElectronicaComponent],
})
export class PasoTresComponent {

    /**
     * Objeto con las instrucciones.
     * @property {string} textConfig
     */
    textConfig = TEXTO_ANEXAR_REQUISITOS;
}
