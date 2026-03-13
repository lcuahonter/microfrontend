
/**
 * Modelo de ejemplo de envio de información
 */
export interface EjemploResponse {
      
    /** Texto de ejemplo */
    texto: string
}

/**
 * Modelo base de respuesta con un arreglo genérico.
 */
export interface BaseReponseCustomArray<T> {
    codigo: string;
    mensaje: string;
    datos: T[];
}


