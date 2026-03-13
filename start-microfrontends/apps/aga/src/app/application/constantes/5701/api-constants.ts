/**
 * El RFC del solicitante y/o apoderado
 */
export const RFC_QUERY = '{rfc}';
/**
 * API para recuperar las patentes asociadas a un solicitante
 * @param RFC_QUERY El RFC del solicitante
 * @see https://api-v30.cloud-ultrasist.net/api/patente/swagger-ui/index.html
 */
export const API_GET_PATENTE = `patente/${RFC_QUERY}`;

/**
 * API para recuperar las patentes asociadas a un apoderado
 * @param rfcApoderado El RFC del apoderado
 * @see https://api-v30.cloud-ultrasist.net/api/patente/swagger-ui/index.html
 */
export const API_GET_PATENTE_APODERADO = `patente/busca/apoderado?rfc=${RFC_QUERY}`;

/**
 * La clave de la patente por la que se filtrará la información.
 */
export const CLAVE_PATENTE_QUERY = '{clavePatente}';
/**
 * El tipo de la patente por la que se filtrará la información.
 */
export const TIPO_PATENTE_QUERY = '{tipoPatente}';
/**
 * API para recuperar el catálogo de empresas
 * @param CLAVE_PATENTE_QUERY La clave de la pantente seleccionada por el usuario
 * @param TIPO_PATENTE_QUERY El tipo de patente seleccionada por el usuario
 * @see https://api-v30.cloud-ultrasist.net/api/patente/swagger-ui/index.html#/Patente/consulta-lista-rfc-empresas-asociadas
 */
export const API_GET_EMPRESA =
  'patente/rfc/asociados/{CLAVE_PATENTE_QUERY}/{TIPO_PATENTE_QUERY}';
/**
 * La clave del socio comercial por la que se filtrará la información.
 */
export const ID_SOCIO_COMERCIAL_QUERY = '{idSocioComercial}';
/**
 * API para recuperar el catálogo de empresas
 * @param CLAVE_PATENTE_QUERY La clave de la pantente seleccionada por el usuario
 * @param TIPO_PATENTE_QUERY El tipo de patente seleccionada por el usuario
 * @see https://api-v30.cloud-ultrasist.net/api/patente/swagger-ui/index.html#/Patente/consulta-lista-rfc-empresas-asociadas
 */
export const API_GET_SOCIO_COMERCIAL = `catalogo/certificacion/scc/valida/${ID_SOCIO_COMERCIAL_QUERY}`;
/**
 * API que permite consultar las certificaciones automotrices.
 * @param RFC_QUERY EL RFC del solicitante
 * @see https://api-v30.cloud-ultrasist.net/api/patente/swagger-ui/index.html#/Patente/consulta-lista-rfc-empresas-asociadas
 */
export const API_GET_INDUSTRIA_AUTOMOTRIZ = `sat-t5701/solicitud/cert-automotriz/${RFC_QUERY}`;
/**
 * El número de gafete por el que se filtrará la información.
 */
export const NUMERO_GAFETE_QUERY = '{numeroGafete}';
/**
 * El tipo de gafete por el que se filtrará la información.
 */
export const TIPO_GAFETE_QUERY = '{tipoGafete}';
/**
 * API que permite obtener información relacionada a los gafetes.
 * @param NUMERO_GAFETE_QUERY
 * @param TIPO_GAFETE_QUERY
 * @see https://api-v30.cloud-ultrasist.net/api/gafete/swagger-ui/index.html#/Gafetes/consulta-responsable-gafete
 */
export const API_GET_CONSULTA_RESPONSABLE = `gafete/responsable/${NUMERO_GAFETE_QUERY}/${TIPO_GAFETE_QUERY}`;

/**
 * API para validar el horario de una aduana y sección
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t5701/swagger-ui/index.html#/Horarios/valida
 */
export const API_VALIDA_HORARIO = 'sat-t5701/horario/valida';

/**
 * API para obtener las certificaciones de Programa Fomento e IMMEX
 * @param RFC_QUERY El RFC del solicitante
 * @see https://api-v30.cloud-ultrasist.net/api/programa-se/swagger-ui/index.html
 */
export const API_CERTIFICACION = `sat-t5701/solicitud/certificacion/${RFC_QUERY}`;

/**
 * API que obtiene la información del contribuyente por RFC.
 * @param RFC_QUERY El RFC del contribuyente
 */
export const API_GET_RFC_IDC = `idc/contribuyente/detalle/${RFC_QUERY}`;
/**
 * API que valida si un RFC (Registro Federal de Contribuyentes) está certificado para la revisión de origen.
 * * @param RFC_QUERY El RFC del contribuyente
 */
export const API_GET_RFC_ORIGEN = `catalogo/certificacion/origen/valida/${RFC_QUERY}`;
/**
 * El tipo de trámite por el que se filtrará la información.
 */
export const TIPO_TRAMITE_QUERY = '{tipoTramite}';
/**
 * API para validar si un RFC tiene certificaciones vigentes.
 * @param TIPO_TRAMITE_QUERY El tipo de trámite
 * @param RFC_QUERY El RFC del solicitante
 * @see https://api-v30.cloud-ultrasist.net/api/catalogo/swagger-ui/index.html#/Certificaciones/valida-certificaciones
 */
export const API_GET_VALIDA_CERTIFICACIONES = `catalogo/valida-certificaciones/${TIPO_TRAMITE_QUERY}/${RFC_QUERY}`;
/**
 * La línea de pago por la que se filtrará la información.
 */
export const LINEA_PAGO_QUERY = '{lineaPago}';
/**
 * API para validar si una línea de pago es válida.
 * @param LINEA_PAGO_QUERY La línea de pago
 */
export const API_GET_VALIDA_LINEA_PAGO = `pago/sea/${LINEA_PAGO_QUERY}`;

/**
 * API para obtener el monto del trámite
 */
export const API_GET_PARAMETRO_MONTO = `sat-t5701/solicitud/parametro/monto`;

/**
 * API para validar el pedimento
 */
export const API_VALIDAR_PEDIMENTO = 'sat-t5701/pedimento/estado';

/**
 * Constante para la linea de captura que se utilizará en las consultas
 */
export const LINEA_CAPTURA_QUERY = '{lineaCaptura}';

/**
 * API para validar la línea de captura
 * @param LINEA_CAPTURA_QUERY La línea de captura a validar
 * @see https://api-v30.cloud-ultrasist.net/api/pago/swagger-ui/index.html#/Pago/pago_2
 */
export const API_GET_VALIDA_LINEA_CAPTURA = `pago/linea-captura/${LINEA_CAPTURA_QUERY}/usada`;

/**
 * API para validar si una línea de captura ha sido pagada
 * @param LINEA_CAPTURA_QUERY La línea de captura a validar
 * @see https://api-v30.cloud-ultrasist.net/api/pago/swagger-ui/index.html#/Pago/pago
 */
export const API_GET_VALIDA_LINEA_CAPTURA_PAGADA = `pago/valida/${LINEA_CAPTURA_QUERY}`;

/**
 * API para validar el rfc auroizacion LDA
 * @see https://api-v30.cloud-ultrasist.net/api/catalogo/swagger-ui/index.html#/LDA/valida-lda
 */
export const API_POST_VALIDA_LDA = `catalogo/solicitud/valida-lda`;

/**
 * API para obtener aduanas por RFC
 * @param RFC_QUERY El RFC del solicitante
 */
export const API_GET_ADUANA_BY_RFC = `catalogo/aduanas/rfc/${RFC_QUERY}`;