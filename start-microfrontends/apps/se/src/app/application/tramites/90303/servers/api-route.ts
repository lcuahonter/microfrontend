/**
 * Conjunto de rutas de la API para el procedimiento 90303.
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
 * Solicitud de la API
 */
const SOLICITUD = ENVIRONMENT.SOLICITUD_URL;

/**
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t90303';

/**
 * Rutas de la API para el procedimiento 90303
 */
export const PROC_90303 = {
    /**
     * Ruta para obtener la lista de programas a modificar.
     */
    LISTA_PROGRAMAS: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-programasa-modificar?rfc=`,
    
    /**
     * Ruta para obtener los datos de la tabla de plantas.
     */
    PLANTAS: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta/plantas`,

    /**
     * Ruta para obtener los datos de la tabla de sectores.
     */
    SECTOR: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar/sectors-por-idsolicitud?idSolicitud=`,

    /**
     * Ruta para obtener los datos de la tabla de mercancías.
     */
    MERCANCIA_PRODUCIR: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar/mercancias-id-solicitud`,

    /**
     * Ruta para obtener los datos de la tabla de productores indirectos.
     */
    PRODUCTOR_INDIRECTO: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consulta/productores-indirectos`,

    /**
     * Ruta para obtener los datos de la lista de sectores activos.
     */
    LISTA_SECTORES: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/buscar-sectors`,

    /**
     * Ruta para obtener la bitácora de un programa PROSEC.
     */
    BITACORA: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/consultar-bitacora-immex?idPrograma=`,

    /**
     * Ruta para buscar una solicitud por su ID.
     */
    BUSCAR_ID_SOLICITUD: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/busca-id-solicitud`,

    /**
     * Ruta para actualizar los datos de la tabla Prosec.
     */
    ACTUALIZAR_GRID_PROSEC: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/actualizar-grid-prosec`,
    
    /**
     * Ruta para guardar los datos de la solicitud.
     */
    GUARDAR: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/guardar`,

    /**
     * Ruta para mostrar los datos de una solicitud específica.
     */
    MOSTRAR: (id: string | number): string => `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/mostrar?idSolicitud=${id}`,
};
