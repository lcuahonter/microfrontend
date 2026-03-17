/**
 * Lista de pasos para el proceso, con información sobre su estado actual.
 * Cada paso tiene un índice, un título, y valores que indican si está activo o completado.
 */
export const PASOS = [
  {
    /**
     * Índice del primer paso dentro del proceso.
     */
    indice: 1,

    /**
     * Título del primer paso: Capturar solicitud.
     */
    titulo: 'Capturar solicitud',

    /**
     * Indica que el primer paso está activo.
     */
    activo: true,

    /**
     * Indica que el primer paso ya ha sido completado.
     */
    completado: true,
  },
  {
    /**
     * Índice del segundo paso dentro del proceso.
     */
    indice: 2,

    /**
     * Título del segundo paso: Anexar requisitos.
     */
    titulo: 'Anexar requisitos',

    /**
     * Indica que el segundo paso aún no está activo.
     */
    activo: false,

    /**
     * Indica que el segundo paso aún no ha sido completado.
     */
    completado: false,
  },
  {
    /**
     * Índice del tercer paso dentro del proceso.
     */
    indice: 3,

    /**
     * Título del tercer paso: Firmar solicitud.
     */
    titulo: 'Firmar solicitud',

    /**
     * Indica que el tercer paso aún no está activo.
     */
    activo: false,

    /**
     * Indica que el tercer paso aún no ha sido completado.
     */
    completado: false,
  },
];
