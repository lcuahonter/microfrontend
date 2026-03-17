/**
 * @fileoverview Enum de configuración para permisos del trámite 300105
 * 
 * Este archivo contiene las configuraciones relacionadas con permisos y campos de fecha
 * utilizados en el formulario del trámite 300105 para autorización de equipos de rayos X.
 * 
 * Funcionalidades principales:
 * - Configuración de campos de fecha
 * - Configuración de validaciones
 * - Configuración de estados de campos
 * 
 * @author VUCEM Development Team
 * @since 1.0.0
 * @version 1.0.0
 */

/**
 * @constant INPUT_FECHA_CONFIG
 * @description Configuración completa utilizada para el campo de entrada de fecha en el formulario
 * del trámite 300105. Define las propiedades esenciales para el manejo correcto de fechas
 * en el proceso de autorización de equipos de rayos X.
 * 
 * Esta configuración establece:
 * - Etiqueta visible para el usuario
 * - Estado de obligatoriedad del campo
 * - Estado de habilitación para edición
 * 
 * Se utiliza principalmente en el componente de pago de derechos donde se requiere
 * capturar la fecha de pago para completar el proceso de solicitud.
 * 
 * @type {Object}
 * @property {string} labelNombre - Etiqueta que se muestra como nombre del campo
 * @property {boolean} required - Indica si el campo es obligatorio para completar el formulario
 * @property {boolean} habilitado - Indica si el campo está habilitado para su edición por el usuario
 * 
 * @example
 * ```typescript
 * // Uso en un formulario reactivo
 * export class PagoDerechosComponent {
 *   fechaConfig = INPUT_FECHA_CONFIG;
 *   
 *   constructor(private fb: FormBuilder) {
 *     this.formulario = this.fb.group({
 *       fechaPago: ['', this.fechaConfig.required ? Validators.required : null]
 *     });
 *   }
 * }
 * ```
 * 
 * @example
 * ```html
 * <!-- Uso en template HTML -->
 * <div class="form-group">
 *   <label [class.required]="fechaConfig.required">
 *     {{ fechaConfig.labelNombre }}
 *   </label>
 *   <input 
 *     type="date" 
 *     [disabled]="!fechaConfig.habilitado"
 *     [required]="fechaConfig.required"
 *     formControlName="fechaPago">
 * </div>
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 * @readonly
 */
export const INPUT_FECHA_CONFIG = {
  /**
   * @property {string} labelNombre
   * @description Etiqueta que se muestra como nombre del campo en la interfaz de usuario.
   * Proporciona una descripción clara y concisa del propósito del campo de fecha.
   * Esta etiqueta es visible para el usuario final y debe ser descriptiva y clara.
   * 
   * @example
   * ```typescript
   * // Acceso a la etiqueta
   * const etiqueta = INPUT_FECHA_CONFIG.labelNombre; // "Fecha de pago"
   * ```
   * 
   * @since 1.0.0
   * @readonly
   */
  labelNombre: 'Fecha de pago',

  /**
   * @property {boolean} required
   * @description Indica si el campo es obligatorio para completar el formulario.
   * Cuando es true, el campo debe ser completado antes de poder enviar el formulario.
   * Esta propiedad se utiliza para validaciones del lado del cliente y del servidor.
   * 
   * @example
   * ```typescript
   * // Validación en formulario reactivo
   * if (INPUT_FECHA_CONFIG.required) {
   *   this.formulario.get('fechaPago')?.setValidators([Validators.required]);
   * }
   * ```
   * 
   * @since 1.0.0
   * @readonly
   */
  required: true,

  /**
   * @property {boolean} habilitado
   * @description Indica si el campo está habilitado para su edición por parte del usuario.
   * Cuando es true, el usuario puede modificar el valor del campo.
   * Cuando es false, el campo se muestra como solo lectura o deshabilitado.
   * 
   * @example
   * ```typescript
   * // Control de estado del campo
   * if (INPUT_FECHA_CONFIG.habilitado) {
   *   this.formulario.get('fechaPago')?.enable();
   * } else {
   *   this.formulario.get('fechaPago')?.disable();
   * }
   * ```
   * 
   * @since 1.0.0
   * @readonly
   */
  habilitado: true,
};