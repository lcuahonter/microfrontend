import { ConfiguracionColumna } from '@ng-mf/data-access-user';


/**
 * Representa la información de un destinatario relacionado.
 * Esta interfaz define los datos necesarios para identificar y contactar a un destinatario.
 */
export interface Destinatario {
  /**
   * Indica si el destinatario ha sido seleccionado.
   * @example true
   */
  seleccionado?: boolean;

  /**
   * Nombre o razón social del destinatario.
   * @example "Juan Pérez"
   */
  nombreRazonSocial: string;

  /**
   * Registro Federal de Contribuyentes (RFC) del destinatario.
   * @example "ABC123456T78"
   */
  rfc: string;

  /**
   * Clave Única de Registro de Población (CURP) del destinatario.
   * @example "PEMJ800101HDFNNL09"
   */
  curp: string;

  /**
   * Número de teléfono del destinatario.
   * @example "5551234567"
   */
  telefono: string;

  /**
   * Correo electrónico del destinatario.
   * @example "juan.perez@example.com"
   */
  correoElectronico: string;

  /**
   * Calle donde reside el destinatario.
   * @example "Av. Reforma"
   */
  calle: string;

  /**
   * Número exterior del domicilio del destinatario.
   * @example "123"
   */
  numeroExterior: string;

  /**
   * Número interior del domicilio del destinatario, si aplica.
   * @example "4B"
   */
  numeroInterior: string;

  /**
   * País donde reside el destinatario.
   * @example "México"
   */
  pais: string;

  /**
   * Colonia donde reside el destinatario.
   * @example "Centro"
   */
  colonia: string;

  /**
   * Municipio o alcaldía donde reside el destinatario.
   * @example "Cuauhtémoc"
   */
  municipioAlcaldia: string;

  /**
   * Localidad donde reside el destinatario.
   * @example "Ciudad de México"
   */
  localidad: string;

  /**
   * Entidad federativa donde reside el destinatario.
   * @example "Ciudad de México"
   */
  entidadFederativa: string;

  /**
   * Estado o localidad específica del destinatario.
   * @example "Distrito Federal"
   */
  estadoLocalidad: string;

  /**
   * Código postal del domicilio del destinatario.
   * @example "06000"
   */
  codigoPostal: string;

  /**
   * Colonia equivalente del destinatario, si aplica.
   * @example "Centro Histórico"
   */
  coloniaEquivalente: string;

  /**
   * Identificador único del destinatario.
   * @example "12345"
   */
  id?: string;

  /**
   * Lada telefónica del destinatario.
   * @example "55"
   */
  lada?: string;

  /**
   * Nombres del destinatario.
   * @example "Juan Carlos"
   */
  nombres?: string;

  /**
   * Tipo de persona del destinatario (física o moral).
   * @example "Física"
   */
  tipoPersona?: string;

  /**
   * Segundo apellido del destinatario.
   * @example "Gómez"
   */
  segundoApellido?: string;

  /**
   * Primer apellido del destinatario.
   * @example "Pérez"
   */
  primerApellido?: string;
}


/**
 * Configuración de las columnas para la tabla de destinatarios relacionados.
 * Esta constante define las propiedades de cada columna, incluyendo el encabezado,
 * la clave para acceder a los datos de cada fila y el orden en el que se muestran las columnas.
 * 
 * @type {ConfiguracionColumna<Destinatario>[]}
 * 
 * @property {string} encabezado - Texto que se muestra como encabezado de la columna.
 * @property {function} clave - Función que define cómo acceder al valor de la columna desde una fila.
 * @property {number} orden - Posición de la columna en la tabla.
 * 
 * Ejemplo de configuración de columna:
 * ```typescript
 * {
 *   encabezado: 'Nombre/Denominación o Razón Social',
 *   clave: (fila) => fila.nombreRazonSocial,
 *   orden: 1,
 * }
 * ```
 * 
 * Columnas definidas:
 * - Nombre/Denominación o Razón Social
 * - R.F.C.
 * - CURP
 * - Teléfono
 * - Correo Electrónico
 * - Calle
 * - Número Exterior
 * - Número Interior
 * - País
 * - Colonia
 * - Municipio o Alcaldía
 * - Localidad
 * - Entidad Federativa
 * - Estado/Localidad
 * - Código Postal
 */
export const DESTINATARIO_ENCABEZADO_DE_TABLA: ConfiguracionColumna<Destinatario>[] =
  [
    {
      encabezado: 'Nombre/Denominación o Razón Social',
      clave: (fila) => fila.nombreRazonSocial,
      orden: 1,
    },
    { encabezado: 'R.F.C.', clave: (fila) => fila.rfc, orden: 2 },
    { encabezado: 'CURP', clave: (fila) => fila.curp, orden: 3 },
    { encabezado: 'Teléfono', clave: (fila) => fila.telefono, orden: 4 },
    {
      encabezado: 'Correo Electrónico',
      clave: (fila) => fila.correoElectronico,
      orden: 5,
    },
    { encabezado: 'Calle', clave: (fila) => fila.calle, orden: 6 },
    {
      encabezado: 'Número Exterior',
      clave: (fila) => fila.numeroExterior,
      orden: 7,
    },
    {
      encabezado: 'Número Interior',
      clave: (fila) => fila.numeroInterior,
      orden: 8,
    },
    { encabezado: 'País', clave: (fila) => fila.pais, orden: 9 },
    { encabezado: 'Colonia', clave: (fila) => fila.colonia, orden: 10 },
    {
      encabezado: 'Municipio o Alcaldía',
      clave: (fila) => fila.municipioAlcaldia,
      orden: 11,
    },
    { encabezado: 'Localidad', clave: (fila) => fila.localidad, orden: 12 },
    {
      encabezado: 'Entidad Federativa',
      clave: (fila) => fila.entidadFederativa,
      orden: 13,
    },
    {
      encabezado: 'Estado/Localidad',
      clave: (fila) => fila.estadoLocalidad,
      orden: 14,
    },
    {
      encabezado: 'Código Postal',
      clave: (fila) => fila.codigoPostal,
      orden: 15,
    },
   
  ];


/**
 * Representa el uso de un recurso o elemento en un contexto específico.
 * Esta interfaz define las propiedades relacionadas con la descripción y el país asociado al uso.
 */
export interface Uso {
  /**
   * Descripción detallada del uso del recurso o elemento.
   * Proporciona información sobre cómo se utiliza o aplica.
   * @example "Uso agrícola para fertilización"
   */
  descripcion: string;

  /**
   * País asociado al uso del recurso o elemento.
   * Este campo es opcional y puede no estar presente si el uso no está vinculado a un país específico.
   * @example "México"
   */
  pais?: string;
}

/**
 * Representa la información de un representante relacionado.
 * Esta interfaz define los datos personales y de contacto de un representante,
 * así como su dirección y otros detalles opcionales.
 */
export interface Representante {
  /**
   * Nombre o razón social del representante.
   * @example "Juan Pérez S.A. de C.V."
   */
  nombreRazonSocial: string;

  /**
   * Registro Federal de Contribuyentes (RFC) del representante.
   * @example "ABC123456T78"
   */
  rfc: string;

  /**
   * Clave Única de Registro de Población (CURP) del representante.
   * @example "PEMJ890101HDFRRL01"
   */
  curp: string;

  /**
   * Número de teléfono del representante.
   * @example "5551234567"
   */
  telefono: string;

  /**
   * Correo electrónico del representante.
   * @example "juan.perez@example.com"
   */
  correoElectronico: string;

  /**
   * Calle de la dirección del representante.
   * @example "Av. Reforma"
   */
  calle: string;

  /**
   * Número exterior de la dirección del representante.
   * @example "123"
   */
  numeroExterior: string;

  /**
   * Número interior de la dirección del representante.
   * @example "4B"
   */
  numeroInterior: string;

  /**
   * País de residencia del representante.
   * @example "México"
   */
  pais: string;

  /**
   * Colonia de la dirección del representante.
   * @example "Centro"
   */
  colonia: string;

  /**
   * Municipio o alcaldía de la dirección del representante.
   * @example "Cuauhtémoc"
   */
  municipioAlcaldia: string;

  /**
   * Localidad de la dirección del representante.
   * @example "Ciudad de México"
   */
  localidad: string;

  /**
   * Entidad federativa de la dirección del representante.
   * @example "Ciudad de México"
   */
  entidadFederativa: string;

  /**
   * Estado o localidad específica de la dirección del representante.
   * @example "Distrito Federal"
   */
  estadoLocalidad: string;

  /**
   * Código postal de la dirección del representante.
   * @example "06000"
   */
  codigoPostal: string;

  /**
   * Colonia equivalente en caso de que aplique.
   * @example "Centro Histórico"
   */
  coloniaEquivalente: string;

  /**
   * Segundo apellido del representante (opcional).
   * @example "García"
   */
  segundoApellido?: string;

  /**
   * Primer apellido del representante (opcional).
   * @example "Pérez"
   */
  primerApellido?: string;

  /**
   * Nombres del representante (opcional).
   * @example "Juan Carlos"
   */
  nombres?: string;

  /**
   * Lada del número telefónico del representante (opcional).
   * @example "55"
   */
  lada?: string;

  /**
   * Tipo de persona del representante (opcional).
   * Puede ser "Física" o "Moral".
   * @example "Física"
   */
  tipoPersona?: string;
}

/**
 * Configuración de las columnas para la tabla de representantes relacionados.
 * Esta constante define las propiedades de cada columna, incluyendo el encabezado,
 * la clave para acceder a los datos de cada fila y el orden en el que se muestran las columnas.
 * 
 * @type {ConfiguracionColumna<Representante>[]}
 * 
 * @property {string} encabezado - Texto que se muestra como encabezado de la columna.
 * @property {function} clave - Función que define cómo acceder al valor de la columna desde una fila.
 * @property {number} orden - Posición de la columna en la tabla.
 */
export const REPRESENTANTE_ENCABEZADO_DE_TABLA: ConfiguracionColumna<Representante>[] =
  [
    {
      encabezado: 'Nombre/Denominación o Razón Social',
      clave: (fila) => fila.nombreRazonSocial,
      orden: 1,
    },
    { encabezado: 'R.F.C.', clave: (fila) => fila.rfc, orden: 2 },
    { encabezado: 'CURP', clave: (fila) => fila.curp, orden: 3 },
    { encabezado: 'Teléfono', clave: (fila) => fila.telefono, orden: 4 },
    {
      encabezado: 'Correo Electrónico',
      clave: (fila) => fila.correoElectronico,
      orden: 5,
    },
    { encabezado: 'Calle', clave: (fila) => fila.calle, orden: 6 },
    {
      encabezado: 'Número Exterior',
      clave: (fila) => fila.numeroExterior,
      orden: 7,
    },
    {
      encabezado: 'Número Interior',
      clave: (fila) => fila.numeroInterior,
      orden: 8,
    },
    { encabezado: 'País', clave: (fila) => fila.pais, orden: 9 },
    { encabezado: 'Colonia', clave: (fila) => fila.colonia, orden: 10 },
    {
      encabezado: 'Municipio o Alcaldía',
      clave: (fila) => fila.municipioAlcaldia,
      orden: 11,
    },
    { encabezado: 'Localidad', clave: (fila) => fila.localidad, orden: 12 },
    {
      encabezado: 'Entidad Federativa',
      clave: (fila) => fila.entidadFederativa,
      orden: 13,
    },
    {
      encabezado: 'Estado/Localidad',
      clave: (fila) => fila.estadoLocalidad,
      orden: 14,
    },
    {
      encabezado: 'Código Postal',
      clave: (fila) => fila.codigoPostal,
      orden: 15,
    },
  
  ];

  /**
   * Configuración de columnas para la tabla de uso.
   * Esta constante define las columnas que se mostrarán en la tabla, incluyendo su encabezado,
   * clave para acceder a los datos de cada fila y el orden en que se presentarán.
   * 
   * @type {ConfiguracionColumna<Uso>[]}
   * 
   * @property {string} encabezado - Nombre del encabezado de la columna que se mostrará en la tabla.
   * @property {Function} clave - Función que define cómo acceder al valor de la columna desde una fila.
   * @property {number} orden - Posición de la columna en la tabla, donde un número menor indica mayor prioridad.
   * 
   * @example
   * const USO_TABLA: ConfiguracionColumna<Uso>[] = [
   *   {
   *     encabezado: 'descripcion',
   *     clave: (fila) => fila.descripcion,
   *     orden: 1,
   *   },
   * ];
   */
  export const USO_TABLA: ConfiguracionColumna<Uso>[] =
  [
    {
      encabezado: 'descripcion',
      clave: (fila) => fila.descripcion,
      orden: 1,
    },
  ];


/**
 * Representa la información de uso final de un tercero relacionado.
 * Esta interfaz define los datos personales, de contacto y ubicación de un tercero.
 */
export interface UsoFinal {
  /**
   * Nombre o razón social del tercero.
   * @example "Juan Pérez S.A. de C.V."
   */
  nombreRazonSocial: string;

  /**
   * Registro Federal de Contribuyentes (RFC) del tercero.
   * @example "ABC123456T78"
   */
  rfc: string;

  /**
   * Clave Única de Registro de Población (CURP) del tercero.
   * @example "PEMJ800101HDFNNL09"
   */
  curp: string;

  /**
   * Número de teléfono del tercero.
   * @example "5551234567"
   */
  telefono: string;

  /**
   * Correo electrónico del tercero.
   * @example "correo@ejemplo.com"
   */
  correoElectronico: string;

  /**
   * Calle donde se encuentra ubicado el tercero.
   * @example "Av. Reforma"
   */
  calle: string;

  /**
   * Número exterior del domicilio del tercero.
   * @example "123"
   */
  numeroExterior: string;

  /**
   * Número interior del domicilio del tercero, si aplica.
   * @example "A-2"
   */
  numeroInterior: string;

  /**
   * País donde se encuentra ubicado el tercero.
   * @example "México"
   */
  pais: string;

  /**
   * Colonia donde se encuentra ubicado el tercero.
   * @example "Centro"
   */
  colonia: string;

  /**
   * Municipio o alcaldía donde se encuentra ubicado el tercero.
   * @example "Cuauhtémoc"
   */
  municipioAlcaldia: string;

  /**
   * Localidad donde se encuentra ubicado el tercero.
   * @example "Ciudad de México"
   */
  localidad: string;

  /**
   * Entidad federativa donde se encuentra ubicado el tercero.
   * @example "Ciudad de México"
   */
  entidadFederativa: string;

  /**
   * Estado o localidad específica del tercero.
   * @example "Distrito Federal"
   */
  estadoLocalidad: string;

  /**
   * Código postal del domicilio del tercero.
   * @example "06000"
   */
  codigoPostal: string;

  /**
   * Colonia equivalente en caso de que aplique.
   * @example "Centro Histórico"
   */
  coloniaEquivalente: string;

  /**
   * Descripción adicional sobre el tercero, si aplica.
   * @example "Proveedor de servicios"
   */
  descripcion?: string;

  /**
   * Segundo apellido del tercero, si aplica.
   * @example "García"
   */
  segundoApellido?: string;

  /**
   * Primer apellido del tercero, si aplica.
   * @example "Pérez"
   */
  primerApellido?: string;

  /**
   * Nombres del tercero, si aplica.
   * @example "Juan Carlos"
   */
  nombres?: string;

  /**
   * Lada telefónica del tercero, si aplica.
   * @example "55"
   */
  lada?: string;

  /**
   * Tipo de persona del tercero (física o moral), si aplica.
   * @example "Física"
   */
  tipoPersona?: string;
}

/**
 * Configuración de las columnas para la tabla de uso final de terceros relacionados.
 * Esta constante define las propiedades de cada columna, incluyendo el encabezado,
 * la clave para acceder a los datos de cada fila y el orden en el que se muestran las columnas.
 * 
 * @type {ConfiguracionColumna<UsoFinal>[]}
 * 
 * @property {string} encabezado - Texto que se muestra como encabezado de la columna.
 * @property {function} clave - Función que define cómo acceder al valor de la columna desde una fila.
 * @property {number} orden - Posición de la columna en la tabla.
 */
export const USO_FINAL_ENCABEZADO_DE_TABLA: ConfiguracionColumna<UsoFinal>[] =
  [
    {
      encabezado: 'Nombre/Denominación o Razón Social',
      clave: (fila) => fila.nombreRazonSocial,
      orden: 1,
    },
    { encabezado: 'R.F.C.', clave: (fila) => fila.rfc, orden: 2 },
    { encabezado: 'CURP', clave: (fila) => fila.curp, orden: 3 },
    { encabezado: 'Teléfono', clave: (fila) => fila.telefono, orden: 4 },
    {
      encabezado: 'Correo Electrónico',
      clave: (fila) => fila.correoElectronico,
      orden: 5,
    },
    { encabezado: 'Calle', clave: (fila) => fila.calle, orden: 6 },
    {
      encabezado: 'Número Exterior',
      clave: (fila) => fila.numeroExterior,
      orden: 7,
    },
    {
      encabezado: 'Número Interior',
      clave: (fila) => fila.numeroInterior,
      orden: 8,
    },
    { encabezado: 'País', clave: (fila) => fila.pais, orden: 9 },
    { encabezado: 'Colonia', clave: (fila) => fila.colonia, orden: 10 },
    {
      encabezado: 'Municipio o Alcaldía',
      clave: (fila) => fila.municipioAlcaldia,
      orden: 11,
    },
    { encabezado: 'Localidad', clave: (fila) => fila.localidad, orden: 12 },
    {
      encabezado: 'Entidad Federativa',
      clave: (fila) => fila.entidadFederativa,
      orden: 13,
    },
    {
      encabezado: 'Estado/Localidad',
      clave: (fila) => fila.estadoLocalidad,
      orden: 14,
    },
    {
      encabezado: 'Código Postal',
      clave: (fila) => fila.codigoPostal,
      orden: 15,
    },
    {
      encabezado: 'Uso final',
      clave: (fila) => fila.descripcion,
      orden: 16,
    },
  ];

/**
 * Representa el estado del formulario de pago de derechos.
 * Esta interfaz define las propiedades necesarias para capturar la información
 * relacionada con el pago de derechos en el sistema.
 */
export interface PagoDerechosFormState {
  /**
   * Clave de referencia única asociada al pago.
   * @example "REF123456"
   */
  claveReferencia: string;

  /**
   * Cadena que identifica la dependencia relacionada con el pago.
   * @example "Secretaría de Medio Ambiente y Recursos Naturales"
   */
  cadenaDependencia: string;

  /**
   * Estado actual del pago.
   * Puede representar valores como "Pagado", "Pendiente", etc.
   * @example "Pagado"
   */
  estado: string;

  /**
   * Llave única que identifica el pago en el sistema.
   * @example "LLAVE123456789"
   */
  llavePago: string;

  /**
   * Fecha en la que se realizó el pago.
   * Representada en formato ISO 8601.
   * @example "2023-05-01"
   */
  fechaPago: string;

  /**
   * Importe total del pago realizado.
   * Representado como una cadena para manejar formatos específicos.
   * @example "1500.00"
   */
  importePago: string;
}


/**
 * Constante que representa la configuración de la fecha de pago.
 * Contiene propiedades que definen el nombre de la etiqueta, si es requerida y si está habilitada.
 * 
 * @property labelNombre - Nombre de la etiqueta que se mostrará para la fecha de pago.
 * @example "Fecha de pago"
 * 
 * @property required - Indica si el campo de fecha de pago es obligatorio.
 * @example true
 * 
 * @property habilitado - Indica si el campo de fecha de pago está habilitado para su uso.
 * @example true
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de pago',
  required: true,
  habilitado: true,
};
