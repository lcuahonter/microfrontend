/**
 * Paso del proceso de captura y firma de solicitud.
 * Define los pasos del proceso en una lista.
 */
export const PASOS = [
  {
    indice: 1, // Índice del paso
    titulo: 'Capturar solicitud', // Título del paso
    activo: true, // Indica si el paso está activo
    completado: true, // Indica si el paso ha sido completado
  },
  {
    indice: 2,
    titulo: 'Requisitos neccesarios',
    activo: false,
    completado: false,
  },
  {
    indice: 3, // Índice del paso
    titulo: 'Firmar solicitud', // Título del paso
    activo: false, // Indica si el paso está activo
    completado: false, // Indica si el paso ha sido completado
  },
];

/**
 * Enum para representar los tipos de selección en las tablas.
 * Permite especificar si se utilizará un checkbox, un radio, o si no está definido.
 */
export enum TablaSeleccion {
  CHECKBOX = 'CHECKBOX', // Representa la selección con checkbox
  RADIO = 'RADIO', // Representa la selección con radio
  UNDEFINED = 'undefined', // Indica que la selección no está definida
}