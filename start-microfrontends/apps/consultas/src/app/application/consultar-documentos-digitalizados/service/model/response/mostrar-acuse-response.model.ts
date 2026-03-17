/**
 * Modelo de respuesta para mostrar acuse de documento digitalizado
 */
export interface MostrarAcuseResponse {
    /** Llave única del archivo en almacenamiento */
    llave_archivo: string;
    
    /** Nombre original del archivo */
    nombre_archivo: string;
    
    /** Contenido del archivo (base64 o texto) */
    contenido: string;
}