

/**
 * API para obtener los datos de IMMEX por RFC.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-no-autorizacion-immex
 * @param tramite Identificador del trámite.
 * @param rfc RFC del solicitante.
 * @returns URL completa para la consulta.
 */

export const API_GET_IMMEX = (tramite: string, rfc: string): string =>
  `sat-t${tramite}/catalogo/rfc/${rfc}/no-autorizacion-immex`;

/**
 * API para obtener las materias primas por número de bitácora.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogo/materias-primas
 * @param tramite
 * @returns URL completa para la consulta.
 */
export const API_GET_MATERIAS_BITACORA = (
  rfc: string,
  tramite: string
): string => `sat-t${tramite}/catalogo/rfc/${rfc}/materias-primas`;

/**
 * API para obtener una materia prima por su ID.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogo/materia-prima-id
 * @param materiaId ID de la materia prima.
 * @param tramite Identificador del trámite.
 * @returns URL completa para la consulta.
 */
export const API_GET_MATERIA_ID = (
  materiaId: string,
  tramite: string
): string =>
  `sat-t${tramite}/catalogo/idMercancia/${materiaId}/materia-prima-detalle`;

/**
 * API para obtener las fracciones arancelarias.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-fracciones-arancelarias
 * @param tramite Identificador del trámite.
 * @returns URL completa para la consulta.
 */
export const API_GET_FRACCIONES_ARANCELARIAS = (tramite: string): string =>
  `sat-t${tramite}/catalogo/fraccion-arancelaria`;

/**
 * API para obtener la clave NICO asociada a una fracción arancelaria.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-clave-nico-por-fraccion
 * @param tramite Identificador del trámite (por ejemplo '231002').
 * @param fraccionCve Clave de la fracción arancelaria.
 * @returns Ruta relativa para consultar la clave NICO por fracción.
 * @see API_GET_FRACCIONES_ARANCELARIAS
 */
export const API_GET_NICO_POR_FRACCION_CVE = (
  tramite: string,
  fraccionCve: string
): string =>
  `sat-t${tramite}/catalogo/fraccion-arancelaria/${fraccionCve}/clave-nico`;

/**
 * API para obtener las unidades de medida comercial.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-unidades-medida-comercial
 * @param tramite Identificador del trámite.
 * @returns Ruta relativa para consultar unidades de medida.
 */
export const API_GET_UNIDAD_MEDIDA = (tramite: string): string =>
  `sat-t${tramite}/catalogo/unidades-medida-comercial`;

/**
 * API para obtener la descripción asociada a una combinación de NICO y fracción.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-descripcion-nico-por-cve-nico-y-fraccion
 * @param tramite Identificador del trámite.
 * @param nicoCve Clave NICO.
 * @param fraccionCve Clave de la fracción arancelaria.
 * @returns Ruta relativa para consultar la descripción NICO por clave y fracción.
 */
export const API_GET_DESC_NICO_POR_CVE_NICO_FRACCION_CVE = (
  tramite: string,
  nicoCve: string,
  fraccionCve: string
): string =>
  `sat-t${tramite}/catalogo/cveNico/${nicoCve}/fraccionNico/${fraccionCve}/descripcion-nico`;

/**
 * API para obtener las claves de residuo.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-clave-residuo
 * @param tramite Identificador del trámite.
 * @returns Ruta relativa para consultar claves de residuo.
 */
export const API_GET_CLAVE_RESIDUO = (tramite: string): string =>
  `sat-t${tramite}/catalogo/clave-residuo`;

/**
 * API para obtener nombres de residuo.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-nombre-residuo
 * @param tramite Identificador del trámite.
 * @returns Ruta relativa para consultar nombres de residuo.
 */
export const API_GET_NOMBRE_RESIDUO = (tramite: string): string =>
  `sat-t${tramite}/catalogo/nombre-residuo`;

/**
 * API para obtener la descripción de residuo.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-descripcion-residuo
 * @param tramite Identificador del trámite.
 * @returns Ruta relativa para consultar descripciones de residuo.
 */
export const API_GET_DESC_RESIDUO = (tramite: string): string =>
  `sat-t${tramite}/catalogo/descripcion-residuo`;

/**
 * API para listar tipos de contenedor.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-tipo-contenedor
 * @param tramite Identificador del trámite.
 * @returns Ruta relativa para consultar tipos de contenedor.
 */
export const API_GET_TIPO_CONTENEDOR = (tramite: string): string =>
  `sat-t${tramite}/catalogo/tipo-contenedor`;

/**
 * API para obtener enumeraciones de características por nombre de enum.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-enum-caracteristicas
 * @param tramite Identificador del trámite.
 * @param estadoCve Nombre del enum o clave que identifica la enumeración.
 * @returns Ruta relativa para consultar la enumeración de características.
 */
export const API_GET_ENUM_CARACTERISTICAS = (
  tramite: string,
  estadoCve: string
): string => `sat-t${tramite}/catalogo/enumName/${estadoCve}/enum`;

/**
 * API para obtener aduanas de salida.
 * see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-aduanas
 * @param tramite Identificador del trámite.
 * @returns Ruta relativa para consultar aduanas de salida.
 */
export const API_GET_ADUANAS_SALIDA = (tramite: string): string =>
  `sat-t${tramite}/catalogo/aduanas`;

/**
 * API para obtener las direcciones asociadas a un IMMEX.
 * see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-direcciones-immex
 * @param tramite Identificador del trámite.
 * @param cveImmex ID del programa IMMEX.
 * @returns Ruta relativa para consultar las direcciones asociadas al IMMEX.
 */
export const API_GET_DIRECCIONES = (
  tramite: string,
  cveImmex: string
): string => `sat-t${tramite}/catalogo/idImmex/${cveImmex}/direccion`;

/**
 * API para obtener los países de destino.
 * see https://api-v30.cloud-ultrasist.net/api/sat-t231002/swagger-ui/index.html#/Catalogos/consulta-paises-destino
 * @param tramite IDentificador del trámite.
 * @returns Ruta relativa para consultar los países de destino.
 */
export const API_GET_PAISES_DESTINO = (tramite: string): string =>
  `sat-t${tramite}/catalogo/paises`;

/**
 * ID de la solicitud que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el ID real de la solicitud.
 * @constant {string}
 */
export const IDSOLICITUD = '{idSolicitud}';


/**
 * API para obtener el estado de la solicitud del tramite 231001.
 * @param tramite Identificador del trámite.
 * @param idSolicitud ID de la solicitud.
 * @returns Ruta relativa para obtener el estado de la solicitud.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Registro-Solicitud/estado-solicitud  
 */
export const API_POST_CADENA_ORIGINAL = (
  tramite: string,
  idSolicitud: number
): string => `sat-t${tramite}/solicitud/${idSolicitud}/genera-cadena-original`;


/**
 * Alias para la ruta que guarda la solicitud del trámite 231001.
 * Equivalente a API_POST_SOLICITUD. Preferir API_POST_SOLICITUD si existe coherencia en el código.
 * @see API_POST_SOLICITUD
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Registro-Solicitud/guardar
 * @constant {string}
 */
export const API_POST_GUARDAR_SOLICITUD =(tramite:string):string => `sat-t${tramite}/solicitud/guardar`;



/**
 * API para firmar la solicitud del tramite 231003.
 * @oaram tramite Identificador del trámite.
 * @oaram idSolicitud ID de la solicitud a firmar.
 * @returns Ruta relativa para firmar la solicitud.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231003/swagger-ui/index.html#/Registro-Solicitud/firmar
 */
export const API_POST_FIRMA = (tramite:string,idSolicitud:string):string => `sat-t${tramite}/solicitud/${idSolicitud}/firmar`;




