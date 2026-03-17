/**
 * Lista de aduanas disponibles para selección.
 * @constant
 * @type {string[]}
 */
export const ADUANAS_DISPONIBLES: string[] = [
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
 * Lista de textos requisitos para selección.
 * @constant
 * @type {string[]}
 */

export const TEXTOS_REQUISITOS = {
  INSTRUCCIONES: `<h6>Instrucciones</h6>
      <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
      <p>- En caso de que no requieras algún documento, selecciónalo y elimínalo</p>
      <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
  ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
* Interfaz para definir la acción y el valor del botón.
* @interface AccionBoton
* @property {string} accion - La acción del botón ('cont' o 'atras').
* @property {number} valor - El índice del paso al que se navega.
*/
export interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Lista de LISTA_DE_ENTRADA_PERSONALIZADA para selección.
 * @constant
 * @type {string[]}
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
* Secciones a mostrar dentro de cada Paso de acuerdo al trámite
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
 * Lista de DISPONSIBLE_ADUANA_CHECKBOXES para selección.
 * @constant
 * @type {string[]}
 */
export const DISPONSIBLE_ADUANA_CHECKBOXES = [
  { id: 'regionFronteriza', name: 'Región fronteriza', checked: false, disabled: true, hide: true },
  { id: 'franjaFronteriza', name: 'Franja fronteriza', checked: false, disabled: true, hide: true },
  { id: 'todoTerritorio', name: 'Todo el territorio', checked: false, disabled: false, hide: false }
];

/**
 * Lista de MERCANCIAS para selección.
 * @constant
 * @type {string[]}
 */

export const MERCANCIAS = {
  "tableHeader": ["Fracción aranceleria", "Cantidad", "Cantidad(letra)"],
  "tableBody": [
    {
      "tbodyData": ["06042099", "1.00", "UNO"]
    }
  ]
};

/**
 * Lista de DETALLE para selección.
 * @constant
 * @type {string[]}
 */

export const DETALLE = {
  "tableHeader": ["Nombre científico", "Nombre común"],
  "tableBody": [
    {
      "tbodyData": ["Ananas comosus", "P&iacute;na"]
    }
  ]
};

/**
 * Lista de test cross list para selección.
 * @constant
 * @type {string[]}
 */

export const TEST_CROSS_LIST: string[] = [
  'test 1',
  'test 2',
  'test 3'
];

/**
 * Encabezados de la tabla de solicitudes.
 * Define los títulos de las columnas que se mostrarán en la tabla.
 */
export const SOLICITUD_HEADER = {
  "hSolicitud": [
    "Fecha creación",
    "Mercancía",
    "Cantidad",
    "Proveedor"
  ]
}