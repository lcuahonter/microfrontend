
/**
 * Solicitud de confirmar firma
 */

export interface AcusesRecibosResponse {
      id_documento_oficial: number,
      desc_documento: string,
      documento_minio: string
    
}

/**
 * Modelo base de respuesta con un arreglo genérico.
 */
export interface BaseReponseCustomArray<T> {
    codigo: string;
    mensaje: string;
    datos: T[];
}


