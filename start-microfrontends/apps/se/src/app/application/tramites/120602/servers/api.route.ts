/**
 * Definición de rutas de la API para el trámite 120602
 * ----------------------------------------------------
 * Este archivo centraliza las rutas y constantes necesarias para interactuar con la API
 * correspondiente al procedimiento 120602, facilitando la gestión y mantenimiento de endpoints.
 *
 * Uso:
 * Importar las constantes de rutas en servicios o componentes que requieran realizar peticiones
 * a la API del trámite 120602.
 *
 * Funcionalidad:
 * - Define las rutas para guardar solicitudes, obtener plantas y accionistas.
 * - Centraliza la configuración de endpoints para evitar duplicidad y errores.
 *
 * Autor: [Agregar nombre del autor si se desea]
 *
 */
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
const PROCEDURE = '/sat-t120602';

/**
 * Rutas de la API para el procedimiento 120602.
 * Incluye las rutas para guardar la solicitud y para obtener el catálogo de tipo de factura.
 */

export const PROC_120602 = {
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    PLANTAS: `${BASE_URL}${API}${PROCEDURE}/solicitud/plantas`,
    ACCIONISTAS: `${BASE_URL}${API}${PROCEDURE}/solicitud/accionistas`,
}
