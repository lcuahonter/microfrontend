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
 * Servicio que permite consultar los establecimientos..
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta
 */
export const API_GET_CATALOGO_ESTABLECIMIENTO_TIF = (TRAMITE: string, RFC: string, CVEUCON: string) : string => `sat-t${TRAMITE}/catalogo/${RFC}/establecimiento-tif/${CVEUCON}`;

/**
 * Servicio que permite consultar las plantas autorizadas de origen.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta
 */
export const API_GET_CATALOGO_PLANTAS_AUTORIZADAS = (TRAMITE: string, CVEPAIS: string, CVEPLANTA: string) : string => `sat-t${TRAMITE}/catalogo/${CVEPAIS}/plantas-autorizadas/${CVEPLANTA}`;

/**
 * Servicio que permite consultar las unidades de medida comerciales asociadas.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-umc
 */
export const API_GET_CATALOGO_UNIDADES_MEDIDA_COMERCIALES = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/unidades-medida-comercial`;

/**
 * Servicio que permite consultar los usos de mercancía ACTIVOS por tipo de trámite ordenados por nombre ascendente.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-usos-mercancia
 */
export const API_GET_CATALOGO_USOS_MERCANCIA = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/tramite/usos-mercancia`;

/**
 * Servicio que permite consultar la información de restricción por el identificador del trámite.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-usos-mercancia
 */
export const API_GET_CATALOGO_RESTRICCIONES = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/tramite/restricciones`;

/**
 * Servicio que permite consultar los datos de las francciones arancelarías ACTIVAS por el identificador del trámite.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-fracciones-tramite
 */
export const API_GET_CATALOGO_FRACCIONES_ARANCELARIAS = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/tramite/fracciones-arancelarias`;

/**
 * Servicio que permite consultar una lista de Tipo Presentacion.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta_2
 */
export const API_GET_CATALOGO_TIPO_PRESENTACION = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/tipos-presentacion`;

/**
 * Servicio que permite consultar una lista de Tipo Planta.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta_3
 */
export const API_GET_CATALOGO_TIPO_PLANTA = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/tipos-planta`;

/**
 * Servicio que permite consultar una lista de Subtipo Presentacion.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta_4
 */
export const API_GET_CATALOGO_SUBTIPO_PRESENTACION = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/subtipos-presentacion`;

/**
 * Servicio que permite consultar una lista de tipos de producto.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/getTipoProductosActivos
 */
export const API_GET_CATALOGO_TIPOS_PRODUCTO = (TRAMITE: string): string => `sat-t${TRAMITE}/catalogo/tipos-producto`;

/**
 * Servicio que permite consultar los regimenes ACTIVOS ordenados por el nombre ascendente..
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-regimenes
 */
export const API_GET_CATALOGO_SEXOS_ACTIVOS = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/sexos`;

/**
 * Servicio que permite consultar los regimenes ACTIVOS ordenados por el nombre ascendente.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-regimenes
 */
export const API_GET_CATALOGO_REGIMENES = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/regimenes`;

/**
 * Servicio que permite consultar vida silvestre.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-regimenes
 */
export const API_GET_CATALOGO_VIDA_SILVESTRE = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/tipos-vida-silvestre`;

/**
 * Servicio que permite consultar los régimenes ACTIVOS y VIGENTES.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-regimenes_1
 */
export const API_GET_CATALOGO_REGIMENES_VIGENTES = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/regimenes-vigentes`;

/**
 * Servicio que permite consultar los puntos de verificacion federal activos.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-punto-verificacion
 */
export const API_GET_CATALOGO_PUNTOS_VERIFICACION = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/punto-verificacion`;

/**
 * Servicio que permite consultar los puntos de inspección.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-punto-inspecci%C3%B3n
 */
export const API_GET_CATALOGO_PUNTO_INSPECCION = (TRAMITE: string, OISA: string) : string => `sat-t${TRAMITE}/catalogo/punto-inspeccion/${OISA}`;

/**
 * Servicio que permite consultar los paises ACTIVOS ordenados por el nombre ascendete.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-paises
 */
export const API_GET_CATALOGO_CONSULTA_PAISES = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/paises`;

/**
 * Servicio que permite consultar los países ACTIVOS y vigentes excluyendo México.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-paises-sin-mexico
 */
export const API_GET_CATALOGO_PAISES_SIN_MEXICO = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/paises-sin-mexico`;

/**
 * Servicio que permite consultar las entidades federativas por medio del pais seleccionado.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-entidades-federativas-pais
 */
export const API_GET_CATALOGO_ENTIDADES_FEDERATIVAS = (TRAMITE: string, CVEPAIS: string) : string => `sat-t${TRAMITE}/catalogo/pais/${CVEPAIS}/entidades-federativas`;

/**
 * Servicio que permite consultar los países destino por tipo de producto y tipo de mercancía.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-pais-destino
 */
export const API_GET_CATALOGO_PAIS_DESTINO = (TRAMITE: string, CVETIPOPRODUCTO: string) : string => `sat-t${TRAMITE}/catalogo/pais/destino/${CVETIPOPRODUCTO}`;

/**
 * Servicio que permite consultar los datos de las colonias por medio de la clave del municipio o delegación.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-colonia
 */
export const API_GET_CATALOGO_COLONIAS = (TRAMITE: string, CVEDELEGNUM: string) : string => `sat-t${TRAMITE}/catalogo/municipio-delegacion/${CVEDELEGNUM}/colonias`;

/**
 * Servicio que permite consultar los medios de transporte.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-medio-transporte
 */
export const API_GET_CATALOGO_MEDIO_TRANSPORTE = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/medio-transporte`;

/**
 * Servicio que permite consultar una lista de Justificacion.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta_5
 */
export const API_GET_CATALOGO_JUSTIFICACIONES_PAGO = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/justificaciones-pago`;

/**
 * Servicio que permite consultar las fracciones NICO por clave de fracción arancelaria.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-fracciones-nico
 */
export const API_GET_CATALOGO_FRACCION_ARANCELARIA = (TRAMITE: string, CVEFRACCION: string) : string => `sat-t${TRAMITE}/catalogo/fraccion-arancelaria/${CVEFRACCION}/nico`;

/**
 * Servicio que permite consultar los nombres del los medicos veterinarios por establecimiento TIF.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-especies
 */
export const API_GET_CATALOGO_MEDICOS_VETERINARIOS = (TRAMITE: string, CVEESTABLECIMIENTOTIF: string) : string => `sat-t${TRAMITE}/catalogo/establecimiento-tif/${CVEESTABLECIMIENTOTIF}/medicos-veterinarios`;

/**
 * Servicio que permite consultar los nombres del los medicos veterinarios por establecimiento TIF.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-especies
 */
export const API_GET_CATALOGO_ESPECIES = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/especies`;

/**
 * Servicio que permite consultar las entidades federativas ordenados por el nombre ascendente.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-entidades-federativas
 */
export const API_GET_CATALOGO_ENTIDADES_FEDERATIVAS_GENERAL = (TRAMITE: string, PAIS: string = 'MEX') : string => `sat-t${TRAMITE}/catalogo/pais/${PAIS}/entidades-federativas`;

/**
 * Servicio que permite consultar los datos de las delegaciones o municipios por medio de la clave de la entidad federativa.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta-delegacion-municipio
 */
export const API_GET_CATALOGO_ENTIDAD_FEDERATIVA_MUNICIPIOS = (TRAMITE: string, CLVENTIDAD: string) : string => `sat-t${TRAMITE}/catalogo/entidad-federativa/${CLVENTIDAD}/municipios-delegaciones`;

/**
 * Servicio que permite consultar los bancos.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/
 */
export const API_GET_CATALOGO_BANCOS = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/bancos`;

/**
 * Consulta las aduanas ACTIVAS ordenadas por clave ascendete.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/
 */
export const API_GET_CATALOGO_ADUANAS = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/aduanas`;

/**
 * Consulta las Oficinas de Inspección de Sanidad Agropecuaria ACTIVAS ordenadas por el nombre ascendete.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Catalogos/consulta_9
 */
export const API_GET_CATALOGO_OFICINAS_INSPECCION = (TRAMITE: string, CVEADUANA: string) : string => `sat-t${TRAMITE}/catalogo/aduana/${CVEADUANA}/oficinas-inspeccion`;

/**
 * Genera la ruta de la API para obtener los datos de una solicitud.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param esPrellenado - Indica si es prellenado.
 * @param idSolicitud - ID de la solicitud.
 * @returns Ruta de la API como string.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Registro-Solicitud/consulta-datos-solicitud
 */
export const API_GET_DATOS_SOLICITUD = (TRAMITE: string, esPrellenado: boolean, idSolicitud : string) : string => `sat-t${TRAMITE}/prellenado/${esPrellenado}/solicitud/${idSolicitud}/datos-solicitud`;


/**
 * Genera la ruta de la API para obtener las solicitudes recientes de un trámite específico y RFC dado.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param RFC - RFC del usuario.
 * @returns Ruta de la API como cadena de texto.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Registro-Solicitud/get-last-solicitudes
 */
export const API_GET_SOLICITUDES_RECENTES = (TRAMITE: string, RFC: string) : string => `sat-t${TRAMITE}/solicitud/recientes/${RFC}`;


/**
 * Genera la ruta de la API para obtener las solicitudes recientes de un trámite específico y RFC dado.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param cveFraccion - Clave de la fracción arancelaria.
 * @returns Ruta de la API como cadena de texto.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Registro-Solicitud/consulta-descripcion-fraccion-arancelaria
 */
export const API_GET_SOLICITUDES_FRACCION_ARANCELARIA_DESCRIPCION = (TRAMITE: string, cveFraccion: string) : string => `sat-t${TRAMITE}/fraccion-arancelaria/${cveFraccion}/descripcion`;


/**
 * Genera la ruta de la API para obtener la descripción de un NICO específico dentro de una fracción arancelaria y trámite dados.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param cveFraccion - Clave de la fracción arancelaria.
 * @param cveNico - Clave del NICO.
 * @returns La ruta de la API como cadena de texto para consultar la descripción del NICO.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Registro-Solicitud/consulta-descripcion-nico
 */
export const API_GET_SOLICITUDES_NICO_DESCRIPCION = (TRAMITE: string, cveFraccion: string,cveNico: string) : string => `sat-t${TRAMITE}/fraccion/${cveFraccion}/nico/${cveNico}/descripcion`;


/**
 * Generates the API endpoint URL for retrieving the unit of measurement associated with a specific tariff fraction.
 *
 * @param TRAMITE - The identifier of the procedure or process (trámite) to be used in the API path.
 * @param cveFraccion - The code of the tariff fraction (fracción arancelaria) for which the unit of measurement is requested.
 * @returns The constructed API endpoint URL as a string.
 *
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Registro-Solicitud/consulta-descripcion-umt-fraccion-arancelaria
 */
export const API_GET_SOLICITUDES_UNIDAD_MEDIDA = (TRAMITE: string, cveFraccion: string) : string => `sat-t${TRAMITE}/fraccion-arancelaria/${cveFraccion}/unidad-medida`;


/**
 * GUARDA LOS DATOS DE UNA SOLICITUD
 *
 * @returns Obtiene Json con caso exitoso o no.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/swagger-ui/index.html#/Registro-Solicitud/guardar
 */
export const API_POST_SOLICITUD_GUARDAR = (TRAMITE: string): string => `sat-t${TRAMITE}/solicitud/guardar`;


/**
 * Genera la ruta de la API para guardar parcialmente una solicitud para un trámite específico.
 *
 * @param TRAMITE - Identificador del trámite relacionado con la solicitud.
 * @returns La ruta de la API como cadena de texto para guardar parcialmente la solicitud.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Registro-Solicitud/guardar-parcial
 */
export const API_GET_SOLICITUDES_GUARDADO_PARCIAL = (TRAMITE: string) : string => `sat-t${TRAMITE}/solicitud/guardar-parcial`;


/**
 * Genera la ruta de la API para enviar una solicitud relacionada con un trámite específico.
 *
 * @param TRAMITE - Identificador del trámite que se utilizará en el endpoint.
 * @returns La ruta de la API como cadena de texto.
 */
export const API_GET_SOLICITUDES_GUARDAR = (TRAMITE: string) : string => `sat-t${TRAMITE}/solicitud/guardar`;


/**
 * Genera una URL para obtener las solicitudes de movilización nacional.
 *
 * @param TRAMITE - Identificador del trámite relacionado.
 * @param esPrellenado - Indica si la solicitud es un prellenado (true) o no (false).
 * @param idSolicitud - Identificador único de la solicitud.
 * @returns Una cadena de texto que representa la URL generada.
 */
export const API_GET_SOLICITUDES_MOVILIZACION_NACIONAL = (TRAMITE: string, esPrellenado: boolean, idSolicitud : string) : string => `sat-t${TRAMITE}/prellenado/${esPrellenado}/solicitud/${idSolicitud}/movilizacion-nacional`;

/**
 * Genera la URL para obtener los terceros relacionados a una solicitud específica.
 * 
 * @param TRAMITE - Identificador del trámite.
 * @param esPrellenado - Indica si es un prellenado (true) o no (false).
 * @param idSolicitud - Identificador único de la solicitud.
 * @returns La URL generada como una cadena de texto.
 */
export const API_GET_SOLICITUDES_TERCEROS_RELACIONADOS = (TRAMITE: string, esPrellenado: boolean, idSolicitud : string) : string => `sat-t${TRAMITE}/prellenado/${esPrellenado}/solicitud/${idSolicitud}/terceros-relacionados`;

/**
 * Genera la URL para obtener las solicitudes de pago de derechos.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param esPrellenado - Indica si es un prellenado (true o false).
 * @param idSolicitud - Identificador único de la solicitud.
 * @returns La URL generada como una cadena de texto.
 */
export const API_GET_SOLICITUDES_PAGO_DERECHOS = (TRAMITE: string, esPrellenado: boolean, idSolicitud : string) : string => `sat-t${TRAMITE}/prellenado/${esPrellenado}/solicitud/${idSolicitud}/pago-derechos`;


/**
 * API para obtener el estado de la solicitud del tramite 220201.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Registro-Solicitud/genera-cadena-original_1
 */
export const API_POST_CADENA_ORIGINAL = (TRAMITE: string, IDSOLICITUD: string) : string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/generar-cadena-original`;

/**
 * Endpoint para obtener los certificados pendientes.
 */
export const API_GET_CERTIFICADOS_PENDIENTES = (TRAMITE: string): string => `/api/sat-t${TRAMITE}/certificados/pendientes`;
/*
 * Genera la ruta de la API para obtener los documentos opcionales de una solicitud.
 *
 * @param TRAMITE - Identificador del trámite que se utilizará en el endpoint.
 * @returns La ruta de la API como cadena de texto.
 */
export const API_GET_DOCUMENTOS_OPCIONALES = (TRAMITE: string, idSolicitud: number | undefined, especifico: boolean) : string => {
  let url = `sat-t${TRAMITE}/solicitud/documentos`;
  const PARAMS: string[] = [];
  if (idSolicitud !== undefined && idSolicitud !== null) {
    PARAMS.push(`idSolicitud=${idSolicitud}`);
  }
  if (especifico !== undefined && especifico !== null) {
    PARAMS.push(`especifico=${especifico}`);
  }

  if (PARAMS.length > 0) {
    url += `?${PARAMS.join('&')}`;
  }

  return url;
}

/**
 * Endpoint para obtener el catálogo de Aduanas de Ingreso.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GET_ADUANA_INGRESO = (TRAMITE: string): string => `/api/sat-t${TRAMITE}/catalogo/aduana-ingreso`;

/**
 * Endpoint para obtener el catálogo de horas de inspección.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GET_HORAS_INSPECCION = (TRAMITE: string): string => `/api/sat-t${TRAMITE}/catalogo/horas-inspeccion`;

/**
 * Endpoint para obtener los datos del certificado autorizado según la clave.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param CLAVE - Clave del certificado.
 * @returns Ruta completa de la API.
 */
export const API_GET_CERTIFICADO_DATOS = (TRAMITE: string, CLAVE: string): string => `/api/sat-t${TRAMITE}/datos-solicitud/certificado/${CLAVE}/datos`;

/**
 * Endpoint para obtener la tabla de solicitudes registradas de un trámite específico.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GET_SOLICITUDES = (TRAMITE: string): string =>`/api/sat-t${TRAMITE}/datos-solicitud/solicitudes`;

/**
 * Obtiene la ruta del endpoint para consultar las oficinas de inspección
 * de sanidad agropecuaria asociadas a una aduana específica.
 *
 * @param {string} TRAMITE - Clave del trámite SAT (por ejemplo: '220502').
 * @param {string} CVE_ADUANA - Clave de la aduana para obtener las oficinas correspondientes.
 * @returns {string} Ruta del endpoint de la API.
 *
 */
export const API_GET_OFICINAS_INSPECCION_SANIDAD = (TRAMITE: string, CLAVE: string): string =>`/api/sat-t${TRAMITE}/catalogo/oficinas-inspeccion-sanidad/${CLAVE}`;

/**
 * Obtiene la ruta del endpoint para consultar el catálogo de medios de transporte.
 *
 * @param {string} TRAMITE - Clave del trámite SAT (por ejemplo: '220502').
 * @returns {string} Ruta del endpoint de la API.
 *
 * Ejemplo de salida:
 * `/api/sat-t220502/catalogo/medio-transport`
 */
export const API_GET_MEDIO_TRANSPORTE = (TRAMITE: string): string => `/api/sat-t${TRAMITE}/catalogo/medio-transporte`;
/**
 * Endpoint para obtener el catálogo de tipo de contenedor de un trámite específico.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GET_TIPO_CONTENEDOR = (TRAMITE: string): string =>`/api/sat-t${TRAMITE}/catalogo/tipo-contenedor`;

/**
 * Construye la ruta del API para obtener terceros (exportadores, importadores, etc.)
 *
 * @param TRAMITE - Identificador del trámite (ejemplo: '220502').
 * @param CODIGO - Último identificador dinámico (ejemplo: '202830385').
 * @returns Ruta completa del endpoint.
 */
export const API_GET_TERCEROS = (TRAMITE: string, CODIGO: string): string =>
  `/api/sat-t${TRAMITE}/terceros/${CODIGO}`;
/**
 * Endpoint para obtener los datos de mercancías asociados a un certificado específico.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param CERTIFICADO - Número o clave del certificado.
 * @returns Ruta completa de la API.
 */
export const API_GET_DATOS_MERCANCIA = (TRAMITE: string, CERTIFICADO: string): string =>`/api/sat-t${TRAMITE}/datos-solicitud/certificado/${CERTIFICADO}/mercancias`;
/**
 * Endpoint para obtener el historial de inspección física asociado a un certificado específico.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param CERTIFICADO - Número o clave del certificado.
 * @returns Ruta completa de la API.
 */
export const API_GET_HISTORIAL_INSPECCION_FISICA = (TRAMITE: string, CERTIFICADO: string): string =>`/api/sat-t${TRAMITE}/datos-solicitud/certificado/${CERTIFICADO}/historial-inspeccion-fisica`;
/**
 * Endpoint para obtener los puntos de inspección asociados a una OISA
 * y un tipo de trámite específico.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param CLAVE - Clave OISA o valor para filtrar los puntos de inspección.
 * @returns Ruta completa de la API.
 */
export const API_GET_PUNTOS_INSPECCION = (TRAMITE: string, CLAVE: string): string =>`/api/sat-t${TRAMITE}/catalogo/punto-de-inspeccion-por-oisa-tipotramite/${CLAVE}`;
/**
 * Endpoint para obtener los datos generales de una
 * revisión documental asociada a un certificado.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param CERTIFICADO - Número de certificado o identificador para filtrar.
 * @returns Ruta completa de la API.
 */
export const API_GET_DATOS_GENERALES_REVISION_DOCUMENTAL = (
  TRAMITE: string,
  CERTIFICADO: string
): string =>`/api/sat-t${TRAMITE}/revision-documental/mercancias/${CERTIFICADO}`;
/**
 * Endpoint para obtener los datos generales de una
 * solicitud en revisión documental.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param CERTIFICADO - Número de certificado o identificador para filtrar.
 * @returns Ruta completa de la API.
 */
export const API_GET_DATOS_GENERALES_REVISION = (
  TRAMITE: string,
  CERTIFICADO: string
): string =>`/api/sat-t${TRAMITE}/revision-documental/datos-generales/${CERTIFICADO}`;
/**
 * Endpoint para obtener el catálogo de puntos de
 * verificación federal asociados a un trámite.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GET_PUNTO_VERIFICACION_FEDERAL = (
  TRAMITE: string
): string => `/api/sat-t${TRAMITE}/catalogo/punto-de-verificacion-federal`;
/**
 * Endpoint para obtener el catálogo de Régimen al que se destinará la mercancía
 * asociado a un trámite.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GET_REGIMENES = (TRAMITE: string): string => `/api/sat-t${TRAMITE}/catalogo/regimenes`;
/**
 * Endpoint para obtener el pago de derechos de una
 * solicitud en revisión documental.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param CERTIFICADO - Número de certificado o identificador para filtrar.
 * @returns Ruta completa de la API.
 */
export const API_GET_PAGO_DERECHOS_REVISION = (
  TRAMITE: string,
  CERTIFICADO: string
): string => `/api/sat-t${TRAMITE}/revision-documental/pago/${CERTIFICADO}`;
/**
 * Endpoint para obtener la justificación de un trámite.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GET_JUSTIFICACION = (
  TRAMITE: string
): string => `/api/sat-t${TRAMITE}/catalogo/justification`;

/**
 * Endpoint para iniciar la inspección física de una solicitud prellenada.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param idSolicitudPrellenado - Identificador de la solicitud prellenada.
 * @returns Ruta completa de la API con query parameter.
 */
export const API_INICIAR_INSPECCION_FISICA = (
  TRAMITE: string,
  idSolicitudPrellenado: number | string
): string => `/api/sat-t${TRAMITE}/inspeccion-fisica-sagarpa/iniciar?idSolicitudPrellenado=${idSolicitudPrellenado}`;

/**

 * API para firmar una solicitud de un trámite específico.
 */
export const API_POST_FIRMA = (TRAMITE: string, IDSOLICITUD: string) : string => `sat-t${TRAMITE}/solicitud/${IDSOLICITUD}/firmar`;

/**
 * Endpoint para guardar los datos de inspección física.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GUARDAR_INSPECCION_FISICA_SAGARPA = (TRAMITE: string): string => `/api/sat-t${TRAMITE}/inspeccion-fisica-sagarpa/guardar`;
/** *
 * Endpoint para obtener el historial de carros ferrocarril de un certificado.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param certificado - Número del certificado.
 * @returns Ruta completa de la API.
 */
export const API_HISTORIAL_CARROS_FERROCARRIL = (
  TRAMITE: string,
  certificado: number | string
): string =>`/api/sat-t${TRAMITE}/datos-solicitud/certificado/${certificado}/historial-carros-ferrocarril`;
/**
 * Endpoint to submit a signature for a given solicitud.
 *
 * @param solicitudId - The ID of the solicitud to sign.
 * @returns Full API path.
 */
export const API_FIRMAR_SOLICITUD = (TRAMITE: string): string =>
  `/api/sat-t${TRAMITE}/inspeccion-fisica-sagarpa/firmar`;

/**
 * Endpoint to submit a signature for a given solicitud.
 *
 * @param solicitudId - The ID of the solicitud to sign.
 * @returns Full API path.
 */
export const API_FIRMAR_SOLICITUD_ACUICOLA = (TRAMITE: string): string =>
  `/api/sat-t${TRAMITE}/solicitud/firmar`;

/**
 * Endpoint para generar la cadena original de una solicitud.
 *
 * @param TRAMITE - Identificador del trámite (dinámico).
 * @param idSolicitud - Identificador de la solicitud.
 * @returns Ruta completa de la API.
 */
export const API_GENERA_CADENA_ORIGINAL = (TRAMITE: string, idSolicitud: string): string =>`/api/sat-t${TRAMITE}/solicitud/${idSolicitud}/genera-cadena-original`;

/**
 * Endpoint para obtener el catálogo de Establecimientos TIF
 * asociado a un trámite.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GET_ESTABLECIMIENTOS_TIF = (TRAMITE: string, cveUcon: string): string => 
  `/api/sat-t${TRAMITE}/catalogo/establecimientos-tif/${cveUcon}`;

/**
 * Endpoint para obtener los puntos de inspección
 * asociados a una oficina OISA específica.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param CLAVE - Clave de la oficina OISA.
 * @returns Ruta completa de la API.
 */
export const API_GET_PUNTOS_INSPECCION_POR_OISA = ( TRAMITE: string, CLAVE: string): string =>`/api/sat-t${TRAMITE}/catalogo/punto-de-inspeccion/${CLAVE}`;



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
 * API para obtener las opciones de evaluación del tramite 130118.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t130118/swagger-ui/index.html#/Evaluar-Solicitud/opcion…
 */
export const API_POST_OPCIONES_EVALUACION = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/evaluar/opciones-evaluacion`;

/**
 * Genera la ruta de la API para guardar una solicitud relacionada con un trámite específico.
 *
 * @param TRAMITE - Identificador del trámite que se utilizará en el endpoint.
 * @returns La ruta de la API como cadena de texto.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t220201/swagger-ui/index.html#/Registro-Solicitud/guardar
 */
export const API_POST_GUARDAR = (TRAMITE: string) : string => `sat-t${TRAMITE}/solicitud/guardar`;
/**
 * Endpoint para obtener el catálogo de regímenes
 * asociado a un trámite.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GET_CATALOGO_REGIMENS = (TRAMITE: string): string =>`/api/sat-t${TRAMITE}/catalogo/catalogo_regimens`;

/**
 * Endpoint para obtener los terceros asociados a una solicitud específica
 * filtrados por tipo de tercero.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param CODIGO - Identificador de la solicitud.
 * @param tipoTercero - Tipo de tercero a filtrar.
 * @returns Ruta completa de la API.
 */
export const API_GET_TERCEROS_POR_TIPO = (
  TRAMITE: string,
  CODIGO: string,
  tipoTercero: string
): string => `/api/sat-t${TRAMITE}/terceros/${CODIGO}?tipoTercero=${tipoTercero}`;

/**
 * Endpoint para iniciar una solicitud a partir de una solicitud prellenada.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param idSolicitudPrellenado - Identificador de la solicitud prellenada.
 * @returns Ruta completa de la API con query parameter.
 */
export const API_INICIAR_SOLICITUD = (
  TRAMITE: string,
  idSolicitudPrellenado: number | string
): string =>
  `/api/sat-t${TRAMITE}/solicitud/iniciar?idSolicitudPrellenado=${idSolicitudPrellenado}`;
  /**
 * Endpoint para guardar una solicitud.
 *
 * @param TRAMITE - Identificador del trámite.
 * @returns Ruta completa de la API.
 */
export const API_GUARDAR_SOLICITUD = (TRAMITE: string): string => `/api/sat-t${TRAMITE}/solicitud/guardar`;
//  API para Genera la vista previa de una hoja de trabajo
//  @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/tramite/{numFolioTramite}/dictamen/hoja-trabajo/vista-previa
//  */
export const API_GET_HOJA_TREABAJO_VISTA_PREVIA = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/hoja-trabajo/vista-previa`;

/**
 * API para Genera la vista previa de una hoja de trabajo
 @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/tramite/{numFolioTramite}/dictamen/hoja-trabajo/vista-previa
 */
export const API_GET_REMISION_MUESTRAS_DIAGNOSTICO_VISTA_PREVIA = (TRAMITE: string, NUMFOLIOTRAMITE: string,nombreDictaminador:string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/remision-muestra-diagnostico/vista-previa?nombre_dictaminador=${nombreDictaminador}`;

/**
 * API para Genera la vista previa de una hoja de trabajo
 @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/tramite/{numFolioTramite}/dictamen/orden-tratamiento/vista-previa
 */
export const API_GET_ORDEN_SERVICIOS_TRATAMIENTO_VISTA_PREVIA = (TRAMITE: string, NUMFOLIOTRAMITE: string,nombreDictaminador:string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/orden-tratamiento/vista-previa?nombre_dictaminador=${nombreDictaminador}`;


/**
 * API para Genera la vista previa de una hoja de trabajo
 @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/catalogo/tipos-laboratorio
 */
export const API_GET_TIPOS_LABORATORIO = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/tipos-laboratorio`;


/**
 * API para Genera la vista previa de una hoja de trabajo
 @see https://api-v30.cloud-ultrasist.net/api/sat-t220202/catalogo/tipo/{ideTipoLaboratorio}/laboratorios
 */
export const API_GET_NOMBRES_LABORATORIOS = (TRAMITE: string,ideTipoLaboratorio:string) : string => `sat-t${TRAMITE}/catalogo/tipo/${ideTipoLaboratorio}/laboratorios`;

/**
 * API para Genera la vista previa de una hoja de trabajo
 @see https://api-v30.cloud-ultrasist.net/api/sat-t${TRAMITE}/catalogo/unidades-medida-comercial
 */
export const API_GET_UNIDADES_MEDIDA_COMERCIAL = (TRAMITE: string) : string => `sat-t${TRAMITE}/catalogo/unidades-medida-comercial`;


/**
 * API para Genera la vista previa de una hoja de trabajo
 @see https://api-v30.cloud-ultrasist.net/api/sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/generar/guardar
 */
export const API_POST_DICTAMEN_GUARDAR = (TRAMITE: string, NUMFOLIOTRAMITE: string) : string => `sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/generar/guardar`;

/**
 * API para Genera la vista previa de una hoja de trabajo
 @see https://api-v30.cloud-ultrasist.net/api/sat-t${TRAMITE}/tramite/${NUMFOLIOTRAMITE}/dictamen/hoja-trabajo/guardar
 */
export const API_POST_HOJA_TRABAJO_GUARDAR = (TRAMITE: string): string => `sat-t${TRAMITE}/dictamen/hoja-trabajo/guardar`;
/**
* Api para iniciar hoja de trabajo
* */
export const API_GET_HOJA_INICIAR = (TRAMITE: string,numFolioTramite:string): string => `sat-t${TRAMITE}/tramite/${numFolioTramite}/hoja-trabajo/iniciar`;





//**----------------------Consulta solicitud------------------*/

/**
 * Genera la ruta de la API para consultar los datos de una solicitud de trámite.
 *
 * @param TRAMITE - Identificador del tipo de trámite.
 * @param FOLIO - Número de folio del trámite.
 * @returns La ruta de la API como una cadena de texto.
 */
export const API_GET_CONSULTA_TRAMITE_DATOS_SOLICITUD = (TRAMITE: string, FOLIO: string) : string => `sat-t${TRAMITE}/consulta/tramite/${FOLIO}/datos-solicitud`;

/**
 * Genera la ruta de consulta para un trámite de movilización nacional.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param FOLIO - Número de folio asociado al trámite.
 * @returns La ruta de la API como una cadena de texto.
 */
export const API_GET_CONSULTA_TRAMITE_MOVILIZACION = (TRAMITE: string, FOLIO: string) : string => `sat-t${TRAMITE}/consulta/tramite/${FOLIO}/movilizacion-nacional`;

/**
 * Genera la URL para consultar terceros relacionados a un trámite específico.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param FOLIO - Folio único del trámite.
 * @returns URL construida para la consulta.
 */
export const API_GET_CONSULTA_TRAMITE_TERCEROS = (TRAMITE: string, FOLIO: string) : string => `sat-t${TRAMITE}/consulta/tramite/${FOLIO}/terceros-relacionados`;

/**
 * Genera la URL para consultar el pago de derechos de un trámite específico.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param FOLIO - Número de folio del trámite.
 * @returns La URL construida para la consulta.
 */
export const API_GET_CONSULTA_TRAMITE_PAGO_DERECHOS = (TRAMITE: string, FOLIO: string) : string => `sat-t${TRAMITE}/consulta/tramite/${FOLIO}/pago-derechos`;
