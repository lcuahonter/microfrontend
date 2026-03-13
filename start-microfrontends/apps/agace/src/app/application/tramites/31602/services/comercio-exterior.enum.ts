/**
 * Representa los pasos (pasos) para un proceso específico en la aplicación.
 * Cada paso contiene un índice, título y banderas de estado que indican si
 * el paso está activo o completado.
 *
 * @constant
 * @type {Array<{indice: number, titulo: string, activo: boolean, completado: boolean}>}
 * @property {number} indice - El índice del paso en el proceso.
 * @property {string} titulo - El título o descripción del paso.
 * @property {boolean} activo - Indica si el paso está actualmente activo.
 * @property {boolean} completado - Indica si el paso ha sido completado.
 */
export const PANTA_PASOS = [
    {
      indice: 1,
      titulo: 'Capturar solicitud',
      activo: true,
      completado: false,
    },
    {
        indice: 2,
        titulo: 'Anexar requisitos',
        activo: false,
        completado: false,
    },
    {
        indice: 3,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
    },
];

/**
 * Constante que representa el título para el paso dos en el proceso.
 * Se utiliza para mostrar la etiqueta "Cargar archivos" en la interfaz de usuario.
 */
export const TITULO_PASO_UNO = 'IVA e IEPS A';
/**
 * Constante que representa el título para el paso dos en el proceso.
 * Se utiliza para mostrar la etiqueta "Cargar archivos" en la interfaz de usuario.
 */
export const TITULO_PASO_DOS = 'Cargar archivos';
/**
 * Constante que representa el título para el paso dos en el proceso.
 * Se utiliza para mostrar la etiqueta "Cargar archivos" en la interfaz de usuario.
 */
export const TITULO_PASO_TRES = 'Firmar';