/**
 * Constantes de textos utilizados en la aplicación
 * 
 * Este objeto contiene todos los textos y mensajes estáticos que se muestran
 * en la interfaz de usuario, centralizando la gestión de contenido textual
 * para facilitar el mantenimiento y la internacionalización.
 * 
 * @constant {Object} TEXTOS
 * @namespace TEXTOS
 * @since 1.0.0
 * @author Sistema de Gestión
 * 
 * @example
 * ```typescript
 * // Uso en componentes
 * import { TEXTOS } from './constantes/textos';
 * 
 * // Mostrar instrucciones en el template
 * this.instrucciones = TEXTOS.INSTRUCCIONES_DEL_CAMPO_DE_TABLA;
 * ```
 */
export const TEXTOS = {
  
  /**
   * Mensaje de instrucciones para campos de tabla obligatorios
   * 
   * Texto que informa al usuario sobre la obligatoriedad de completar
   * las tablas marcadas con asterisco y la necesidad de agregar al menos
   * un registro en cada una de ellas.
   * 
   * @type {string}
   * @memberof TEXTOS
   * @readonly
   * 
   * @example
   * ```typescript
   * // Uso en componente Angular
   * export class MiComponente {
   *   mensajeInstrucciones = TEXTOS.INSTRUCCIONES_DEL_CAMPO_DE_TABLA;
   * }
   * ```
   * 
   * @example
   * ```html
   * <!-- Uso en template HTML -->
   * <div class="instrucciones">
   *   {{ TEXTOS.INSTRUCCIONES_DEL_CAMPO_DE_TABLA }}
   * </div>
   * ```
   */
  INSTRUCCIONES_DEL_CAMPO_DE_TABLA : 'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.',
};