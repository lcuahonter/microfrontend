/**
 * Componente para el manejo del tercer paso del trámite 290101 de AMECAFE.
 *
 * Este componente es responsable de manejar el tercer paso del proceso de trámite,
 * que incluye la funcionalidad para obtener la firma electrónica y permitir la
 * navegación hacia la página de acuse de recibo.
 *
 * El componente forma parte del flujo de trabajo del trámite 290101 y proporciona
 * la interfaz de usuario para completar las acciones finales del procedimiento.
 */

import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

/**
 * Componente Angular para el tercer paso del trámite 290101.
 *
 * Este componente maneja la lógica y presentación del paso final del trámite,
 * incluyendo la obtención de firma electrónica y navegación al acuse de recibo.
 *
 * @class PasoTresComponent
 * @implements {OnInit} - Interfaz del ciclo de vida de Angular (si se implementa en el futuro)
 *
 * @example
 * ```html
 * <paso-tres></paso-tres>
 * ```
 *
 * @see {@link https://angular.io/guide/component-overview} Documentación de componentes Angular
 * @since 1.0.0
 * @version 1.0.0
 */
@Component({
  /**
   * Selector del componente utilizado en plantillas HTML.
   * @type {string}
   */
  selector: 'paso-tres',

  /**
   * Ruta al archivo de plantilla HTML del componente.
   * @type {string}
   */
  templateUrl: './paso-tres.component.html',

  /**
   * Ruta al archivo de estilos SCSS del componente.
   * @type {string}
   */
  styleUrl: './paso-tres.component.scss'
})
export class PasoTresComponent {

  /**
   * Textos e instrucciones para el usuario en el tercer paso del trámite.
   *
   * Contiene las instrucciones específicas que se mostrarán al usuario
   * durante el proceso de firma y finalización del trámite. Los textos
   * son obtenidos del módulo de acceso a datos de usuario.
   *
   * @property {string} TEXTOS
   * @readonly
   * @default TEXTOS?.INSTRUCCIONES
   *
   * @example
   * ```typescript
   * // Acceso a las instrucciones
   * const instrucciones = this.TEXTOS;
   * ```
   *
   * @see {@link TEXTOS} Módulo de textos importado desde @ng-mf/data-access-user
   * @since 1.0.0
   */
  TEXTOS: string = TEXTOS?.INSTRUCCIONES;
}