import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AlertComponent, AnexarDocumentosComponent, TEXTOS, TituloComponent } from '@libs/shared/data-access-user/src';

/**
 * Componente que representa el paso dos de un proceso.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [CommonModule, AnexarDocumentosComponent, AlertComponent, TituloComponent],
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent {
  /**
   * Constante que almacena los textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;
}
