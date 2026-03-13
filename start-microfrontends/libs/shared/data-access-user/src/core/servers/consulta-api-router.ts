/**
 * 
 * @param TRAMITE 
 * @param cve_enumeracion_h 
 * @returns 
 */

/** cofepris catalogo */
export const API_GET_DESTINADO_PARA = (TRAMITE: string, cve_enumeracion_h:string) : string => `sat-t${TRAMITE}/catalogo/uso-autorizado/${cve_enumeracion_h}`;
export const API_RESTRICCIONES = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/tramite/${TRAMITE}/restricciones`;
export const API_OBSERVACIONES = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/observacion/${TRAMITE}`;
export const API_PLAZO = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/plazo/${TRAMITE}`;
export const API_ASIGNAR_AUTORIZADOR = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/asignar-autorizador/${TRAMITE}`;
export const API_MOTIVO_DE_RECHAZO = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/motivo/rechazo/${TRAMITE}`;
// export const API_MOTIVO_DEL_OFICIO = (TRAMITE: string, ideTipoMotivo:string) : string => `sat-t${TRAMITE}/catalogo/motivo-del-oficio/${ideTipoMotivo}/${TRAMITE}`;
export const API_ALCANCE_REQUERIMIENTO = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/alcance-requerimiento/${TRAMITE}`;
export const API_MOTIVO_DEL_REQUERIMIENTO = (TRAMITE: string, MOTIVO_REQ_PARAM:string) : string => `sat-t${TRAMITE}/catalogo/motivo/${TRAMITE}/${MOTIVO_REQ_PARAM}`;
export const API_FUNDAMENTO_DE_REQUERIMIENTO = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/fundamentos-requerimiento/${TRAMITE}`;
export const API_GET_ENUMERACION = (TRAMITE: string, cveEnumeracionH: string): string =>`sat-t${TRAMITE}/catalogo/enumeracion/${cveEnumeracionH}`;
export const API_TIPO_DE_DOCUMENTO = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/tipo_de_documento/${TRAMITE}`;
export const API_ALCANCE_REQUERIMIENTO_ENUM = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/alcance-requerimiento-enum`;
export const API_CLASIFICACION_TOXICOLOGICA = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/clasificacion-toxicologica/${TRAMITE}`;
export const API_PAIS_BLOQUES = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/paises`;
export const API_ENUMERACION_INF_REQUERIMIENTO = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/enumeracion/ENU_INF_REQUERIMIENTO`;
export const API_FUNDAMENTO_DEL_DICTAMEN = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/fundamento-negativo-dictamen/${TRAMITE}`;
export const API_FUNDAMENTO_OFICIO_DICTAMEN = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/fundamento-oficio-dictamen/${TRAMITE}`;
export const API_MOTIVO_DE_RECHAZO_REQ_PARAM = (TRAMITE: string, MOTIVO_REQ_PARAM:string) : string => `sat-t${TRAMITE}/catalogo/motivo/${TRAMITE}/${MOTIVO_REQ_PARAM}`;
export const API_FUNDAMENTO_DE_OFICIO_DICTAMEN = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/fundamento-oficio-dictamen/${TRAMITE}`;
export const API_FUNDAMENTO_NEGATIVO_DICTAMEN = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/fundamento-negativo-dictamen/${TRAMITE}`;
export const API_AREA = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/unidades-administrativas_proc_spec/4006`;


