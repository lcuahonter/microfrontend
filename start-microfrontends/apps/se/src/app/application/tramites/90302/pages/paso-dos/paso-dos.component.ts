/**
 * @fileoverview
 * El `PasoDosComponent` es un componente de Angular diseñado para gestionar la funcionalidad del segundo paso del trámite.
 * Proporciona acceso a los textos constantes definidos en la aplicación para su uso en la plantilla HTML.
 * 
 * @module PasoDosComponent
 * @description
 * Este componente utiliza los textos constantes definidos en `TEXTOS` para mostrar información en la interfaz de usuario.
 */

import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent {
  /**
   * Textos constantes utilizados en el componente.
   * @property {any} TEXTOS
   */
  TEXTOS = TEXTOS;

  /**
   * Constructor del componente.
   * @constructor
   */
  constructor() {
    // No se necesita lógica de inicialización adicional.
  }
}