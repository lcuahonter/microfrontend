/**
 * API para obtener el catálogo de aduanas de ingreso/salida
 * del trámite 220402.
 */
export const ADUANA_DE_SALIDA_URL =
  "api/sat-t220402/catalogo/aduana-ingreso";

/**
 * API para obtener el catálogo de medios de transporte
 * del trámite 220402.
 */
export const MEDIO_TRANSPORTE_URL =
  "api/sat-t220402/catalogo/medio-transporte";

/**
 * API para iniciar el proceso de pago de derechos
 * del trámite 220402.
 */
export const PAGE_DE_CHORES_INICIAR_URL =
  "api/sat-t220402/pago/iniciar";

/**
 * API para guardar los datos de la solicitud
 * del trámite 220402.
 */
export const GUARDAR_DATOS_TRAMITE_URL =
  "api/sat-t220402/solicitud/guardar";

/**
 * API para obtener el catálogo de bancos
 * del trámite 220402.
 */
export const BANCO_URL =
  "api/sat-t220402/catalogo/bancos";

/**
 * API para obtener el catálogo de países
 * del trámite 220402.
 */
export const GET_PAIS_URL =
  "api/sat-t220402/catalogo/paises";

/**
 * API para obtener el catálogo de unidades de verificación (CATUV)
 * del trámite 220402.
 */
export const UNIDAD_VERIFICATION_URL =
  "api/sat-t220402/catalogo/unidad/CATUV";

/**
 * API para obtener los módulos de certificación fitosanitaria
 * por entidad federativa.
 *
 * @param CVE_UNIDAD Clave de la entidad federativa
 */
export const MODULOS_FITOSANITARIA_URL = (CVE_UNIDAD: string): string =>
  `api/sat-t220402/catalogo/entidad-federativa/${CVE_UNIDAD}/modulos-certificacion-fitosanitaria`;

/**
 * API para obtener los terceros especialistas
 * asociados a una unidad de verificación.
 *
 * @param CVE_UNIDAD Clave de la unidad de verificación
 */
export const TERCERO_ESPECIALISTA_URL = (CVE_UNIDAD: string): string =>
  `api/sat-t220402/catalogo/unidad-verificacion/${CVE_UNIDAD}/terceros-especialistas`;

/**
 * API para obtener el catálogo de entidades federativas
 * de la unidad expedidora (México).
 */
export const ENTIDAD_FEDERATIVA_UNIDAD_EXPEDIDORA_URL =
  "api/sat-t220402/catalogo/entidades-federativas-mex";

/**
 * API para obtener los módulos de certificación fitosanitaria
 * para la entidad federativa AGS.
 */
export const FITOSANITARIO_URL =
  "api/sat-t220402/catalogo/entidad-federativa/AGS/modulos-certificacion-fitosanitaria";

/**
 * API para validar una fracción arancelaria
 * del trámite 220402.
 *
 * @param CLAVE_FRACCION Clave de la fracción arancelaria
 */
export const FRACCION_ARANCELARIA_URL = (CLAVE_FRACCION: string): string =>
  `api/sat-t220402/fraccion-arancelaria/${CLAVE_FRACCION}/validar`;

/**
 * API para obtener el catálogo de nombres comunes
 * del trámite 220402.
 */
export const NOMBRE_COMUN_URL =
  "api/sat-t220402/catalogo/nombre-comun";

/**
 * API para obtener el catálogo de unidades de medida comercial (UMC)
 * del trámite 220402.
 */
export const UMC_URL =
  "api/sat-t220402/catalogo/unidades-medida-comercial";

/**
 * API para obtener el catálogo de descripciones de empaques
 * del trámite 220402.
 */
export const DESCRIPCION_EMAQUE_URL =
  "api/sat-t220402/catalogo/descripcion-empaques";

/**
 * API para obtener el catálogo de usos de mercancía
 * del trámite 220402.
 */
export const USO_MERCANCIA_URL =
  "api/sat-t220402/catalogo/usos-mercancia/220402";

/**
 * API para obtener los municipios/delegaciones
 * por entidad federativa.
 *
 * @param CVE_ENTIDAD Clave de la entidad federativa
 */
export const MUNICIPIO_DE_ORIGIN_URL = (CVE_ENTIDAD: string): string =>
  `api/sat-t220402/catalogo/entidad-federativa/${CVE_ENTIDAD}/delegaciones-municipios`;

/**
 * API para obtener el nombre científico
 * a partir del nombre común.
 *
 * @param NOMBRE_COMMUN Nombre común de la mercancía
 */
export const NOMBRE_CLIENT_URL = (NOMBRE_COMMUN: string): string =>
  `api/sat-t220402/catalogo/nombre-comun/${NOMBRE_COMMUN}/nombre-cientifico`;

/**
 * API para firmar la solicitud
 * del trámite 220402.
 */
export const FIRMAR_URL =
  "api/sat-t220402/solicitud/firmar";

/**
 * API para generar la cadena original
 * de una solicitud.
 *
 * @param TRAMITE Clave del trámite
 * @param ID_SOLICITUD Identificador de la solicitud
 */
export const GENERAR_CADENA_ORIGINAL_URL = (
  TRAMITE: string,
  ID_SOLICITUD: string
): string =>
  `api/sat-t${TRAMITE}/solicitud/${ID_SOLICITUD}/generar-cadena-original`;
