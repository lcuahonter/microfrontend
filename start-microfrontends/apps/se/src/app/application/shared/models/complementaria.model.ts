/**
 * Modelos para la gestión de plantas y sectores en el sistema PROSEC.
 * @interface PlantasTabla
 */
export interface PlantasTabla {
  /**
   * Calle de la planta.
   * @type {string}
   */
  calle: string;

  /**
   * Número exterior de la planta.
   * @type {number}
   */
  numeroExterior: number;

  /**
   * Número interior de la planta.
   * @type {number}
   */
  numeroInterior: number;

  /**
   * Código postal de la planta.
   * @type {number}
   */
  codigoPostal: number;

  /**
   * Colonia de la planta.
   * @type {string}
   */
  colonia: string;

  /**
   * Municipio o alcaldía de la planta.
   * @type {string}
   */
  municipioOAlcaldia: string;

  /**
   * Estado de la planta.
   * @type {string}
   */
  estado: string;

  /**
   * País de la planta.
   * @type {string}
   */
  pais: string;

  /**
   * Registro federal de contribuyentes de la planta.
   * @type {string}
   */
  registroFederal: string;

  /**
   * Razón social de la planta.
   * @type {string}
   */
  razonSocial: string;

  /**
   * Domicilio fiscal del solicitante de la planta.
   * @type {string}
   */
  domicilioFiscal: string;

  /**
   * Estatus de la planta.
   * @type {string}
   */
  estatus: string;
}

/**
 * Modelo para la gestión de sectores en el sistema PROSEC.
 * @interface SectorTabla
 */
export interface SectorTabla {
  /**
   * Lista de sectores.
   * @type {string}
   */
  listaDeSectores: string;

  /**
   * Clave del sector.
   * @type {string}
   */
  claveDelSector: string;

  /**
   * Estatus del sector.
   * @type {string}
   */
  estatus: string;
}

/**
 * Modelo para la gestión de mercancías en el sistema PROSEC.
 * @interface Mercancias
 */
export interface Mercancias {
  /**
   * Fracción arancelaria de la mercancía.
   * @type {string}
   */
  fraccionArancelaria: {
    cveFraccion: string;
  };

  /**
   * Clave del sector de la mercancía.
   * @type {string}
   */
  cveSector: string;

  /**
   * Estatus de la mercancía.
   * @type {string}
   */
  descripcionTestado: string;
}

/**
 * Respuesta de la API para la gestión de mercancías.
 * @interface MercanciasResquesta
 */
export interface MercanciasResquesta {
  /**
   * Código de respuesta de la API.
   * @type {number}
   */
  code: number;

  /**
   * Datos de las mercancías.
   * @type {Mercancias[]}
   */
  data: Mercancias[];

  /**
   * Mensaje de respuesta de la API.
   * @type {string}
   */
  message: string;
}

/**
 * Modelo para la gestión de productores indirectos en el sistema PROSEC.
 * @interface ProductorIndirecto
 */
export interface ProductorIndirecto {
  /**
   * Registro federal de contribuyentes del productor indirecto.
   * @type {string}
   */
  registroFederal: string;

  /**
   * Denominación o razón social del productor indirecto.
   * @type {string}
   */
  denominacion: string;

  /**
   * Correo electrónico del productor indirecto.
   * @type {string}
   */
  correo: string;

  /**
   * Estatus del productor indirecto.
   * @type {string}
   */
  eStatus: string;
}

/**
 * Respuesta de la API para la gestión de productores indirectos.
 * @interface ProductorIndirectoResquesta
 */
export interface ProductorIndirectoResquesta {
  /**
   * Código de respuesta de la API.
   * @type {number}
   */
  code: number;

  /**
   * Datos de los productores indirectos.
   * @type {ProductorIndirecto[]}
   */
  data: ProductorIndirecto[];

  /**
   * Mensaje de respuesta de la API.
   * @type {string}
   */
  message: string;
}

/**
 * Representa la información complementaria de una persona o empresa,
 * incluyendo su RFC, nombre y apellidos.
 * @interface Complimentaria
 */
export interface Complimentaria {
  /**
   * RFC de la persona o empresa
   */
  rfc?: string;

  /**
   * Nombre(s) del accionista o representante
   */
  nombre?: string;

  /**
   * Primer apellido
   */
  apellidoPaterno?: string;

  /**
   * Segundo apellido
   */
  apellidoMaterno?: string;

  /**
   * ID de la solicitud asociada
   */
  idSolicitud?: number | null;

  /** CURP de la persona o empresa */
  curp?: string | null;
  /** Descripción del giro */
  descripcionGiro?: string | null;
  /** Correo electrónico */
  correoElectronico?: string | null;
}

/**
 * Representa los datos de un Planta.
 */
export interface Plantas {
  /** 
   * ID único de la planta (opcional)
   */
  id?: number;

  /**
   * Calle de la planta
   */
  calle?: string;

  /**
   * Número exterior de la planta
   */
  numeroExterior?: string;

  /**
   * Número interior de la planta
   */
  numeroInterior?: string;

  /**
   * Código postal de la planta
   */
  codigoPostal?: string;

  /** 
   * Localidad de la planta 
   */
  localidad?: string;

  /** 
   * Colonia de la planta 
   */
  colonia?: string;

  /**
   * Municipio o delegación de la planta
   */
  municipioDelegacion?: string;

  /**
   * Estado de la planta
   */
  estado?: string;

  /** 
   * País de la planta
   */
  pais?: string;

  /**
   * RFC de la planta
   */ 
  rfc?: string;

  /**
   * Fiscal del solicitante de la planta
   */
  fiscalSolicitante?: string;

  /**
   * Razón social de la planta
   */
  razonSocial?: string;

  /** 
   * Estatus de la planta
   */
  desEstatus?: string;

  /** 
   * Indicador de estatus de la planta
   */
  estatus?: boolean;

  /**
   * Entidad federativa de la planta
   */
  entidadFederativa?: string;
}

/**
 * Representa los datos de un Servicio Immex.
 */
export interface ServiciosImmex {
  /**
   * ID único del servicio (opcional)
   */
  id?: number;

  /**
   * Estatus del servicio
   */
  desEstatus?: string;

  /**
   * Descripción del servicio
   */
  descripcion?: string;

  /**
   * Tipo de servicio
   */
  tipoDeServicio?: string;

  /**
   * Testadoo del servicio
   */
  testado?: string;

  /**
   * Descripción del testado del servicio
   */
  descripcionTestado?: string;

  /**
   * Descripción del tipo de servicio
   */
  descripcionTipo?: string;
}

/**
 * Representa los datos de una empresa.
 * @interface Empresas
 */
export interface Empresas {
  /**
   * RFC de la empresa.
   * Este campo es opcional y puede contener el Registro Federal de Contribuyentes de la empresa.
   */
  rfc?: string;

  /**
   * Razón social de la empresa.
   * Este campo es opcional y puede contener el nombre legal de la empresa.
   */
  razonSocial?: string;

  /**
   * Calle donde se encuentra ubicada la empresa.
   * Este campo es opcional y puede contener el nombre de la calle.
   */
  calle?: string;

  /**
   * Número interior del domicilio de la empresa.
   * Este campo es opcional y puede contener el número interior del edificio o local.
   */
  numeroInterior?: string;

  /**
   * Número exterior del domicilio de la empresa.
   * Este campo es opcional y puede contener el número exterior del edificio o local.
   */
  numeroExterior?: string;

  /**
   * Código postal del domicilio de la empresa.
   * Este campo es opcional y puede contener el código postal correspondiente.
   */
  codigoPostal?: string;

  /**
   * Colonia donde se encuentra ubicada la empresa.
   * Este campo es opcional y puede contener el nombre de la colonia.
   */
  colonia?: string;

  /**
   * Municipio o delegación donde se encuentra ubicada la empresa.
   * Este campo es opcional y puede contener el nombre del municipio o delegación.
   */
  municipioDelegacion?: string;

  /**
   * Entidad federativa donde se encuentra ubicada la empresa.
   * Este campo es opcional y puede contener el nombre del estado o entidad federativa.
   */
  estado?: string;

  /**
   * País donde se encuentra ubicada la empresa.
   * Este campo es opcional y puede contener el nombre del país.
   */
  pais?: string;

  /**
   * Teléfono de contacto de la empresa.
   * Este campo es opcional y puede contener el número telefónico de contacto.
   */
  telefono?: string;

  /**
   * Estatus de la empresa.
   * Este campo es opcional y puede contener información sobre el estado actual de la empresa.
   */
  estatus?: string;
}