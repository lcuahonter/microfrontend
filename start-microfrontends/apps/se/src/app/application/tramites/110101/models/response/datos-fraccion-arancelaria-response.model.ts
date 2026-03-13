/**
 * Modelo de respuesta para los datos de fracción arancelaria.
 */
export interface DatosFraccionArancelariaResponse {

    /** Clave de la fracción arancelaria */
    cve_fraccion: string,
    
    /** Clave del capítulo de la fracción arancelaria */
    cve_capitulo_fraccion: string,

    /** Nombre del capítulo de la fracción arancelaria */
    nombre_capitulo: string,

    /** Clave de la partida de la fracción arancelaria */
    cve_partida_fraccion: string,

    /** Nombre de la partida de la fracción arancelaria */
    nombre_partida: string,

    /** Clave de la subpartida de la fracción arancelaria */
    cve_subpartida_fraccion: string,

    /** Nombre de la subpartida de la fracción arancelaria */
    nombre_subpartida: string,
    
    /** Descripción de la subpartida de la fracción arancelaria */
    descripcion: string
}