/**
 * Modelo de request para el catálogo de criterios otras instancias.
 */

export interface CriteriosOtrasInstanciasRequest {
    /** Paises */
    paises: string[];

    /** Otras instancias */
    otras_instancias: string[];
}
