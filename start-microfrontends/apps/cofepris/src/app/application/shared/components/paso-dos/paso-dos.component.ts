import { Component } from '@angular/core';

import { AlertComponent, AnexarDocumentosComponent, TEXTOS, TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [ CommonModule, 
    TituloComponent,
    AnexarDocumentosComponent, 
    AlertComponent],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent {
    /**
   * @prop {any} TEXTOS - Contiene constantes de texto utilizadas en la UI.
   */
    TEXTOS = TEXTOS;
}
