/**
 * Contiene la lista de pasos para el proceso de exportación.
 * Cada paso incluye un índice, título, si está activo y si está completado.
 * 
 * @type {PasoExportacion[]}
 */
export const PASOS_EXPORTACION = [
    /**
     * Paso 1: Capturar solicitud
     * Este paso representa la acción de capturar una solicitud de exportación.
     * 
     * @type {PasoExportacion}
     */
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: true,
    },
    /**
     * Paso 2: Anexar requisitos
     * Este paso corresponde a la acción de anexar los requisitos necesarios para la exportación.
     * Actualmente no está activo ni completado.
     * 
     * @type {PasoExportacion}
     */
    {
        indice: 2,
        titulo: 'Anexar requisitos',
        activo: false,
        completado: false,
    },
    /**
     * Paso 3: Firmar solicitud
     * Este paso se refiere a la firma de la solicitud de exportación.
     * Actualmente no está activo ni completado.
     * 
     * @type {PasoExportacion}
     */
    {
        indice: 3,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
    }
];

/**
 * Interfaz que define un paso del proceso de exportación.
 * Cada paso tiene un índice, un título, y dos banderas que indican si está activo o si ya ha sido completado.
 * 
 * @interface
 */
export interface PasoExportacion {
    /**
     * El índice único del paso dentro del proceso de exportación.
     * 
     * @type {number}
     */
    indice: number;

    /**
     * El título del paso, que describe brevemente la acción a realizar.
     * 
     * @type {string}
     */
    titulo: string;

    /**
     * Indica si el paso está activo y puede ser realizado en el proceso de exportación.
     * 
     * @type {boolean}
     */
    activo: boolean;

    /**
     * Indica si el paso ha sido completado.
     * 
     * @type {boolean}
     */
    completado: boolean;
}
