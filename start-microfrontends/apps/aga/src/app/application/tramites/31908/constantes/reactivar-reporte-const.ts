/**
 * Identificador del tramite
 */
export const TRAMITE_ID = 31908;

/**
 * Lista de pasos del proceso de solicitud.
 * Cada paso contiene su índice, título, y el estado actual (activo y completado).
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    /** Indica si el paso está activo actualmente */
    activo: true,
    /** Indica si el paso ya fue completado */
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Firmar solicitud',
    /** Indica que el paso aún no está activo */
    activo: false,
    /** Indica que el paso no ha sido completado */
    completado: false,
  },
];
