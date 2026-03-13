/**
 * @fileoverview Definiciones de tipos e interfaces para la captura de datos de fabricantes
 * @author Tu Nombre
 * @version 1.0.0
 */

/**
 * Interface que define la estructura de datos para capturar información de fabricantes.
 * Contiene todos los campos necesarios para el registro completo de una empresa o persona física.
 * 
 * @interface CapturarColumns
 * @description Interface utilizada para tipificar los datos de entrada en formularios de captura
 * @example
 * ```typescript
 * const fabricante: CapturarColumns = {
 *   nombreDenominacionORazonSocial: "Empresa S.A. de C.V.",
 *   rfc: "EMP123456789",
 *   curp: "CURP123456HDFABC01",
 *   telefono: 5551234567,
 *   correoElectronico: "contacto@empresa.com",
 *   calle: "Av. Principal",
 *   numeroExterior: 123,
 *   numeroInterior: 4,
 *   pais: "México",
 *   colonia: "Centro",
 *   municipioOAlcaldia: "Ciudad de México",
 *   localidad: "CDMX",
 *   entidadFederativa: "Ciudad de México",
 *   estadoLocalidad: "Activo",
 *   codigoPostal: "01000",
 *   coloniaOEquivalente: "Centro Histórico"
 * };
 * ```
 */
export interface CapturarColumns {
  /**
   * Nombre completo, denominación social o razón social del fabricante
   * @type {string}
   * @description Campo obligatorio que identifica el nombre legal de la empresa o persona
   * @example "Industrias ABC S.A. de C.V."
   */
  nombreDenominacionORazonSocial: string;

  /**
   * Registro Federal de Contribuyentes
   * @type {string}
   * @description Clave única de identificación fiscal en México (12 o 13 caracteres)
   * @example "ABC123456789" o "ABCD123456E12"
   */
  rfc: string;

  /**
   * Clave Única de Registro de Población
   * @type {string}
   * @description Identificador único de personas físicas en México (18 caracteres)
   * @example "CURP123456HDFABC01"
   */
  curp: string;

  /**
   * Número telefónico de contacto
   * @type {number}
   * @description Teléfono principal para contacto comercial o administrativo
   * @example 5551234567
   */
  telefono: number;

  /**
   * Dirección de correo electrónico
   * @type {string}
   * @description Email principal para comunicaciones oficiales
   * @example "contacto@empresa.com"
   */
  correoElectronico: string;

  /**
   * Nombre de la calle del domicilio
   * @type {string}
   * @description Vía pública donde se ubica el domicilio fiscal
   * @example "Avenida Insurgentes Sur"
   */
  calle: string;

  /**
   * Número exterior del domicilio
   * @type {number}
   * @description Numeración oficial asignada por el municipio
   * @example 1234
   */
  numeroExterior: number;

  /**
   * Número interior del domicilio
   * @type {number}
   * @description Numeración interna del inmueble (departamento, oficina, etc.)
   * @example 101
   */
  numeroInterior: number;

  /**
   * País donde se encuentra el domicilio
   * @type {string}
   * @description Nombre del país de ubicación
   * @example "México"
   */
  pais: string;

  /**
   * Colonia o fraccionamiento
   * @type {string}
   * @description Subdivisión territorial urbana
   * @example "Roma Norte"
   */
  colonia: string;

  /**
   * Municipio o alcaldía correspondiente
   * @type {string}
   * @description División política administrativa municipal
   * @example "Cuauhtémoc"
   */
  municipioOAlcaldia: string;

  /**
   * Localidad específica
   * @type {string}
   * @description Población o asentamiento humano específico
   * @example "Ciudad de México"
   */
  localidad: string;

  /**
   * Entidad federativa (estado)
   * @type {string}
   * @description Estado o entidad federativa de la República Mexicana
   * @example "Ciudad de México"
   */
  entidadFederativa: string;

  /**
   * Estado actual de la localidad
   * @type {string}
   * @description Status o condición administrativa de la localidad
   * @example "Activo"
   */
  estadoLocalidad: string;

  /**
   * Código postal
   * @type {string}
   * @description Código numérico de identificación postal (5 dígitos en México)
   * @example "06700"
   */
  codigoPostal: string;

  /**
   * Colonia o asentamiento equivalente
   * @type {string}
   * @description Denominación alternativa de la colonia o tipo de asentamiento
   * @example "Fraccionamiento Las Flores"
   */
  coloniaOEquivalente: string;
}

/**
 * Configuración de columnas para la tabla de fabricantes.
 * Define la estructura, orden y funciones de acceso para cada columna de la tabla.
 * 
 * @constant {Array<Object>} FABRICANTE_TABLE_COLUMNS
 * @description Array de objetos que define la configuración de columnas para mostrar datos de fabricantes
 * @readonly
 * 
 * @property {string} encabezado - Texto que se muestra en el encabezado de la columna
 * @property {Function} clave - Función que extrae el valor específico de cada fila
 * @property {number} orden - Posición numérica de la columna en la tabla
 * 
 * @example
 * ```typescript
 * // Uso en un componente de tabla
 * const renderTable = (data: CapturarColumns[]) => {
 *   return FABRICANTE_TABLE_COLUMNS.map(column => (
 *     <th key={column.orden}>{column.encabezado}</th>
 *   ));
 * };
 * 
 * // Extracción de datos de una fila
 * const getValue = (row: CapturarColumns, columnIndex: number) => {
 *   return FABRICANTE_TABLE_COLUMNS[columnIndex].clave(row);
 * };
 * ```
 */
export const FABRICANTE_TABLE_COLUMNS =
  [
    {
      /**
       * Columna para mostrar el nombre o razón social
       * @type {Object}
       * @property {string} encabezado - "Nombre/denominación o razón social"
       * @property {Function} clave - Función que retorna el nombre de la empresa
       * @property {number} orden - Posición 1 en la tabla
       */
      encabezado: 'Nombre/denominación o razón social',
      clave: (fila: CapturarColumns): string => fila.nombreDenominacionORazonSocial,
      orden: 1,
    },
    {
      /**
       * Columna para mostrar el RFC
       * @type {Object}
       * @property {string} encabezado - "R.F.C."
       * @property {Function} clave - Función que retorna el RFC
       * @property {number} orden - Posición 2 en la tabla
       */
      encabezado: 'R.F.C.',
      clave: (fila: CapturarColumns): string => fila.rfc,
      orden: 2,
    },
    {
      /**
       * Columna para mostrar el CURP
       * @type {Object}
       * @property {string} encabezado - "CURP"
       * @property {Function} clave - Función que retorna el CURP
       * @property {number} orden - Posición 3 en la tabla
       */
      encabezado: 'CURP',
      clave: (fila: CapturarColumns): string => fila.curp,
      orden: 3,
    },
    {
      /**
       * Columna para mostrar el teléfono
       * @type {Object}
       * @property {string} encabezado - "Teléfono"
       * @property {Function} clave - Función que retorna el número telefónico
       * @property {number} orden - Posición 4 en la tabla
       */
      encabezado: 'Teléfono',
      clave: (fila: CapturarColumns): number => fila.telefono,
      orden: 4,
    },
    {
      /**
       * Columna para mostrar el correo electrónico
       * @type {Object}
       * @property {string} encabezado - "Correo electrónico"
       * @property {Function} clave - Función que retorna el email
       * @property {number} orden - Posición 5 en la tabla
       */
      encabezado: 'Correo electrónico',
      clave: (fila: CapturarColumns): string => fila.correoElectronico,
      orden: 5,
    },
    {
      /**
       * Columna para mostrar la calle
       * @type {Object}
       * @property {string} encabezado - "Calle"
       * @property {Function} clave - Función que retorna el nombre de la calle
       * @property {number} orden - Posición 6 en la tabla
       */
      encabezado: 'Calle',
      clave: (fila: CapturarColumns): string => fila.calle,
      orden: 6,
    },
    {
      /**
       * Columna para mostrar el número exterior
       * @type {Object}
       * @property {string} encabezado - "Número exterior"
       * @property {Function} clave - Función que retorna el número exterior
       * @property {number} orden - Posición 7 en la tabla
       */
      encabezado: 'Número exterior',
      clave: (fila: CapturarColumns): number => fila.numeroExterior,
      orden: 7,
    },
    {
      /**
       * Columna para mostrar el número interior
       * @type {Object}
       * @property {string} encabezado - "Número interior"
       * @property {Function} clave - Función que retorna el número interior
       * @property {number} orden - Posición 8 en la tabla
       */
      encabezado: 'Número interior',
      clave: (fila: CapturarColumns): number => fila.numeroInterior,
      orden: 8,
    },
    {
      /**
       * Columna para mostrar el país
       * @type {Object}
       * @property {string} encabezado - "País"
       * @property {Function} clave - Función que retorna el nombre del país
       * @property {number} orden - Posición 9 en la tabla
       */
      encabezado: 'País',
      clave: (fila: CapturarColumns): string => fila.pais,
      orden: 9,
    },
    {
      /**
       * Columna para mostrar la colonia
       * @type {Object}
       * @property {string} encabezado - "Colonia"
       * @property {Function} clave - Función que retorna el nombre de la colonia
       * @property {number} orden - Posición 10 en la tabla
       */
      encabezado: 'Colonia',
      clave: (fila: CapturarColumns): string => fila.colonia,
      orden: 10,
    },
    {
      /**
       * Columna para mostrar el municipio o alcaldía
       * @type {Object}
       * @property {string} encabezado - "Municipio o alcaldía"
       * @property {Function} clave - Función que retorna el municipio
       * @property {number} orden - Posición 11 en la tabla
       */
      encabezado: 'Municipio o alcaldía',
      clave: (fila: CapturarColumns): string => fila.municipioOAlcaldia,
      orden: 11,
    },
    {
      /**
       * Columna para mostrar la localidad
       * @type {Object}
       * @property {string} encabezado - "Localidad"
       * @property {Function} clave - Función que retorna la localidad
       * @property {number} orden - Posición 12 en la tabla
       */
      encabezado: 'Localidad',
      clave: (fila: CapturarColumns): string => fila.localidad,
      orden: 12,
    },
    {
      /**
       * Columna para mostrar la entidad federativa
       * @type {Object}
       * @property {string} encabezado - "Entidad federativa"
       * @property {Function} clave - Función que retorna la entidad federativa
       * @property {number} orden - Posición 13 en la tabla
       */
      encabezado: 'Entidad federativa',
      clave: (fila: CapturarColumns): string => fila.entidadFederativa,
      orden: 13,
    },
    {
      /**
       * Columna para mostrar el estado de la localidad
       * @type {Object}
       * @property {string} encabezado - "Estado/localidad"
       * @property {Function} clave - Función que retorna el estado de la localidad
       * @property {number} orden - Posición 14 en la tabla
       */
      encabezado: 'Estado/localidad',
      clave: (fila: CapturarColumns): string => fila.estadoLocalidad,
      orden: 14,
    },
    {
      /**
       * Columna para mostrar el código postal
       * @type {Object}
       * @property {string} encabezado - "Código postal"
       * @property {Function} clave - Función que retorna el código postal
       * @property {number} orden - Posición 15 en la tabla
       */
      encabezado: 'Código postal',
      clave: (fila: CapturarColumns): string => fila.codigoPostal,
      orden: 15,
    },
    {
      /**
       * Columna para mostrar la colonia o equivalente
       * @type {Object}
       * @property {string} encabezado - "Colonia o equivalente"
       * @property {Function} clave - Función que retorna la colonia equivalente
       * @property {number} orden - Posición 16 en la tabla
       */
      encabezado: 'Colonia o equivalente',
      clave: (fila: CapturarColumns): string => fila.coloniaOEquivalente,
      orden: 16,
    },
  ];