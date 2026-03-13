/**
 * @fileoverview Enrutador centralizado de APIs para el sistema VUCEM.
 * 
 * Este archivo contiene todas las rutas y endpoints de las APIs utilizadas en el sistema VUCEM,
 * organizadas por funcionalidad y trámites. Proporciona una configuración centralizada para
 * el acceso a servicios web, catálogos, autenticación y operaciones de trámites.
 * 
 * @description
 * El enrutador incluye:
 * - Rutas base y configuración de URLs
 * - Endpoints de autenticación y usuarios
 * - APIs de catálogos (aduanas, países, tratados, etc.)
 * - Operaciones de trámites (130118, 231001, etc.)
 * - Servicios de validación y consulta
 * - Manejo de documentos y firmas electrónicas
 * 
 * @example
 * ```typescript
 * import { API_GET_PAISES, CATALOGO_TRATADO_ACUERDO } from './api-router';
 * 
 * // Usar endpoint estático
 * const paisesUrl = API_GET_PAISES;
 * 
 * // Usar función generadora de endpoint
 * const tratadosUrl = CATALOGO_TRATADO_ACUERDO('110219');
 * ```
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author Sistema VUCEM
 */

import { ENVIRONMENT } from "../../enviroments/enviroment";
import { RFC_GENERICO } from "../constants/constantes-generales";

/**
 * URL base del servidor obtenida de las variables de entorno.
 * @constant {string}
 */
const BASE_URL = `${ENVIRONMENT.URL_SERVER}`;

/**
 * Ruta base para los endpoints de autenticación.
 * @constant {string}
 */
const API_URL = '/auth/api';

/**
 * Configuración centralizada de URLs comunes del sistema.
 * 
 * Contiene las rutas base y versiones de API utilizadas en todo el sistema VUCEM.
 * Estas constantes se utilizan para construir endpoints completos y mantener
 * consistencia en las rutas de la aplicación.
 * 
 * @example
 * ```typescript
 * const fullUrl = `${COMUN_URL.BASE_URL}${COMUN_URL.CATALOGO_URL}/paises`;
 * ```
 * 
 * @since 1.0.0
 */
export const COMUN_URL = {
  BASE_URL: `${ENVIRONMENT.API_HOST}/api/`,
  API: '/api',
  API_VERSION: '/v3',
  CATALOGO_URL: '/catalogo',
  SOLICITUD_URL: '/solicitud',
  TRAMITE_URL: '/tramite',
};

/**
 * Rutas de API para operaciones de usuarios del sistema.
 * 
 * Contiene los endpoints completos para realizar operaciones CRUD sobre usuarios,
 * incluyendo creación, actualización y eliminación de cuentas de usuario.
 * 
 * @example
 * ```typescript
 * // Crear un nuevo usuario
 * this.http.post(ROUTE.USER.CREATE, userData).subscribe(...);
 * 
 * // Actualizar usuario existente
 * this.http.put(ROUTE.USER.UPDATE, updatedData).subscribe(...);
 * ```
 * 
 * @see BASE_URL
 * @see COMUN_URL.API_VERSION
 * @since 1.0.0
 */
export const ROUTE = {
  /**
   * Endpoints para operaciones de usuarios.
   */
  USER: {
    /** Endpoint para crear un nuevo usuario */
    CREATE: `${BASE_URL}${COMUN_URL.API_VERSION}/user/create`,
    /** Endpoint para actualizar un usuario existente */
    UPDATE: `${BASE_URL}${COMUN_URL.API_VERSION}/user/update`,
    /** Endpoint para eliminar un usuario */
    DELETE: `${BASE_URL}${COMUN_URL.API_VERSION}/user/delete`,
  }
};
 
/**
 * Rutas de autenticación del sistema VUCEM.
 * 
 * Contiene los endpoints utilizados para procesos de autenticación y autorización
 * de usuarios, incluyendo login con FIEL (Firma Electrónica) y otros métodos
 * de autenticación soportados por el sistema.
 * 
 * @example
 * ```typescript
 * // Autenticarse con FIEL
 * this.http.post(AUTH_ROUTE.LOGIN, credentials)
 *   .subscribe(response => {
 *     // Manejar respuesta de autenticación
 *   });
 * ```
 * 
 * @see BASE_URL
 * @see API_URL
 * @see COMUN_URL.API_VERSION
 * @since 1.0.0
 */
export const AUTH_ROUTE = {
  /** 
   * Endpoint para autenticación mediante FIEL (Firma Electrónica).
   * Permite a los usuarios autenticarse usando su certificado digital. 
   */
  LOGIN: `${BASE_URL}${API_URL}${COMUN_URL.API_VERSION}/auth/login/fiel`,
};
 
/**
 * Construye dinámicamente el endpoint para inicializar trámites del SAT.
 * 
 * Esta función helper genera la URL completa para iniciar el proceso de solicitud
 * de cualquier trámite del SAT, utilizando el identificador del procedimiento
 * proporcionado. Es útil para mantener consistencia en la construcción de URLs
 * y facilitar el mantenimiento del código.
 * 
 * @param procedureId - Identificador único del procedimiento del trámite (ej: '110219', '130118')
 * 
 * @returns {string} URL completa y formateada para el endpoint de inicialización del trámite
 * 
 * @example
 * ```typescript
 * // Para trámite 110219
 * const url = CONSTRUIR_ENDPOINT_INICIAR('110219');
 * // Resultado: 'https://api.vucem.com/api/sat-t110219/solicitud/iniciar'
 * 
 * // Para trámite 130118
 * const url2 = CONSTRUIR_ENDPOINT_INICIAR('130118');
 * // Resultado: 'https://api.vucem.com/api/sat-t130118/solicitud/iniciar'
 * ```
 * 
 * @see COMUN_URL.BASE_URL
 * @since 1.0.0
 * @author Sistema VUCEM
 */
export const CONSTRUIR_ENDPOINT_INICIAR = (procedureId: string): string => { return `${COMUN_URL.BASE_URL}sat-t${procedureId}/solicitud/iniciar` }
 
 
 
/**
 * Endpoint para recuperar el catálogo completo de aduanas del sistema.
 * 
 * Este endpoint proporciona información sobre todas las aduanas disponibles
 * en el sistema VUCEM, incluyendo códigos, nombres y datos de contacto.
 * 
 * @constant {string}
 * @example
 * ```typescript
 * this.http.get(`${BASE_URL}/${API_GET_ADUANA}`)
 *   .subscribe(aduanas => {
 *     this.listaAduanas = aduanas;
 *   });
 * ```
 * 
 * @see {@link https://api-v30.cloud-ultrasist.net/api/catalogo/swagger-ui/index.html#/Aduana./consulta-cat%C3%A1logo-aduanas|Documentación API}
 * @since 1.0.0
 */
export const API_GET_ADUANA = 'catalogo/aduanas';

/**
 * Endpoint para recuperar el catálogo completo de aduanas del sistema por medio del rfc.
 * 
 * Este endpoint proporciona información sobre todas las aduanas disponibles
 * en el sistema VUCEM, incluyendo códigos, nombres y datos de contacto.
 * 
 * @constant {string}
 * @example
 * ```typescript
 * const rfc = 'XAXX010101000';
 * const endpoint = API_GET_ADUANA_BY_RFC.replace('{rfc}', rfc);
 * this.http.get(`${BASE_URL}/${endpoint}`)
 *   .subscribe(aduanas => {
 *     this.listaAduanas = aduanas;
 *   });
 * ```
 * 
 * @see {@link https://api-v30.cloud-ultrasist.net/api/catalogo/swagger-ui/index.html#/Aduana./consulta-cat%C3%A1logo-aduanas|Documentación API}
 * @since 1.0.0
 */
export const API_GET_ADUANA_BY_RFC = 'catalogo/aduanas/rfc/{rfc}';

/**
 * Parámetro de consulta para filtrar información por clave de aduana.
 * 
 * Esta constante se utiliza como placeholder en URLs que requieren
 * especificar una aduana particular. Debe ser reemplazada por el
 * código real de la aduana antes de realizar la consulta.
 * 
 * @constant {string}
 * @example
 * ```typescript
 * const url = API_GET_SECCION_ADUANA.replace(CLAVE_ADUANA_QUERY, '010');
 * ```
 * @since 1.0.0
 */
export const CLAVE_ADUANA_QUERY = '{claveAduana}';

/**
 * Endpoint para recuperar las secciones de una aduana específica.
 * 
 * Permite obtener información detallada sobre las diferentes secciones
 * o departamentos que conforman una aduana particular, utilizando su
 * clave identificadora.
 * 
 * @constant {string}
 * @example
 * ```typescript
 * const claveAduana = '010';
 * const url = API_GET_SECCION_ADUANA.replace(CLAVE_ADUANA_QUERY, claveAduana);
 * this.http.get(`${BASE_URL}/${url}`)
 *   .subscribe(secciones => {
 *     this.seccionesAduana = secciones;
 *   });
 * ```
 * 
 * @see CLAVE_ADUANA_QUERY
 * @see {@link https://api-v30.cloud-ultrasist.net/api/catalogo/swagger-ui/index.html#/Aduana./consulta-cat%C3%A1logo-aduanas|Documentación API}
 * @since 1.0.0
 */
export const API_GET_SECCION_ADUANA = `catalogo/seccion-aduanas/${CLAVE_ADUANA_QUERY}`;
/**
 * La clave de la patente por la que se filtrará la información.
 */
export const CLAVE_PATENTE_QUERY = '{clavePatente}';
/**
 * API para recuperar los recintos inherentes de una aduana.
 * @param CLAVE_ADUANA_QUERY El clave de la aduana seleccionada por el usuario.
 * @see https://api-v30.cloud-ultrasist.net/api/patente/swagger-ui/index.html
 */
export const API_GET_RECINTO = `catalogo/recintos-fiscalizados/${CLAVE_ADUANA_QUERY}`;
/**
 * API para obtener el catálogo de tipo de equipo en el trasnporte ferroviario.
 * @see https://api-v30.cloud-ultrasist.net/api/catalogo/swagger-ui/index.html#/Tipos%20de%20equipo./consul…
 */
export const API_GET_TIPO_EQUIPO = 'catalogo/busca/tipo-equipo';
/**
 * Tipo de transporte [ferro, aereo]
 */
export const TIPO_TRANSPORTE = '{tipoTransporte}';
/**
 * API para validar el número BL de transporte ferroviario. y obtener los datos:
 * Tipo de equipo, Iniciales de equipo y Npumero de equipo.
 * @see https://api-v30.cloud-ultrasist.net/api/privado/swagger-ui/index.html#/Privado%20Validaciones/valid…
 */
export const API_CONSULTAR_VALIDACION = `privado/${TIPO_TRANSPORTE}/valida`;
/**
 * El RFC del solicitante y/o apoderado
 */
export const RFC_QUERY = '{rfc}';
/**
 * API que permite verificar si el RFC proporcionado es válido.
 * @param RFC_QUERY EL RFC
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t5701/swagger-ui/index.html#/RFC/valida-rfc
 */
export const API_GET_VALIDA_RFC = `sat-t5701/rfc/valida/${RFC_QUERY}`;
 
/**
 * API que obtiene la información del contribuyente por RFC.
 * @param RFC_QUERY El RFC del contribuyente
 */
export const API_GET_RFC_IDC = `idc/contribuyente/detalle/${RFC_QUERY}`;
/**
 * API que valida si un RFC (Registro Federal de Contribuyentes) está certificado para la revisión de origen.
 * * @param RFC_QUERY El RFC del contribuyente
 */
export const API_GET_RFC_ORIGEN = `certificacion/origen/valida/${RFC_QUERY}`;
/**
 * El tipo de trámite por el que se filtrará la información.
 */
export const TIPO_TRAMITE_QUERY = '{tipoTramite}';
/**
 * API para validar si un RFC tiene certificaciones vigentes.
 * @param TIPO_TRAMITE_QUERY El tipo de trámite
 * @param RFC_QUERY El RFC del solicitante
 * @see https://api-v30.cloud-ultrasist.net/api/catalogo/swagger-ui/index.html#/Certificaciones/valida-cert…
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
 * API para guardar la solicitud
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t5701/swagger-ui/index.html#/Solicitud/guardar
 */
export const API_POST_SOLICITUD = 'sat-t5701/guardar';
 
/**
 * ID del trámite a eliminar.
 * Este ID se debe reemplazar por el ID del trámite que se desea eliminar.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t5701/swagger-ui/index.html#/Tramite/elimina-tramite-pe…
 */
export const ID_TRAMITE = '{idTramite}';
 
/**
 * API para eliminar un trámite pendiente.
 */
export const API_ELIMINAR_TRAMITE = `sat-t5701/tramite/pendiente/${ID_TRAMITE}`;
 
/**
 * Indica el número de trámite a consultar.
 */
export const TRAMITE = '{numeroTramite}';
 
/**
 * API  para obtener el catálogo de cdocumentos obligatorios, según el trámite.
 * @param TRAMITE el trámite seleccionado por el usuario.
 * @see https://api-v30.cloud-ultrasist.net/api/tramite/5701/documentos?especifico=false
 */
export const API_GET_DOCUMENTOS_OBLIGATORIOS = `sat-t{numeroTramite}/solicitud/documentos`;
 
/**
 * API para recuperar el catálogo de paises
 * @see https://api-v30.cloud-ultrasist.net/api/catalogo/swagger-ui/index.html#/Pa%C3%ADs/consulta-paises-a…
 */
export const API_GET_PAISES = 'catalogo/paises';
 
/**
 * API para generar la cadena original de un trámite.
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Cadena/generar
 */
export const API_GENERAR_CADENA_ORIGINAL =
  'api/tramite/solicitud/genera-cadena-original';
 
/**
 * API para enviar una firma electrónica.
 * @see https://api-v30.cloud-ultrasist.net/api/firma/swagger-ui/index.html#/Firma/firmar
 */
export const API_ENVIAR_FIRMA = 'api/tramite/firmar';
 
/**
 * API para recuperar las tareas por usuario.
 * @see https://api-v30.cloud-ultrasist.net/api/bandeja-tarea/swagger-ui/index.html#/Bandeja%20tarea/consul…
 */
export const API_GET_BANDEJATAREA = 'bandeja-tarea/usuario/tarea';

/**
 * API para activar tareas.
 * @see https://api-v30.cloud-ultrasist.net/api/bandeja-tarea/swagger-ui/index.html#/Bandeja%20tarea/activar-tarea
 */
export const API_POST_TAREA_ACTIVAR = 'bandeja-tarea/activar';

/**
 * API para recuperar las tareas por usuario.
 * @see https://api-v30.cloud-ultrasist.net/api/bandeja-tarea/swagger-ui/index.html#/Bandeja%20solicitud/consulta-solicitudes-pendientes
 */
export const API_GET_BANDEJA_SOLICITUDES = 'bandeja-tarea/solicitudes-pendientes';
 
/**
 * API para recuperar el catálogo de regímenes aduaneros.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Catalogos/consulta-regim…
 */
export const API_GET_REGIMEN = `sat-t130118/catalogo/regimenes`;
 
/**
 * La clave del régimen aduanero por el que se filtrará la información.
 */
export const CLASIFICACION = '{cveRegimen}';
 
/**
 * API para recuperar la clasificación de un régimen aduanero.
 * @param CLASIFICACION La clave del régimen aduanero
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Catalogos/consulta-clasi…
 */
export const API_GET_REGIMENES_CLASIFICACION = `sat-t130118/catalogo/regimenes/${CLASIFICACION}/clasificacion`;
 
/**
 * API para recuperar el catálogo de países para el trámite T130118.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Catalogos/consulta-paises
 */
export const API_GET_PAISES_SAT_T130118 = 'sat-t130118/catalogo/paises';
 
/**
 * API para recuperar el catálogo de entidades federativas.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Catalogos/consulta-entid…
 */
export const API_GET_ENTIDADES_FEDERATIVAS = 'sat-t130118/catalogo/entidades-federativas';
 
/**
 * La clave de la entidad federativa por la que se filtrará la información.
 */
export const CVEENTIDAD = '{cveEntidad}';
 
/**
 * API para recuperar las unidades administrativas de una entidad federativa.
 * @param CVEENTIDAD La clave de la entidad federativa
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Catalogos/consulta-unida…
 */
export const API_GET_ENTIDADES_FEDERATIVAS_CLAVE = `sat-t130118/catalogo/entidad-federativa/${CVEENTIDAD}/unidades-administrativas`;
 
/**
 * API para recuperar el catálogo de fracciones arancelarias.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Catalogos/consulta-fracc…
 */
export const API_GET_FRACCION_ARANCELARIA = 'sat-t130118/catalogo/fracciones-arancelarias';
 
/**
 * La clave de la fracción arancelaria por la que se filtrará la información.
 */
export const CVEFRACCION = '{cveFraccion}';
 
/**
 * API para recuperar el catálogo de fracciones arancelarias.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Catalogos/consulta-unida…
 */
export const API_GET_FRACCION_ARANCELARIA_CVE = `sat-t130118/catalogo/fraccion-arancelaria/${CVEFRACCION}/unidades-medida`;
 
/**
 * API para recuperar el catálogo de subdivisiones y fracciones arancelarias.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Catalogos/consulta-subdi…
 */
export const API_GET_NICO = `sat-t130118/catalogo/fraccion-arancelaria/${CVEFRACCION}/subdiviciones`;
 
/**
 * ID de la solicitud que se utilizará en las rutas de la API.
 */
export const IDSOLICITUD = '{idSolicitud}';
 
/**
 * API para guardar el acuse de una solicitud.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Registro-Solicitud/guard…
 */
export const API_POST_GUARDAR_ACUSE = (idSolicitud: string, tramite: number): string => `sat-t${tramite}/solicitud/${idSolicitud}/acuse/guardar`;

/**
 * API para guardar el recibo oficial de una solicitud.
 * @param idSolicitud Identificador de la solicitud
 * @param tramite Número de procedimiento
 * @returns URL del endpoint para guardar el recibo oficial
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Registro-Solicitud/guardar-documento
 */
export const API_POST_GUARDAR_CERTIFICADO = (idSolicitud: string, tramite: number): string => `sat-t${tramite}/solicitud/${idSolicitud}/constancia/guardar`;

/**
 * API para guardar el certificado de una solicitud.
 * @param idSolicitud Identificador de la solicitud
 * @param tramite Número de procedimiento
 * @returns URL del endpoint para guardar el certificado
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Registro-Solicitud/guardar-documento
 */
export const API_POST_VISTA_PREVIA_CERTIFICADO = (idSolicitud: string, tramite: number): string => `sat-t${tramite}/solicitud/${idSolicitud}/constancia/vista-previa`;

/**
 * API para guardar el aviso de desistimiento de una solicitud.
 * @param idSolicitud Identificador de la solicitud
 * @returns URL del endpoint para guardar el aviso de desistimiento
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230301/swagger-ui/index.html#/aviso-desistimiento/guardar
 */
export const API_POST_GUARDAR_AVISO_DESISTIMIENTO = (idSolicitud: string): string => `sat-t230301/solicitud/${idSolicitud}/aviso-desistimiento/guardar`;

/**
 * API para generar la vista previa del acuse de una solicitud.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Registro-Solicitud/gener…
 */
export const API_POST_VISTA_PREVIA = (idSolicitud: string, tramite: number): string => `sat-t${tramite}/solicitud/${idSolicitud}/acuse/vista-previa`;

/**
 * API para obtener los documentos
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Registro-Solicitud/consu…
 */
export const API_GET_DOCUMENTOS_SOLICITUD = (tramite: string): string => `sat-t${tramite}/solicitud/documentos`;

/**
 *API para obtener los documentos del tramite 231001
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t231001/swagger-ui/index.html#/Registro-Solicitud/consu…
 */
 
export const API_GET_DOCUMENTOS231001 = 'sat-t231001/solicitud/documentos';
 
/**
 * Ruta de la API para obtener la información del contribuyente IDC.
 * Utiliza el RFC genérico como parte de la URL.
 *
 * @see https://api-v30.cloud-ultrasist.net/api/idc/swagger-ui/index.html#/idc-ws-end-point-controller/info…
 */
export const API_GET_IDC_CONTRIBUYENTE = `idc/contribuyente/${RFC_GENERICO}/informacion`;
 
/**
 * Constante para el número de folio del tramite.
 * Debe ser reemplazada por el número de folio real del tramite.
 */
export const NUMFOLIOTRAMITE = '{numFolioTramite}';
 
/**
 * ID de la solicitud del dictamen que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el ID real de la solicitud del dictamen.
 */
export const IDSOLICITUDDICTAMEN = '{idSolicitudDictamen}';
 
/**
 * API para obtener las opciones de evaluación del tramite 130118.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Evaluar-Solicitud/opcion…
 */

export const API_POST_OPCIONES_EVALUACION = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/${NUMFOLIOTRAMITE}/evaluar/opciones-evaluacion`;

export const API_DELETE_OPCIONES_EVALUACION = (TRAMITE: string, IDOPINION: string) : string => `sat-t${TRAMITE}/solicitud/opinion/${IDOPINION}/eliminar`;  

export const API_DELETE_DOCUMENTO_OPCIONES_EVALUACION = (TRAMITE: string) : string => `sat-t${TRAMITE}/opinion/registrar/eliminar-archivo`;  

export const API_POST_OPCIONES_EVALUACION_GUARDAR = (TRAMITE: string, FILONUMBER: string) : string => `sat-t${TRAMITE}/solicitud/${FILONUMBER}/opinion/solicitar/agregar`;  


export const API_TERMINAR_OPCIONES_EVALUACION = (TRAMITE: string,NUMFOLIOTRAMITE:string) : string => `sat-t${TRAMITE}/solicitud/${NUMFOLIOTRAMITE}/opinion/solicitar/guardar`;  

/**
 * API para obtener las opciones de evaluación del tramite t220202.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/swagger-ui/index.html#/Evaluar-Solicitud/getOpcionesEvaluacion
 */
export const API_POST_OPCIONES_EVALUACION_A = (TRAMITE: string, NUMFOLIOTRAMITE: string): string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/evaluar/opciones-evaluacion`;

/**
 * API para generar el dictamen del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Dictamen/dictame…
 */
export const API_GET_DICTAMEN = `sat-t${TRAMITE}/solicitud/${IDSOLICITUDDICTAMEN}/dictamen/generar/criterios`;
 
/**
 * API para guardar el dictamen del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Dictamen/generar…
 */
export const API_POST_GUARDAR_DICTAMEN = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/generar/guardar`;
 
/**
 * API para iniciar el dictamen del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Dictamen/generar…
 */
export const API_GET_INICAR_DICTAMEN = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/generar/iniciar`;
 
/**
 * API para Consultar acuses de resolución del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Acuse/consulta-acuse-res…
 */
export const API_GET_ACUSES_RESOLUCION = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/funcionario/acuses-resoluciones`;
 
/**
 * API para Consultar dictamenes del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitudes/con…
 */
export const API_GET_DICTAMENES = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamenes`;
 
/**
 * API para Consultar requerimientos del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitudes/get…
 */
export const API_GET_REQUERIMIENTOS = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimientos`;
 
/**
 * API para Consultar documentos de solicitud del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitudes/con…
 */
export const API_GET_SOLICITUD_DOCUMENTOS = (TRAMITE: string, IDSOLICITUD: string) : string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/documentos`;
 
/**
 * API para Consultar tareas de solicitud del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitudes/get…
 */
export const API_GET_TAREAS_DOCUMENTOS = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/bitacora`;
 
/**
 * Id opinion que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const IDOPINION= '{idOpinion}';
 
/**
 * API para Consultar detalle de opinion del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitud/consu…
 */
export const API_GET_OPINION_DETALLE = `sat-t${TRAMITE}/tramite/opinion/${IDOPINION}/detalle`

/**
 * Id trámite que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const IDTRAMITEFOLIO= '{idTramiteFolio}';

/**
 * API para Consultar detalle  del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130102/swagger-ui/index.html#/Registro-Solicitud/consulta-detalle-by-numFolioTramite
 */
export const API_GET_TRAMITE_DETALLE = (TRAMITE: string, IDTRAMITEFOLIO: string) : string => `sat-t${TRAMITE}/tramite/${IDTRAMITEFOLIO}/detalle`

/**
 * Id resolucion que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const IDRESOLUCION= '{idResolucion}';

export const API_POST_GUARDAR_RESOLUCION = (TRAMITE: string, IDRESOLUCION: number) : string => `sat-t${TRAMITE}/confirmar-notificacion/resolucion/${IDRESOLUCION}/acuse/guardar`;

 
/**
 * Id dictamen que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const IDDICTAMEN= '{idDictamen}';
 
/**
 * API para Consultar detalle de dictamen del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitud/busca…
 */
export const API_GET_DICTAMEN_DETALLE = `sat-t${TRAMITE}/tramite/dictamen/${IDDICTAMEN}`
 
/**
 * Id observacion que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const IDOBSERVACION= '{idObservacion}';
 
/**
 * API para Consultar detalle de observacion del dictamen del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitud/get-B…
 */
export const API_GET_DICTAMEN_DETALLE_OBSERVACION = `sat-t${TRAMITE}/dictamen/observacion/${IDOBSERVACION}`
 
/**
 * DOCUMENTOMINIO para descargas.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const DOCUMENTOMINIO= '{documentoMinio}';
 
/**
 * API para Consultar url de descarga de dictamen.
 * @see  https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitud/consu…
 */
export const API_GET_DESCARGAR_ACUSE= `sat-t${TRAMITE}/documento-oficiales/${DOCUMENTOMINIO}`

/**
 * API para Consultar url de descarga de documentos.
 * @see  https://api-v30.cloud-ultrasist.net/api/digitalizacion/swagger-ui/index.html#/Carga-Documento/DownloadDocument
 */
export const API_GET_DESCARGAR_DOCUMENTOS= `digitalizacion/descargar/${DOCUMENTOMINIO}`
 
/**
 * IDREQUERIMIENTO para detalle de requerimiento.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const IDREQUERIMIENTO= '{idRequerimiento}';
 
/**
 * API para Consultar detalle de un requerimiento del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Consulta-Requerimiento…
 */
export const API_GET_REQUERIMIENTO_DETALLE = `sat-t${TRAMITE}/tramite/requerimiento/${IDREQUERIMIENTO}/detalle`
 
/**
 * API firmar
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Requerimiento/fi…
 */
export const API_POST_FIRMAR_DICTAMEN = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/generar/firmar`;
 
/**
 * API firmar
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Requerimiento/fi…
 */
export const API_POST_FIRMAR_REGISTRAR_DICTAMEN = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/solicitud/${NUMFOLIOTRAMITE}/opinion/registrar/firmar`;

export const API_POST_GURDER_REGISTRAR_DICTAMEN = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/solicitud/${NUMFOLIOTRAMITE}/opinion/registrar/guardar`;
 
 
/**
 * API para mostrar y firmar el dictamen
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Dictamen/mostra-…
 */
export const API_POST_MOSTRAR_FIRMAR = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/generar/mostrar-firmar`;
 
/**
 * API para generar el dictamen del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Dictamen/dictame…
 */
export const API_GET_DICTAMEN_CRITERIOS = (TRAMITE: string, IDSOLICITUDDICTAMEN: string) : string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUDDICTAMEN}/dictamen/generar/criterios`;
 
/**
 * API para consultar los sentidos disponibles
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Catalogos/consulta-senti…
 */
export const API_GET_SENTIDOS_DISPONIBLES = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/generar/sentidos-disponibles`;

 
/**
 * API para consultar los sentidos disponibles
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Catalogos/consulta-senti…
 */
export const API_GET_SENTIDOS_DISPONIBLES_VERIFICAR = (TRAMITE: string) : string => `sat-t${TRAMITE}/tramite/verificar/sentidos`;
 
 
/**
 * API para guardar el requerimiento del trámite generico
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Requerimiento/gu…
 */
export const API_POST_GUARDAR_REQUERIMIENTO = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/generar/guardar`;
 
/**
 * API para guardar el requerimiento del trámite 130118
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Generar-Requerimiento/…
 */
export const API_POST_GUARDAR_REQUERIMIENTO_MOSTRAR_FIRMA = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/generar/mostrar-firmar`;

/**
 * API para guardar el requerimiento del trámite 130118
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/swagger-ui/index.html#/Autorizar%20Requerimiento/mostrar-firma-autorizar-requerimiento
 */
export const API_POST_AUTORIZAR_REQUERIMIENTO_GUARDAR_OBSERVACION = (TRAMITE: string, NUMFOLIOTRAMITE: string): string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/observacion/guardar`;

/**
 * API para guardar el requerimiento del trámite 130118
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/swagger-ui/index.html#/Autorizar%20Requerimiento/Guardar%20observaci%C3%B3n
 */
export const API_POST_AUTORIZAR_REQUERIMIENTO_MOSTRAR_FIRMA = (TRAMITE: string, NUMFOLIOTRAMITE: string): string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/autorizar/mostrar-firma`;

/**
 * API para generar los documentos específicos del requerimiento del trámite 130118
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Generar-Requerimiento/…
 */
export const API_POST_DOCUMENTOS_ESPECIFICOS_REQ = (TRAMITE: string) : string => `sat-t${TRAMITE}/requerimiento/generar/documentos-especificos`;

/**
 * API para generar los documentos adicionales del requerimiento del trámite 220202
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/swagger-ui/index.html#/Generar-Requerimiento/consultar-documentos-especificos
 */
export const API_GET_DOCUMENTOS_ADICIONALES_REQ = (TRAMITE: string): string => `sat-t${TRAMITE}/requerimiento/generar/documentos-adicionales`;


 
/**
 * API para generar la firma del requerimiento del trámite 130118
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Generar-Requerimiento/…
 */
export const API_POST_FIRMAR_REQUERIMIENTO = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/generar/firmar`;

/**
 * API para generar la firma del requerimiento del trámite 130118
 * @see https://api-v30.cloud-ultrasist.net/api/tramite-flujo/swagger-ui/index.html#/Generar-Requerimiento/…
 */
export const API_POST_FIRMAR_AUTORIZAR_REQUERIMIENTO = (TRAMITE: string, NUMFOLIOTRAMITE: string): string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/autorizar/firmar`;

/**
 * API para generar el oficio del requerimiento del trámite 110101
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t110101/swagger-ui/index.html#/Generar-Requerimiento/guardar-oficio-requerimiento
 */
export const API_POST_OFICIO_REQUERIMIENTO = (TRAMITE: string, IDSOLICITUD: string) : string => `sat-t${TRAMITE}/${IDSOLICITUD}/requerimiento/oficio`;

/**
 * API para iniciar requerimiento trámite generico
 * @see /api/sat-t260203/tramite/{numFolioTramite}/requerimiento/autorizar/observacion/guardar
 */
export const API_POST_AUTORIZAR_OBSERVACION_REQUERIMIENTO = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/autorizar/observacion/guardar`; 

/**
 * API para iniciar requerimiento trámite generico
 * @see /api/sat-t260203/tramite/{numFolioTramite}/requerimiento/autorizar/observacion/guardar
 */
export const API_POST_VERIFICAR_OBSERVACION_REQUERIMIENTO = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/verificar/observacion`;

/**
 * API para guardar observacion 
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Autorizar-Dictamen
 */
export const API_POST_OBSERVACION_GUARDAR = `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/observacion/guardar`;

/**
 * API para iniciar requerimiento trámite generico
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Requerimiento/in…
 */
export const API_POST_INICIAR_REQUERIMIENTO = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/generar/iniciar`;

/**
 * API para iniciar autorizarRequerimiento trámite generico
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/swagger-ui/index.html#/Autorizar%20Requerimiento/autorizar-requerimiento-iniciar
 */
export const API_POST_INICIAR_VERIFICAR_REQUERIMIENTO = (TRAMITE: string, NUMFOLIOTRAMITE: string): string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/verificar/iniciar`;
 
/**
 * API para iniciar autorizarRequerimiento trámite generico
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/swagger-ui/index.html#/Autorizar%20Requerimiento/autorizar-requerimiento-iniciar
 */
export const API_POST_INICIAR_AUTORIZAR_REQUERIMIENTO = (TRAMITE: string, NUMFOLIOTRAMITE: string): string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/autorizar/iniciar`;

/**
 * API para detalle de la opinion tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitud/consu…
 */
export const API_GET_OPINION = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/opiniones`;
 
/**
 * API para obtener documento de resolucion generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Dictamen/guardar…
 */
export const API_POST_REQUERIMIENTO_GUARDAR = (TRAMITE: string, IDREQUERIMIENTO: string) : string => `sat-t${TRAMITE}/confirmar-notificacion/requerimiento/${IDREQUERIMIENTO}/acuse/guardar`;
 
/**
 * API para obtener la notificacion de los acuses recibidos.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Confirmar-Notificacion/c…
 */
export const API_GET_ACUSES_RECIBOS_NOTIFICACION = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/acuses-recibos-notificacion`;

/**
 * API para obtener la notificacion de los acuses recibidos.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130102/swagger-ui/index.html#/Confirmar-Notificacion/consulta-acuse-recibo-notificacion
 */
export const API_GET_ACUSES_RECIBOS = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/acuses-recibos-notificacion`;
 
/**
 * API para iniciar la confirmación de notificación del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Confirmar-Notificacion/i…
 */
export const API_GET_INICIAR_CONFIRMACION_NOTIFICACION = (TRAMITE:string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/confirmar-notificacion/iniciar`;
 
/**
 * API para obtener documento de resolucion generico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Dictamen/guardar…
 */
export const API_POST_RESOLUCION_GUARDAR = (TRAMITE: string, IDRESOLUCION: string) : string => `sat-t${TRAMITE}/confirmar-notificacion/resolucion/${IDRESOLUCION}/acuse/guardar`;
 
/**
 * API para cargar documentos.
 * @see https://api-v30.cloud-ultrasist.net/api/digitalizacion/cargar
 */
export const API_POST_CARGAR_DOCUMENTOS = `digitalizacion/cargar`
 
/**
 *
 * @see https://api-v30.cloud-ultrasist.net/api/digitalizacion/documentos/LEQI8101314S7-ba0fedcf-0e76-4165-…
 */
export const API_POST_DOCUMENTO_REFERENCIA_SOLICITUD = (REFRERENCIASOLICITUD: string) : string => `digitalizacion/documentos/${REFRERENCIASOLICITUD}`;
/**
 * API para obtener evaluar iniciar tramite 130118.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Evaluar-Solicitud/getOpc…
 */
export const API_GET_EVALUAR_INICIAR = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/evaluar/iniciar`;
 
/**
 * API para prepar evaluacion tramite 130118.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Evaluar-Solicitud/getOpc…
 */
export const API_GET_EVALUAR_MOSTRAR = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/evaluar/mostrar`;
 
/**
 * API para consulta de envio digital 130118.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitud/get-d…
 */
export const API_GET_ENVIO_DIGITAL = (NUMFOLIOTRAMITE: string) : string => `tramite/${NUMFOLIOTRAMITE}/envio-digital/detalle`;
 
/**
 * API para Consultar que tabs mostrar 130118.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitud/estad…
 */
export const API_GET_TABS = (TRAMITE: string, IDSOLICITUD: string) : string => `sat-t${TRAMITE}/tramite/solicitud/${IDSOLICITUD}/estado`;
 
/**
 * API para Consultar los datos del solicitante
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Consulta-Solicitud/estad…
 */
export const API_GET_DATOS_SOLICITANTE = (TRAMITE: string, IDSOLICITUD: string) : string => `sat-t${TRAMITE}/tramite/${IDSOLICITUD}/solicitud/solicitante`;
 
/*
 * API para obtener el catálogo de immex
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/servicios-immex
 */
export const CATALOGO_IMMEX = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/servicios-immex`;
 
/*
 * API para obtener el catálogo de estados
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/estados
 */
export const CATALOGO_ESTADOS = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/estados`;
 
/*
 * API para obtener el catálogo de países
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/paises
 */
export const CATALOGO_PAISES = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/paises`;

/*
 * API para obtener el catálogo de países
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/paises
 */
export const CATALOGO_PAISES_DESTINO = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/paises-destino/SGPPRO004/TICERM.SOA`;

/*
  * API para obtener el catálogo de monedas
  * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/monedas
  */
 export const CATALOGO_UMC = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/unidades-medida-comercial`;

/*
 * API para obtener el catálogo de NICO
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80203/catalogo/nicos/producto-exportacion/72162101
 
 */
export const CATALOGO_NICO = (TRAMITE: string, claveFraccion: string) : string => `sat-t${TRAMITE}/catalogo/nicos/producto-exportacion/${claveFraccion}`;
/**
 * API para obtener el estado de la solicitud del tramite 130118.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Registro-Solicitud/gener…
 */
export const API_POST_CADENA_ORIGINAL = (IDSOLICITUD: string, PROCEDURE: number): string => `sat-t${PROCEDURE}/solicitud/${IDSOLICITUD}/genera-cadena-original`;
/**
 * API para firmar la solicitud del tramite 130118.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Registro-Solicitud/firmar
 */
export const API_POST_FIRMA = (IDSOLICITUD: string, PROCEDURE: number): string => `sat-t${PROCEDURE}/solicitud/${IDSOLICITUD}/firmar`;
 
/** API para guardar la solicitud del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/solicitud/guardar
 */
export const API_POST_SOLICITUD_GUARDAR = (PROCEDURE: string): string => `sat-t${PROCEDURE}/solicitud/guardar`;

/** API para guardar la solicitud del tramite generico.
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/solicitud/guardar
 */
export const API_POST_SOLICITUD_GUARDAR_PARCIAL = (PROCEDURE: string): string => `sat-t${PROCEDURE}/solicitud/guardar-parcial`;
/*
 * API para obtener la representación federal por clave de entidad
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/representacion-federal/{cveEntidad}
 */
export const CATALOGO_REPRESENTACION_FEDERAL = (TRAMITE: string, CVEENTIDAD: string): string =>
  `sat-t${TRAMITE}/catalogo/representacion-federal/${CVEENTIDAD}`;

/*
 * API para obtener la representación federal por clave de entidad
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/representacion-federal/{cveEntidad}
 */
export const CATALOGO_REPRESENTACION_FEDERAL_10 = (TRAMITE: string, CVEENTIDAD: string): string =>
  `sat-t${TRAMITE}/representacion-federal/${CVEENTIDAD}`;

/*
 * API para obtener el tipo de factura
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/tipo-factura
 */
export const CATALOGO_TIPO_FACTURA = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/tipo-factura`;

/*
 * API para obtener la unidad de medida de la masa bruta
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/unidad-medida-masa-bruta
 */
export const CATALOGO_UNIDAD_MASA_BRUTA = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/unidades-medidas`;

/*
 * API para obtener el catálogo de países
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/paises/bloques
 */
export const CATALOGO_PAISES_BLOQUE = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/paises/bloques`;

/*
 * API para obtener el catálogo de países
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/paises/bloques
 */
export const AGREGAR_PRODUCTOR = (): string => `sat-t${TRAMITE}/solicitud/agregar-productor`;


/*
 * API para obtener el catálogo de idiomas
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/idioma
 */
export const CATALOGO_IDIOMA = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/idioma`;

/*
 * API para obtener el catálogo de medios de transporte
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/medio-transporte
 */
export const CATALOGO_MEDIO_TRANSPORTE = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/medio-transporte`;

/*
 * API para obtener unidades de medida comercial
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/unidades-medida-comercial
 */
export const UNIDADES_MEDIDA_COMERCIAL = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/unidades-medida-comercial`;

/*
 * API para obtener el catálogo de entidades federativas
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/entidades-federativas
 */
export const CATALOGO_ENTIDADES_FEDERATIVAS = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/entidades-federativas`;
/*
 * API para obtener el catálogo de tratados y acuerdos
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/tratados-acuerdos
 */
export const CATALOGO_TRATADOS_ACUERDOS = (TRAMITE: string, IDETIPOTRATADOACUERDO: string): string => `sat-t${TRAMITE}/catalogo/${IDETIPOTRATADOACUERDO}/tratados-acuerdos`;

/*
 * API para obtener el catálogo de tratados y acuerdos
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/tratados-acuerdos
 */
export const CATALOGO_TRATADO_ACUERDOS = (TRAMITE: string, IDETIPOTRATADOACUERDO: string): string => `sat-t${TRAMITE}/catalogo/tratados-o-acuerados/${IDETIPOTRATADOACUERDO}`;


/*
 * API para obtener el catálogo de tratados y acuerdos
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/paises-destino
 */
export const PAIS_DESTINO = (TRAMITE: string, PAYLOAD_DATOS: { cveTratado: string , cvePais: string}): string => `sat-t${TRAMITE}/catalogo/paises-destino/${PAYLOAD_DATOS.cveTratado}/${PAYLOAD_DATOS.cvePais}`;
 
/*
 * API para obtener el catálogo de tratados y acuerdos
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/paises-destino
 */
export const CLASIFICACION_REGIMEN = (TRAMITE: string, PAYLOAD_DATOS: { tramite: string , id: string}): string => `sat-t${TRAMITE}/catalogo/tramite/${PAYLOAD_DATOS.tramite}/regimenes/${PAYLOAD_DATOS.id}/clasificacion`;

/**
 * Genera dinámicamente la ruta para el catálogo de tratados/acuerdos de la UE por bloque.
 * 
 * Esta función construye el endpoint específico para acceder al catálogo de tratados
 * comerciales y acuerdos internacionales de la Unión Europea organizados por bloques
 * comerciales, adaptado al trámite especificado.
 * 
 * @param TRAMITE - Identificador del trámite (ej: '110219', '130118') que determina
 *                  el contexto y versión del catálogo a consultar
 * 
 * @returns {string} Ruta formateada del endpoint para consultar tratados/acuerdos UE
 * 
 * this.http.get(`${BASE_URL}/${rutaTratados}`)
 *   .subscribe(tratados => {
 *     this.tratadosUE = tratados;
 *   });
 * ```
 * 
 * @see COMUN_URL.BASE_URL
 * @since 1.0.0
 * @author Sistema VUCEM
 */
export const CATALOGO_TRATADO_ACUERDO = (TRAMITE: string, IDETIPOTRATADOACUERDO: string) : string => `sat-t${TRAMITE}/catalogo/tratado-acuerdo/${IDETIPOTRATADOACUERDO}/bloque`;

/**
 * Genera la ruta de la API para obtener el catálogo de países de México según el trámite especificado.
 *
 * @param TRAMITE - El identificador del trámite para el cual se requiere el catálogo.
 * @returns La ruta de la API como una cadena de texto.
 */
export const CATALOGO_PAISES_MEXICO = (TRAMITE: string,IDETIPOTRATADOACUERDO: string) : string => `sat-t${TRAMITE}/catalogo/paises-maxico/${IDETIPOTRATADOACUERDO}`;

/**
 * Genera la ruta de la API para obtener la descripción de la fracción HTS de EE.UU. 
 * según el trámite y el tipo de tratado/acuerdo especificados.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param IDETIPOTRATADOACUERDO - Identificador del tipo de tratado o acuerdo.
 * @returns La ruta de la API como cadena de texto.
 */
export const FRACCION_HTS = (TRAMITE: string, IDETIPOTRATADOACUERDO: string): string => `sat-t${TRAMITE}/catalogo/fraccion-hts-usa/${IDETIPOTRATADOACUERDO}/descripcion`;

/**
 * Construye la ruta para el catálogo de medios de transporte disponibles.
 * 
 * Genera el endpoint para consultar los diferentes medios de transporte
 * (terrestre, marítimo, aéreo, ferroviario) disponibles y válidos para
 * el trámite especificado, incluyendo sus características y restricciones.
 * 
 * @param TRAMITE - Identificador del trámite que determina los medios de transporte aplicables
 * 
 * @returns {string} Endpoint para consultar el catálogo de medios de transporte
 * 
 * @example
 * 
 * this.transporteService.getMediosTransporte(rutaTransporte)
 *   .subscribe(medios => {
 *     this.mediosDisponibles = medios.filter(m => m.activo);
 *   });
 * ```
 * 
 * @see COMUN_URL.BASE_URL
 * @since 1.0.0
 * @author Sistema VUCEM
 */

/*
 * API para obtener el catálogo de SELECCIONAR_REGLA
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/regla-3rs-immex
 */
export const CATALOGO_SELECCIONAR_REGLA = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/regla-3rs-immex`;

/*
 * API para obtener el catálogo de sectores
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/sectores
 */
export const CATALOGO_SECTORES = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/sectores`;

/*
 * API para obtener la unidad de medida de la masa bruta
 * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/se/unidades-medidas
 */
export const CATALOGO_UNIDAD_DE_MASA_BRUTA = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/se/unidades-medidas`;

/*
  * API para obtener el catálogo de tratados y acuerdos por país
  * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/tratado-acuerdo
  */
export const CATALOGO_TRATADO_ACUERDO_PAIS = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/tratados-acuerdos`;

/*
  * API para obtener el catálogo de tratados y acuerdos por país
  * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/tratado-acuerdo
  */
export const CATALOGO_TRATADO_ACUERDOS_PAIS = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/tratados-acuerdos`;

/*
  * API para obtener el catálogo de tratados y acuerdos por país
  * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/tratado-acuerdo
  */
export const CATALOGO_TRATADO_ACUERDO_PAIS_TITRAC = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/TITRAC.TA/tratados-acuerdos`;

/*
  * API para obtener el catálogo de tratados y acuerdos por país
  * @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/tratado-acuerdo
  */
export const CATALOGO_TRATADO_ACUERDO_PAIS_CON_ID = (TRAMITE: string, ID: string) : string => `sat-t${TRAMITE}/catalogo/${ID}/tratados-acuerdos`;


/**
 * 
 * @param TRAMITE 
 * @param CLAVEBLOQUE 
 * @returns 
 */
export const CATALOGO_PAIS_BLOQUE_CLAVE = (TRAMITE: string, CLAVEBLOQUE: string) : string => `sat-t${TRAMITE}/catalogo/tratado/${CLAVEBLOQUE}/paises`;

/**
 * API para descargar datos solicitud en evaluacion.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t110101/swagger-ui/index.html#/Evalua-Solicitud/excel-solicitud
 */
export const API_GET_DESCARGAR_SOLICITUD = (TRAMITE: string, IDSOLICITUD: string) : string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/excel`;
 
/* Genera la URL del endpoint para obtener el catálogo de tratados o acuerdos de un tipo específico.
 * Recibe como parámetros el tipo de trámite (`TRAMITE`) y el ID del tipo de tratado/acuerdo (`IDETIPOTRATADOACUERDO`).
 * Devuelve un string con la ruta completa del recurso en el backend.
 */
export const CATALOGO_TRATADO_ACUERDO_NEW = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/tratados-acuerdos`;

/**
 * Genera la URL del endpoint para obtener la lista de países asociados a un tratado específico.
 * Recibe como parámetros el tipo de trámite (`TRAMITE`) y el ID del tratado (`IDTRATADO`).
 * Devuelve un string con la ruta completa del recurso en el backend.
 */
export const CATALOGO_ACUERDOS = (TRAMITE: string, IDTRATADO: string) : string => `sat-t${TRAMITE}/catalogo/tratado/${IDTRATADO}/paises`;

/**
 * Genera la URL del endpoint para obtener los tratados o acuerdos asociados a un país específico.
 * Recibe como parámetros el tipo de trámite (`TRAMITE`) y la clave del país (`CVEPAIS`).
 * Devuelve un string con la ruta completa del recurso en el backend.
 */
export const CATALOGO_ACUERDOS_PAIS = (TRAMITE: string, CVEPAIS: string) : string => `sat-t${TRAMITE}/catalogo/pais/${CVEPAIS}/tratados-acuerdos`;

/**
 *API para obtener los documentos del tramite generico
 */

export const API_GET_DOCUMENTOS = (TRAMITE: string, ESPECIFICO: boolean) : string => `sat-t${TRAMITE}/solicitud/documentos?especifico=${ESPECIFICO}`;

/*
 * API para obtener el catálogo de SCIAN
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/scian
 */
export const CATALOGO_SCIAN = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/scian`;

/*
 * API para obtener el catálogo de regímenes
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/regimenes
 */
export const CATALOGO_REGIMENES = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/regimenes`;

/*
 * API para obtener el catálogo de regímenes
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/regimenes
 */
export const CATALOGO_REGIMENES_CLADIFICACION = (TRAMITE: string, REGIMEN_ID: string): string => `sat-t${TRAMITE}/catalogo/regimenes/${REGIMEN_ID}/clasificacion`;


/*
 * API para obtener el catálogo de aduanas
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/aduanas
 */
export const CATALOGO_ADUANAS = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/aduanas`;

/*
 * API para obtener el catálogo de clasificación del producto
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/clasificacion-del-producto/260204
 */
export const CATALOGO_CLASIFICACION_PRODUCTO = (TRAMITE: string, PROCEDIMIENTO: string): string => `sat-t${TRAMITE}/catalogo/clasificacion-del-producto/${PROCEDIMIENTO}`;

/*
 * API para obtener el catálogo específico de clasificación del producto
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/especificar/clasificacion-del-producto/45
 */
export const CATALOGO_ESPECIFICAR_CLASIFICACION_PRODUCTO = (TRAMITE: string, ID_CLASIFICACION: string): string => `sat-t${TRAMITE}/catalogo/especificar/clasificacion-del-producto/${ID_CLASIFICACION}`;

/*
 * API para obtener el catálogo de tipos de producto por trámite
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/tramite/260401/tipos-producto
 */
export const CATALOGO_TIPOS_PRODUCTO = (TRAMITE: string, PROCEDIMIENTO_TIPO: string): string => `sat-t${TRAMITE}/catalogo/tramite/${PROCEDIMIENTO_TIPO}/tipos-producto`;

/*
 * API para obtener el catálogo de forma farmacéutica
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/forma-farmaceutica
 */
export const CATALOGO_FORMA_FARMACEUTICA = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/forma-farmaceutica`;

/*
 * API para obtener el catálogo de enum estado físico mercancía
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/enum/ENU_ESTADO_FISICO_MERCANCIA
 */
export const CATALOGO_ESTADO_FISICO_MERCANCIA = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/enum/ENU_ESTADO_FISICO_MERCANCIA`;

/*
 * API para obtener el catálogo de municipios/delegaciones por entidad federativa
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/entidad-federativa/AGS/municipios-delegaciones
 */
export const CATALOGO_MUNICIPIOS_DELEGACIONES = (TRAMITE: string, CVE_ENTIDAD: string): string => `sat-t${TRAMITE}/catalogo/entidad-federativa/${CVE_ENTIDAD}/municipios-delegaciones`;

/*
 * API para obtener el catálogo de localidades por municipio
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/municipio/15002/localidades
 */
export const CATALOGO_LOCALIDADES = (TRAMITE: string, CVE_MUNICIPIO: string): string => `sat-t${TRAMITE}/catalogo/municipio/${CVE_MUNICIPIO}/localidades`;

/*
 * API para obtener el catálogo de colonias por municipio/delegación
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/municipio-delegacion/13074/colonias
 */
export const CATALOGO_COLONIAS = (TRAMITE: string, CVE_MUNICIPIO_DELEGACION: string): string => `sat-t${TRAMITE}/catalogo/municipio-delegacion/${CVE_MUNICIPIO_DELEGACION}/colonias`;

/**
 *  * API para obtener el catálogo de codigo
 *  https://api-v30.cloud-ultrasist.net/api/sat-t260203/catalogo/codigo-postal/03005/colonias
 */
export const CATALOGO_CODIGO = (TRAMITE: string, CVE_MUNICIPIO: string): string => `sat-t${TRAMITE}/catalogo/codigo-postal/${CVE_MUNICIPIO}/colonias`;
/*
 * API para obtener el catálogo de bancos
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/bancos
 */
export const CATALOGO_BANCOS = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/bancos`;

/*
 * API para obtener el catálogo de años de oficio de asignación
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260204/catalogo/anios-oficio-asignacion
 */
export const CATALOGO_ANOS = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/anios-oficio-asignacion`;

/*
 * API para obtener el catálogo de usos específico de mercancía por trámite
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260203/catalogo/tramite/usos-especifico-mercancia/260203
 */
export const CATALOGO_USOS_ESPECIFICO_MERCANCIA = (TRAMITE: string, PROCEDIMIENTO: string): string =>
  `sat-t${TRAMITE}/catalogo/tramite/usos-especifico-mercancia/${PROCEDIMIENTO}`;

/*
  * API para obtener la descripción de una fracción arancelaria
 */
export const API_OBTENER_FRACCIONES_ARANCELARIAS = (TRAMITE: number, CLAVE: string): string => `sat-t${TRAMITE}/solicitud/fraccion-descripcion?clave=${CLAVE}&idTipoTramite=${TRAMITE}`;

/*
  * API para obtener la unidad de medida por fracción arancelaria
 */
export const API_OBTENER_UMT = (TRAMITE: number, cveFraccion: string): string => `sat-t${TRAMITE}/solicitud/unidad-medida?cveFraccion=${cveFraccion}`;

/**
 * 
 * @param TRAMITE 
 * @param rfc 
 * @returns 
 */
export const OPCIONES_PRELLENADO_SOLICITUD = (TRAMITE: number, rfc: string): string => `sat-t${TRAMITE}/solicitud/recientes/${rfc}`
/*
  * API para obtener la tipo de empresa
 */
export const TIPO_EMPRESA = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/tipo-empresa`;

/*API para obtener el catálogo de fracciones arancelarias*/
export const API_FRACCIONES_ARANCELARIAS = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/fracciones-arancelarias`;

export const FRACCIONES_ARANCELARIAS = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/tramite/TITPEX.130106/pexim/fracciones-arancelarias`;

/*API para obtener el catálogo de unidades de medida tarifaria por clasificación*/
export const API_UMT = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/fraccion-arrancelaria/${CLASIFICACION}/unidades-medidas-tarifarias`;

/** API para prellenadasDatos la solicitud del tramite generico.
 */
export const API_POST_PARCHE_PRELLENADAS = (TRAMITE: number, idSolicitud: number): string => `sat-t${TRAMITE}/solicitud/mostrar?idSolicitud=${idSolicitud}`;

/**
 * API para obtener la solicitud por ID
 */
export const API_GET_SOLICITUD = (TRAMITE: string, IDSOLICITUD: string) : string => `sat-t${TRAMITE}/solicitud-servicio/${IDSOLICITUD}`;
 
export const PAISES_POR_BLOQUE = (TRAMITE: string, CLAVEBLOQUE: string) : string => `sat-t${TRAMITE}/catalogo/paises-por-bloque/${CLAVEBLOQUE}`;

/*API para obtener el catálogo de clasificaciones de régimen*/
export const CLASSIFICACIONES_REGIMEN = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/clasificaciones-regimen/${CLASIFICACION}`;


export const API_PEXIM_FRACCION_ARANCELARIA = (TRAMITE: string, TITPEX_ID: string): string => `sat-t${TRAMITE}/catalogo/tramite/${TITPEX_ID}/pexim/fracciones-arancelarias`;

export const API_PEXIM_FRACCION_ARANCELARIA_10 = (TRAMITE: string, TITPEX_ID: string): string => `sat-t${TRAMITE}/tramite/${TITPEX_ID}/pexim/fracciones-arancelarias`;


export const API_UNIDADES_MEDIDA_TARIFARIA = (TRAMITE: string, ID: string): string => `sat-t${TRAMITE}/catalogo/fraccion-arrancelaria/${ID}/unidades-medidas-tarifarias`;

export const API_UNIDADES_MEDIDA_TARIFARIA_10 = (TRAMITE: string, ID: string): string => `sat-t${TRAMITE}/fraccion-arrancelaria/${ID}/unidades-medidas-tarifarias`;

// export const API_PAISES_POR_BLOQUE = (TRAMITE: string, ID: string): string => `sat-t${TRAMITE}/catalogo/paises-por-bloque/${ID}`;

export const API_CATALOGOS_PAISES_TODOS = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/paises-todos`;

export const API_MOSTRAR_PARTIDAS_SOLICITUD = (TRAMITE: string, ID_SOLICITUD: number): string => `sat-t${TRAMITE}/solicitud/mostrar/partidas?idSolicitud=${ID_SOLICITUD}`;

export const REGIMEN_CLASSIFICACIONES = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/tramite/TITPEX.130108/regimenes/${CLASIFICACION}/clasificacion`;

export const REGIMEN_CLASSIFICACIONES_10 = (TRAMITE: string) : string => `sat-t${TRAMITE}/tramite/TITPEX.130115/regimenes/${CLASIFICACION}/clasificacion`;

/**
 * API para guardar la solicitud
 */
export const API_POST_ACTUALIZAR_SOLICITUD = (TRAMITE: string, ID_SOLICITUD: string): string => `sat-t${TRAMITE}/solicitud/${ID_SOLICITUD}/actualizar`;
/**
 * Genera la ruta del endpoint para consultar el catálogo de
 * *Actividad Productiva PROSEC* correspondiente al trámite indicado.
 */
export const API_ACTIVIDAD_PRODUCTIVA_PROSEC = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/actividad-productiva-prosec`;

/**
 * Construye el endpoint para obtener el catálogo de
 * *Representación Federal de México*, filtrado por trámite y por estado.
 *
 * La ruta es generada dinámicamente con base en los parámetros recibidos.
 */
export const API_REPRESENTACION_FEDERAL_PARAM = (TRAMITE: string, ESTADO: string): string => `sat-t${TRAMITE}/catalogo/representacion-federal/${ESTADO}`;

/**
 * API para obtener el catálogo de régimen enum por trámite.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t140103/catalogo/regimen-enum
 */
export const CATALOGO_REGIMEN_ENUM = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/regimen-enum`;

/**
 * API para obtener el catálogo de tipo de mecanismo de asignación por trámite.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t140103/catalogo/tipo-mecanismo-asignacion
 */
export const CATALOGO_TIPO_MECANISMO_ASIGNACION = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/tipo-mecanismo-asignacion`;

/**
 * API para obtener el catálogo de nombres de producto por trámite.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t140103/catalogo/nombre-producto
 */
export const CATALOGO_NOMBRE_PRODUCTO = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/nombre-producto`;

/**
 * API para obtener el catálogo de nombres de subproducto por trámite.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t140103/catalogo/nombre-subproducto
 */
export const CATALOGO_NOMBRE_SUBPRODUCTO = (TRAMITE: string): string =>`sat-t${TRAMITE}/catalogo/nombre-subproducto`;

/**
 * API para obtener el catálogo de representación federal por trámite.
 * @see https://api-v30.cloud-ultrasist.net/api/140103/catalogo/representacion-federal
 */

export const REPRESENTACION_FEDERAL_CATALOGO = (TRAMITE: string): string =>`sat-t${TRAMITE}/catalogo/representacion-federal`;
/*
 * API para obtener el catálogo de enum estado físico mercancía
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t90202/catalogo/sectores
 */

export const CATALOGO_SECTOR = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/sectores`;
/**
 * Genera la ruta de la API para obtener el catálogo de años de oficio de asignación,
 * utilizando el identificador del trámite proporcionado.
 *
 * @param TRAMITE - Identificador del trámite a utilizar en la ruta.
 * @returns La ruta de la API como cadena de texto.
 */
export const OFICIO_ASIGNACION = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/anios-oficio-asignacion`;

/**
 * Genera el endpoint para consultar las unidades de medida tarifarias
 * asociadas a una fracción arancelaria específica dentro de un trámite.
 *
 * La URL se construye dinámicamente utilizando el identificador del trámite
 * y el ID de la fracción arancelaria.
 *
 * @param {string} TRAMITE - Identificador del trámite que forma parte de la ruta.
 * @param {string} ID - Identificador de la fracción arancelaria.
 *
 * @returns {string} Endpoint completo para obtener las unidades de medida tarifarias.
 */
export const API_UNIDADES_MEDIDAS_TARIFARIAS = (TRAMITE: string, ID: string): string => `sat-t${TRAMITE}/fraccion-arrancelaria/${ID}/unidades-medidas-tarifarias`;

/**
 * Genera el endpoint utilizado para realizar una búsqueda de
 * fracciones arancelarias mediante autocompletado.
 *
 * El endpoint se construye dinámicamente con el identificador del trámite
 * y el parámetro de búsqueda proporcionado.
 *
 * @param {string} TRAMITE - Identificador del trámite para construir la ruta.
 * @param {string} ID - Valor utilizado como criterio de búsqueda en el autocompletado.
 *
 * @returns {string} Endpoint completo para consultar fracciones arancelarias con autocompletado.
 */
export const API_FRACCIONES_ARANCELARIAS_AUTO_COMPLETE = (TRAMITE: string, ID: string): string => `sat-t${TRAMITE}/catalogo/fracciones-arancelarias/auto-complete/${ID}`;

/**
 * Consulta los tipos de requerimiento para la solicitud.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/swagger-ui/index.html#/Cat%C3%A1logos/consulta-tipos-requerimiento
 */
export const API_GET_CATALOGO_TIPOS_REQUERIMIENTO = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/tipos-requerimiento`;

/**
 * Consulta las areas solicitantes .
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/swagger-ui/index.html#/Cat%C3%A1logos/consulta-areas-solicitantes
 */
export const API_GET_CATALOGO_AREAS_SOLICITANTES = (TRAMITE: string, FOLIO: string): string => `sat-t${TRAMITE}/catalogo/areas-solicitantes/${FOLIO}`;

/**
 * @description Endpoint de catálogo de estado de unidades administrativas.
 */
export const API_ESTADO_UNIDADES_ADMINISTRATIVAS = (TRAMITE: string, ID: string): string => `sat-t${TRAMITE}/catalogo/estado/dependencia/unidades-administrativas/${ID}`;

/**
 * @description Endpoint de catálogo de representación federal vecina.
 */
export const CATALOGO_REPRESENTACION_FEDERAL_VECINA = (TRAMITE: string, CLAVEESTADO: string): string => `sat-t${TRAMITE}/catalogo/representacion-federal/vecina/${CLAVEESTADO}`;

/**
 * Genera la ruta de la API para buscar datos de una solicitud específica según el trámite proporcionado.
 *
 * @param TRAMITE - El identificador del trámite para el cual se desea buscar la solicitud.
 * @returns La ruta de la API como una cadena de texto, en el formato `sat-t{TRAMITE}/solicitud/buscar`.
 */
export const BUSCAR_DATOS = (TRAMITE: string): string => `sat-t${TRAMITE}/solicitud/buscar`;

/*
 * API para guardar la solicitud
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t260501/solicitud/guardar
 */
export const GUARDAR_SOLICITUD = (TRAMITE: string): string => `sat-t${TRAMITE}/solicitud/guardar`;

/**
 * Generates the API endpoint URL for pre-filling documents.
 * @param TRAMITE - The procedure identifier
 * @param IDSOLICITUD - The request ID
 * @param especifico - Whether the request is specific
 * @returns The formatted API endpoint URL
 */
export const API_POST_PRE_LLENADO_DOCUMENTOS = (TRAMITE: string, IDSOLICITUD: string, especifico: boolean) : string => `sat-t${TRAMITE}/solicitud/documentos?idSolicitud=${IDSOLICITUD}&especifico=${especifico}`;

/** Construye la ruta del catálogo de unidades de medida para el trámite indicado.
 *  Devuelve la URL formada dinámicamente usando el identificador del trámite. */
export const UNIDADES_MEDIDA_CATALOGO = (TRAMITE: string): string =>`sat-t${TRAMITE}/catalogo/tramite/${TRAMITE}/unidades-medida-comercial`;

/*
* API para obtener el catálogo de unidad de medida
* @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/unidad-de-medida
*/
export const CATALOGO_UNIDAD_DE_MEDIDA = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/unidades-medida-comercial`;

/*
* API para obtener el catálogo de fracción arancelaria divisiones
* @see https://api-v30.cloud-ultrasist.net/api/procedureID/catalogo/fraccion-arancelaria/divisiones
*/
export const FRACCION_ARANCELARIA_DIVICIONES = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/fraccion-arancelaria/diviciones`;

/**
 * API para obtener el catálogo de esquema regla
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130103/catalogo/esquema-regla/TITPEX.130103/98020004/02/04/octava
 */
export const CATALOGO_ESQUEMA_REGLA = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/esquema-regla/TITPEX.130103/98020004/02/04/octava`;

/**
 * API para obtener los datos de asignación de una solicitud específica según el trámite proporcionado.
 * @param TRAMITE - El identificador del trámite para el cual se desea obtener los datos de asignación.
 */
export const BUSCAR_OBTENER_DATOS = (TRAMITE: string): string => `sat-t${TRAMITE}/solicitud/buscar-obtener-datos-asignacion`;


 /** API para obtener los trámites asociados a un trámite principal.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Registro-Solicitud/gener…
 */
export const API_OBTENER_TRAMITES_ASOCIADOS = (TRAMITE: number, folio: string): string => `sat-t${TRAMITE}/solicitud/tramites-asociados?folio=${folio}`;

/**
 * API para obtener documentos prellenados.
 * @param TRAMITE - Identificador del trámite.
 * @param IDSOLICITUD - ID de la solicitud.
 * @param especifico - Indica si es específico.
 * @returns URL del endpoint.
 */
export const API_GET_LLENADO_DOCUMENTOS = (TRAMITE: string, IDSOLICITUD: string, especifico: boolean): string => 
  `sat-t${TRAMITE}/solicitud/documentos?idSolicitud=${IDSOLICITUD}&especifico=${especifico}`;

/**
 * @descripcion
 * Endpoint para registrar o consultar los acuses de resoluciones de un trámite específico.
 * @param numFolioTramite - Número de folio del trámite.
 * @param tramite - Identificador del trámite.
 * @returns Ruta de la API para acuses de resoluciones.
 */
export const API_POST_ACUSE_RESOLUCIONES = (numFolioTramite: string, tramite: number): string => `sat-t${tramite}/tramite/${numFolioTramite}/solicitante/acuses-resoluciones`;

/**
 * @descripcion
 * Endpoint para obtener o generar un documento específico a partir de su identificador en MinIO.
 * @param documento_minio - Identificador del documento en MinIO.
 * @returns Ruta de la API para el documento solicitado.
 */
export const API_POST_ACUSE_DOCUMENTO = (documento_minio: string): string => `generador-documento/tramite/documento/${documento_minio}`;

/**
 * API para mostrar y firmar el dictamen
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Generar-Dictamen/mostra-…
 */
export const API_POST_AUTORIZAR_MOSTRAR_FIRMAR = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/requerimiento/autorizar/mostrar-firma`;

/** API para guardar las opciones de evaluación
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Opinion-Solicitud/solic…
 */
export const API_POST_OPCIONES_EVALUACION_GUARDAR_801 = (TRAMITE: string, FILONUMBER: string) : string => `sat-t${TRAMITE}/${FILONUMBER}/opinion/solicitar/agregar`; 

/** API para guardar las opciones de evaluación
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Opinion-Solicitud/solic…
 */
export const API_POST_OPCIONES_EVALUACION_GUARDAR_130 = (TRAMITE: string, FILONUMBER: string) : string => `sat-t${TRAMITE}/${FILONUMBER}/opinion/solicitar/agregar`; 


/** API para terminar las opciones de evaluación
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Opinion-Solicitud/solic…
 */
export const API_TERMINAR_OPCIONES_EVALUACION_801 = (TRAMITE: string,NUMFOLIOTRAMITE:string) : string => `sat-t${TRAMITE}/${NUMFOLIOTRAMITE}/opinion/solicitar/guardar`; 


/** API para terminar las opciones de evaluación
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Opinion-Solicitud/solic…
 */
export const API_TERMINAR_OPCIONES_EVALUACION_130 = (TRAMITE: string,NUMFOLIOTRAMITE:string) : string => `sat-t${TRAMITE}/${NUMFOLIOTRAMITE}/opinion/solicitar/guardar`; 

/**
 * API para iniciar opinion evaluar iniciar tramite 80101.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80101/swagger-ui/index.html#/Opinion-Evaluar/getOpinionEvaluarIniciar
 */
export const API_GET_OPINION_EVALUAR_INICIAR = (TRAMITE: string, FILO_NUMBER: string) : string => `sat-t${TRAMITE}/solicitud/${FILO_NUMBER}/solicitar/opinion/mostrar`;

/** API para obtener los sentidos disponibles para la opinión.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80101/swagger-ui/index.html#/Opinion-Registrar/getOpinionRegistrarSentidosDisponibles
 */
export const API_GET_RADIO_OPINION=(TRAMITE:string):string=>`sat-t${TRAMITE}/opinion/registrar/sentidos-disponibles`;

/** API para guardar la opinion evaluar tramite 80101.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80101/swagger-ui/index.html#/Opinion-Evaluar/postOpinionEvaluarGuardar
 */
export const API_POST_OPINION_EVALUAR_GUARDAR = (TRAMITE: string, FILO_NUMBER: string) : string => `sat-t${TRAMITE}/${FILO_NUMBER}/opinion/registrar/guardar`;

/** API para mostrar y guardar la firma de la opinion evaluar tramite 80101.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t80101/swagger-ui/index.html#/Opinion-Evaluar/postOpinionEvaluarGuardarFirma
 */
export const API_POST_OPINION_EVALUAR_GUARDAR_FIRMA = (TRAMITE: string, FILO_NUMBER: string) : string => `sat-t${TRAMITE}/${FILO_NUMBER}/opinion/registrar/mostrar-firma`;

export const API_POST_FIRMAR_OPINION = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/${NUMFOLIOTRAMITE}/opinion/registrar/firmar`;

export const OPINION_DOCUMENTO = () : string => `generador-documento/opinion/documento/guardar`;

export const API_GET_DEPENDENCIA = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/dependencia-proc-spec`;

export const API_MOSTRAR_SOLICITUD = (TRAMITE: number, idSolicitud: string): string => `sat-t${TRAMITE}/solicitud/mostrar/${idSolicitud}`;

export const JUNTAS_TECNICAS_CATALOGO = (TRAMITE: string): string =>`sat-t${TRAMITE}/catalogo/juntas-tecnicas-enum`;
