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
 * API para prepar evaluacion tramite general.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80205/swagger-ui/index.html#/Registro-Servicios/buscarServicios
 */
export const SERVICIO_IMMEX_TABLA = (TRAMITE: string): string => `sat-t${TRAMITE}/servicios/buscar`;

/**
 * API para prepar evaluacion tramite general.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80205/swagger-ui/index.html#/Registro-Servicios/buscarServiciosAutorizados
 */
export const SERVICIO_AUTORIZADOS_TABLA = (TRAMITE: string) : string => `sat-t${TRAMITE}/servicios/servicios-autorizados`;

/**
 * API para prepar evaluacion tramite general.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80205/swagger-ui/index.html#/Registro-Servicios/buscarEmpresasNacionales
 */
export const SERVICIO_EMPRESAS_NACIONALES = (TRAMITE: string) : string => `sat-t${TRAMITE}/servicios/empresas-nacionales`;

/**
 * API para buscar datos de la grid de plantas controladoras de empresas controladas.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80210/solicitud/empresas-controladas/buscar-datos-grid-plantas-controladoras
 */
export const API_BUSCAR_DATOS_GRID = (TRAMITE: string) : string => `sat-t${TRAMITE}/solicitud/empresas-controladas/buscar-datos-grid-plantas-controladoras`;

/**
 * API para buscar datos de la grid de plantas controladoras de empresas controladas.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80211/solicitud/empresas-terciarizadas/buscar-datos-grid-plantas
 */
export const API_BUSCAR_TERCIARIZADAS = (TRAMITE: string): string => `sat-t${TRAMITE}/solicitud/empresas-terciarizadas/buscar-datos-grid-plantas`;

/**
 * API para buscar datos de la grid de plantas controladoras de empresas controladas.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80211/solicitud/empresas-terciarizadas/buscar-datos-grid-plantas
 */
export const API_BUSCAR_CANCELACIONES_GRID = (TRAMITE: string, rfc:string): string => `sat-t${TRAMITE}/solicitud/buscar-programas?rfc=${rfc}`;
 
/**
 * API para descargar datos solicitud en evaluacion.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t110101/swagger-ui/index.html#/Evalua-Solicitud/excel-solicitud
 */
export const API_GET_DESCARGAR_SOLICITUD = (TRAMITE: string, IDSOLICITUD: string) : string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/excel`;

/**
 * API para buscar detalle del permiso datos.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t140104/solicitud/buscar
 */
export const API_BUSCAR_DETALLE_DEL_PERMISO_DATOS = (TRAMITE: string) : string => `sat-t${TRAMITE}/solicitud/buscar`;

/**
 * API para buscar cupos disponibles.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t140104/solicitud/buscar/cupos/disponibles
 */
export const API_BUSCAR_CUPOS_DISPONIBLES = (TRAMITE: string) : string => `sat-t${TRAMITE}/solicitud/buscar/cupos/disponibles`;

/**
 * API para obtener certificados disponibles.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t140103/solicitud/obtener/certificados/disponibles
 */
export const API_OBTENER_CERTIFICADOS_DISPONIBLES = (TRAMITE: string) : string => `sat-t${TRAMITE}/solicitud/obtener/certificados/disponibles`;

/**
 * API para obtener detalle de la solicitud.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t140103/solicitud/obtener/detalle
 */
export const API_OBTENER_DETALLE_SOLICITUD = (TRAMITE: string) : string => `sat-t${TRAMITE}/solicitud/obtener/detalle`;

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

/**
 * API para iniciar autorizarRequerimiento trámite generico
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/swagger-ui/index.html#/Autorizar%20Requerimiento/autorizar-requerimiento-iniciar
 */
export const API_POST_INICIAR_AUTORIZAR_REQUERIMIENTO = (TRAMITE: string, NUMFOLIOTRAMITE: string): string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/autorizar/iniciar`;

/**
 * API para mostrar y firmar el dictamen
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Dictamen/mostra-…
 */
export const API_POST_AUTORIZAR_MOSTRAR_FIRMAR = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/autorizar/mostrar-firma`;
 /* API para modificar partidas de la solicitud.
 * @param TRAMITE Identificador del trámite.
 * @param IDSOLICITUD Identificador de la solicitud.
 * @returns 
 */
export const API_MODIFICAR_PARTIDAS = (TRAMITE: number, IDSOLICITUD: string) : string => `sat-t${TRAMITE}/solicitud/mostar/partidas?idSolicitud=${IDSOLICITUD}`;

/**
 * API para testar partidas de la solicitud.
 * @param TRAMITE Identificador del trámite.
 * @returns 
 */
export const API_TESTAR_PARTIDAS = (TRAMITE: number) : string => `sat-t${TRAMITE}/solicitud/partida-mercancia/testar-partidas`;

/**
 * API para actualizar partidas de la solicitud.
 * @param TRAMITE Identificador del trámite.
 * @returns 
 */
export const API_UPDATE_PARTIDAS = (TRAMITE: number) : string => `sat-t${TRAMITE}/solicitud/partida-mercancia/modificar`;

/**
 * API para guardar opciones de evaluacion.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Evaluar-Solicitud/postOpcionesEvaluacion
 */
export const API_POST_OPCIONES_EVALUACION_GUARDAR = (TRAMITE: string, FILONUMBER: string) : string => `sat-t${TRAMITE}/solicitud/${FILONUMBER}/opinion/solicitar/agregar`; 

/**
 * API para terminar opciones de evaluacion.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Evaluar-Solicitud/postOpcionesEvaluacion
 */
export const API_TERMINAR_OPCIONES_EVALUACION = (TRAMITE: string,NUMFOLIOTRAMITE:string) : string => `sat-t${TRAMITE}/solicitud/${NUMFOLIOTRAMITE}/opinion/solicitar/guardar`;

/**
 * API para obtener vista previa del reporte de oficio de comisión.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80101/solicitud/203046665/reporte/oficio/comision/vista-previa
 */
export const API_OBTENER_VISTA_PREVIA_REPORTE = (TRAMITE: string, IDSOLICITUD: string): string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/reporte/oficio/comision/vista-previa`;

/**
 * API para obtener vista previa del acta circunstanciada.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80101/solicitud/203046665/reporte/acta/circunstanciada/vista-previa
 */
export const API_OBTENER_VISTA_PREVIA_ACTA = (TRAMITE: string, IDSOLICITUD: string): string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/reporte/acta/circunstanciada/vista-previa`;
