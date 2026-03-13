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


export const DEFAULT_TABLA_ORDENS = [260201];

export const NUMERO_REGISTRO_SANITARIO = [260202];

export const PROCEDIMIENTOS_MUESTRAN_RFC = [260103,260904, 260203,260204,260205,260206, 260210,260213, 260215, 260216, 260214, 260218, 260208, 260201, 260202,260902, 260217,260914,260912, 260903,260917, 260905, 260906, 260918];
