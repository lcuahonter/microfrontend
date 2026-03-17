import { ENVIRONMENT } from "../../../environments/environment";
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
 * Endpoint para buscar representante legal por RFC
 * @param tramite - Número del trámite
 * @returns string con el endpoint
 */
export const API_BUSCAR_REPRESENTANTE = (tramite: string): string => `sat-t${tramite}/solicitud/buscar`;

/**
 * API para descargar datos solicitud en evaluacion.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t110101/swagger-ui/index.html#/Evalua-Solicitud/excel-solicitud
 */
export const API_GET_DESCARGAR_SOLICITUD = (TRAMITE: string, IDSOLICITUD: string) : string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/excel`;

/**
 * API para obtener evaluar iniciar tramite general.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Evaluar-Solicitud/getOpcionesEvaluacion
 */
export const API_GET_EVALUAR_INICIAR = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/evaluar/iniciar`;

/**
 * API para prepar evaluacion tramite general.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Evaluar-Solicitud/getOpcionesEvaluacion
 */
export const API_GET_EVALUAR_MOSTRAR = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/evaluar/mostrar`;

/** 
 * API para consulta de envio digital.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-/swagger-ui/index.html#/Consulta-Solicitud/get-detalle-estado
 */
export const API_GET_ENVIO_DIGITAL = (NUMFOLIOTRAMITE: string) : string => `tramite/${NUMFOLIOTRAMITE}/envio-digital/detalle`;


/**
 * API para Consultar que tabs mostrar 130118.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitud/estado-consulta-solicitud
 */
export const API_GET_TABS = (TRAMITE: string, IDSOLICITUD: string, PROCESO?: number) : string => `sat-t${TRAMITE}/tramite/solicitud/${IDSOLICITUD}/estado`;


/**
 * API para vista preliminar aceptado - cofepris
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Autorizar-Dictamen
 */
export const API_POST_VISTA_PRELIMINAR_ACEPTADO = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/autorizar/preview`;

/**
 * API para vista preliminar rechazado - cofepris
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Autorizar-Dictamen
 */
export const API_POST_VISTA_PRELIMINAR_RECHAZADO = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/rechazo/preview`;

/**
 * API para vista preliminar de requerimiento autorizado - cofepris
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260201/swagger-ui/index.html#/Autorizar-Oficio-Autorizacion/post_autorizar_oficio_autorizacion_preview
 */
export const API_POST_VISTA_PRELIMINAR_REQUERIMIENTO = (TRAMITE: string, NUMFOLIOTRAMITE: string): string =>
  `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/autorizar/preview`;
//Option
export const API_POST_OPINION_EVALUAR_INICIAR = (TRAMITE: string, FILO_NUMBER: string) : string => `sat-t${TRAMITE}/solicitud/${FILO_NUMBER}/opinion/solicitar/agregar`;

export const API_GET_SOLICITAR_INICIAR = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/evaluar/solicitar`;

export const API_GET_OPINION_EVALUAR_INICIAR = (TRAMITE: string, FILO_NUMBER: string) : string => `sat-t${TRAMITE}/solicitud/${FILO_NUMBER}/solicitar/opinion/mostrar`;

export const API_POST_OPINION_EVALUAR_GUARDAR_FIRMA = (TRAMITE: string, FILO_NUMBER: string) : string => `sat-t${TRAMITE}/solicitud/${FILO_NUMBER}/opinion/registrar/mostrar-firma`;

export const API_POST_OPINION_EVALUAR_GUARDAR = (TRAMITE: string, FILO_NUMBER: string) : string => `sat-t${TRAMITE}/solicitud/${FILO_NUMBER}/opinion/registrar/guardar`;

export const API_GET_RADIO_OPINION=(TRAMITE:string):string=>`sat-t${TRAMITE}/solicitud/opinion/registrar/sentidos-disponibles`;