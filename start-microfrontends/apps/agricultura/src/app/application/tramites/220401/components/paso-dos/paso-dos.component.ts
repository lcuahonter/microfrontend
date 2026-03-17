/**
 * @component
 * @name PasoDosComponent
 * @description
 * Componente que representa el segundo paso de un proceso de trámite.
 * Este componente es independiente (standalone) y utiliza varios componentes compartidos
 * como TituloComponent, AnexarDocumentosComponent y AlertComponent para mostrar la UI correspondiente.
 */
import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { AlertComponent, AnexarDocumentosComponent, TEXTOS, TituloComponent } from '@libs/shared/data-access-user/src';

/**
 * @class PasoDosComponent
 * @description Componente Angular para el paso dos del trámite 220401.
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
   * Contiene constantes de texto utilizadas en la UI.
   * @type {any}
   */
  TEXTOS = TEXTOS;
}
