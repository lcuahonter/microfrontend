 
/**
 * Representa la información de un domicilio asociado a una planta o trámite.
 * @interface DomicilioInfo
 */
export interface DomicilioInfo {
  /** Identificador único del domicilio */
  id?: number;
  /** Calle de la dirección */
  calle?: string;
  /** Número exterior de la dirección */
  numeroExterior?: string;
  /** Número interior de la dirección */
  numeroInterior?: string;
  /** Código postal */
  codigoPostal?: string;
  /** Localidad */
  localidad?: string;
  /** Colonia */
  colonia?: string;
  /** Delegación o municipio */
  delegacionMunicipio?: string;
  /** Entidad federativa */
  entidadFederativa?: string;
  /** País */
  pais?: string;
  /** Teléfono */
  telefono?: string;
  /** ID de la planta (como cadena de texto) */
  idPlanta?: string;
  /** ID de la solicitud asociada */
  idSolicitud?: number | null;
  /** Razón social */
  razonSocial?: string;
  /** Estado del domicilio ('Baja' o 'Activada') */
  desEstatus?: 'Baja' | 'Activada';
  /** Indicador de estatus */
  estatus?: boolean;
  /** RFC asociado */
  rfc?: string;
}
  

/**
 * Representa los datos de un socio o accionista complementario.
 * @interface Complimentaria
 */
export interface Complimentaria {
  /** Identificador de la solicitud (puede ser nulo) */
  idSolicitud?: number | null;
  /** Nombre del socio o accionista */
  nombre?: string;
  /** RFC (Registro Federal de Contribuyentes) */
  rfc?: string;
  /** Apellido paterno */
  apellidoPaterno?: string;
  /** Apellido materno */
  apellidoMaterno?: string;
  /** CURP (Clave Única de Registro de Población), puede ser nulo */
  curp?: string | null;
  /** Descripción del giro comercial, puede ser nulo */
  descripcionGiro?: string | null;
  /** Dirección de correo electrónico, puede ser nulo */
  correoElectronico?: string | null;
}


/**
 * Representa la respuesta de datos de socios o accionistas complementarios.
 * @interface ComplimentariaDatos
 */
export interface ComplimentariaDatos {
  /** Lista de socios o accionistas complementarios */
  data: Complimentaria[];
}


/**
 * Representa los datos de un fedatario público.
 * @interface Federetarios
 */
export interface Federetarios {
  /** Nombre del fedatario */
  nombre?: string;
  /** Primer apellido */
  apellidoPrimer?: string;
  /** Segundo apellido */
  apellidoSegundo?: string;
  /** Número de acta */
  numeroActa?: string;
  /** Fecha del acta */
  fetchActa?: string;
  /** Número de notaría */
  numeroNotaria?: string;
  /** Municipio o delegación */
  municipioDelegacion?: string;
  /** Estado */
  estado?: string;
}


/**
 * Representa los datos de un fedatario público asociados a una solicitud.
 * @interface FederetariosDatos
 */
export interface FederetariosDatos {
  /** Identificador del notario */
  idNotario?: string | null;
  /** Identificador de la solicitud */
  idSolicitud?: number | null;
  /** Nombre del notario */
  nombreNotario?: string | null;
  /** Apellido paterno */
  apellidoPaterno?: string | null;
  /** Apellido materno */
  apellidoMaterno?: string | null;
  /** RFC del notario */
  rfc?: string | null;
  /** Número de acta */
  numeroActa?: string | null;
  /** Fecha del acta */
  fechaActa?: string | null;
  /** Número de notaría */
  numeroNotaria?: string | null;
  /** Número de notario */
  numeroNotario?: string | null;
  /** Delegación o municipio */
  delegacionMunicipio?: string | null;
  /** Entidad federativa */
  entidadFederativa?: string | null;
}


/**
 * Representa la información completa de una operación, extendiendo datos de socio, fedatario y domicilio.
 * @interface Operacions
 */
export interface Operacions extends Complimentaria, Federetarios, DomicilioInfo {
  /** Razón social */
  razonSocial?: string;
  /** Fiscal del solicitante */
  fiscalSolicitante?: string;
  /** RFC */
  rfc?: string;
  /** Nombre */
  nombre?: string;
  /** Primer apellido */
  apellidoPrimer?: string;
  /** Segundo apellido */
  apellidoSegundo?: string;
  /** Número de acta */
  numeroActa?: string;
  /** Fecha del acta */
  fetchActa?: string;
  /** Número de notaría */
  numeroNotaria?: string;
  /** Municipio o delegación */
  municipioDelegacion?: string;
  /** Estado */
  estado?: string;
  /** Identificador único */
  id?: number;
  /** Calle de la dirección */
  calle?: string;
  /** Número exterior de la dirección */
  numeroExterior?: string;
  /** Número interior de la dirección */
  numeroInterior?: string;
  /** Código postal */
  codigoPostal?: string;
  /** Localidad */
  localidad?: string;
  /** Colonia */
  colonia?: string;
  /** Delegación o municipio */
  delegacionMunicipio?: string;
  /** Entidad federativa */
  entidadFederativa?: string;
  /** País */
  pais?: string;
  /** Teléfono */
  telefono?: string;
  /** ID de la planta */
  idPlanta?: string;
  /** ID de la solicitud */
  idSolicitud?: number | null;
  /** Estado del domicilio ('Baja' o 'Activada') */
  desEstatus?: 'Baja' | 'Activada';
  /** Indicador de estatus */
  estatus?: boolean;
}


/**
 * Representa un registro de bitácora de modificaciones.
 * @interface Bitacora
 */
export interface Bitacora {
  /** Tipo de modificación */
  tipoModificion: string;
  /** Fecha de la modificación */
  fetchModificion: string;
  /** Valores anteriores */
  valoresAnteriores: string;
  /** Valores nuevos */
  valoresNuevos: string;
}

/**
 * Representa los datos de un anexo asociado a fracciones arancelarias.
 * @interface Anexo
 */
export interface Anexo {
  /**
   * Tipo de fracción arancelaria asociada al anexo.
   */
  tipoFraccion?: string;
  /**
   * Fracción arancelaria utilizada para exportación.
   */
  fraccionArancelariaExportacion?: string;
  /**
   * Fracción arancelaria utilizada para importación.
   */
  fraccionArancelariaImportacion?: string;
  /**
   * Descripción adicional del anexo o la mercancía.
   */
  descripcion?: string;
  /**
   * Valores previos relacionados con el anexo.
   */
  valoresAnteriores?: string;
  /**
   * Fracción arancelaria numérica de la mercancía de importación.
   */
  fraccionArancelariaDeLaMercanciaDeImportacion?: number;
  /**
   * Cantidad de mercancía asociada al anexo.
   */
  cantidad?: number;
  /**
   * Valor numérico de la mercancía o anexo.
   */
  valor?: number;
  /**
   * Unidad de medida correspondiente a la cantidad especificada.
   */
  unidadMedida?: string;
  /**
   * Clave del producto de exportación asociado al anexo.
   */
  claveProductoExportacion?: number;
  /**
   * Fracción padre asociada al anexo.
   */
  fraccionPadre?: number;

  /**
   * Clave de fracción arancelaria asociada al anexo.
   */
  cveFraccion?: string;

  /**
   * Fracción arancelaria
   */
  fraccionArancelaria?: {
    /**
     * Descripción de la fracción arancelaria.
     */
    descripcion: string;
  }

  /**
   * Complemento
   */
  complemento?: {
    /**
     * Descripción del complemento.
     */
    descripcion: string;
  }

  /**
   * Unidad de medida correspondiente a la cantidad especificada.
   */
  unidadMedidaTarifaria?: string;
}


/**
 * Representa los datos de modificación de una planta o trámite.
 * @interface DatosModificacion
 */
export interface DatosModificacion {
  /** RFC del solicitante */
  rfc: string;
  /** Representación federal */
  representacionFederal: string;
  /** Tipo de modalidad */
  tipoModalidad: string;
  /** Descripción de la modalidad */
  descripcionModalidad: string;
}