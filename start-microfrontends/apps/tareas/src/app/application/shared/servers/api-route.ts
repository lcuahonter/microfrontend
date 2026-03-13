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
 * Procedimiento de la API
 */
const PROCEDURE = '/tareas';

const PROCEDURE_NO = '/';

/**
 * Rutas de la API para el procedimiento 80101
 */
export const API_ROUTES = (procedure: string=PROCEDURE, procedureNo: string = PROCEDURE_NO) => ({
    EJEMPLO: `${BASE_URL}${API}/${procedure}/ejemplo`,
});




