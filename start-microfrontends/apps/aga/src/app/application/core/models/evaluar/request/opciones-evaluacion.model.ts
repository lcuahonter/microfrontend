/**
 * Modelo de salida para las opciones de evaluación del trámite 130118.
 * Este modelo define la estructura de la respuesta que se espera al consultar las opciones de evaluación.
 */
export interface OpcionesEvaluacionRequest {
    /**
     * Clave de la fracción arancelaria.
     */
    cve_rol_capturista: string;

    /**
     * Indica si el usuario es capturista.
     */
    considera_capturista: boolean;
}
