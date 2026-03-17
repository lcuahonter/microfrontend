import { ENVIRONMENT } from '../../../environments/environment';
/**
 * URLs de API comunes
 */
export const COMUN_URL = {
  BASE_URL: `${ENVIRONMENT.URL_SERVER}`,
  API: '/api',
  API_VERSION: '/v3',
  CATALOGO_URL: '/catalogo',
  SOLICITUD_URL: '/solicitud',
  TRAMITE_URL: '/tramite',
};

/**
 * Constante para el número de folio del tramite.
 * Debe ser reemplazada por el número de folio real del tramite.
 */
export const NUMFOLIOTRAMITE = '{numFolioTramite}';

/**
 * Tramite que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const TRAMITE = '{tramite}';

/**
 * ID de la solicitud que se utilizará en las rutas de la API.
 */
export const IDSOLICITUD = '{idSolicitud}';

/**
 * API para iniciar el atender requerimiento
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Atender-Requerimiento/atender-requerimiento-iniciar
 */
export const API_GET_INICIAR_ATENDER_REQUERIMIENTO = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/atender/iniciar`;

/**
 * API para generar la cadena original
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Atender-Requerimiento/atender-requerimiento-mostrar-firma
 */
export const API_POST_MOSTRAR_FIRMAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/atender/mostrar-firma`;

/**
 * API parA firmar el atender el requerimiento
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Atender-Requerimiento/atender-requerimiento-firmar
 */
export const API_POST_FIRMAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/atender/firmar`;

/**
 * API parA firmar generar acuse requerimiento
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Atender-Requerimiento/guardar-acuse-promocion
 */
export const API_POST_ACUSE_REQUERIMIENTO = `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/requerimiento/atender/acuse/guardar`;

/**
 * API para obtener los colores disponibles de vehículos.
 */
export const API_GET_VEHICULOS_COLORES = '/api/sat-t40103/vehiculos/colores';

/**
 * API para firmar la solicitud de modificación.
 */
export const API_FIRMAR = `/api/sat-t40103/solicitud/modificar/firmar`;

/**
 * API para guardar la solicitud de modificación.
 */
export const API_GUARDAR = `/api/sat-t40103/solicitud/modificar/guardar`;

/**
 * API base para obtener los detalles de un chofer.
 */
export const API_CHOFER_DETALLES = `/api/sat-t40103/chofer/detalles`;

/**
 * API para obtener los detalles de un chofer por NSS.
 * @param nss Número del Seguro Social del chofer.
 * @returns URL completa para la consulta del chofer.
 */
export const API_CHOFER_DETALLES_NSS = (nss: string): string =>
  `/api/sat-t40103/chofer/detalles/nss/${nss}`;

/**
 * API para consultar la información del parque vehicular.
 */
export const API_PARQUE_VEHICULAR =
  '/api/sat-t40103/vehiculos/parque-vehicular';

/**
 * API para consultar la información de unidades de arrastre.
 */
export const API_UNIDAD_ARRASTRE = '/api/sat-t40103/vehiculos/unidad-arrastre';

/**
 * API para obtener los municipios o alcaldías según la clave del estado.
 * @param claveEstado Clave de la entidad federativa.
 * @returns URL completa para la consulta de municipios o alcaldías.
 */
export const API_MUNICIPIO_ACLADIA = (claveEstado: string): string =>
  `/api/sat-t40103/catalogo/entidad-federativa/${claveEstado}/municipio-o-alcaldia`;

/**
 * API para obtener las colonias según la clave del municipio o alcaldía.
 * @param claveMunicipio Clave del municipio o alcaldía.
 * @returns URL completa para la consulta de colonias.
 */
export const API_COLONIA = (claveMunicipio: string): string =>
  `/api/sat-t40103/catalogo/municipio-o-alcaldia/${claveMunicipio}/colonia`;

/**
 * API para obtener los tipos de vehículo del catálogo PARIVEH.
 */
export const API_PARIVEH = '/api/sat-t40103/vehiculos/tipos-vehiculo/pariveh';

/**
 * API para obtener el catálogo completo de países.
 */
export const API_PAISES = '/api/sat-t40103/catalogo/paises';

/**
 * API para iniciar el proceso de modificación de una solicitud.
 */
export const API_MODIFICAR_INICIAR = `/api/sat-t40103/solicitud/modificar/iniciar`;

export const API_ENTIDADES_FEDERATIVAS =
  '/api/sat-t40103/catalogo/entidades-federativas';
/**
 * Api para guardar la solicitud del tramite
 * @param tramite id del tramite
 * @returns endpoint para guardar la solicitud
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Guardar-Solicitud/guardar-solicitud
 */
export const API_POST_GUARDAR_SOLICITUD = (tramite: number | string): string =>
  `sat-t${tramite}/solicitud/guardar`;

/**
 * API para obtener la cadena original
 * @param tramite id del tramite
 * @param idSolicitud id de la solicitud
 * @returns endpoint para obtener la cadena original
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Firma-Electronica/obtener-cadena-original
 */
export const API_POST_CADENA_ORIGINAL = (
  tramite: string,
  idSolicitud: string
): string => `sat-t${tramite}/tramite/${idSolicitud}/cadena-original`;

/**
 * Endpoint para obtener el catálogo de países.
 * @param tramiteId tramite id del trámite
 * @returns endpoint para obtener el catálogo de países
 */
export const API_GET_PAISES = (tramiteId: number): string =>
  `sat-t${tramiteId}/catalogo/paises`;

/**
 * Endpoint para obtener el catálogo de entidades federativas.
 * @param tramiteId tramite id del trámite
 * @returns endpoint para obtener el catálogo de entidades federativas
 */
export const API_GET_ENTIDADES_FEDERATIVAS = (tramiteId: number): string =>
  `sat-t${tramiteId}/catalogo/entidades-federativas`;

/**
 * Endpoint para obtener los municipios o alcaldías según la clave del estado.
 * @param tramiteId tramite id del trámite
 * @param cveEstado clave del estado
 * @returns endpoint para obtener los municipios o alcaldías
 */
export const API_GET_MUNICIPIOS = (
  tramiteId: number,
  cveEstado: string
): string =>
  `sat-t${tramiteId}/catalogo/entidad-federativa/${cveEstado}/municipios-delegaciones`;

/**
 * Endpoint para obtener las colonias según la clave del municipio o alcaldía.
 * @param tramiteId tramite id del trámite
 * @param cveMunicipio clave del municipio
 * @returns endpoint para obtener las colonias
 */
export const API_GET_COLONIAS = (
  tramiteId: number,
  cveMunicipio: string
): string =>
  `sat-t${tramiteId}/catalogo/municipio-delegacion/${cveMunicipio}/colonias`;

/**
 * Endpoint para obtener los contribuyentes por RFC.
 * @param tramiteId tramite id del trámite
 * @param esFisico determina si el contribuyente es físico o moral
 * @param rfc rfc del contribuyente
 * @returns endpoint para obtener los contribuyentes por RFC
 */
export const API_GET_CONTRIBUYENTES = (
  tramiteId: number,
  esFisico: boolean,
  rfc: string
): string =>
  `sat-t${tramiteId}/caat/${esFisico ? 'contribuyente-fisico' : 'contribuyente-moral'
  }/${rfc}`;

/**
 * Endpoint para obtener las localidades según la clave del municipio.
 * @param tramiteId tramite id del trámite
 * @param cveMunicipio clave del municipio
 * @returns Endpoint para obtener las localidades
 */
export const API_GET_LOCALIDAD = (
  tramiteId: number,
  cveMunicipio: string
): string => `sat-t${tramiteId}/catalogo/municipio/${cveMunicipio}/localidades`;

/**
 * Endpoint para obtener el código postal según la clave del municipio.
 * @param tramiteId tramite id del trámite
 * @param cveMunicipio clave del municipio
 * @returns Endpoint para obtener el código postal
 */
export const API_GET_CODIGO_POSTAL = (
  tramiteId: number,
  cveMunicipio: string
): string =>
  `sat-t${tramiteId}/catalogo/municipio-delegacion/${cveMunicipio}/colonias/codigo-postal`;

/**
 * Endpoint para obtener la empresa CAAT.
 * @param tramiteId tramite id del trámite
 * @returns endpoint para obtener la empresa CAAT
 */
export const API_OBTENER_EMPRESA_CAAT = (tramiteId: number): string =>
  `sat-t${tramiteId}/caat/empresa-maritima/busqueda`;


/**
 * Endpoint para validar si un RFC corresponde a un agente naviero.
 * @param tramiteId tramite id del trámite
 * @param rfc RFC a validar
 * @returns endpoint para validar el RFC de un agente naviero
 */
export const API_GET_VALIDA_AGENTE_NAVIERO = (
  tramiteId: number,
  rfc: string
): string =>
  `sat-t${tramiteId}/caat/agente-naviero/${rfc}/existe`;


/**
 * Api para obtener las empresas CAAT.
 * @param tramiteId el id del trámite
 * @param rfcSolicitante rfc del solicitante
 * @returns endpoint para obtener las empresas CAAT
 */
export const API_GET_EMPRESAS_CAAT = (tramiteId: number, rfcSolicitante: string):
  string => `sat-t${tramiteId}/caat/transportistas-maritimos/${rfcSolicitante}/consultar`;


  /**
   * Api para obtener el detalle de la solicitud.
   * @param tramiteId el id del trámite
   * @param numFolio numero de folio de la solicitud
   * @returns endpoint para obtener el detalle de la solicitud
   */
export const API_GET_DETALLE_SOLICITUD = (tramiteId: number, numFolio: string): string => `sat-t${tramiteId}/tramite/${numFolio}/solicitud/detalle`;