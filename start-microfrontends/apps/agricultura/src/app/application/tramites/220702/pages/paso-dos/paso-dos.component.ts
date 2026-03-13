
import { AlertComponent, AnexarDocumentosComponent, TituloComponent } from '@ng-mf/data-access-user';
import { Component } from '@angular/core';
import { TEXTOS_REQUISITOS } from '../../constantes/acuicola.enum';

/**
 * Componente que representa el segundo paso del trámite.
 * @export
 * @class PasoDosComponent
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [
    AlertComponent,
    TituloComponent,
    AnexarDocumentosComponent
  ],
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent {
  /**
   * Textos constantes utilizados en el componente.
   * @property {any} TEXTOS
   */
  TEXTOS = TEXTOS_REQUISITOS;
}