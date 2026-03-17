/**
 * Interfaz que define la estructura de datos para las columnas de captura de destinatarios.
 * Contiene toda la información personal y de domicilio requerida para el registro de un destinatario.
 * 
 * @interface DestinatarioCapturarColumns
 * @description Esta interfaz establece el contrato para los datos de destinatarios que pueden ser capturados en el sistema
 */
export interface DestinatarioCapturarColumns {
  /**
   * Nombre completo, denominación comercial o razón social del destinatario
   * @type {string}
   * @description Campo obligatorio que identifica al destinatario, puede ser persona física o moral
   */
  nombreDenominacionORazonSocial: string;

  /**
   * Registro Federal de Contribuyentes del destinatario
   * @type {string}
   * @description Clave única de identificación fiscal asignada por el SAT (Servicio de Administración Tributaria)
   */
  rfc: string;

  /**
   * Clave Única de Registro de Población del destinatario
   * @type {string}
   * @description Identificador único para personas físicas en México, emitido por RENAPO
   */
  curp: string;

  /**
   * Número telefónico de contacto del destinatario
   * @type {number}
   * @description Número de teléfono para comunicarse con el destinatario
   */
  telefono: number;

  /**
   * Dirección de correo electrónico del destinatario
   * @type {string}
   * @description Email de contacto para comunicaciones electrónicas con el destinatario
   */
  correoElectronico: string;

  /**
   * Nombre de la calle donde reside el destinatario
   * @type {string}
   * @description Parte del domicilio que especifica la vía pública
   */
  calle: string;

  /**
   * Número exterior del domicilio del destinatario
   * @type {number}
   * @description Numeración oficial visible desde la vía pública
   */
  numeroExterior: number;

  /**
   * Número interior del domicilio del destinatario
   * @type {number}
   * @description Numeración interna del inmueble (departamento, oficina, etc.)
   */
  numeroInterior: number;

  /**
   * País donde reside el destinatario
   * @type {string}
   * @description Nombre del país de residencia del destinatario
   */
  pais: string;

  /**
   * Colonia o fraccionamiento donde reside el destinatario
   * @type {string}
   * @description Subdivisión territorial dentro del municipio
   */
  colonia: string;

  /**
   * Municipio o alcaldía de residencia del destinatario
   * @type {string}
   * @description División político-administrativa de segundo nivel en México
   */
  municipioOAlcaldia: string;

  /**
   * Localidad específica donde reside el destinatario
   * @type {string}
   * @description Asentamiento humano específico dentro del municipio
   */
  localidad: string;

  /**
   * Entidad federativa (estado) donde reside el destinatario
   * @type {string}
   * @description Estado o entidad federativa de la República Mexicana
   */
  entidadFederativa: string;

  /**
   * Estado o localidad alternativa del destinatario
   * @type {string}
   * @description Campo adicional para especificar estado o localidad cuando sea necesario
   */
  estadoLocalidad: string;

  /**
   * Código postal del domicilio del destinatario
   * @type {string}
   * @description Código numérico de cinco dígitos que identifica la zona postal
   */
  codigoPostal: string;

  /**
   * Colonia o equivalente adicional del destinatario
   * @type {string}
   * @description Campo alternativo para especificar colonia, fraccionamiento o equivalente
   */
  coloniaOEquivalente: string;
}
/**
 * Interfaz que define la estructura de datos para las columnas de captura de destinatarios.
 * Contiene toda la información personal y de domicilio requerida para el registro de un destinatario.
 * 
 * @interface ProveedorCapturarColumns
 * @description Esta interfaz establece el contrato para los datos de destinatarios que pueden ser capturados en el sistema
 */
export interface ProveedorCapturarColumns {
  /**
   * Nombre completo, denominación comercial o razón social del destinatario
   * @type {string}
   * @description Campo obligatorio que identifica al destinatario, puede ser persona física o moral
   */
  nombreDenominacionORazonSocial: string;

  /**
   * Registro Federal de Contribuyentes del destinatario
   * @type {string}
   * @description Clave única de identificación fiscal asignada por el SAT (Servicio de Administración Tributaria)
   */
  rfc: string;

  /**
   * Clave Única de Registro de Población del destinatario
   * @type {string}
   * @description Identificador único para personas físicas en México, emitido por RENAPO
   */
  curp: string;

  /**
   * Número telefónico de contacto del destinatario
   * @type {number}
   * @description Número de teléfono para comunicarse con el destinatario
   */
  telefono: number;

  /**
   * Dirección de correo electrónico del destinatario
   * @type {string}
   * @description Email de contacto para comunicaciones electrónicas con el destinatario
   */
  correoElectronico: string;

  /**
   * Nombre de la calle donde reside el destinatario
   * @type {string}
   * @description Parte del domicilio que especifica la vía pública
   */
  calle: string;

  /**
   * Número exterior del domicilio del destinatario
   * @type {number}
   * @description Numeración oficial visible desde la vía pública
   */
  numeroExterior: number;

  /**
   * Número interior del domicilio del destinatario
   * @type {number}
   * @description Numeración interna del inmueble (departamento, oficina, etc.)
   */
  numeroInterior: number;

  /**
   * País donde reside el destinatario
   * @type {string}
   * @description Nombre del país de residencia del destinatario
   */
  pais: string;

  /**
   * Colonia o fraccionamiento donde reside el destinatario
   * @type {string}
   * @description Subdivisión territorial dentro del municipio
   */
  colonia: string;

  /**
   * Municipio o alcaldía de residencia del destinatario
   * @type {string}
   * @description División político-administrativa de segundo nivel en México
   */
  municipioOAlcaldia: string;

  /**
   * Localidad específica donde reside el destinatario
   * @type {string}
   * @description Asentamiento humano específico dentro del municipio
   */
  localidad: string;

  /**
   * Entidad federativa (estado) donde reside el destinatario
   * @type {string}
   * @description Estado o entidad federativa de la República Mexicana
   */
  entidadFederativa: string;

  /**
   * Estado o localidad alternativa del destinatario
   * @type {string}
   * @description Campo adicional para especificar estado o localidad cuando sea necesario
   */
  estadoLocalidad: string;

  /**
   * Código postal del domicilio del destinatario
   * @type {string}
   * @description Código numérico de cinco dígitos que identifica la zona postal
   */
  codigoPostal: string;

  /**
   * Colonia o equivalente adicional del destinatario
   * @type {string}
   * @description Campo alternativo para especificar colonia, fraccionamiento o equivalente
   */
  coloniaOEquivalente: string;
}

/**
 * Interfaz que define la estructura de datos para las columnas de captura de facturadores.
 * Contiene toda la información personal y de domicilio requerida para el registro de un facturador.
 * 
 * @interface FacturadorCapturarColumns
 * @description Esta interfaz establece el contrato para los datos de facturadores que pueden ser capturados en el sistema
 */
export interface FacturadorCapturarColumns {
  /**
   * Nombre completo, denominación comercial o razón social del destinatario
   * @type {string}
   * @description Campo obligatorio que identifica al destinatario, puede ser persona física o moral
   */
  nombreDenominacionORazonSocial: string;

  /**
   * Registro Federal de Contribuyentes del destinatario
   * @type {string}
   * @description Clave única de identificación fiscal asignada por el SAT (Servicio de Administración Tributaria)
   */
  rfc: string;

  /**
   * Clave Única de Registro de Población del destinatario
   * @type {string}
   * @description Identificador único para personas físicas en México, emitido por RENAPO
   */
  curp: string;

  /**
   * Número telefónico de contacto del destinatario
   * @type {number}
   * @description Número de teléfono para comunicarse con el destinatario
   */
  telefono: number;

  /**
   * Dirección de correo electrónico del destinatario
   * @type {string}
   * @description Email de contacto para comunicaciones electrónicas con el destinatario
   */
  correoElectronico: string;

  /**
   * Nombre de la calle donde reside el destinatario
   * @type {string}
   * @description Parte del domicilio que especifica la vía pública
   */
  calle: string;

  /**
   * Número exterior del domicilio del destinatario
   * @type {number}
   * @description Numeración oficial visible desde la vía pública
   */
  numeroExterior: number;

  /**
   * Número interior del domicilio del destinatario
   * @type {number}
   * @description Numeración interna del inmueble (departamento, oficina, etc.)
   */
  numeroInterior: number;

  /**
   * País donde reside el destinatario
   * @type {string}
   * @description Nombre del país de residencia del destinatario
   */
  pais: string;

  /**
   * Colonia o fraccionamiento donde reside el destinatario
   * @type {string}
   * @description Subdivisión territorial dentro del municipio
   */
  colonia: string;

  /**
   * Municipio o alcaldía de residencia del destinatario
   * @type {string}
   * @description División político-administrativa de segundo nivel en México
   */
  municipioOAlcaldia: string;

  /**
   * Localidad específica donde reside el destinatario
   * @type {string}
   * @description Asentamiento humano específico dentro del municipio
   */
  localidad: string;

  /**
   * Entidad federativa (estado) donde reside el destinatario
   * @type {string}
   * @description Estado o entidad federativa de la República Mexicana
   */
  entidadFederativa: string;

  /**
   * Estado o localidad alternativa del destinatario
   * @type {string}
   * @description Campo adicional para especificar estado o localidad cuando sea necesario
   */
  estadoLocalidad: string;

  /**
   * Código postal del domicilio del destinatario
   * @type {string}
   * @description Código numérico de cinco dígitos que identifica la zona postal
   */
  codigoPostal: string;

  /**
   * Colonia o equivalente adicional del destinatario
   * @type {string}
   * @description Campo alternativo para especificar colonia, fraccionamiento o equivalente
   */
  coloniaOEquivalente: string;
}

/**
 * Configuración de columnas para la tabla de destinatarios.
 * Define la estructura de visualización y acceso a los datos de cada columna en la interfaz de usuario.
 * 
 * @constant {Array<Object>} DESTINATARIO_TABLE_COLUMNS
 * @description Array que contiene la configuración de todas las columnas visibles en la tabla de destinatarios
 * 
 * @property {string} encabezado - Texto que se muestra como título de la columna
 * @property {Function} clave - Función que extrae el valor correspondiente de cada fila de datos
 * @property {number} orden - Número que determina la posición de la columna en la tabla
 * 
 * @example
 * // Uso típico para renderizar una tabla
 * DESTINATARIO_TABLE_COLUMNS.forEach(columna => {
 *   console.log(columna.encabezado); // Muestra el título de la columna
 *   console.log(columna.clave(filaData)); // Obtiene el valor de la columna para una fila específica
 * });
 */
export const DESTINATARIO_TABLE_COLUMNS = [
  /**
   * Columna para mostrar el nombre, denominación o razón social
   * @type {Object}
   * @description Primera columna que identifica al destinatario
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Nombre/denominación o razón social',
    /**
     * Función extractora que obtiene el nombre del destinatario
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El nombre/denominación o razón social del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): string => fila.nombreDenominacionORazonSocial,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 1
  },
  /**
   * Columna para mostrar el RFC (Registro Federal de Contribuyentes)
   * @type {Object}
   * @description Segunda columna con la identificación fiscal
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'R.F.C.',
    /**
     * Función extractora que obtiene el RFC del destinatario
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El RFC del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): string => fila.rfc,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 2,
  },
  /**
   * Columna para mostrar la CURP (Clave Única de Registro de Población)
   * @type {Object}
   * @description Tercera columna con la identificación poblacional
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'CURP',
    /**
     * Función extractora que obtiene la CURP del destinatario
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La CURP del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): string => fila.curp,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 3,
  },
  /**
   * Columna para mostrar el número telefónico
   * @type {Object}
   * @description Cuarta columna con información de contacto telefónico
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Teléfono',
    /**
     * Función extractora que obtiene el teléfono del destinatario
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {number} El número telefónico del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): number => fila.telefono,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 4,
  },
  /**
   * Columna para mostrar la dirección de correo electrónico
   * @type {Object}
   * @description Quinta columna con información de contacto electrónico
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Correo electrónico',
    /**
     * Función extractora que obtiene el email del destinatario
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La dirección de correo electrónico del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): string => fila.correoElectronico,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 5,
  },
  /**
   * Columna para mostrar el nombre de la calle
   * @type {Object}
   * @description Sexta columna con información de domicilio - calle
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Calle',
    /**
     * Función extractora que obtiene la calle del domicilio
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El nombre de la calle del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): string => fila.calle,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 6,
  },
  /**
   * Columna para mostrar el número exterior del domicilio
   * @type {Object}
   * @description Séptima columna con numeración exterior del inmueble
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Número exterior',
    /**
     * Función extractora que obtiene el número exterior
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {number} El número exterior del domicilio
     */
    clave: (fila: DestinatarioCapturarColumns): number => fila.numeroExterior,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 7,
  },
  /**
   * Columna para mostrar el número interior del domicilio
   * @type {Object}
   * @description Octava columna con numeración interior del inmueble
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Número interior',
    /**
     * Función extractora que obtiene el número interior
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {number} El número interior del domicilio
     */
    clave: (fila: DestinatarioCapturarColumns): number => fila.numeroInterior,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 8,
  },
  /**
   * Columna para mostrar el país de residencia
   * @type {Object}
   * @description Novena columna con información del país
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'País',
    /**
     * Función extractora que obtiene el país del destinatario
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El país de residencia del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): string => fila.pais,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 9,
  },
  /**
   * Columna para mostrar la colonia o fraccionamiento
   * @type {Object}
   * @description Décima columna con información de la colonia
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Colonia',
    /**
     * Función extractora que obtiene la colonia del domicilio
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La colonia o fraccionamiento del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): string => fila.colonia,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 10,
  },
  /**
   * Columna para mostrar el municipio o alcaldía
   * @type {Object}
   * @description Undécima columna con información municipal
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Municipio o alcaldía',
    /**
     * Función extractora que obtiene el municipio o alcaldía
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El municipio o alcaldía del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): string => fila.municipioOAlcaldia,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 11,
  },
  /**
   * Columna para mostrar la localidad específica
   * @type {Object}
   * @description Duodécima columna con información de localidad
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Localidad',
    /**
     * Función extractora que obtiene la localidad
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La localidad del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): string => fila.localidad,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 12,
  },
  /**
   * Columna para mostrar la entidad federativa (estado)
   * @type {Object}
   * @description Decimotercera columna con información estatal
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Entidad federativa',
    /**
     * Función extractora que obtiene la entidad federativa
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La entidad federativa del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): string => fila.entidadFederativa,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 13,
  },
  /**
   * Columna para mostrar estado/localidad alternativa
   * @type {Object}
   * @description Decimocuarta columna con información alternativa de ubicación
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Estado/localidad',
    /**
     * Función extractora que obtiene el estado/localidad alternativa
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El estado o localidad alternativa del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): string => fila.estadoLocalidad,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 14,
  },
  /**
   * Columna para mostrar el código postal
   * @type {Object}
   * @description Decimoquinta columna con información postal
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Código postal',
    /**
     * Función extractora que obtiene el código postal
     * @param {DestinatarioCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El código postal del domicilio del destinatario
     */
    clave: (fila: DestinatarioCapturarColumns): string => fila.codigoPostal,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 15,
  },
  /**
   * Columna para mostrar colonia o equivalente adicional
   * @type {Object}
   * @description Decimosexta columna con información adicional de ubicación
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Colonia o equivalente',
    /**
     * Función extractora que obtiene la colonia o equivalente adicional
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La colonia o equivalente adicional del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.coloniaOEquivalente,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 16,
  },
];

/**
 * Configuración de columnas para la tabla de proveedores.
 * Define la estructura de visualización y acceso a los datos de cada columna en la interfaz de usuario.
 * 
 * @constant {Array<Object>} PROVEEDOR_TABLE_COLUMNS
 * @description Array que contiene la configuración de todas las columnas visibles en la tabla de proveedores
 * 
 * @property {string} encabezado - Texto que se muestra como título de la columna
 * @property {Function} clave - Función que extrae el valor correspondiente de cada fila de datos
 * @property {number} orden - Número que determina la posición de la columna en la tabla
 */

export const PROVEEDOR_TABLE_COLUMNS = [
  /**
   * Columna para mostrar el nombre, denominación o razón social
   * @type {Object}
   * @description Primera columna que identifica al destinatario
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Nombre/denominación o razón social',
    /**
     * Función extractora que obtiene el nombre del destinatario
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El nombre/denominación o razón social del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.nombreDenominacionORazonSocial,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 1
  },
  /**
   * Columna para mostrar el RFC (Registro Federal de Contribuyentes)
   * @type {Object}
   * @description Segunda columna con la identificación fiscal
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'R.F.C.',
    /**
     * Función extractora que obtiene el RFC del destinatario
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El RFC del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.rfc,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 2,
  },
  /**
   * Columna para mostrar la CURP (Clave Única de Registro de Población)
   * @type {Object}
   * @description Tercera columna con la identificación poblacional
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'CURP',
    /**
     * Función extractora que obtiene la CURP del destinatario
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La CURP del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.curp,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 3,
  },
  /**
   * Columna para mostrar el número telefónico
   * @type {Object}
   * @description Cuarta columna con información de contacto telefónico
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Teléfono',
    /**
     * Función extractora que obtiene el teléfono del destinatario
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {number} El número telefónico del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): number => fila.telefono,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 4,
  },
  /**
   * Columna para mostrar la dirección de correo electrónico
   * @type {Object}
   * @description Quinta columna con información de contacto electrónico
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Correo electrónico',
    /**
     * Función extractora que obtiene el email del destinatario
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La dirección de correo electrónico del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.correoElectronico,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 5,
  },
  /**
   * Columna para mostrar el nombre de la calle
   * @type {Object}
   * @description Sexta columna con información de domicilio - calle
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Calle',
    /**
     * Función extractora que obtiene la calle del domicilio
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El nombre de la calle del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.calle,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 6,
  },
  /**
   * Columna para mostrar el número exterior del domicilio
   * @type {Object}
   * @description Séptima columna con numeración exterior del inmueble
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Número exterior',
    /**
     * Función extractora que obtiene el número exterior
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {number} El número exterior del domicilio
     */
    clave: (fila: ProveedorCapturarColumns): number => fila.numeroExterior,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 7,
  },
  /**
   * Columna para mostrar el número interior del domicilio
   * @type {Object}
   * @description Octava columna con numeración interior del inmueble
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Número interior',
    /**
     * Función extractora que obtiene el número interior
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {number} El número interior del domicilio
     */
    clave: (fila: ProveedorCapturarColumns): number => fila.numeroInterior,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 8,
  },
  /**
   * Columna para mostrar el país de residencia
   * @type {Object}
   * @description Novena columna con información del país
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'País',
    /**
     * Función extractora que obtiene el país del destinatario
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El país de residencia del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.pais,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 9,
  },
  /**
   * Columna para mostrar la colonia o fraccionamiento
   * @type {Object}
   * @description Décima columna con información de la colonia
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Colonia',
    /**
     * Función extractora que obtiene la colonia del domicilio
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La colonia o fraccionamiento del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.colonia,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 10,
  },
  /**
   * Columna para mostrar el municipio o alcaldía
   * @type {Object}
   * @description Undécima columna con información municipal
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Municipio o alcaldía',
    /**
     * Función extractora que obtiene el municipio o alcaldía
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El municipio o alcaldía del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.municipioOAlcaldia,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 11,
  },
  /**
   * Columna para mostrar la localidad específica
   * @type {Object}
   * @description Duodécima columna con información de localidad
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Localidad',
    /**
     * Función extractora que obtiene la localidad
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La localidad del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.localidad,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 12,
  },
  /**
   * Columna para mostrar la entidad federativa (estado)
   * @type {Object}
   * @description Decimotercera columna con información estatal
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Entidad federativa',
    /**
     * Función extractora que obtiene la entidad federativa
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La entidad federativa del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.entidadFederativa,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 13,
  },
  /**
   * Columna para mostrar estado/localidad alternativa
   * @type {Object}
   * @description Decimocuarta columna con información alternativa de ubicación
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Estado/localidad',
    /**
     * Función extractora que obtiene el estado/localidad alternativa
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El estado o localidad alternativa del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.estadoLocalidad,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 14,
  },
  /**
   * Columna para mostrar el código postal
   * @type {Object}
   * @description Decimoquinta columna con información postal
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Código postal',
    /**
     * Función extractora que obtiene el código postal
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El código postal del domicilio del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.codigoPostal,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 15,
  },
  /**
   * Columna para mostrar colonia o equivalente adicional
   * @type {Object}
   * @description Decimosexta columna con información adicional de ubicación
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Colonia o equivalente',
    /**
     * Función extractora que obtiene la colonia o equivalente adicional
     * @param {ProveedorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La colonia o equivalente adicional del destinatario
     */
    clave: (fila: ProveedorCapturarColumns): string => fila.coloniaOEquivalente,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 16,
  },
];

/**
 * Definición de las columnas para capturar datos de destinatarios.
 * Incluye campos como nombre, RFC, CURP, teléfono, correo electrónico y dirección.
 * 
 * @typedef {Object} DestinatarioCapturarColumns
 * @property {string} nombreDenominacionORazonSocial - Nombre o razón social del destinatario
 * @property {string} rfc - Registro Federal de Contribuyentes del destinatario
 * @property {string} curp - Clave Única de Registro de Población del destinatario
 * @property {number} telefono - Número telefónico del destinatario
 * @property {string} correoElectronico - Dirección de correo electrónico del destinatario
 * @property {string} calle - Nombre de la calle del domicilio
 * @property {number} numeroExterior - Número exterior del domicilio
 * @property {number} numeroInterior - Número interior del domicilio
 * @property {string} pais - País de residencia del destinatario
 * @property {string} colonia - Colonia o fraccionamiento del domicilio
 * @property {string} municipioOAlcaldia - Municipio o alcaldía del domicilio
 * @property {string} localidad - Localidad específica del domicilio
 * @property {string} entidadFederativa - Entidad federativa (estado) del domicilio
 * @property {string} estadoLocalidad - Estado o localidad alternativa del destinatario
 * @property {string} codigoPostal - Código postal del domicilio
 * @property {string} coloniaOEquivalente - Colonia o equivalente adicional del destinatario
 */

export const FACTURADOR_TABLE_COLUMNS = [
  /**
   * Columna para mostrar el nombre, denominación o razón social
   * @type {Object}
   * @description Primera columna que identifica al destinatario
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Nombre/denominación o razón social',
    /**
     * Función extractora que obtiene el nombre del destinatario
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El nombre/denominación o razón social del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.nombreDenominacionORazonSocial,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 1
  },
  /**
   * Columna para mostrar el RFC (Registro Federal de Contribuyentes)
   * @type {Object}
   * @description Segunda columna con la identificación fiscal
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'R.F.C.',
    /**
     * Función extractora que obtiene el RFC del destinatario
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El RFC del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.rfc,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 2,
  },
  /**
   * Columna para mostrar la CURP (Clave Única de Registro de Población)
   * @type {Object}
   * @description Tercera columna con la identificación poblacional
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'CURP',
    /**
     * Función extractora que obtiene la CURP del destinatario
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La CURP del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.curp,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 3,
  },
  /**
   * Columna para mostrar el número telefónico
   * @type {Object}
   * @description Cuarta columna con información de contacto telefónico
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Teléfono',
    /**
     * Función extractora que obtiene el teléfono del destinatario
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {number} El número telefónico del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): number => fila.telefono,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 4,
  },
  /**
   * Columna para mostrar la dirección de correo electrónico
   * @type {Object}
   * @description Quinta columna con información de contacto electrónico
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Correo electrónico',
    /**
     * Función extractora que obtiene el email del destinatario
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La dirección de correo electrónico del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.correoElectronico,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 5,
  },
  /**
   * Columna para mostrar el nombre de la calle
   * @type {Object}
   * @description Sexta columna con información de domicilio - calle
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Calle',
    /**
     * Función extractora que obtiene la calle del domicilio
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El nombre de la calle del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.calle,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 6,
  },
  /**
   * Columna para mostrar el número exterior del domicilio
   * @type {Object}
   * @description Séptima columna con numeración exterior del inmueble
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Número exterior',
    /**
     * Función extractora que obtiene el número exterior
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {number} El número exterior del domicilio
     */
    clave: (fila: FacturadorCapturarColumns): number => fila.numeroExterior,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 7,
  },
  /**
   * Columna para mostrar el número interior del domicilio
   * @type {Object}
   * @description Octava columna con numeración interior del inmueble
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Número interior',
    /**
     * Función extractora que obtiene el número interior
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {number} El número interior del domicilio
     */
    clave: (fila: FacturadorCapturarColumns): number => fila.numeroInterior,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 8,
  },
  /**
   * Columna para mostrar el país de residencia
   * @type {Object}
   * @description Novena columna con información del país
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'País',
    /**
     * Función extractora que obtiene el país del destinatario
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El país de residencia del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.pais,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 9,
  },
  /**
   * Columna para mostrar la colonia o fraccionamiento
   * @type {Object}
   * @description Décima columna con información de la colonia
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Colonia',
    /**
     * Función extractora que obtiene la colonia del domicilio
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La colonia o fraccionamiento del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.colonia,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 10,
  },
  /**
   * Columna para mostrar el municipio o alcaldía
   * @type {Object}
   * @description Undécima columna con información municipal
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Municipio o alcaldía',
    /**
     * Función extractora que obtiene el municipio o alcaldía
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El municipio o alcaldía del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.municipioOAlcaldia,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 11,
  },
  /**
   * Columna para mostrar la localidad específica
   * @type {Object}
   * @description Duodécima columna con información de localidad
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Localidad',
    /**
     * Función extractora que obtiene la localidad
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La localidad del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.localidad,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 12,
  },
  /**
   * Columna para mostrar la entidad federativa (estado)
   * @type {Object}
   * @description Decimotercera columna con información estatal
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Entidad federativa',
    /**
     * Función extractora que obtiene la entidad federativa
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La entidad federativa del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.entidadFederativa,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 13,
  },
  /**
   * Columna para mostrar estado/localidad alternativa
   * @type {Object}
   * @description Decimocuarta columna con información alternativa de ubicación
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Estado/localidad',
    /**
     * Función extractora que obtiene el estado/localidad alternativa
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El estado o localidad alternativa del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.estadoLocalidad,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 14,
  },
  /**
   * Columna para mostrar el código postal
   * @type {Object}
   * @description Decimoquinta columna con información postal
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Código postal',
    /**
     * Función extractora que obtiene el código postal
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} El código postal del domicilio del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.codigoPostal,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 15,
  },
  /**
   * Columna para mostrar colonia o equivalente adicional
   * @type {Object}
   * @description Decimosexta columna con información adicional de ubicación
   */
  {
    /**
     * Título visible de la columna en la interfaz
     * @type {string}
     */
    encabezado: 'Colonia o equivalente',
    /**
     * Función extractora que obtiene la colonia o equivalente adicional
     * @param {FacturadorCapturarColumns} fila - Objeto con los datos de la fila
     * @returns {string} La colonia o equivalente adicional del destinatario
     */
    clave: (fila: FacturadorCapturarColumns): string => fila.coloniaOEquivalente,
    /**
     * Posición de ordenamiento de la columna
     * @type {number}
     */
    orden: 16,
  }
];