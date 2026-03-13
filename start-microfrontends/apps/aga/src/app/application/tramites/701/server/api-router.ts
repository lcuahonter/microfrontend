/** 
 * SECCIÓN DE CATALOGOS 
 */

/**
 * API para el catalogo de los tipos de documentos activos
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t701/swagger-ui/index.html#/Catalogos/consulta-tipos-documento
 */
export const API_GET_CAT_TIPOS_DOCUMENTOS = `sat-t701/catalogo/tipos-documento`;


/** 
 * SECCIÓN DE REGISTRO SOLICITUD
 */

/**
 * API para buscar un usuario en IDC por medio del RFC.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t701/swagger-ui/index.html#/Registro-Solicitud/Buscar-Usuario-IDC
 */
export const API_GET_USUARIO_IDC_POR_RFC = (RFCSOLICITANTE: string, RFCDOCUMENTO: string) : string=> `sat-t701/solicitud/buscar-usuario-IDC/${RFCSOLICITANTE}/${RFCDOCUMENTO}`;

/**
 * API para guardar los tipos de documentos especificos del trámite
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t701/swagger-ui/index.html#/Registro-Solicitud/guardar-tipo-documentos-tramite
 */
export const API_POST_GUARDAR_TIPOS_DOCUMENTOS = (IDSOLICITUD: string) : string => `sat-t701/solicitud/${IDSOLICITUD}/documentos/guardar-tipos`;

/**
 * API para guardar la solicitud del trámite
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t701/swagger-ui/index.html#/Registro-Solicitud/guardar
 */
export const API_POST_GUARDAR_SOLICITUD_TRAMITE = `sat-t701/solicitud/guardar`;

/**
 * Api para generar la cadena original de la solicitud del tramite 120301.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t701/swagger-ui/index.html#/Registro-Solicitud/mostrar-firma
 */
export const API_POST_CADENA_ORIGINAL = (IDSOLICITUD: string) : string => `sat-t701/solicitud/${IDSOLICITUD}/genera-cadena-original`;

/**
 * Api para firmar la solicitud del tramite 120301.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t701/swagger-ui/index.html#/Registro-Solicitud/firmar
 */
export const API_POST_FIRMAR = (IDSOLICITUD: string) : string => `sat-t701/solicitud/${IDSOLICITUD}/firmar`;
 