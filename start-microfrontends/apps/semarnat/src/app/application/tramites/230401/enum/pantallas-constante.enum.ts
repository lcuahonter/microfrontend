import { SustanciaSensible } from "../models/tramies230401.model";


/**
 * Constante que define una lista de países en formato de cadena.
 * 
 * Esta lista contiene nombres de países junto con sus respectivas denominaciones oficiales
 * o descripciones adicionales. Es útil para aplicaciones que requieren una lista de países
 * predefinida con información adicional sobre cada uno.
 * 
 * @constant
 * @type {string[]}
 * 
 * @property {string} AFGANISTÁN (EMIRATO ISLÁMICO) - Nombre oficial del país Afganistán.
 * @property {string} ALBANIA (REPÚBLICA DE) - Nombre oficial del país Albania.
 * @property {string} ALEMANIA (REPÚBLICA FEDERAL DE) - Nombre oficial del país Alemania.
 * @property {string} ANDORRA (PRINCIPADO DE) - Nombre oficial del Principado de Andorra.
 * @property {string} ANGOLA (REPÚBLICA DE) - Nombre oficial de la República de Angola.
 * @property {string} ANGUILLA - Nombre del territorio de Anguilla.
 * @property {string} ANTIGUA Y BARBUDA - Nombre oficial del país Antigua y Barbuda.
 * @property {string} ARABIA SAUDITA (COMUNIDAD ECONÓMICA EUROPEA) - Nombre oficial del país Arabia Saudita.
 * @property {string} ARGELIA (REPÚBLICA DEMOCRÁTICA Y POPULAR DE) - Nombre oficial de la República Democrática y Popular de Argelia.
 * @property {string} ARGENTINA (REPÚBLICA) - Nombre oficial de la República Argentina.
 * @property {string} AUSTRALIA (COMMONWEALTH OF) - Nombre oficial de la Commonwealth de Australia.
 * @property {string} AUSTRIA (REPUBLIC OF) - Nombre oficial de la República de Austria.
 * @property {string} BAHAMAS (COMMONWEALTH OF THE) - Nombre oficial de la Commonwealth de las Bahamas.
 * @property {string} BAHRAIN (KINGDOM OF) - Nombre oficial del Reino de Bahréin.
 * @property {string} BANGLADESH (PEOPLE'S REPUBLIC OF) - Nombre oficial de la República Popular de Bangladesh.
 * @property {string} BARBADOS - Nombre oficial del país Barbados.
 * @property {string} BELGIUM (KINGDOM OF) - Nombre oficial del Reino de Bélgica.
 * @property {string} BELIZE - Nombre oficial del país Belice.
 * @property {string} BENIN (REPUBLIC OF) - Nombre oficial de la República de Benín.
 * @property {string} BHUTAN (KINGDOM OF) - Nombre oficial del Reino de Bután.
 */
export const CROSLISTA_DE_PAISES: string[] = [
    "AFGANISTÁN (EMIRATO ISLÁMICO)",
    "ALBANIA (REPÚBLICA DE)",
    "ALEMANIA (REPÚBLICA FEDERAL DE)",
    "ANDORRA (PRINCIPADO DE)",
    "ANGOLA (REPÚBLICA DE)",
    "ANGUILLA",
    "ANTIGUA Y BARBUDA",
    "ARABIA SAUDITA (COMUNIDAD ECONÓMICA EUROPEA)",
    "ARGELIA (REPÚBLICA DEMOCRÁTICA Y POPULAR DE)",
    "ARGENTINA (REPÚBLICA)",
    "AUSTRALIA (COMMONWEALTH OF)",
    "AUSTRIA (REPUBLIC OF)",
    "BAHAMAS (COMMONWEALTH OF THE)",
    "BAHRAIN (KINGDOM OF)",
    "BANGLADESH (PEOPLE'S REPUBLIC OF)",
    "BARBADOS",
    "BELGIUM (KINGDOM OF)",
    "BELIZE",
    "BENIN (REPUBLIC OF)",
    "BHUTAN (KINGDOM OF)"
  ];

/**
 * Contiene los textos utilizados en la sección de requisitos dentro de la aplicación.
 * 
 * Este objeto proporciona instrucciones y mensajes relacionados con la gestión de documentos 
 * en el proceso de trámites. Los textos están estructurados en formato HTML para facilitar 
 * su presentación en la interfaz de usuario.
 * 
 * Propiedades:
 * - `INSTRUCCIONES`: Texto que describe las instrucciones generales para el manejo de documentos 
 *   en el trámite. Incluye detalles sobre documentos obligatorios, eliminación de documentos no 
 *   requeridos y anexado de múltiples documentos del mismo tipo.
 * - `ADJUNTAR`: Texto que explica cómo adjuntar nuevos documentos en el trámite. Proporciona 
 *   instrucciones claras sobre la selección de la opción correspondiente y el uso del botón 
 *   "Adjuntar documentos".
 */
export const TEXTOS_REQUISITOS = {
  INSTRUCCIONES: `<h6>Instrucciones</h6>
      <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
      <p>- En caso de que no requieras algún documento, selecciónalo y elimínalo</p>
      <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
  ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};


/**
 * Representa una acción asociada a un botón en la interfaz de usuario.
 * 
 * Esta interfaz define las propiedades necesarias para describir una acción
 * que puede ser ejecutada al interactuar con un botón.
 */
export interface AccionBoton {
  /**
   * Nombre o descripción de la acción que se ejecutará al presionar el botón.
   * 
   * Ejemplo: "guardar", "eliminar", "editar".
   */
  accion: string;

  /**
   * Valor numérico asociado a la acción del botón.
   * 
   * Este valor puede ser utilizado para identificar o categorizar la acción.
   * Ejemplo: 1 para "guardar", 2 para "eliminar".
   */
  valor: number;
}

  /**
   * Lista de entrada personalizada que contiene nombres de ubicaciones específicas.
   * 
   * Esta constante define un arreglo de cadenas que representan diferentes lugares,
   * incluyendo aeropuertos, aduanas y ciudades en México. Es útil para identificar
   * puntos de entrada personalizados en el contexto de trámites o aplicaciones relacionadas.
   * 
   * Ejemplo de uso:
   * - Validar si una ubicación específica está en la lista.
   * - Mostrar opciones de entrada en una interfaz de usuario.
   * 
   * @const {string[]} LISTA_DE_ENTRADA_PERSONALIZADA
   * @type {string[]}
   * @example
   * console.log(LISTA_DE_ENTRADA_PERSONALIZADA.includes("ACAPULCO, PUERTO Y AEROPUERTO"));
   * // Resultado: true
   */
  export const LISTA_DE_ENTRADA_PERSONALIZADA: string[] = [
    "ACAPULCO, PUERTO Y AEROPUERTO",
    "ADUANA DE PANTACO",
    "AEROPUERTO INT. DE LA CD DE MEXICO",
    "AEROPUERTO INTERNACIONAL FELIPE ANGELES",
    "AGUA PRIETA",
    "AGUASCALIENTES, AGS.",
    "ALTAMIRA",
    "CANCUN, AEROPUERTO",
    "CD. CAMARGO, TAMPS.",
    "CD. DEL CARMEN, CAMP.",
    "CD. JUAREZ, CHIHUAHUA, CHIH."
  ];

/** "t" se utiliza para continuar el botón que se usa globalmente para el procedimiento 230401 */
  export const CONTINUAR: string = "t";


/**
 * Constante que define las secciones y pasos de validación para el trámite 230401.
 * 
 * Esta estructura organiza las validaciones necesarias para cada paso del trámite,
 * indicando qué secciones requieren validación y cuáles no.
 * 
 * Propiedades:
 * - `PASO_1`: Contiene las validaciones específicas para las secciones del primer paso.
 *   - `VALIDACION_SECCION_1`: Indica si la sección 1 requiere validación (booleano).
 *   - `VALIDACION_SECCION_2`: Indica si la sección 2 requiere validación (booleano).
 *   - `VALIDACION_SECCION_3`: Indica si la sección 3 requiere validación (booleano).
 * - `PASO_2`: Contiene la validación general para el segundo paso.
 *   - `VALIDACION_SECCION`: Indica si el paso 2 requiere validación (booleano).
 * - `PASO_3`: Define si el tercer paso requiere validación.
 *   - `requiereValidacion`: Indica si el paso 3 requiere validación (booleano).
 * 
 * Uso:
 * Esta constante puede ser utilizada para determinar dinámicamente qué secciones
 * o pasos deben ser validados en el flujo del trámite 230401.
 */
export const SECCIONES_TRAMITE_230401 = {
  PASO_1: {
    VALIDACION_SECCION_1: false,
    VALIDACION_SECCION_2: true,
    VALIDACION_SECCION_3: true,
  },
  PASO_2: {
    VALIDACION_SECCION: true,
  },
  PASO_3: {
    requiereValidacion: true,
  },
};

/**
 * Configuración de las sustancias sensibles utilizada para definir las propiedades
 * y el orden de las columnas en una tabla o vista relacionada con sustancias sensibles.
 * 
 * Cada objeto en la configuración representa una columna con las siguientes propiedades:
 * - `encabezado`: El título o nombre de la columna que se mostrará en la interfaz de usuario.
 * - `clave`: Una función que toma un objeto de tipo `SustanciaSensible` y devuelve el valor
 *   correspondiente para esa columna.
 * - `orden`: El número que indica la posición de la columna en la tabla o vista.
 */
export const CONFIGURACION_SUSTANCIAS_SENSIBLES = [
  {
    encabezado: 'Número CAS',
    clave: (ele: SustanciaSensible): string | undefined => ele.numeroCAS,
    orden: 1,
  },
  {
    encabezado: 'C.A.S',
    clave: (ele: SustanciaSensible): string | undefined => ele.cas,
    orden: 2,
  },
  {
    encabezado: 'Descripción no arancelaria',
    clave: (ele: SustanciaSensible): string | undefined => ele.descripcionNoArancelaria,
    orden: 3,
  },
  {
    encabezado: 'Nombre químico',
    clave: (ele: SustanciaSensible): string | undefined => ele.nombreQuimico,
    orden: 4,
  },
];