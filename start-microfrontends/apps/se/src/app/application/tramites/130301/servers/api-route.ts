/**
 * Conjunto de rutas de la API para el procedimiento 130301.
 */
import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';

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
 * Catálogo de la API
 */
const CATALOGO = ENVIRONMENT.CATALOGO_URL;

/**
 * Procedimiento de la API
 */
const PROCEDURE = '/sat-t130301';

/**
 * Rutas de la API para el procedimiento 130301
 */
export const PROC_130301 = {
  /**
   * Ruta para cargar los datos de perfil utilizando el folio de permiso y RFC del solicitante.
   */
  CARGAR_DATOS_PREFIL: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/validar-folio-permiso-prorroga`,

  /**
   * Ruta para mostrar las prórrogas asociadas a una resolución.
   */
  MOSTRAR_PRORROGA: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/mostrar/prorrogas?folioResolucion=`,

  /**
   * Ruta para mostrar las partidas PEIXM autorizadas asociadas a una solicitud.
   */
  MOSTAR_PARTIDAS: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/mostrar/partidas-pexim-autorizadas?idSolicitud=`,

  /**
   * Ruta para obtener el catálogo de países.
   */
  PAIS_CATALOGO: `${BASE_URL}${API}${PROCEDURE}/catalogo/paises`,

  /** Ruta para guardar los datos del formulario */
  GUARDAR: `${BASE_URL}${API}${PROCEDURE}${SOLICITUD}/guardar`,

  TIPO_FACTURA: `${BASE_URL}${API}${PROCEDURE}${CATALOGO}/tipo-factura`,

  /** Ruta para mostrar las partidas de la solicitud */
    MOSTAR : `${BASE_URL}${API}${PROCEDURE}/solicitud/mostrar?idSolicitud=`,
};
