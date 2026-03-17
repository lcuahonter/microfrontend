/**
 * @description Constantes relacionadas con las cookies utilizadas en la aplicación.
 * Contiene los nombres de las cookies para identificar al usuario, rol, token, usuario y RFC.
 */
export const COOKIE = {
  NOMBRE_COOKIE_ID_USUARIO: 'sg-id-user',
  NOMBRE_COOKIE_ROL: 'sg-rol',
  NOMBRE_COOKIE_TOKEN: 'sg-token',
  NOMBRE_COOKIE_USUARIO: 'sg-usuario',
  NOMBRE_COOKIE_RFC: 'sg-rfc',
};

/**
 * @description Constantes relacionadas con los códigos HTTP.
 * Contiene el código de éxito (200).
 */
export const CODIGOS_HTTP = {
  SUCCESS: "200"
}

/**
 * @description Identificadores de los catálogos utilizados en la aplicación.
 * Contiene los nombres y valores de los catálogos como tipos de solicitud, países, aduanas, entre otros.
 */
export const CATALOGOS_ID = {
  CAT_TIPO_SOL: 'tipos-solicitud',
  CAT_PAISES: 'paises',
  CAT_ADUANAS: 'aduanas',
  CAT_SECCION_ADUANAS: 25,
  DATOS_GNRLS_SOL: 5,
  CAT_TIPO_DOCUMENTO: 'tipos-documento',
  CAT_TIPO_OPERACION: 26,
  CAT_MEDIO_DE_TRANSPORTE: 'medio-de-transporte',
  CAT_REGIMEN_MERCANCIA: 'regimen-mercancia',
  CAT_CLASIFI_REGIMEN: 'clasifi-regimen',
  CAT_FRACCION_ARANCELARIA: 'fraccion-arancelaria',
  CAT_NICO: 'nico',
  CAT_UNIDAD_MEDIDA_TARIFARIA: 'unidad-medida-tarifaria',
  CAT_PAIS_ORIGEN: 'pais-origen',
  CAT_PAIS_DESTINO: 'pais-destino',
  CAT_MOLINO: 'molino',
  CAT_ESTADO: 'estado',
  CAT_BIMESTRE_UNO: 'bimestre-catalogo-uno',
  CAT_BIMESTRE_DOS: 'bimestre-catalogo-dos',
  CAT_BIMESTRE_TRES: 'bimestre-catalogo-tres',
  CAT_REPRESENTACION_FEDERAL: 'representacion-federal',
  CAT_TIPO_TRANSPORTE: 29,
  DATOS_PERSONA_FISICA: 21,
  CAT_RECINTO: 30,
  CAT_DESPACHO_LDA: 31,
  CAT_DESPACHO_DD: 32,
  CAT_ADUANA: 'aduana',
  CAT_PAIS: 'pais',
  CAT_DOCUMENTO_RESIDENCIA: 'documento-residencia',
  CAT_DESTINO_DONACION: 'destino-donacion',
  CAT_TIPO_DE_MERCANCIA: 'tipo-de-mercancia',
  CAT_UMT: 'umt',
  CAT_UMC: 'umc',
  CAT_PROCEDENCIA_OTRO: 'procedencia-otro',
  CAT_CONDICION_MERCANCIA: 'condicion-mercancia',
  CAT_PAIS_ORIGEN_MEDICAMENTO: 'pais-origen-medicamento',
  CAT_PAIS_PROCEDENCIA_MEDICAMENTO: 'pais-procedencia-medicamento',
};

/**
 * @description Tipos de personas utilizadas en la aplicación.
 * Contiene identificadores para personas físicas y morales, tanto nacionales como extranjeras.
 */
export const TIPO_PERSONA = {
  FISICA_NACIONAL: 1,
  MORAL_NACIONAL: 2,
  FISICA_EXTRANJERA: 3,
  MORAL_EXTRANJERA: 4,
};

/**
 * @description Tipos de solicitudes disponibles en la aplicación.
 * Contiene identificadores para solicitudes individuales, semanales y mensuales.
 */
export const TIPO_SOLICITUD = {
  INDIVIDUAL: 1,
  SEMANAL: 2,
  MENSUAL: 3,
};

/**
 * @description Constantes relacionadas con el padding para claves privadas cifradas.
 * Contiene los textos de inicio y fin del padding.
 */
export const PADDING = {
  INICIO: '-----BEGIN ENCRYPTED PRIVATE KEY-----\n',
  FIN: '\n-----END ENCRYPTED PRIVATE KEY-----',
};


/**
 * @description Constante que representa el texto para el login.
 */
export const LOGIN = 'login';

/**
 * @description Constantes relacionadas con formatos de archivo.
 * Contiene valores como PDF, DPI, MB y KB.
 */
export const PDF = 'PDF';
/**
 * @description Constante que representa el formato de archivo DPI.
 * Utilizado para identificar archivos con formato DPI en la aplicación.
 */
export const DPI = 'DPIs';

/**
 * @description Constante que representa el formato de archivo MB.
 * Utilizado para identificar el tamaño de archivos en megabytes (MB) en la aplicación.
 */
export const MB = 'MB';

/**
 * @description Constante que representa el formato de archivo KB.
 * Utilizado para identificar el tamaño de archivos en kilobytes (KB) en la aplicación.
 */
export const KB = 'KB';

/**
 * @description Constantes relacionadas con unidades de medida.
 * Contiene valores en bytes para KB, MB y GB.
 */
export const UNIDADES = {
  KB: 1024,
  MB: 1048576,
  GB: 1073741824,
};

/**
 * @description Constantes relacionadas con milisegundos.
 * Contiene valores para un día, una semana y un mes en milisegundos.
 */
export const MILISEGUNDOS = {
  DIA: 86400000,
  SEMANA: 604800000,
  MES: 2592000000,
};

/**
 * @description Enumeración que representa los estados de registro.
 * Contiene valores para activar y dar de baja un registro.
 */
export const enum ESTADO_REGISTRO {
  ACTIVAR = 'Activar',
  BAJA = 'Baja',
}

/**
 * @description Enumeración que representa los textos de estado de una fila de registro.
 * Contiene valores para activada y baja.
 */
export const enum TEXTO_FILA_REGISTRO{
  ACTIVADA = 'Activada',
  BAJA = 'Baja',
}

/**
 * @description Constantes relacionadas con el proceso de generación de línea de captura.
 * Contiene la URL para generar la línea de captura y el texto del botón para continuar.
 */
export const GENERAR_LINEA_CAPTURA_URL = 'https://pccem.mat.sat.gob.mx/PTSC/cet/FmpceContr/faces/resources/pages/pagos/formularioMultiplePago.jsf';


