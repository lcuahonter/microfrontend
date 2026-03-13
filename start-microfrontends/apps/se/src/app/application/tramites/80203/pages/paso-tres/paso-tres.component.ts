/**
 * @fileoverview Componente para el tercer paso del trámite IMMEX.
 * @description
 * Este archivo contiene la implementación del componente PasoTresComponent
 * que maneja el tercer paso del trámite IMMEX, incluyendo la obtención de
 * la firma electrónica y la navegación a la página de acuse.
 */

import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

/**
 * @class PasoTresComponent
 * @description
 * Componente Angular responsable de manejar el tercer paso del trámite IMMEX.
 * Este componente se encarga de mostrar las instrucciones necesarias para completar
 * el proceso de firma electrónica y proporciona la funcionalidad para navegar
 * hacia la página de acuse de recibo.
 * 
 * @example
 * ```html
 * <paso-tres></paso-tres>
 * ```
 * 
 * @since 1.0.0
 * @author Equipo de Desarrollo VUCEM 3.0
 */
@Component({
  selector: 'paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss'
})
export class PasoTresComponent {
  /**
   * @property {string} TEXTOS
   * @description 
   * Contiene las instrucciones textuales que se mostrarán al usuario
   * durante el tercer paso del trámite IMMEX. Estas instrucciones
   * guían al usuario en el proceso de firma electrónica.
   * 
   * @type {string}
   * @memberof PasoTresComponent
   * @since 1.0.0
   * @default TEXTOS?.INSTRUCCIONES
   * 
   * @example
   * ```typescript
   * // Acceso a las instrucciones
   * const instrucciones = this.TEXTOS;
   * ```
   */
  TEXTOS: string = TEXTOS?.INSTRUCCIONES;
}