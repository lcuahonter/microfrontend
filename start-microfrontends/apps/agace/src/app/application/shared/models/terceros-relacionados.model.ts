/**
 * Representa un enlace operativo (Enlace Operativo) con información detallada personal y de contacto.
 */
export interface EnlaceOperativo {
  rfc: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  ciudadOEstadoDeResidencia: string;
  cargoOPuesto: string;
  telefono: string;
  correoElectronico: string;
  suplente: string;
}

/**
 * Representa a una persona con detalles de identificación y personales.
 */
export interface Personas {
  rfc: string;
  curp: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

/**
 * Representa una constante `ENLACE_TABLA` que define la estructura de una tabla
 * para mostrar información sobre entidades de tipo "Enlace Operativo".
 * Cada objeto en el arreglo corresponde a una columna en la tabla.
 *
 * @constant
 * @type {Array<{ encabezado: string; clave: (ele: EnlaceOperativo) => any; orden: number }>}
 *
 * @property {string} encabezado - El nombre del encabezado de la columna de la tabla.
 * @property {(ele: EnlaceOperativo) => any} clave - Una función que extrae el valor
 *     para la columna desde un objeto `EnlaceOperativo`.
 * @property {number} orden - El orden en el que la columna aparece en la tabla.
 */
export const ENLACE_TABLA = [
  {
    encabezado: 'RFC',
    clave: (ele: EnlaceOperativo): string => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Nombre',
    clave: (ele: EnlaceOperativo): string => ele.nombre,
    orden: 2,
  },
  {
    encabezado: 'Apellido Paterno',
    clave: (ele: EnlaceOperativo): string => ele.apellidoPaterno,
    orden: 3,
  },
  {
    encabezado: 'Apellido Materno',
    clave: (ele: EnlaceOperativo): string => ele.apellidoMaterno,
    orden: 4,
  },
  {
    encabezado: 'Ciudad o Estado de Residencia',
    clave: (ele: EnlaceOperativo): string => ele.ciudadOEstadoDeResidencia,
    orden: 5,
  },
  {
    encabezado: 'Cargo o Puesto',
    clave: (ele: EnlaceOperativo): string => ele.cargoOPuesto,
    orden: 6,
  },
  {
    encabezado: 'Teléfono',
    clave: (ele: EnlaceOperativo): string => ele.telefono,
    orden: 7,
  },
  {
    encabezado: 'Correo Electrónico',
    clave: (ele: EnlaceOperativo): string => ele.correoElectronico,
    orden: 8,
  },
  {
    encabezado: 'Suplente',
    clave: (ele: EnlaceOperativo): string => ele.suplente,
    orden: 9,
  },
];

/**
 * Representa una constante que define un arreglo de objetos utilizado para
 * especificar la estructura y mapeo de propiedades para entidades de tipo "Personas".
 * Cada objeto en el arreglo incluye:
 * - Un nombre de encabezado (`encabezado`) para propósitos de visualización.
 * - Una función de mapeo de clave (`clave`) para extraer la propiedad correspondiente de un objeto `Personas`.
 * - Un orden (`orden`) para determinar la secuencia de los campos.
 *
 * @constant
 * @type {Array<{ encabezado: string; clave: (ele: Personas) => any; orden: number }>}
 */
export const PERSONAS_PARA = [
  {
    encabezado: 'RFC',
    clave: (ele: Personas): string => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'CURP',
    clave: (ele: Personas): string => ele.curp,
    orden: 2,
  },
  {
    encabezado: 'Nombre',
    clave: (ele: Personas): string => ele.nombre,
    orden: 3,
  },
  {
    encabezado: 'Apellido Paterno',
    clave: (ele: Personas): string => ele.apellidoPaterno,
    orden: 4,
  },
  {
    encabezado: 'Apellido Materno',
    clave: (ele: Personas): string => ele.apellidoMaterno,
    orden: 5,
  },
];
