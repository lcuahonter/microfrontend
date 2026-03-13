import { AlertComponent, AnexarDocumentosComponent, TEXTOS, TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * @component
 * @name PasoDosComponent
 * @description
 * Componente que representa el segundo paso de un proceso.
 * Este componente es independiente (standalone) y utiliza varios componentes compartidos.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [
    CommonModule, 
    TituloComponent,
    AnexarDocumentosComponent, 
    AlertComponent,
  ],
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent {
  /**
   * @property {any} TEXTOS
   * @description Contiene constantes de texto utilizadas en la UI.
   */
  TEXTOS = TEXTOS;
}
