/**
 * @constant
 * @name CROSLISTA_DE_PAISES
 * @description
 * Lista de países representados como cadenas de texto. Cada elemento de la lista
 * contiene el nombre oficial del país, incluyendo su forma de gobierno o denominación
 * oficial en algunos casos.
 * 
 * @type {string[]}
 * @example
 * // Ejemplo de uso:
 * console.log(CROSLISTA_DE_PAISES[0]); // Salida: 'AFGANISTÁN (EMIRATO ISLÁMICO)'
 */
export const CROSLISTA_DE_PAISES: string[] = [
  'AFGANISTÁN (EMIRATO ISLÁMICO)',
  'ALBANIA (REPÚBLICA DE)',
  'ALEMANIA (REPÚBLICA FEDERAL DE)',
  'ANDORRA (PRINCIPADO DE)',
  'ANGOLA (REPÚBLICA DE)',
  'ANGUILLA',
  'ANTIGUA Y BARBUDA',
  'ARABIA SAUDITA (COMUNIDAD ECONÓMICA EUROPEA)',
  'ARGELIA (REPÚBLICA DEMOCRÁTICA Y POPULAR DE)',
  'ARGENTINA (REPÚBLICA)',
  'AUSTRALIA (COMMONWEALTH OF)',
  'AUSTRIA (REPUBLIC OF)',
  'BAHAMAS (COMMONWEALTH OF THE)',
  'BAHRAIN (KINGDOM OF)',
  "BANGLADESH (PEOPLE'S REPUBLIC OF)",
  'BARBADOS',
  'BELGIUM (KINGDOM OF)',
  'BELIZE',
  'BENIN (REPUBLIC OF)',
  'BHUTAN (KINGDOM OF)',
];

/**
 * @constant PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE
 * @description
 * Lista de identificadores de procedimientos específicos destinados a no contribuyentes.
 * Estos identificadores se utilizan para clasificar y manejar solicitudes relacionadas
 * con personas o entidades que no están registradas como contribuyentes.
 */
export const PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE = [260216];

/**
 * Constante que representa el valor 'Nacional'.
 * Puede ser utilizada para identificar o categorizar elementos
 * relacionados con el ámbito nacional.
 */
export const STR_NACIONAL = 'Nacional';

/**
 * Opciones disponibles para el tipo de persona.
 * 
 * Contiene dos opciones:
 * - 'Física': Representa a una persona física.
 * - 'Moral': Representa a una persona moral.
 * 
 * Cada opción incluye una etiqueta (`label`) y un valor (`value`).
 */
export const TIPO_PERSONA_OPCIONES = [
  { label: 'Física', value: 'Fisica', hint:'Una persona fisica es entendida como toda persona con una actividad especifica' },
  { label: 'Moral', value: 'Moral', hint:'Una persona moral es entendida como una empresa con una actividad especifica' },
];

/**
 * Opciones de nacionalidad para terceros.
 * 
 * Este arreglo contiene las opciones disponibles para la nacionalidad de terceros,
 * cada una representada por un objeto con una etiqueta (`label`) y un valor (`value`).
 * 
 * Opciones disponibles:
 * - Mexicana
 * - Extranjero
 */
export const TERCEROS_NACIONALIDAD_OPCIONES = [
  {
    label: 'Mexicana',
    value: 'Mexicana',
  },
  {
    label: 'Extranjero',
    value: 'Extranjero',
  },
];

/**
 * Constante que define los números de trámite utilizados en el sistema.
 * 
 * Cada propiedad de este objeto representa un tipo específico de trámite,
 * identificado por un código único. Estos códigos son utilizados para 
 * clasificar y manejar diferentes solicitudes dentro de la aplicación.
 * 
 * Propiedades:
 * - `TRAMITE_240108`: Código para el trámite 240108.
 * - `TRAMITE_240114`: Código para el trámite 240114.
 * - `TRAMITE_240308`: Código para el trámite 240308.
 * - `TRAMITE_240117`: Código para el trámite 240117.
 * - `TRAMITE_240121`: Código para el trámite 240121.
 * - `TRAMITE_240405`: Código para el trámite 240405.
 * - `TRAMITE_240305`: Código para el trámite 240305.
 *  -`TRAMITE_240311`: Código para el trámite 240311.
 * - `TRAMITE_240411`: Código para el trámite 240411.
 * - `TRAMITE_240407`: Código para el trámite 240407.
 */
export const NUMERO_TRAMITE = {
  TRAMITE_240108: 240108,
  TRAMITE_240101: 240101,
  TRAMITE_240119: 240119,
  TRAMITE_240114: 240114,
  TRAMITE_240308: 240308,
  TRAMITE_240117: 240117,
  TRAMITE_240120: 240120,
  TRAMITE_240121: 240121,
  TRAMITE_240405: 240405,
  TRAMITE_240305: 240305,
  TRAMITE_240311: 240311,
  TRAMITE_240411: 240411,
  TRAMITE_240122: 240122,
  TRAMITE_240407: 240407,
  TRAMITE_240123: 240123,
  TRAMITE_240321: 240321,
  TRAMITE_240118: 240118,
  TRAMITE_240105: 240105
}

/**
 * Opciones de nacionalidad para terceros, utilizadas para definir si un tercero es 
 * de nacionalidad "Nacional" o "Extranjero".
 * 
 * Cada opción incluye:
 * - `label`: El texto que se muestra al usuario.
 * - `value`: El valor asociado a la opción.
 */
export const TERCEROS_NACIONALIDAD_OPCIONES_EXTRANJERO = [
  {
    label: 'Nacional',
    value: 'Nacional',
  },
  {
    label: 'Extranjero',
    value: 'Extranjero',
  },
];

/*
**
 * Opciones disponibles para el tipo de persona no contribuyente.
 * 
 * Contiene una opción:
 * - 'NoContribyunte': Representa a un no contribuyente.
 * 
 * Cada opción incluye una etiqueta (`label`) y un valor (`value`).
 */
export const TIPO_PERSONA_OPCIONES_NO_CONTRIBUYENTE = [
  { label: 'NoContribyunte', value: 'NoContribyunte' },
];


/**
 * Constante que define los campos obligatorios para el destinatario.
 * 
 * @const CAMPO_OBLIGATORIO_DESTINATARIO
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos que representan
 * los campos que son obligatorios para el destinatario en el contexto de la solicitud.
 */
export const CAMPO_OBLIGATORIO_DESTINATARIO = [240111,240105,240117,260208];

/**
 * @const CAMPO_OBLIGATORIO_DESTINATARIO_PROVEEDOR
 * @description Representa un arreglo que contiene los identificadores de los campos obligatorios
 *              relacionados con el destinatario proveedor.
 * @type {number[]}
 */

/**
 * @const MOSTRAR_ASTERISCO
 * @description Representa un arreglo que contiene los identificadores de los campos obligatorios
 *              relacionados con el destinatario proveedor.
 * @type {number[]}
 */
export const MOSTRAR_ASTERISCO = [240118];

/**
 * @const MOSTRAR_INFORMACION
 * @description Representa un arreglo que contiene los identificadores de los campos obligatorios
 *              relacionados con el destinatario proveedor.
 * @type {number[]}
 */
export const MOSTRAR_INFORMACION = [240118];

/**
 * Constante que representa los campos obligatorios para el proveedor.
 * 
 * @const CAMPO_OBLIGATORIO_PROVEEDOR
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos que indican 
 * los campos que son requeridos para el proveedor en el sistema.
 */
export const CAMPO_OBLIGATORIO_PROVEEDOR = [240111, 240105];

/**
 * Constante que representa los campos obligatorios para el formulario de agregar proveedor.
 * 
 * @const AGREGARPROVEEDORFORM
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos que indican 
 * los campos que son requeridos para el formulario de agregar proveedor en el sistema.
 * Estos identificadores se utilizan para validar y mostrar los campos correspondientes
 * en el formulario de proveedores.
 */
export const AGREGARPROVEEDORFORM =[240118, 240120, 240117];

/**
 * Constante que representa los campos obligatorios para los derechos.
 * 
 * @const CAMPO_OBLIGATORIO_DERECHOS
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos que indican 
 * los campos que son requeridos para los derechos en el sistema.
 */
export const CAMPO_OBLIGATORIO_DERECHOS = [240111,240112, 240118, 240120,240114,240108,240105,240117,240305];


/**
 * Constante que define los valores de bandera para el campo "Colonia".
 * 
 * Estos valores se utilizan para identificar y manejar condiciones específicas
 * relacionadas con el campo "Colonia" en la solicitud.
 * 
 * @const
 * @type {number[]}
 */
export const COLONIA_FIELD_FLAG = [240117, 240114, 240122, 240118, 240120];

/**
 * @constant
 * @name TERCEROS_NACIONALIDAD
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos relacionados con la nacionalidad de terceros.
 * Este valor se utiliza para identificar trámites o procesos asociados a terceros con una nacionalidad específica.
 */
export const TERCEROS_NACIONALIDAD = [240123];



/**
 * Constante que representa los títulos personalizados para el destinatario.
 * 
 * @const DESTINATARIO_TITULO_CUSTOM
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos que indican 
 * los títulos personalizados que se aplican al destinatario en el sistema.
 */

export const DESTINATARIO_TITULO_CUSTOM=[240321];
/**
 * Constante que representa los títulos personalizados para el proveedor.
 * 
 * @const PROVEEDOR_TITULO_CUSTOM
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos que indican 
 * los títulos personalizados que se aplican al proveedor en el sistema.
 */
export const PROVEEDOR_TITULO_CUSTOM=[240321];
/**
 * Constante que representa los identificadores para ocultar el botón "Modificar Terceros".
 * 
 * @const OCULTAR_BOTON_MODIFICAR_TERCEROS
 * @type {number[]}
 * @description Contiene un arreglo de identificadores numéricos que indican 
 * las condiciones en las que se debe ocultar el botón "Modificar Terceros" en el sistema.
 */

export const OCULTAR_BOTON_MODIFICAR_TERCEROS=[240321];

