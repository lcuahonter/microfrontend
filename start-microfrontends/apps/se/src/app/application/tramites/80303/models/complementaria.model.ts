
/**
 * Representa los datos de un contribuyente.
 */
export interface DatosContribuyente {
  /**
   * El Registro Federal de Contribuyentes (RFC) del contribuyente.
   * Es opcional.
   */
  RFC?: string;

  /**
   * Los nombres del contribuyente.
   * Es opcional.
   */
  Nombres?: string;

  /**
   * El primer apellido del contribuyente.
   * Es opcional.
   */
  PrimerApellido?: string;

  /**
   * El segundo apellido del contribuyente.
   * Es opcional.
   */
  SegundoApellido?: string;
}


/**
 * Representa la información de un federatario público.
 */
export interface Federatario {
  /**
   * Nombre del federatario público.
   * @optional
   */
  nombreNotario?: string;

  /**
   * Primer apellido del federatario público.
   * @optional
   */
  apellidoMaterno?: string;

  /**
   * Segundo apellido del federatario público.
   * @optional
   */
  apellidoPaterno?: string;

  /**
   * Número del acta asociada al federatario público.
   * @optional
   */
  numeroActa?: string;

  /**
   * Fecha en la que se emitió el acta asociada al federatario público.
   * @optional
   */
  fechaActa?: string;

  /**
   * Número de la notaría donde trabaja el federatario público.
   * @optional
   */
  numeroNotaria?: string;

  /**
   * Municipio o delegación donde se encuentra la notaría del federatario público.
   * @optional
   */
  delegacionMunicipio?: string;

  /**
   * Estado o distrito donde se encuentra la notaría del federatario público.
   * @optional
   */
  entidadFederativa?: string;
}


/**
 * Representa la información relacionada con el federatario que realizará las operaciones.
 * Esta interfaz define los detalles del domicilio, identificación fiscal y estatus del federatario.
 */
export interface FederatarioRealizaranLasOperaciones {
  /**
   * La calle donde se encuentra ubicado el domicilio del federatario.
   * @optional
   */
  calle?: string;

  /**
   * El número exterior del domicilio del federatario.
   * @optional
   */
  numeroExterior?: string;

  /**
   * El número interior del domicilio del federatario, si aplica.
   * @optional
   */
  numeroInterior?: string;

  /**
   * El código postal del domicilio del federatario.
   * @optional
   */
  codigoPostal?: string;

  /**
   * La colonia donde se encuentra ubicado el domicilio del federatario.
   * @optional
   */
  colonia?: string;

  /**
   * La localidad donde se encuentra ubicado el domicilio del federatario.
   * @optional
   */
  localidad?: string;

  /**
   * El municipio o delegación donde se encuentra ubicado el domicilio del federatario.
   * @optional
   */
  municipioDelegacion?: string;

  /**
   * El estado o distrito donde se encuentra ubicado el domicilio del federatario.
   * @optional
   */
  estadoDistrito?: string;

  /**
   * El país donde se encuentra ubicado el domicilio del federatario.
   * @optional
   */
  pais?: string;

  /**
   * El Registro Federal de Contribuyentes (RFC) del federatario.
   * @optional
   */
  rfc?: string;

  /**
   * El domicilio fiscal del federatario.
   * @optional
   */
  domicilioFiscal?: string;

  /**
   * La denominación social del federatario.
   * @optional
   */
  denominacionSocial?: string;

  /**
   * El estatus actual del federatario.
   * @optional
   */
  estatus?: string;
}


/**
 * Representa los datos de una empresa submanufacturera.
 * Esta interfaz define las propiedades necesarias para describir la información básica de una empresa submanufacturera.
 */
export interface DatosEmpresaSubmanufacturera {
  /**
   * RFC de la empresa submanufacturera.
   * Este campo es opcional y puede contener el Registro Federal de Contribuyentes de la empresa.
   */
  rfc?: string;

  /**
   * Razón social de la empresa submanufacturera.
   * Este campo es opcional y puede contener el nombre legal de la empresa.
   */
  razonSocial?: string;

  /**
   * Calle donde se encuentra ubicada la empresa submanufacturera.
   * Este campo es opcional y puede contener el nombre de la calle.
   */
  calle?: string;

  /**
   * Número interior del domicilio de la empresa submanufacturera.
   * Este campo es opcional y puede contener el número interior del edificio o local.
   */
  numeroInterior?: string;

  /**
   * Número exterior del domicilio de la empresa submanufacturera.
   * Este campo es opcional y puede contener el número exterior del edificio o local.
   */
  numeroExterior?: string;

  /**
   * Código postal del domicilio de la empresa submanufacturera.
   * Este campo es opcional y puede contener el código postal correspondiente.
   */
  codigoPostal?: string;

  /**
   * Colonia donde se encuentra ubicada la empresa submanufacturera.
   * Este campo es opcional y puede contener el nombre de la colonia.
   */
  colonia?: string;

  /**
   * Municipio o delegación donde se encuentra ubicada la empresa submanufacturera.
   * Este campo es opcional y puede contener el nombre del municipio o delegación.
   */
  municipioDelegacion?: string;

  /**
   * Entidad federativa donde se encuentra ubicada la empresa submanufacturera.
   * Este campo es opcional y puede contener el nombre del estado o entidad federativa.
   */
  entidadFederativa?: string;

  /**
   * País donde se encuentra ubicada la empresa submanufacturera.
   * Este campo es opcional y puede contener el nombre del país.
   */
  pais?: string;

  /**
   * Teléfono de contacto de la empresa submanufacturera.
   * Este campo es opcional y puede contener el número telefónico de contacto.
   */
  telefono?: string;

  /**
   * Estatus de la empresa submanufacturera.
   * Este campo es opcional y puede contener información sobre el estado actual de la empresa.
   */
  estatus?: string;
}


/**
 * Representa los datos de una planta manufacturera.
 * Esta interfaz define las propiedades necesarias para describir la información de una planta manufacturera,
 * incluyendo su ubicación, identificación fiscal y estado actual.
 */
export interface DatosPlantaManufacturera {
  /**
   * La calle donde se encuentra ubicada la planta manufacturera.
   * @optional
   */
  Calle?: string;

  /**
   * El número exterior del domicilio de la planta manufacturera.
   * @optional
   */
  NumeroExterior?: string;

  /**
   * El número interior del domicilio de la planta manufacturera, si aplica.
   * @optional
   */
  NumeroInterior?: string;

  /**
   * El código postal correspondiente al domicilio de la planta manufacturera.
   * @optional
   */
  CodigoPostal?: string;

  /**
   * La colonia donde se encuentra ubicada la planta manufacturera.
   * @optional
   */
  Colonia?: string;

  /**
   * El municipio o delegación donde se encuentra ubicada la planta manufacturera.
   * @optional
   */
  MunicipioDelegacion?: string;

  /**
   * La entidad federativa (estado) donde se encuentra ubicada la planta manufacturera.
   * @optional
   */
  EntidadFederativa?: string;

  /**
   * El país donde se encuentra ubicada la planta manufacturera.
   * @optional
   */
  Pais?: string;

  /**
   * El Registro Federal de Contribuyentes (RFC) asociado a la planta manufacturera.
   * @optional
   */
  RFC?: string;

  /**
   * Indica si el domicilio de la planta manufacturera es también su domicilio fiscal.
   * @optional
   */
  DomicilioFiscal?: string;

  /**
   * El estado actual de la planta manufacturera (por ejemplo, activa, inactiva, etc.).
   * @optional
   */
  Estatus?: string;
}


/**
 * Representa un servicio IMMEX con información detallada sobre su descripción, tipo, estado y estatus.
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
  descripcionTipo?: string;

  /**
   * Testado del servicio
   */
  descripcionTestado?: string;
}
/**
 * Representa un anexo de exportación con información detallada sobre la fracción arancelaria, descripción y tipo de fracción.
 */
export interface AnexoExportacion {
  /**
   * La fracción arancelaria asociada al anexo de exportación.
   * Representa el código utilizado para clasificar productos en el comercio internacional.
   * @optional
   */
  fraccionArancelaria?: {
    /**
     * El descripción de la fracción arancelaria.
     */
    descripcion: string;
  };

  /**
   * Una descripción detallada del producto o elemento relacionado con la exportación.
   * Proporciona información adicional sobre el contenido del anexo.
   * @optional
   */
  descripcion?: string;

  /**
   * El tipo de fracción arancelaria que se aplica al producto.
   * Puede ser utilizado para identificar la categoría o clasificación específica.
   * @optional
   */
  tipoFraccion?: string;
}


/**
 * Representa un anexo de importación con información detallada sobre las fracciones y su descripción.
 */
export interface AnexoImportacion {
  /**
   * La fracción correspondiente a la exportación.
   * @optional
   */
  fraccionExportacion?: string;

  /**
   * La fracción correspondiente a la importación.
   * @optional
   */
  fraccionImportacion?: string;

  /**
   * Una descripción detallada de la fracción.
   * @optional
   */
  descripcion?: string;

  /**
   * El tipo de fracción que se está manejando.
   * @optional
   */
  tipoFraccion?: string;
  
}


/**
 * Representa un modelo para datos sensibles relacionados con importaciones.
 * Este modelo incluye información sobre la fracción de importación, cantidad, valor y unidad de medida.
 */
export interface Sensible {
  /**
   * La fracción arancelaria de importación asociada al producto.
   * @example "01012101"
   */
  fraccionImportacion?: string;

  /**
   * La cantidad del producto importado.
   * @example "100"
   */
  cantidad?: string;

  /**
   * El valor monetario del producto importado.
   * @example "1500.00"
   */
  valor?: string;

  /**
   * La unidad de medida utilizada para la cantidad del producto.
   * @example "kilogramos"
   */
  unidadMedida?: string;
}
/**
 * Representa una respuesta JSON genérica con datos de tipo T.
 */
export interface JSONRespuesta<T> {
  /**
   * Causa del error, si aplica.
   */
  causa?: string;

  /**
   * Código de estado HTTP o personalizado.
   */
  codigo?: string;

  /**
   * Mensaje descriptivo de la respuesta.
   */
  mensaje: string;

  /**
   * Datos retornados por la API, de tipo genérico T.
   */
  datos?: T;
}