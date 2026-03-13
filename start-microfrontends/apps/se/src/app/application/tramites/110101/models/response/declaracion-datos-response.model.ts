/**
 * Modelo de respuesta para la declaración de datos.
 */
export interface DeclaracionDatosResponse {
    /** Descripción de la declaración */
    descripcion: string | null;

    /** Clave de la declaración */
    clave: string | null;
}