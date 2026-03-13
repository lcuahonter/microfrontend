/**
 * Modelo de salida para el tramite 120301. 
 * Interfaz que representa la estructura de una Representación-federal. 
*/
export interface RepresentaciónFederalResponse {
    
    /** Clave única de la ubicación. */
    clave: string;
    
    /** Nombre de la ubicación. */
    nombre: string;
    
    /** Clave de la entidad federativa a la que pertenece. */
    cve_entidad: string;
    
    /** Nombre completo de la entidad federativa. */
    nombre_entidad: string;
}