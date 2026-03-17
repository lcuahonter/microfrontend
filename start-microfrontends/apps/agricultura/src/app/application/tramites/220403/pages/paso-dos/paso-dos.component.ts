/**
 * @component PasoDosComponent
 * @description Este componente es responsable de manejar el segundo paso del trámite.
 * 
 * @import { Component } from '@angular/core';
 * @import { TEXTOS } from '@libs/shared/data-access-user/src';
 */

import { Component } from '@angular/core';
import { TEXTOS } from '@libs/shared/data-access-user/src';

/**
 * @fileoverview Componente para mostrar el subtítulo y los requisitos del asistente en el paso dos del trámite.
 * Incluye la visualización de textos de ayuda y el componente para anexar documentos.
 * @module PasoDosComponent
 */

/**
 * Componente para mostrar el subtítulo del asistente y los requisitos en el paso dos.
 * @component PasoDosComponent
 * @selector app-paso-dos
 * @templateUrl ./paso-dos.component.html
 * @styleUrls ./paso-dos.component.scss
 */

@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.css',
})
export class PasoDosComponent {
  /**
   * @property {any} TEXTOS 
   * @description
   * Constantes de textos utilizados en el componente.
   */
  TEXTOS = TEXTOS
}
