/**
 * Modelo que representa una modificación en la aplicación.
 * @interface Modificacion
 */
export interface Modificacion {
  /**
   * RFC del usuario que realizó la modificación.
   */
  rfc: string;
  /**
   * Indica si la modificación es de tipo federal.
   */
  representacionFederal: string;
  /**
   * Tipo de modificación realizada.
   */
  tipo: string;
  /**
   * Programa asociado a la modificación.
   */
  programa: string;
}

/**
 * Estructura que representa los datos de un servicio específico
 * dentro del trámite de modificación del programa IMMEX.
 */
export interface DatosDelServicios {
  /**
   * ID del servicio
   */
  id?: number;

  /**
   * Estatus descriptivo del servicio
   */
  desEstatus?: string;

  /**
   * Descripción del servicio
   */
  descripcion?: string;

  /**
   * Tipo de servicio relacionado con el trámite
   */
  tipoDeServicio?: string;

  /**
   * Estado del servicio
   */
  testado?: string;
}

/**
 * Estructura que representa los datos de un domicilio específico
 * dentro del trámite de modificación del programa IMMEX.
 */
export interface DatosDelDomicilio {
  /**
   * ID del domicilio
   */
  id?: number;

  /**
   * Calle del domicilio
   */
  calle?: string;

  /**
   * Número exterior del domicilio
   */
  numeroExterior?: number;

  /**
   * Número interior del domicilio
   */
  numeroInterior?: number;

  /**
   * Código postal del domicilio
   */
  codigoPostal?: number;

  /**
   * Colonia del domicilio
   */
  colonia?: string;

  /**
   * Municipio o alcaldía del domicilio
   */
  municipioOAlcaldia?: string;

  /**
   * Entidad federativa del domicilio
   */
  entidadFederativa?: string;

  /**
   * País del domicilio
   */
  pais?: string;

  /**
   * Teléfono del domicilio
   */
  telefono?: string;

  /**
   * Estatus descriptivo del domicilio
   */
  desEstatus?: string;
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
 * Estructura que representa los datos de exportación e importación
 * dentro del trámite de modificación del programa IMMEX.
 * @interface ExportacionImportacionDatos
 */
export interface ExportacionImportacionDatos {
  /**
   * Clave del producto de exportación
   */
  claveProductoExportacion: number;

  /**
   * Fracción arancelaria asociada al producto de exportación
   */
  fraccionArancelaria: {
    /** Clave de la fracción arancelaria */
    clave: string;

    /** Descripción de la fracción arancelaria */
    descripcion: string;
  }

  /**
   * Fracción padre asociada al producto de exportación
   */
  fraccionPadre: number;

  /**
   * Descripción del estado del producto de exportación
   */
  desEstatus: string;

  /**
   * Indica si el producto es visible en la interfaz de usuario
   */
  visible?: boolean;

  /**
   * Clave de la fracción
   */
  cveFraccion?: string;
}