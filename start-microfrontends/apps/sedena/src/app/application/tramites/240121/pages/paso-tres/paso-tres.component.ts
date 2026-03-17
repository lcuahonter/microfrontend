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
  selector: 'paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss'
})
export class PasoTresComponent {

  /**
   * Objeto con las instrucciones.
   * @property {string} TEXTOS - Instrucciones para el usuario. --220201
   */
  TEXTOS: string = TEXTOS?.INSTRUCCIONES;
}