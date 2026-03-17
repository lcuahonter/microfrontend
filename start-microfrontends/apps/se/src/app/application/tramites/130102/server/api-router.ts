/**
 * API MS paara obtener los regimenes del tramite 130102.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130102/regimenes
 */
export const API_GET_REGIMENES = 'sat-t130102/catalogo/regimenes';

/**
 * API MS para obtener los bloques de paises del tramite 130102.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130102/bloques
 */
export const API_GET_BLOQUE_PAISES = 'sat-t130102/bloques';

/**
 * Constante para la clave del tratado.
 * Debe ser reemplazada por la clave real del tratado.
 */
export const CVETRATADO = '{cveTratado}';

/**
 * API MS para obtener los países por bloque del tramite 130102.
 * @param CVETRATADO - Clave del tratado.
 * @returns 
 */
export const API_GET_PAISES_BLOQUE = (CVETRATADO: string) : string => `sat-t130102/pais/${CVETRATADO}/bloques`;

/*
 * API MS para obtener las entidades federativas del tramite 130102.
 *  @see https://api-v30.cloud-ultrasist.net/api/sat-t130102/catalogo/entidades-federativas
 * 
*/
export const API_GET_ENTIDADES_FEDERATIVAS = 'sat-t130102/catalogo/entidades-federativas';

/**
 * Constante para la clave de la entidad.
 * Debe ser reemplazada por la clave real de la entidad.
 */
export const CVEENTIDAD = '{cveEntidad}';

/**
 * API MS para obtener las unidades administrativas de una entidad federativa específica del tramite 130102.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130102/swagger-ui/index.html#/Catalogos/consulta-unidades-administrativas
 * @param CVEENTIDAD - Clave de la entidad federativa.
 * @returns 
 */
export const API_GET_UNIDADES_ADMINISTRATIVAS = (CVEENTIDAD: string) : string => `sat-t130102/catalogo/entidad-federativa/${CVEENTIDAD}/unidades-administrativas`;

/**
 * API MS para obtener las fracciones arancelarias del tramite 130102.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130102/catalogo/pexim/fracciones-arancelarias?modoCarga=combo
 */
export const API_GET_FRACCION_ARANCELARIA = 'sat-t130102/catalogo/pexim/fracciones-arancelarias?modoCarga=combo';

/**
 * Constante para la clave del régimen.
 * Debe ser reemplazada por la clave real del régimen.
 */

export const CVEREGIMEN = '{cveRegimen}';

/**
 * API MS para obtener las clasificaciones de un régimen específico del tramite 130102.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130102/catalogo/regimenes/{cveRegimen}/clasificacion
 */

export const API_GET_CLASIFICACION_REGIMEN = (CVEREGIMEN: string) : string => `sat-t130102/catalogo/regimenes/${CVEREGIMEN}/clasificacion`;

/**
 * Constante para la clave de la fracción arancelaria.
 * Debe ser reemplazada por la clave real de la fracción arancelaria.
 */
export const CVEFRACCION = '{cveFraccion}';

/**
 * aPI MS para obtener las unidades de medida asociadas a una fracción arancelaria específica del tramite 130102.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130102/catalogo/fraccion-arancelaria/17011405/unidades-medida
 * @param CVEFRACCION - Clave de la fracción arancelaria.
 * @returns 
 */
export const API_GET_UNIDADES_MEDIDA = (CVEFRACCION: string) : string => `sat-t130102/catalogo/fraccion-arancelaria/${CVEFRACCION}/unidades-medida`;

/**
 * Constante para la clave de la fracción arancelaria.
 * Debe ser reemplazada por la clave real de la fracción arancelaria.
 */
export const CVE_FRACCION = '{cveFraccion}';


/**
 * API MS para obtener las subdivisiones asociadas a una fracción arancelaria específica del tramite 130102.
 * @param CVE_FRACCION - Clave de la fracción arancelaria.
 * @returns 
 */
export const API_GET_FRACCION_SUBDIVISIONES = (CVE_FRACCION: string) : string => `sat-t130102/catalogo/fraccion-arancelaria/${CVE_FRACCION}/subdiviciones`;



/**
 * Constante para la clave de la fracción de octava temporal.
 */
export const CVEFRACCIONOCTAVA = '{cveFraccionOctava}';
 /**
  * constante para el régimen de octava temporal.
  */
export const REGIMEN = '{regimen}';
/**
 * Constante para la clasificación del régimen.
 */
export const CLASIFICACIONREGIMEN = '{clasificacionRegimen}';
/**
 * API MS para obtener la octava temporal basada en la fracción, régimen y clasificación del régimen del tramite
 * @param CVEFRACCIONOCTAVA 
 * @param REGIMEN 
 * @param CLASIFICACIONREGIMEN 
 * @returns 
 */
export const API_GET_OCTAVA_TEMPORAL = (CVEFRACCIONOCTAVA: string, REGIMEN: string, CLASIFICACIONREGIMEN: string) : string => `sat-t130102/esquema-regla/${CVEFRACCIONOCTAVA}/${REGIMEN}/${CLASIFICACIONREGIMEN}/octava`;

/**
 * Constante para el número de folio del trámite.
 * Debe ser reemplazada por el número real de folio del trámite.
 */
export const NUMFOLIOTRAMITE = '{numFolioTramite}';

/**
 * API MS para iniciar la notificación de un trámite específico del tramite 130102.
 * @param NUMFOLIOTRAMITE - Número de folio del trámite.
 * @returns 
 */

export const API_GET_INICIAR_NOTIFICACION = (NUMFOLIOTRAMITE: string) : string => `sat-t130102/${NUMFOLIOTRAMITE}/confirmar-notificacion/iniciar`;

/*
    * Constante para la clave de la fracción.
    * Debe ser reemplazada por la clave real de la fracción.
*/
export const CLVFRACCION = '{clvFraccion}';

/**
 * API MS para obtener el TIGIE de una fracción arancelaria específica del tramite 130102.
 * @param CLVFRACCION - Clave de la fracción arancelaria.
 * @returns 
 */
export const API_GET_TIGIE = (CLVFRACCION: string) : string => `sat-t130102/tramite/${CLVFRACCION}/tigie`;

/**
 * API MS para guardar la solicitud del tramite 130102.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130102/swagger-ui/index.html#/Solicitud%20Importaci%C3%B3n%20Regla%20Octava/guardar
 */
export const API_POST_GUARDAR_SOLICITUD = 'sat-t130102/solicitud/guardar';

/**
 * API MS para obtener las fracciones y divisiones del tramite 130102.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130102/exportacion/fracciones-divisiones
 */
export const API_GET_FRACCIONES_DIVISIONES = 'sat-t130102/exportacion/fracciones-divisiones';

/**
 * MS para enviar la solicitud de firma electrónica del tramite 130102.
 * @param idSolicitud 
 * @returns 
 */
export const API_POST_FIRMA = (IDSOLICITUD: string) : string => `sat-t130102/solicitud/${IDSOLICITUD}/firmar`;

/**
 *  Id de la solicitud
 */
export const IDSOLICITUD = '{idSolicitud}';

/**
 * MS para obtener la cadena original de una solicitud específica del tramite 130102.
 * @param idSolicitud 
 * @returns 
 */
export const API_POST_CADENA_ORIGINAL = (IDSOLICITUD: string) : string => `sat-t130102/solicitud/${IDSOLICITUD}/genera-cadena-original`;

/**
 * MS para enviar un archivo de partidas de la mercancia específica del tramite 130102.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130102/solicitud/archivo
 */
export const API_POST_PARTIDAS_MERCANCIA = 'sat-t130102/solicitud/archivo';