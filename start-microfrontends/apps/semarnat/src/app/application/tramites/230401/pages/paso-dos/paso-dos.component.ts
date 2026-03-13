import { Component } from '@angular/core';
import { TEXTOS_REQUISITOS } from '../../enum/pantallas-constante.enum';

/**
 * Componente que representa el segundo paso en el flujo de trámites.
 * 
 * Este componente contiene un objeto con los textos de los requisitos necesarios
 * para completar el trámite. Los textos son accesibles a través de la propiedad `TEXTOS`.
 *
 * Se espera que sea utilizado dentro de un flujo paso a paso para visualizar
 * los requisitos necesarios antes de continuar con la solicitud.
 *
 * @class PasoDosComponent
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
})
/**
 * Componente que representa el segundo paso en el flujo de trámites.
 * 
 * Este componente contiene un objeto con los textos de los requisitos necesarios
 * para completar el trámite. Los textos son accesibles a través de la propiedad `TEXTOS`.
 * 
 * @class PasoDosComponent
 * @property {object} TEXTOS - Objeto que contiene los textos de los requisitos.
 * 
 * @example
 * ```typescript
 * const pasoDos = new PasoDosComponent();
 * console.log(pasoDos.TEXTOS); // Accede a los textos de los requisitos
 * ```
 */
export class PasoDosComponent {

  /**
   * Variable que almacena los textos relacionados con los requisitos.
   * 
   * `TEXTOS` se utiliza para gestionar y mostrar los textos necesarios 
   * en el contexto de los requisitos dentro del componente `paso-dos`.
   * 
   * Los textos son obtenidos desde la constante `TEXTOS_REQUISITOS`, 
   * que contiene las definiciones específicas de los mensajes o 
   * información requerida para esta sección de la aplicación.
   */
  TEXTOS = TEXTOS_REQUISITOS;
}
