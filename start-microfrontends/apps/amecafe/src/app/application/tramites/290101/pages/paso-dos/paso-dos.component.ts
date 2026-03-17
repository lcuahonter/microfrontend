/**
 * Componente para el segundo paso del trámite 290101 en el módulo AMECAFE.
 *
 * Este componente es responsable de manejar el segundo paso del procedimiento del trámite,
 * que incluye la gestión de tipos de documentos y documentos seleccionados necesarios
 * para completar el proceso administrativo.
 *
 * El componente forma parte del flujo de trabajo del trámite 290101 y proporciona
 * la interfaz y lógica necesaria para la captura y validación de documentos
 * en la segunda etapa del procedimiento.
 */

import { Component } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';

/**
 * Configuración del componente Angular para el segundo paso del trámite.
 *
 * @component
 * @selector paso-dos
 * @templateUrl ./paso-dos.component.html
 * @styleUrls ./paso-dos.component.scss
 */
@Component({
  selector: 'paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrls: ['./paso-dos.component.scss'],
})

/**
 * Clase del componente PasoDosComponent.
 *
 * Esta clase implementa la lógica del segundo paso del trámite 290101,
 * proporcionando las funcionalidades necesarias para la gestión de documentos
 * y la navegación dentro del flujo del procedimiento administrativo.
 *
 * @class PasoDosComponent
 * @description Componente del segundo paso del trámite que maneja la lógica
 * de obtención y gestión de tipos de documentos y documentos seleccionados.
 *
 * @example
 * ```typescript
 * // Uso del componente en un template
 * <paso-dos></paso-dos>
 * ```
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class PasoDosComponent {
  /**
   * Constantes de textos utilizados en el componente.
   *
   * Esta propiedad contiene todas las constantes de texto importadas desde
   * el módulo de acceso a datos del usuario, que se utilizan para mostrar
   * mensajes, etiquetas y textos informativos en la interfaz del componente.
   *
   * @property {any} TEXTOS
   * @description Objeto que contiene las constantes de texto para el componente
   * @readonly
   * @memberof PasoDosComponent
   *
   * @example
   * ```typescript
   * // Acceso a los textos en el template
   * {{ TEXTOS.MENSAJE_CONFIRMACION }}
   * ```
   */
  TEXTOS = TEXTOS;
}