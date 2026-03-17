
/**
 * Modelo de respuesta para catálogos.
 * 
 * 
 */ 
export interface PaisesBloqueRese {
    descripcion: string;
    clave: string;
    id?: number;
    bloque: boolean;
}

/**
 * Modelo de respuesta para catálogo tigies.
 */
export interface Tigies {
    fechaInicioVigencia: string;
    fechaFinVigencia: string;
    descripcion: string;
    cveFraccion: string;
    cveUsuario: string;
    fechaCaptura: string;
    capitulo:  string;
    partida:  string;
    subPartida:  string;
    cveCapituloFraccion: string;
    cvePartidaFraccion: string;
    cveSubPartidaFraccion:  string;
}


/** Modelo para almacenar la respuesta de las apis de catálogo tigies */
export interface CatalogosTigiesResponse {
    codigo: string;
    mensaje: string;
    datos: Tigies[];
}
