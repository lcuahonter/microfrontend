/**
 * @component PasoDosComponent
 * @description
 * Componente que representa el segundo paso de un proceso.
 * Este componente es independiente (standalone) y utiliza varios componentes compartidos.
 */
import { AlertComponent, AnexarDocumentosComponent, TEXTOS, TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
   * Contiene las constantes de texto utilizadas en la interfaz de usuario del componente.
   * Este objeto centraliza y proporciona los textos que se muestran en la UI para los distintos elementos del paso dos,
   * facilitando su mantenimiento y reutilización.
   * @type {any}
    * @description  
   */
  TEXTOS = TEXTOS;
}