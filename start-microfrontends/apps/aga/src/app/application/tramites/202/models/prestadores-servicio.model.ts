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
     * Lista de manifiestos.
     * 
     * @type {Manifiestos[]}
     */
    data: Manifiestos[];
}