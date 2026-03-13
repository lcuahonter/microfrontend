/**
 * ## REGISTRO_TRANSPORTISTA
 * 
 * Constante que representa una lista de pasos para el registro de un transportista.
 * Cada paso tiene un índice, título, estado de activación y estado de completado.
 */
export const REGISTRO_TRANSPORTISTA = [
  /**
   * ## Paso 1: Capturar solicitud
   * 
   * - **indice**: `1`  
   *   Número de orden del paso.
   * - **titulo**: `'Capturar solicitud'`  
   *   Título descriptivo del paso.
   * - **activo**: `true`  
   *   Indica si el paso está activo.
   * - **completado**: `true`  
   *   Indica si el paso ha sido completado.
   */
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  /**
   * ## Paso 2: Firmar solicitud
   * 
   * - **indice**: `2`  
   *   Número de orden del paso.
   * - **titulo**: `'Firmar solicitud'`  
   *   Título descriptivo del paso.
   * - **activo**: `false`  
   *   Indica si el paso está activo.
   * - **completado**: `false`  
   *   Indica si el paso ha sido completado.
   */
  {
    indice: 2,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  }
];
