/**
 * Interfaz que representa una declaración de manifiesto.
 */
export interface Manifiestos {
    /**
     * Los detalles de la declaración.
     * 
     * @property {string} clave - El identificador único de la declaración.
     * @property {string} descripcion - La descripción de la declaración.
     */
    declaracion: {
        clave: string;
        descripcion: string;
    }
    /**
     * Indicador de si la declaración forma parte del manifiesto.
     * 
     * @type {boolean}
     */
    manifiestoDeclaracion: boolean;
}

/**
 * Respuesta de la API al obtener múltiples manifiestos.
 */
export interface ManifiestosRespuesta {
    /**
     * Código de respuesta de la API.
     * @type {number}
     */
    code: number;

    /**
     * Lista de manifiestos.
     * 
     * @type {Manifiestos[]}
     */
    data: Manifiestos[];

    /**
     * Mensaje de respuesta de la API.
     * @type {string}
     */
    message: string;
}

/**
 * Interfaz que representa un renovación.
 * @interface Renovacion
 */
export interface Renovacion {
    /**
     * Número de oficio.
     * @type {string}
     */
    numeroOficio: string;

    /**
     * Fecha inicio de vigencia
     * @type {string}
     */
    fechaFinalInput: string;

    /**
     * Fecha fin de vigencia
     * @type {string}
     */
    fechaInicialInput: string;
}

/**
 * Interfaz que representa una respuesta de la API al obtener datos de renovación.
 * @interface RenovacionRespuesta
 */
export interface RenovacionRespuesta {
    /**
     * Código de respuesta de la API.
     * @type {number}
     */
    code: number;

    /**
     * Lista de renovaciones.
     * 
     * @type {Renovacion[]}
     */
    data: Renovacion[];

    /**
     * Mensaje de respuesta de la API.
     * @type {string}
     */
    message: string;
}