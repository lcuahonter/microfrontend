/**
 * Modelo de respuesta para datos del fabricante o productor
 */
export interface FabricanteResponse {
    /** RFC del usuario */
    rfc: string;
    
    /** Nombre del usuario */
    nombre: string;
    
    /** Apellido paterno */
    apellido_paterno: string;
    
    /** Apellido materno */
    apellido_materno: string;
    
    /** Razón social (null si no aplica) */
    razon_social: string | null;
}