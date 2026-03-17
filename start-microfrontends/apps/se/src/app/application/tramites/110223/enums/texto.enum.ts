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