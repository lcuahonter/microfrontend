/**
 * Representa una empresa dentro de un grupo.
 */
export interface EmpresasDelGrupo {
  rfc: string;
  denominctionORazonSocial: string;
  domicillo: string;
}

/**
 * Representa los detalles de registros anteriores relacionados con una entidad empresarial.
 */
export interface Anteriores {
    denominacionSocial: string;
    rfc: string;
    numeroEmpleaUno: string;
    bimestreUno: string;
    numeroEmpleaDos: string;
    bimestreDos: string;
    numeroEmpleaTres: string;
    bimestreTres: string;
}

/**
 * Una constante que representa la estructura de la tabla para mostrar información de empresas.
 * Cada objeto en el arreglo define una columna en la tabla con su encabezado, función de mapeo de datos y orden.
 *
 * @constant
 * @type {Array<{encabezado: string, clave: (ele: EmpresasDelGrupo) => any, orden: number}>}
 *
 * @property {string} encabezado - El nombre del encabezado de la columna.
 * @property {(ele: EmpresasDelGrupo) => any} clave - Una función que mapea un objeto `EmpresasDelGrupo` al valor mostrado en la columna.
 * @property {number} orden - El orden en el que aparece la columna en la tabla.
 */
export const EMPRESAS_TABLA = [
    {
      encabezado: 'RFC',
      clave: (ele: EmpresasDelGrupo): string => ele.rfc,
      orden: 1,
    },
    {
      encabezado: 'Denominction o razon social',
      clave: (ele: EmpresasDelGrupo): string => ele.denominctionORazonSocial,
      orden: 2,
    },
    {
      encabezado: 'Domicillo',
      clave: (ele: EmpresasDelGrupo): string => ele.domicillo,
      orden: 3,
    },
];

/**
 * Una constante `ANTERIORES_TABLA` que define la estructura de una tabla
 * con encabezados, funciones de mapeo de datos y orden para cada columna.
 * 
 * Cada objeto en el arreglo representa una columna en la tabla con las siguientes propiedades:
 * 
 * - `encabezado`: El encabezado o título de la columna.
 * - `clave`: Una función que mapea un objeto `Anteriores` al valor para esta columna.
 * - `orden`: El orden o posición de la columna en la tabla.
 * 
 * Ejemplo de columnas incluye:
 * - Denominación Social
 * - RFC
 * - Número de empleados para varios bimestres
 * - Bimestres (1ro, 2do, 3ro)
 */
export const ANTERIORES_TABLA = [
  {
    encabezado: 'Denominación Social',
    clave: (ele: Anteriores): string => ele.denominacionSocial,
    orden: 1,
  },
  {
    encabezado: 'RFC',
    clave: (ele: Anteriores): string => ele.rfc,
    orden: 2,
  },
  {
    encabezado: 'Número de empleados',
    clave: (ele: Anteriores): string => ele.numeroEmpleaUno,
    orden: 3,
  },
  {
    encabezado: '1er Bimestre',
    clave: (ele: Anteriores): string => ele.bimestreUno,
    orden: 4,
  },
  {
    encabezado: 'Número de empleados',
    clave: (ele: Anteriores): string => ele.numeroEmpleaDos,
    orden: 5,
  },
  {
    encabezado: '2do Bimestre',
    clave: (ele: Anteriores): string => ele.bimestreDos,
    orden: 6,
  },
  {
    encabezado: 'Número de empleados',
    clave: (ele: Anteriores): string => ele.numeroEmpleaTres,
    orden: 7,
  },
  {
    encabezado: '3er Bimestre',
    clave: (ele: Anteriores): string => ele.bimestreTres,
    orden: 8,
  }

];