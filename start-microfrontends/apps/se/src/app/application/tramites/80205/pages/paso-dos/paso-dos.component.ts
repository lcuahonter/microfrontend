/**
 * @fileoverview Componente del segundo paso para el trámite de ampliación de servicios IMMEX.
 * 
 * Este componente representa el segundo paso del wizard de registro,
 * mostrando información relevante para la continuación del proceso.
 * 
 * @component PasoDosComponent
 * @selector app-paso-dos
 * @templateUrl ./paso-dos.component.html
 */

import { Component } from '@angular/core';
import { TEXTOS} from '@ng-mf/data-access-user';

/**
 * Componente del segundo paso en el flujo de trámites de ampliación de servicios.
 * 
 * Este componente maneja la presentación del segundo paso del wizard,
 * utilizando textos estandarizados para mantener consistencia en la UI.
 * 
 * @class PasoDosComponent
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
 
})
export class PasoDosComponent {
  /**
   * Constante que contiene todos los textos utilizados en el componente.
   * 
   * Importada desde la librería de datos compartidos para mantener
   * consistencia en los textos mostrados al usuario.
   * 
   * @property {typeof TEXTOS} TEXTOS - Objeto con textos estandarizados de la aplicación
   */
  TEXTOS = TEXTOS;
}
