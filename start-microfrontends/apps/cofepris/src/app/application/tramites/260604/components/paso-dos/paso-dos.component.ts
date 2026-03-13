/**
 * @fileoverview
 * Componente que representa el segundo paso de un flujo o proceso.
 * Este componente es independiente (standalone) y utiliza componentes
 * compartidos para encabezado, alertas y anexado de documentos.
 */

import { 
  AlertComponent, 
  AnexarDocumentosComponent, 
  TEXTOS, 
  TituloComponent 
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * @component PasoDosComponent
 * @description
 * Componente que representa el segundo paso del proceso.  
 * Su función principal es mostrar el título, alertas informativas
 * y el módulo de anexar documentos.  
 * Este componente no maneja lógica compleja; solamente sirve como contenedor visual.
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
   * @description
   * Objeto con textos reutilizables dentro del módulo.  
   * Se utiliza desde la librería compartida `data-access-user`.
   */
  TEXTOS = TEXTOS;

  /**
   * @constructor
   * Constructor vacío debido a que este componente no requiere
   * inyección de servicios ni inicialización adicional.
   */
  constructor() {
    // Componente sin lógica adicional
  }
}
