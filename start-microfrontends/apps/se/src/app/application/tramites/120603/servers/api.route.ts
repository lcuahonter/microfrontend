/**
 * Definición de rutas de la API para el trámite 120603
 * ----------------------------------------------------
 * Este archivo centraliza las rutas y constantes necesarias para interactuar con la API
 * correspondiente al procedimiento 120603, facilitando la gestión y mantenimiento de endpoints.
 *
 * Uso:
 * Importar las constantes de rutas en servicios o componentes que requieran realizar peticiones
 * a la API del trámite 120603.
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
const PROCEDURE = '/sat-t120603';

/**
 * Rutas de la API para el procedimiento 120603.
 * Incluye las rutas para guardar la solicitud y para obtener el catálogo de tipo de factura.
 */

export const PROC_120603 = {
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}/solicitud/guardar`,
    PLANTAS: `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-datos-grid-plantas`,
    ACCIONISTAS: `${BASE_URL}${API}${PROCEDURE}/solicitud/accionistas`,
    BUSCAR_ACTIVIDADES_ECONOMICAS : `${BASE_URL}${API}${PROCEDURE}/solicitud/buscar-actividades-economicas`,
    OBTENER_DATOS_ACCIONISTA_EXTRANJERO_POST:`${BASE_URL}${API}${PROCEDURE}/solicitud/obtener-datos-accionista-extranjero`,
    OBTENER_ACCIONSTAS :`${BASE_URL}${API}${PROCEDURE}/solicitud/obtener-accionistas`,
    OBTENER_ACCIONSTAS_EXTRANJEROS :`${BASE_URL}${API}${PROCEDURE}/solicitud/obtener-accionistas-extranjeros`,
    OBTENER_DATOS_ACCIONISTA_POST :`${BASE_URL}${API}${PROCEDURE}/solicitud/obtener-datos-accionista`,
    ELIMINAR_ACCIONISTA : `${BASE_URL}${API}${PROCEDURE}/solicitud/eliminar-accionista`
    
}
