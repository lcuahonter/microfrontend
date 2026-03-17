/**
 * Modelo que representa la respuesta del servicio para obtener los datos del fabricante.
 */
export interface FabricanteResponse {
    /** Número de registro fiscal del fabricante */
    numero_registro_fiscal: string;
    /** Nombre del fabricante */
    nombre_fabricante: string;
    /** Correo electrónico del fabricante */
    correo_electronico: string;
    /** Teléfono del fabricante */
    telefono: string;
    /** Dirección del fabricante */
    direccion: string;
}