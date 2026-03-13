/**
 * Modelo de un elemento válido en la respuesta de la subida de archivos.
 */
export interface ElementoValido {
    cantidad: number;
    fraccionArancelaria: string;
    descripcion: string;
    total: number;
    numeroLinea: number;
}

/**
 * Modelo de un error en la respuesta de la subida de archivos.
 */
export interface Error {
    numero_linea: number;
    contenido_linea: string;
    mensaje_error: string;
}

/**
 * Modelo de respuesta para la subida de archivos en la solicitud.
 */
export interface SolicitudArchivo {
    elementos_validos: ElementoValido[];
    errores: Error[];
    mensaje: string;
}
