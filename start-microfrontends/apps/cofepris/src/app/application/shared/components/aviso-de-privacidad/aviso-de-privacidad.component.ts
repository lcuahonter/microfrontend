import { AVISO } from '@libs/shared/data-access-user/src';
import { AlertComponent} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-aviso-de-privacidad',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './aviso-de-privacidad.component.html',
  styleUrl: './aviso-de-privacidad.component.scss',
})
export class AvisoDePrivacidadComponent {
  public infoAlert = 'alert-info';
    TEXTOS = AVISO;
}
