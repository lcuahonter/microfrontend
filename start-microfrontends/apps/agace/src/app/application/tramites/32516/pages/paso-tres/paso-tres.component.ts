/**
 * Componente responsable de manejar el tercer paso del trámite 32516.
 *
 * Este componente representa la página final del flujo del trámite, donde se maneja
 * la obtención de la firma electrónica y la navegación hacia la página de acuse de recibo.
 * Implementa la lógica necesaria para completar el proceso de solicitud y proporcionar
 * las instrucciones finales al usuario.
 *
 * @fileoverview Componente del paso tres para el trámite 32516 - Página de firma y finalización
 * @version 1.0.0
 * @since 2025
 */

import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

/**
 * Componente Angular para el tercer y último paso del trámite 32516.
 *
 * Este componente proporciona la interfaz de usuario para el paso final del proceso,
 * donde los usuarios pueden firmar su solicitud y recibir las instrucciones finales
 * antes de ser dirigidos a la página de acuse de recibo.
 *
 * Funcionalidades principales:
 * - Mostrar instrucciones finales al usuario
 * - Facilitar el proceso de firma electrónica
 * - Proporcionar navegación hacia el acuse de recibo
 *
 * @class PasoTresComponent
 * @implements {OnInit} - Para inicialización del componente
 * 
 * @example
 * ```html
 * <paso-tres></paso-tres>
 * ```
 *
 * @see {@link https://angular.io/guide/component-overview} - Documentación de componentes Angular
 */
@Component({
  /**
   * Selector del componente para su uso en plantillas HTML.
   * @type {string}
   */
  selector: 'paso-tres',
  
  /**
   * Ruta del archivo de plantilla HTML del componente.
   * @type {string}
   */
  templateUrl: './paso-tres.component.html',
  
  /**
   * Ruta del archivo de estilos SCSS del componente.
   * @type {string}
   */
  styleUrl: './paso-tres.component.scss'
})
export class PasoTresComponent {

  /**
   * Textos de instrucciones para el usuario en el paso final del trámite.
   *
   * Contiene las instrucciones específicas que se mostrarán al usuario
   * en esta etapa del proceso, obtenidas del módulo de acceso a datos
   * de usuario compartido.
   *
   * @type {string}
   * @public
   * @readonly
   * @memberof PasoTresComponent
   * 
   * @example
   * ```typescript
   * // Acceso a las instrucciones en el template
   * {{ TEXTOS }}
   * ```
   * 
   * @see {@link TEXTOS} - Objeto de textos importado del módulo compartido
   */
  TEXTOS: string = TEXTOS?.INSTRUCCIONES;
}