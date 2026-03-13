/**
 * Constantes de endpoints y claves para el trámite 231001.
 * Provee descripciones JSDoc para mejorar autocompletado y generación de documentación.
 *
 * Notas:
 * - Muchas constantes contienen placeholders como '{tramite}', '{rfc}', '{idSolicitud}', etc.
 *   Estos deben reemplazarse en tiempo de ejecución antes de invocar las rutas reales.
 */

/**
 * Tramite que se utilizará en las consultas.
 * Este valor debe ser reemplazado por el tramite correspondiente.
 */
export const TRAMITE = 'sat-t230901';



/**
 * Descripcion clave Fraccion Arancelaria
 * Reemplace '{claveFraccionArancelaria}' por la clave real del capítulo al construir la ruta.
 * @constant {string}
 */
export const CLAVE_FRACCION_ARANCELARIA = '{claveFraccionArancelaria}';


/**
 * Clave de la clasificacion taxonomica..
 * Reemplace '{clave}' por la clave real del capítulo al construir la ruta.
 * @constant {string}
 */
export const CLAVE_CLASIFICACION_TAXONOMICA = '{claveClasificacionTaxonomica}';

/**
 * Nombre Cientifico de la clasificacion taxonomica y del nombre cientifico.
 * Reemplace '{nombreCientifico}' por la clave real del capítulo al construir la ruta.
 * @constant {string}
 */
export const CLAVE_NOMBRE_CIENTIFICO = '{claveNombreCientifico}';



/**
 * API para obtener los catalogos de tipo de movimientos.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/regimenes/movimientos
 */
export const API_GET_MOVIMIENTOS = `${TRAMITE}/catalogo/regimenes/movimientos`;

/**
 * API para obtener los catalogos de tipo de regimenes.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/regimenes
 */
export const API_GET_REGIMENES = `${TRAMITE}/catalogo/regimenes/tramite`;

/**
 * API para obtener los catalogos de aduanas.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/aduanas
 */
export const API_GET_ADUANAS = `${TRAMITE}/catalogo/aduanas`;


/**
 * API que permite consultar las fracciones arrancelarias relacionadas con el tipo tramite
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/tramite/fracciones-arancelarias
 */
export const API_GET_FRACCIONES_ARANCELARIAS = `${TRAMITE}/catalogo/tramite/fracciones-arancelarias`;


/**
 * API  que permite consultar la fraccion arancelaria por medio de la clave de la fraccion arancelaria.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/fraccion-arancelaria/61032301
 */
export const API_GET_DESCRIPCION_FRACCION_ARANCELARIA = `${TRAMITE}/catalogo/tramite/fraccion-arancelaria/${CLAVE_FRACCION_ARANCELARIA}`;


/**
 * API que permite consultar las clasificaciones taxonomicas ACTIVAS.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/clasificacion-taxonomica
 */
export const API_GET_CLASIFICACION_TAXONOMICA = `${TRAMITE}/catalogo/clasificacion-taxonomica`;

/**
 * API que permite consultar el catalogo de Nombres cientificos de Vida Silvestre por medio de la clasificacion taxonomica.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/vida-silvestre/nombre-cientifico?ideClasifTaxonomica=CLSTX.PLA
 */
export const API_GET_NOMBRE_CIENTIFICO = `${TRAMITE}/catalogo/vida-silvestre/nombre-cientifico?ideClasifTaxonomica=${CLAVE_CLASIFICACION_TAXONOMICA}`;

/**
 * API que permite consultar el catalogo de Nombres comunes de Vida Silvestre por medio de la clasificacion taxonomica y el nombre cientifico.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/vida-silvestre/nombre-comun?ideClasifTaxonomica=CLSTX.PLA&nombreCientifico=Euphorbia%20spp.
 */
export const API_GET_NOMBRE_COMUN = `${TRAMITE}/catalogo/vida-silvestre/nombre-comun?ideClasifTaxonomica=${CLAVE_CLASIFICACION_TAXONOMICA}&nombreCientifico=${CLAVE_NOMBRE_CIENTIFICO}`;


/**
 * API que permite consultar las unidades de medida comercial del tramite.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/unidades-medida-comercial
 */
export const API_GET_UNIDAD_MEDIDA = `${TRAMITE}/catalogo/unidades-medida-comercial`


/**
 * API que permite consultar los paises ACTIVOS ordenados por el nombre ascendete.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/paises
 */
export const API_GET_PAISES = `${TRAMITE}/catalogo/paises`


/**
 * API  que permite consultar los paises ACTIVOS ordenados por el nombre ascendete sin incluir a Mexico.
 * @see hhttps://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/paises-sin-mexico
 */
export const API_GET_PAISES_SIN_MEXICO = `${TRAMITE}/catalogo/paises-sin-mexico`


/**
 * Servicio que permite consultar los usos de mercancía ACTIVOS relacionados con el tramite ordenados por el nombre ascendente.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/usos-mercancia
 */
export const API_GET_USOS_MERCANCIA = `${TRAMITE}/catalogo/usos-mercancia`


/**
 * Tipo de movimiento seleccionado
 * Reemplace '{rfc}' por el RFC real al construir las rutas en tiempo de ejecución.
 * @constant {string}
 */
export const TIPO_MOVIMIENTO = '{tipo_movimiento}';
/**
 * Identificador del contribuyente (RFC) usado en rutas que requieren el RFC.
 * Reemplace '{rfc}' por el RFC real al construir las rutas en tiempo de ejecución.
 * @constant {string}
 */
export const RFC = '{rfc}';
/**
 * Identificador de la clave recinto
 * Reemplace '{rfc}' por el RFC real al construir las rutas en tiempo de ejecución.
 * @constant {string}
 */
export const CLAVE_RECINTO = '{clave_recinto}';

/**
 * Servicio que permite consultar los domicilios del recinto del destinatario.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/destinatario-recintos/02/AAL0409235E6
 */
export const API_GET_DESTINATARIO_RECINTOS = `${TRAMITE}/catalogo/destinatario-recintos/${TIPO_MOVIMIENTO}/${RFC}`


/**
 * Servicio que permite consultar los domicilios del recinto del destinatario con Clave Recinto.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/destinatario-recintos/01/AAL0409235E6/domicilios/MOR
 */
export const API_GET_DESTINATARIO_RECINTOS_CLAVE = `${TRAMITE}/catalogo/destinatario-recintos/${TIPO_MOVIMIENTO}/${RFC}/domicilios/${CLAVE_RECINTO}`

/**
 * Servicio que permite consultar las entidades federativas ordenados por el nombre ascendente.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/entidades-federativas
 */
export const API_GET_ENTIDADES_FEDERATIVAS = `${TRAMITE}/catalogo/entidades-federativas`

/**
 * Servicio que permite consultar la información del pago relacionada con el tramite.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/tramite/datos-pago
 */
export const API_GET_DATOS_PAGOS = `${TRAMITE}/catalogo/tramite/datos-pago`

/**
 * Servicio que permite consultar el catalogo de Bancos.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/bancos
 */
export const API_GET_BANCOS = `${TRAMITE}/catalogo/bancos`

/**
 * Servicio que permite consultar el catalogo de Bancos.
 * @see https://api-v30.cloud-ultrasist.net/api/sat-t230901/catalogo/bancos
 */
export const API_POST_GUARDA_SOLICITUD = `${TRAMITE}/solicitud/guardar`



