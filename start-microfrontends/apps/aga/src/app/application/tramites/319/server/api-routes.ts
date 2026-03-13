/**
 * Devuelve la ruta para obtener el tipo de operación de un trámite específico para un RFC dado.
 * @param tramite - El identificador del trámite.
 * @param rfc - El RFC para el cual se desea obtener el tipo de operación.
 * @returns La ruta de la API como una cadena de texto.
 */
export const API_GET_TIPO_OPERACION = (rfc: string): string =>
  `sat-t319/solicitud/rfc/${rfc}/tipo-operacion`;

/**
 * @description
 * Devuelve la ruta para obtener las personas asociadas a un trámite específico y RFC dado.
 * @param tramite - El identificador del trámite.
 * @param rfc - El RFC para el cual se desea obtener las personas.
 * @returns La ruta de la API como una cadena de texto.
 */
export const API_GET_PERSONAS = (rfc: string): string =>
  `sat-t319/solicitud/rfc/${rfc}/personas-oir-recibir-notificaciones`;

/**
 * Devuelve la ruta para obtener los períodos de un trámite específico.
 * @param tramite - El identificador del trámite.
 * @returns La ruta de la API como una cadena de texto.
 */
export const API_GET_PERIODOS = `sat-t319/catalogo/periodos-ce`;


/**
 * Devuelve la ruta para obtener el período histórico actual.
 * @returns La ruta de la API como una cadena de texto.
 */
export const API_GET_PERIODOS_HISTORICO_ACTUAL = `sat-t319/solicitud/clave-periodo-historico-actual`;

/**
 * Devuelve la ruta para guardar una solicitud de trámite 319.
 * @return La ruta de la API como una cadena de texto.
 */
export const API_POST_GUARDAR_SOLICITUD = `sat-t319/solicitud/guardar`

