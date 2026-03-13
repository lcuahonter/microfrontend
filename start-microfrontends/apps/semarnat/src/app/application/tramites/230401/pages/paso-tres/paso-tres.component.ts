import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

/**
 * Componente que representa el segundo paso en el flujo de trámites.
 * 
 * Este componente contiene un objeto con los textos de los requisitos necesarios
 * para completar el trámite. Los textos son accesibles a través de la propiedad `TEXTOS`.
 *
 * Se espera que sea utilizado dentro de un flujo paso a paso para visualizar
 * los requisitos necesarios antes de continuar con la solicitud.
 *
 * @class PasoTresComponent
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
})
/**
 * Componente que representa el paso tres dentro del flujo de trámites.
 * 
 * @class PasoTresComponent
 * @description Este componente contiene la lógica y presentación para el tercer paso del proceso de trámites.
 * 
 * @property {string} TEXTOS - Contiene las instrucciones necesarias para el paso tres. 
 *                             Se obtiene del objeto global `TEXTOS` y accede a la propiedad `INSTRUCCIONES`.
 */
export class PasoTresComponent {


  /**
   * Propiedad que almacena los textos de instrucciones utilizados en el componente.
   * 
   * `TEXTOS` es una cadena de texto que se inicializa con el valor de `TEXTOS?.INSTRUCCIONES`.
   * Este valor puede ser utilizado para mostrar mensajes o instrucciones específicas en la interfaz de usuario.
   * 
   * @type {string}
   */
  TEXTOS: string = TEXTOS?.INSTRUCCIONES;
}
