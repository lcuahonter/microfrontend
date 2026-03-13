/**
 * @fileoverview
 * Componente que representa el tercer paso dentro del flujo del trámite.
 * Este componente es simple y funciona únicamente como contenedor visual
 * para su respectiva plantilla HTML y hoja de estilos.
 */

import { Component } from '@angular/core';

/**
 * @component PasoTresComponent
 * @description
 * Componente correspondiente al tercer paso del proceso.
 * No contiene lógica interna ni dependencias inyectadas;
 * únicamente sirve como estructura para la vista asociada.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.css',
})
export class PasoTresComponent {

  /**
   * @constructor
   * Constructor sin dependencias ya que este componente
   * no requiere inicialización adicional.
   */
  constructor() {
    // Componente sin lógica adicional
  }
}
