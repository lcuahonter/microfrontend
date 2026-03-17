/**
 * Constante que define la estructura de la tabla para los fabricantes relacionados.
 * Cada objeto en el arreglo representa una columna de la tabla con su encabezado y clave asociada.
 * 
 * @const
 * @type {Array<{ encabezado: string, clave: string }>}
 * 
 * @property {string} encabezado - El nombre del encabezado que se mostrará en la tabla.
 * @property {string} clave - La clave asociada al encabezado, utilizada para identificar los datos.
 */
export const FABRICANTE_TABLA = [
    { encabezado: 'Nombre/denominación o razón social', clave: 'nombre' },
    { encabezado: 'R.F.C', clave: 'rfc' },
    { encabezado: 'CURP', clave: 'curp' },
    { encabezado: 'Teléfono', clave: 'telefono' },
    { encabezado: 'Correo electrónico', clave: 'correoElectronico' },
    { encabezado: 'Calle', clave: 'calle' },
    { encabezado: 'Número exterior', clave: 'numeroExterior' },
    { encabezado: 'Número interior', clave: 'numeroInterior' },
    { encabezado: 'País', clave: 'pais' },
    { encabezado: 'Colonia', clave: 'colonia' },
    { encabezado: 'Municipio o alcaldia', clave: 'municipio' },
    { encabezado: 'Localidad', clave: 'localidad' },
    { encabezado: 'Entidad federativa', clave: 'entidadFederativa' },
    { encabezado: 'Estado/Localidad', clave: 'estado' },
    { encabezado: 'Código postal', clave: 'cp' },
  ];


/**
 * @constant {Array<Object>} OTROS_TABLA
 * @description Contiene una lista de objetos que representan las columnas de una tabla
 * utilizada para mostrar información relacionada con terceros fabricantes.
 * Cada objeto incluye un encabezado y una clave asociada.
 * 
 * @property {string} encabezado - El nombre del encabezado de la columna.
 * @property {string} clave - La clave asociada al encabezado, utilizada como identificador.
 * 
 * @example
 * [
 *   { encabezado: 'Tercero nombre descripción', clave: 'tercero' },
 *   { encabezado: 'Nombre/denominación o razón social', clave: 'nombre' },
 *   ...
 * ]
 */
export const OTROS_TABLA = [
  { encabezado: 'Tercero nombre descripción', clave: 'tercero' },
  { encabezado: 'Nombre/denominación o razón social', clave: 'nombre' },
  { encabezado: 'R.F.C', clave: 'rfc' },
  { encabezado: 'CURP', clave: 'curp' },
  { encabezado: 'Teléfono', clave: 'telefono' },
  { encabezado: 'Correo electrónico', clave: 'correoElectronico' },
  { encabezado: 'Calle', clave: 'calle' },
  { encabezado: 'Número exterior', clave: 'numeroExterior' },
  { encabezado: 'Número interior', clave: 'numeroInterior' },
  { encabezado: 'País', clave: 'pais' },
  { encabezado: 'Colonia', clave: 'colonia' },
  { encabezado: 'Municipio o alcaldia', clave: 'municipio' },
  { encabezado: 'Localidad', clave: 'localidad' },
  { encabezado: 'Entidad federativa', clave: 'entidadFederativa' },
  { encabezado: 'Estado/Localidad', clave: 'estado' },
  { encabezado: 'Código postal', clave: 'cp' },
];

/**
 * @constant {number[]} DEFAULT_TABLA_ORDENS
 * @description Constante que define los IDs de los trámites que utilizan la tabla de órdenes por defecto.
 */
export const DEFAULT_TABLA_ORDENS:number[] = [];

/**
 * @constant {number[]} NUMERO_REGISTRO_SANITARIO
 * @description Constante que define los IDs de los trámites que requieren el número de registro sanitario.
 */
export const NUMERO_REGISTRO_SANITARIO:number[] = [260604];

/**
 * @constant {number[]} PROCEDIMIENTOS_MUESTRAN_RFC
 * @description Constante que define los IDs de los trámites que muestran el campo RFC sanitario.
 */
export const PROCEDIMIENTOS_MUESTRAN_RFC:number[] = [];

/**
 * @constant {number[]} COLONIA_EQUIVALENTE_PROCEDIMIENTOS
 * @description Constante que define los IDs de los trámites que utilizan el campo "Colonia o equivalente".
 */
export const COLONIA_EQUIVALENTE_PROCEDIMIENTOS: number[] = [];