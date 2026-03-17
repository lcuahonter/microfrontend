/**
 * Conjunto de rutas de la API para el procedimiento 80101.
 */
import { ENVIRONMENT } from "@libs/shared/data-access-user/src/enviroments/enviroment";

/**
 * url base de la API
 */
const BASE_URL = ENVIRONMENT.API_HOST;
/**
 * API nombre
 */
const API = ENVIRONMENT.API;
/**
 * Catálogo de la API
 */
const CATALOGO = ENVIRONMENT.CATALOGO_URL;
/**
 * Solicitud de la API
 */
const SOLICITUD = ENVIRONMENT.SOLICITUD_URL;

/**
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t120401';

/**
 * Rutas de la API para el procedimiento 120401
 */
export const PROC_120401 = {
    ENTIDAD_FEDERATIVA: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/entidades-federativas`,
    REPRESENTACION_FEDERAL: (entidad: string): string => `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/representacion-federal/${entidad}`,
    REGIMEN: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/regimenes`,
    TRATADO: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/tratados-o-acuerados/TITRAC.TA`,
    PRODUCTO: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/nombre-producto`,
    NOMBRE_SUBPRODUCTO: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/nombre-subproducto`,
    BUSCAR_CUPOS: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-cupos-disponibles-vigentes`,
    GUARDAR_SOLICITUD: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/guardar`,
    TABLA_CLICK: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-cupos`,
};
