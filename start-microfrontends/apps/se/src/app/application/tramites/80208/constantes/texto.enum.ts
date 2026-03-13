/**
 * @fileoverview Constantes de texto para los requisitos del proceso.
 * Este archivo define los textos que se utilizan en los requisitos del proceso,
 * incluyendo instrucciones y mensajes para adjuntar documentos.
 * @module textoEnum --80208
 */

/**
 * @const TEXTOS_REQUISITOS
 * @description Textos específicos relacionados con los requisitos del trámite IMMEX.
 *
 * @property {string} INSTRUCCIONES - Instrucciones específicas para los requisitos.
 * @property {string} ADJUNTAR - Mensaje para adjuntar nuevos documentos.
 */
export const TEXTOS_REQUISITOS = {
    /**
     * @constant {string} INSTRUCCIONES
     * @description Instrucciones para los requisitos.
     */
    INSTRUCCIONES: `<h6>Instrucciones</h6>
      <p>- De acuerdo al caso particular, algunos dcumentos podrían ser obligatorios</p>
      <p>- En caso de que no requieras algún documento, seleccionalo y elíminalo</p>
      <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
    /**
     * @constant {string} ADJUNTAR
     * @description Mensaje para adjuntar nuevos documentos.
     */
    ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar dcumentos"</p>`,
  };

/**
 * Interfaz que define la estructura de respuesta del servidor para operaciones de trámite.
 * @interface Payload
 * @description Representa la respuesta estándar del servidor cuando se realizan operaciones 
 * como guardar, actualizar o procesar solicitudes del trámite 80208.
 * 
 * @example
 * ```typescript
 * const respuestaExitosa: Payload = {
 *   codigo: '00',
 *   mensaje: 'Solicitud guardada correctamente',
 *   datos: { id_solicitud: 12345 }
 * };
 * 
 * const respuestaError: Payload = {
 *   codigo: '01',
 *   mensaje: 'Error al procesar la solicitud'
 * };
 * ```
 */
export interface Payload { 
  /** 
   * Código de respuesta del servidor que indica el resultado de la operación.
   * @description '00' indica éxito, cualquier otro código indica error.
   * @example '00' | '01' | '02'
   */
  codigo: string; 
  
  /** 
   * Mensaje descriptivo del resultado de la operación.
   * @description Proporciona información detallada sobre el resultado de la petición.
   * @example 'Operación exitosa' | 'Error de validación' | 'Servicio no disponible'
   */
  mensaje: string; 
  
  /** 
   * Datos adicionales de la respuesta, incluyendo el ID de la solicitud generada.
   * @description Opcional. Se incluye cuando la operación genera o modifica una solicitud.
   * @example { id_solicitud: 12345 }
   */
  datos?: { 
    /** Identificador único de la solicitud generada o modificada */
    id_solicitud: number 
  } 
}

/**
 * Interfaz que define la estructura para el manejo de errores en el cambio de modalidad.
 * @interface CambioModalidadState
 * @description Representa un error específico relacionado con la validación de campos
 * en el proceso de cambio de modalidad del trámite IMMEX.
 * 
 * @example
 * ```typescript
 * const errorSimple: CambioModalidadState = {
 *   campo: 'modalidad',
 *   errores: 'El campo modalidad es requerido'
 * };
 * 
 * const errorMultiple: CambioModalidadState = {
 *   campo: 'servicios',
 *   errores: ['Debe seleccionar al menos un servicio', 'Servicio inválido seleccionado']
 * };
 * ```
 */
export interface CambioModalidadState { 
  /** 
   * Nombre del campo que contiene el error de validación.
   * @description Identifica específicamente qué campo del formulario tiene problemas.
   * @example 'modalidad' | 'servicios' | 'año' | 'folio'
   */
  campo?: string; 
  
  /** 
   * Mensaje(s) de error asociado(s) al campo especificado.
   * @description Puede ser un mensaje único o múltiples mensajes de error.
   * Los errores múltiples se representan como un array de strings.
   * @example 'Campo requerido' | ['Error 1', 'Error 2']
   */
  errores?: string | string[] 
}

/**
 * Interfaz para definir la estructura de errores del modelo.
 * @interface ErrorModelo
 * @description Representa un error específico con su campo asociado y los mensajes de error correspondientes.
 */
export interface ErrorModelo {
  /** Campo del formulario o modelo que contiene el error */
  campo?: string;
  /** Mensaje(s) de error asociado(s) al campo. Puede ser un string único o un array de strings */
  errores?: string | string[];
}
