import { ConfiguracionColumna } from '@ng-mf/data-access-user'; // adjust the import path if needed


/**
 * Representa la información de una empresa submanufacturera.
 * Esta interfaz define las propiedades necesarias para describir los datos de una empresa submanufacturera
 * en el contexto de un programa IMMEX.
 */
export interface EmpresaSubmanufacturera {
  /**
   * El estatus actual de la empresa submanufacturera.
   * Puede indicar si está activa, inactiva, o en otro estado.
   */
  estatus: string;

  /**
   * El Registro Federal de Contribuyentes (RFC) de la empresa submanufacturera.
   * Es un identificador único utilizado para propósitos fiscales en México.
   */
  rfc: string;

  /**
   * La razón social de la empresa submanufacturera.
   * Representa el nombre oficial registrado de la empresa.
   */
  razonSocial: string;

  /**
   * La calle donde se encuentra ubicada la empresa submanufacturera.
   * Parte de la dirección física de la empresa.
   */
  calle: string;

  /**
   * El número interior del edificio donde se encuentra la empresa submanufacturera.
   * Especifica una ubicación más precisa dentro de un edificio.
   */
  numeroInterior: string;

  /**
   * El número exterior del edificio donde se encuentra la empresa submanufacturera.
   * Indica la ubicación del edificio en la calle.
   */
  numeroExterior: string;

  /**
   * El código postal de la ubicación de la empresa submanufacturera.
   * Ayuda a identificar la región específica dentro del país.
   */
  codigoPostal: string;

  /**
   * La localidad donde se encuentra la empresa submanufacturera.
   * Puede ser un barrio, colonia o área específica dentro de un municipio.
   */
  localidad: string;

  /**
   * El municipio o alcaldía donde se encuentra la empresa submanufacturera.
   * Representa una división administrativa dentro de una entidad federativa.
   */
  municipioAlcaldia: string;

  /**
   * La entidad federativa donde se encuentra la empresa submanufacturera.
   * Corresponde al estado dentro de México.
   */
  entidadFederativa: string;

  /**
   * El país donde se encuentra la empresa submanufacturera.
   * Representa la nación en la que opera la empresa.
   */
  pais: string;

  /**
   * El número de teléfono de contacto de la empresa submanufacturera.
   * Permite la comunicación directa con la empresa.
   */
  telefono: string;

  /**
   * El número de fax de la empresa submanufacturera.
   * Utilizado para enviar documentos de manera electrónica.
   */
  fax: string;

  /**
   * La dirección de correo electrónico de la empresa submanufacturera.
   * Permite la comunicación digital con la empresa.
   */
  correoElectronico: string;

  /**
   * Descripción del estatus de la empresa submanufacturera.
   */
  desEstatus: string;
}

/**
 * Constante que define la configuración de columnas para la tabla de empresas submanufactureras.
 *
 * @const
 * @type {ConfiguracionColumna<EmpresaSubmanufacturera>[]}
 */
export const EMPRESA_SUBMANUFACTURERA_ENCABEZADO_DE_TABLA: ConfiguracionColumna<EmpresaSubmanufacturera>[] =
  [
    { encabezado: 'Estatus', clave: (fila) => fila.estatus, orden: 1 },
    { encabezado: 'R.F.C.', clave: (fila) => fila.rfc, orden: 2 },
    { encabezado: 'Razón social', clave: (fila) => fila.razonSocial, orden: 3 },
    { encabezado: 'Calle', clave: (fila) => fila.calle, orden: 4 },
    {
      encabezado: 'Número interior',
      clave: (fila) => fila.numeroInterior,
      orden: 5,
    },
    {
      encabezado: 'Número exterior',
      clave: (fila) => fila.numeroExterior,
      orden: 6,
    },
    {
      encabezado: 'Código postal',
      clave: (fila) => fila.codigoPostal,
      orden: 7,
    },
    { encabezado: 'Localidad', clave: (fila) => fila.localidad, orden: 8 },
    {
      encabezado: 'Municipio o alcaldía',
      clave: (fila) => fila.municipioAlcaldia,
      orden: 9,
    },
    {
      encabezado: 'Entidad federativa',
      clave: (fila) => fila.entidadFederativa,
      orden: 10,
    },
    { encabezado: 'País', clave: (fila) => fila.pais, orden: 11 },
    { encabezado: 'Teléfono', clave: (fila) => fila.telefono, orden: 12 },
    { encabezado: 'Fax', clave: (fila) => fila.fax, orden: 13 },
    {
      encabezado: 'Correo electrónico',
      clave: (fila) => fila.correoElectronico,
      orden: 14,
    },
  ];


/**
 * Representa la bitácora de modificaciones realizadas en el sistema.
 * Contiene información detallada sobre el tipo de modificación, la fecha en que se realizó,
 * y los valores anteriores y nuevos asociados a la modificación.
 */
export interface Bitacora {
  /**
   * Tipo de modificación realizada.
   * Ejemplo: "Actualización", "Eliminación", "Creación".
   */
  tipoModificacion: string;

  /**
   * Fecha en la que se realizó la modificación.
   * Formato esperado: "YYYY-MM-DD".
   */
  fechaModificacion: string;

  /**
   * Valores anteriores antes de realizar la modificación.
   * Representa el estado previo de los datos modificados.
   */
  valoresAnteriores: string;

  /**
   * Valores nuevos después de realizar la modificación.
   * Representa el estado actualizado de los datos modificados.
   */
  valoresNuevos: string;
}

/**
 * Constante que define la configuración de columnas para la tabla de bitácora.
 *
 * @const
 * @type {ConfiguracionColumna<Bitacora>[]}
 */
export const BITACORA_ENCABEZADO_DE_TABLA: ConfiguracionColumna<Bitacora>[] = [
  {
    encabezado: 'Tipo modificación',
    clave: (fila) => fila.tipoModificacion,
    orden: 1,
  },
  {
    encabezado: 'Fecha modificación',
    clave: (fila) => fila.fechaModificacion,
    orden: 2,
  },
  {
    encabezado: 'Valores anteriores',
    clave: (fila) => fila.valoresAnteriores,
    orden: 3,
  },
  {
    encabezado: 'Valores nuevos',
    clave: (fila) => fila.valoresNuevos,
    orden: 4,
  },
];


/**
 * Representa los datos necesarios para realizar una modificación en el programa IMMEX.
 * Contiene información sobre el RFC, la representación federal, el tipo de modificación y el programa a modificar.
 */
export interface ModificacionDatos {
  /**
   * El Registro Federal de Contribuyentes (RFC) de la empresa que solicita la modificación.
   * Este campo es obligatorio y debe ser único para cada empresa.
   */
  rfc: string;

  /**
   * La representación federal asociada a la empresa que solicita la modificación.
   * Indica la delegación o entidad federal correspondiente.
   */
  representacionFederal: string;

  /**
   * El tipo de modificación que se desea realizar en el programa IMMEX.
   * Puede incluir opciones como alta, baja o cambio de submanufacturera.
   */
  tipoModificacion: string;

  /**
   * El programa IMMEX específico que se desea modificar.
   * Este campo identifica el programa que será afectado por la solicitud.
   */
  modificacionPrograma: string;
}

/**
 * Representa un programa IMMEX en una lista o tabla.
 * Contiene información básica del programa.
 * @interface ProgramaLista
 */
export interface ProgramaLista {
  /**
   * Identificador único del programa autorizado.
   */
  idProgramaAutorizado?: string;

  /**
   * Folio único del programa IMMEX.
   */
  folioPrograma?: string;

  /**
   * Tipo de programa IMMEX.
   */
  tipoPrograma: string;

  /**
   * RFC asociado al programa IMMEX.
   */
  rfc?: string;

  /**
   * Identificador compuesto del programa IMMEX.
   */
  idProgramaCompuesto: string;
}

/**
 * Contiene los datos generales para la modificación de una solicitud IMMEX.
 */
export interface DatosModificacion {
  /**
   * Registro Federal de Contribuyentes del solicitante
   */
  rfc: string;
  
  /**
   * Representación federal (nombre o entidad que representa)
   */
  representacionFederal: string;

  /** 
   * Tipo de modalidad IMMEX a modificar 
   */
  tipo: string;

  /** 
   * Descripción detallada de la modalidad 
   */
  programa: string;
}

/**
 * Payload para la obtención de datos de exportación e importación.
 * @interface ExportacionImportacionPayload
 */
export interface ExportacionImportacionPayload {
  /**
   * Identificador de la solicitud.
   * @type {string | number}
   */
  idSolicitud: string | number;

  /**
   * Discriminador del tipo de solicitud.
   * @type {string}
   */
  discriminatorValue: string;

  /** 
   * Registro Federal de Contribuyentes (RFC).
   * @type {string}
   */
  rfc: string;

  /**
   * Folio del programa IMMEX.
   * @type {string}
   */
  folioPrograma: string;

  /** 
   * Tipo de programa IMMEX.
   * @type {string}
   */
  tipoPrograma: string;

  /** 
   * Identificador del programa IMMEX.
   * @type {string}
   */
  idPrograma: string;
}

/**
 * Estructura que representa los datos de fracciones de importación y exportación
 * dentro del trámite de modificación del programa IMMEX.
 * @interface ImportacionExportacionFracciones
 */
export interface ImportacionExportacionFracciones {
  /**
   * Fracción compuesta de la importación o exportación.
   * @property {string} fraccionCompuesta
   */
  fraccionCompuesta: string;

  /**
   * Clave del producto de exportación.
   * @property {number} claveProductoExportacion
   */
  claveProductoExportacion: number;

  /**
   * Fracción padre de la importación o exportación.
   * @property {string} fraccionPadre
   */
  fraccionPadre: string;

  /**
   * Fecha de inicio de vigencia de la fracción.
   * @property {string} fecIniVigencia
   */
  fecIniVigencia: string;

  /**
   * Clave de la fracción arancelaria.
   * @property {string} cveFraccion
   */
  cveFraccion: string;

  /**
   * Descripción de la fracción arancelaria.
   * @property {string} descripcion
   */
  descripcion: string;

  /**
   * Descripción del estado de la fracción.
   * @property {string} descripcionTestado
   */
  descripcionTestado: string;

  /**
   * Indica si el registro está visible en la tabla.
   * @property {boolean} visible
   */
  visible: boolean;
}

/**
 * Representa la respuesta de datos de modificación.
 * @interface DatosModificacionRespuesta
 */
export interface DatosModificacionRespuesta {
  /**
   * RFC original del solicitante.
   * @type {string}
   */
  rfc_original: string;

  /**
   * Información de identificación del solicitante.
   * @type {object}
   */
  identificacion: {
    /**
     * Tipo de sociedad del solicitante.
     * @type {string}
     */
    tipo_sociedad: string;

    /**
     * Correo electrónico del solicitante.
     * @type {string}
     */
    email: string;
  };
}
