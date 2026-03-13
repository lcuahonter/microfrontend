/**
 * @fileoverview Definiciones de tipos e interfaces para la gestión de destinatarios
 * en el sistema de captura de datos. Incluye la estructura de datos y configuración
 * de columnas para tablas de destinatarios.
 * @author Sistema de Gestión
 * @version 1.0.0
 */

/**
 * Interfaz que define la estructura de datos para las columnas de captura de destinatarios.
 * Esta interfaz representa todos los campos necesarios para registrar la información
 * completa de un destinatario, incluyendo datos personales, de contacto y dirección.
 * 
 * @interface DestinatarioCapturarColumns
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * const destinatario: DestinatarioCapturarColumns = {
 *   nombreDenominacionORazonSocial: "Juan Pérez García",
 *   rfc: "PEGJ850101ABC",
 *   curp: "PEGJ850101HDFRN01",
 *   telefono: 5551234567,
 *   correoElectronico: "juan.perez@email.com",
 *   calle: "Av. Reforma",
 *   numeroExterior: 123,
 *   numeroInterior: 4,
 *   pais: "México",
 *   colonia: "Centro",
 *   municipioOAlcaldia: "Cuauhtémoc",
 *   localidad: "Ciudad de México",
 *   entidadFederativa: "Ciudad de México",
 *   estadoLocalidad: "Activo",
 *   codigoPostal: "06000",
 *   coloniaOEquivalente: "Centro Histórico"
 * };
 * ```
 */
export interface DestinatarioCapturarColumns {
  /**
   * Nombre completo de la persona física o denominación/razón social de la persona moral.
   * Campo obligatorio que identifica al destinatario principal.
   * 
   * @type {string}
   * @minLength 1
   * @maxLength 255
   * @example "Juan Pérez García" | "Empresa ABC S.A. de C.V."
   */
  nombreDenominacionORazonSocial: string;

  /**
   * Registro Federal de Contribuyentes (RFC) del destinatario.
   * Clave alfanumérica única asignada por el SAT para identificación fiscal.
   * 
   * @type {string}
   * @pattern /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/
   * @example "PEGJ850101ABC" | "ABC123456DEF"
   */
  rfc: string;

  /**
   * Clave Única de Registro de Población (CURP) del destinatario.
   * Aplica únicamente para personas físicas mexicanas.
   * 
   * @type {string}
   * @pattern /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z]{2}$/
   * @example "PEGJ850101HDFRN01"
   */
  curp: string;

  /**
   * Número telefónico de contacto del destinatario.
   * Número entero que representa el teléfono principal de contacto.
   * 
   * @type {number}
   * @minimum 1000000000
   * @maximum 9999999999
   * @example 5551234567
   */
  telefono: number;

  /**
   * Dirección de correo electrónico del destinatario.
   * Campo de contacto digital principal para comunicaciones.
   * 
   * @type {string}
   * @format email
   * @example "usuario@dominio.com"
   */
  correoElectronico: string;

  /**
   * Nombre de la calle donde se ubica el domicilio del destinatario.
   * Parte principal de la dirección física.
   * 
   * @type {string}
   * @minLength 1
   * @maxLength 100
   * @example "Av. Insurgentes Sur" | "Calle 5 de Mayo"
   */
  calle: string;

  /**
   * Número exterior del domicilio del destinatario.
   * Identificador numérico visible desde la vía pública.
   * 
   * @type {number}
   * @minimum 1
   * @maximum 99999
   * @example 1234 | 567
   */
  numeroExterior: number;

  /**
   * Número interior del domicilio del destinatario.
   * Identificador interno dentro del inmueble (apartamento, oficina, etc.).
   * 
   * @type {number}
   * @minimum 1
   * @maximum 9999
   * @example 4 | 101
   */
  numeroInterior: number;

  /**
   * País donde se encuentra ubicado el destinatario.
   * Nombre completo del país de residencia.
   * 
   * @type {string}
   * @minLength 1
   * @maxLength 50
   * @example "México" | "Estados Unidos" | "España"
   */
  pais: string;

  /**
   * Nombre de la colonia o barrio del destinatario.
   * División territorial urbana donde se ubica el domicilio.
   * 
   * @type {string}
   * @minLength 1
   * @maxLength 100
   * @example "Del Valle" | "Roma Norte" | "Centro"
   */
  colonia: string;

  /**
   * Municipio o alcaldía donde reside el destinatario.
   * División política administrativa a nivel municipal.
   * 
   * @type {string}
   * @minLength 1
   * @maxLength 100
   * @example "Benito Juárez" | "Cuauhtémoc" | "Tlalpan"
   */
  municipioOAlcaldia: string;

  /**
   * Localidad específica del destinatario.
   * Población o asentamiento humano dentro del municipio.
   * 
   * @type {string}
   * @minLength 1
   * @maxLength 100
   * @example "Ciudad de México" | "Guadalajara" | "Monterrey"
   */
  localidad: string;

  /**
   * Entidad federativa (estado) donde se ubica el destinatario.
   * División territorial de primer nivel en México.
   * 
   * @type {string}
   * @minLength 1
   * @maxLength 50
   * @example "Ciudad de México" | "Jalisco" | "Nuevo León"
   */
  entidadFederativa: string;

  /**
   * Estado o condición de la localidad del destinatario.
   * Campo informativo sobre el estatus actual de la ubicación.
   * 
   * @type {string}
   * @minLength 1
   * @maxLength 50
   * @example "Activo" | "Inactivo" | "En proceso"
   */
  estadoLocalidad: string;

  /**
   * Código postal de la dirección del destinatario.
   * Código numérico de 5 dígitos para identificación postal.
   * 
   * @type {string}
   * @pattern /^[0-9]{5}$/
   * @example "01000" | "44100" | "64000"
   */
  codigoPostal: string;

  /**
   * Colonia o equivalente alternativo del destinatario.
   * Campo adicional para especificar colonias con nombres alternativos.
   * 
   * @type {string}
   * @minLength 1
   * @maxLength 100
   * @example "Centro Histórico" | "Zona Rosa" | "Polanco"
   */
  coloniaOEquivalente: string;
}

/**
 * Configuración de columnas para la tabla de destinatarios.
 * Define la estructura y comportamiento de cada columna en la interfaz de usuario,
 * incluyendo encabezados, funciones de acceso a datos y orden de presentación.
 * 
 * @constant {Array<ColumnConfig>} DESTINATARIO_TABLE_COLUMNS
 * @since 1.0.0
 * 
 * @description
 * Este arreglo contiene objetos de configuración para cada columna de la tabla
 * de destinatarios. Cada objeto define:
 * - encabezado: Texto mostrado en el header de la columna
 * - clave: Función que extrae el valor de la fila correspondiente
 * - orden: Posición de la columna en la tabla (1-16)
 * 
 * @example
 * ```typescript
 * // Uso en componente de tabla
 * const columns = DESTINATARIO_TABLE_COLUMNS.map(col => ({
 *   Header: col.encabezado,
 *   accessor: col.clave,
 *   sortOrder: col.orden
 * }));
 * ```
 */
export const DESTINATARIO_TABLE_COLUMNS = [
  /**
   * Configuración para la columna de nombre/denominación o razón social.
   * Primera columna que muestra la identificación principal del destinatario.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Nombre/denominación o razón social"
   * @property {function} clave - Función que retorna el nombre del destinatario
   * @property {number} orden - Posición 1 en la tabla
   */
  {
    encabezado: 'Nombre/denominación o razón social',
    clave: (fila: DestinatarioCapturarColumns): string => fila.nombreDenominacionORazonSocial,
    orden: 1
  },
  /**
   * Configuración para la columna de RFC (Registro Federal de Contribuyentes).
   * Segunda columna que muestra la clave fiscal del destinatario.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "R.F.C."
   * @property {function} clave - Función que retorna el RFC del destinatario
   * @property {number} orden - Posición 2 en la tabla
   */
  {
    encabezado: 'R.F.C.',
    clave: (fila: DestinatarioCapturarColumns): string => fila.rfc,
    orden: 2,
  },
  /**
   * Configuración para la columna de CURP (Clave Única de Registro de Población).
   * Tercera columna que muestra la clave única poblacional del destinatario.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "CURP"
   * @property {function} clave - Función que retorna la CURP del destinatario
   * @property {number} orden - Posición 3 en la tabla
   */
  {
    encabezado: 'CURP',
    clave: (fila: DestinatarioCapturarColumns): string => fila.curp,
    orden: 3,
  },
  /**
   * Configuración para la columna de teléfono.
   * Cuarta columna que muestra el número telefónico de contacto.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Teléfono"
   * @property {function} clave - Función que retorna el teléfono del destinatario
   * @property {number} orden - Posición 4 en la tabla
   */
  {
    encabezado: 'Teléfono',
    clave: (fila: DestinatarioCapturarColumns): number => fila.telefono,
    orden: 4,
  },
  /**
   * Configuración para la columna de correo electrónico.
   * Quinta columna que muestra la dirección de email del destinatario.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Correo electrónico"
   * @property {function} clave - Función que retorna el email del destinatario
   * @property {number} orden - Posición 5 en la tabla
   */
  {
    encabezado: 'Correo electrónico',
    clave: (fila: DestinatarioCapturarColumns): string => fila.correoElectronico,
    orden: 5,
  },
  /**
   * Configuración para la columna de calle.
   * Sexta columna que muestra el nombre de la calle del domicilio.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Calle"
   * @property {function} clave - Función que retorna la calle del destinatario
   * @property {number} orden - Posición 6 en la tabla
   */
  {
    encabezado: 'Calle',
    clave: (fila: DestinatarioCapturarColumns): string => fila.calle,
    orden: 6,
  },
  /**
   * Configuración para la columna de número exterior.
   * Séptima columna que muestra el número exterior del domicilio.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Número exterior"
   * @property {function} clave - Función que retorna el número exterior
   * @property {number} orden - Posición 7 en la tabla
   */
  {
    encabezado: 'Número exterior',
    clave: (fila: DestinatarioCapturarColumns): number => fila.numeroExterior,
    orden: 7,
  },
  /**
   * Configuración para la columna de número interior.
   * Octava columna que muestra el número interior del domicilio.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Número interior"
   * @property {function} clave - Función que retorna el número interior
   * @property {number} orden - Posición 8 en la tabla
   */
  {
    encabezado: 'Número interior',
    clave: (fila: DestinatarioCapturarColumns): number => fila.numeroInterior,
    orden: 8,
  },
  /**
   * Configuración para la columna de país.
   * Novena columna que muestra el país de residencia del destinatario.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "País"
   * @property {function} clave - Función que retorna el país del destinatario
   * @property {number} orden - Posición 9 en la tabla
   */
  {
    encabezado: 'País',
    clave: (fila: DestinatarioCapturarColumns): string => fila.pais,
    orden: 9,
  },
  /**
   * Configuración para la columna de colonia.
   * Décima columna que muestra la colonia del domicilio del destinatario.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Colonia"
   * @property {function} clave - Función que retorna la colonia del destinatario
   * @property {number} orden - Posición 10 en la tabla
   */
  {
    encabezado: 'Colonia',
    clave: (fila: DestinatarioCapturarColumns): string => fila.colonia,
    orden: 10,
  },
  /**
   * Configuración para la columna de municipio o alcaldía.
   * Undécima columna que muestra la división municipal del destinatario.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Municipio o alcaldía"
   * @property {function} clave - Función que retorna el municipio/alcaldía
   * @property {number} orden - Posición 11 en la tabla
   */
  {
    encabezado: 'Municipio o alcaldía',
    clave: (fila: DestinatarioCapturarColumns): string => fila.municipioOAlcaldia,
    orden: 11,
  },
  /**
   * Configuración para la columna de localidad.
   * Duodécima columna que muestra la localidad del destinatario.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Localidad"
   * @property {function} clave - Función que retorna la localidad del destinatario
   * @property {number} orden - Posición 12 en la tabla
   */
  {
    encabezado: 'Localidad',
    clave: (fila: DestinatarioCapturarColumns): string => fila.localidad,
    orden: 12,
  },
  /**
   * Configuración para la columna de entidad federativa.
   * Decimotercera columna que muestra el estado del destinatario.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Entidad federativa"
   * @property {function} clave - Función que retorna la entidad federativa
   * @property {number} orden - Posición 13 en la tabla
   */
  {
    encabezado: 'Entidad federativa',
    clave: (fila: DestinatarioCapturarColumns): string => fila.entidadFederativa,
    orden: 13,
  },
  /**
   * Configuración para la columna de estado/localidad.
   * Decimocuarta columna que muestra el estado de la localidad.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Estado/localidad"
   * @property {function} clave - Función que retorna el estado/localidad
   * @property {number} orden - Posición 14 en la tabla
   */
  {
    encabezado: 'Estado/localidad',
    clave: (fila: DestinatarioCapturarColumns): string => fila.estadoLocalidad,
    orden: 14,
  },
  /**
   * Configuración para la columna de código postal.
   * Decimoquinta columna que muestra el código postal del destinatario.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Código postal"
   * @property {function} clave - Función que retorna el código postal
   * @property {number} orden - Posición 15 en la tabla
   */
  {
    encabezado: 'Código postal',
    clave: (fila: DestinatarioCapturarColumns): string => fila.codigoPostal,
    orden: 15,
  },
  /**
   * Configuración para la columna de colonia o equivalente.
   * Decimosexta columna que muestra la colonia alternativa del destinatario.
   * 
   * @type {ColumnConfig}
   * @property {string} encabezado - "Colonia o equivalente"
   * @property {function} clave - Función que retorna la colonia equivalente
   * @property {number} orden - Posición 16 en la tabla
   */
  {
    encabezado: 'Colonia o equivalente',
    clave: (fila: DestinatarioCapturarColumns): string => fila.coloniaOEquivalente,
    orden: 16,
  },
];