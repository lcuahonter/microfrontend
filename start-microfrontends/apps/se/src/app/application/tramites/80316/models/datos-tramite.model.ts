import { Catalogo } from "@libs/shared/data-access-user/src";

/**
 * Representa los datos del solicitante.
 */
export interface DatosSolicitante {
  /**
   * RFC del solicitante.
   */
  rfc: string;

  /**
   * Denominación o razón social del solicitante.
   */
  denominacion: string;

  /**
   * Actividad económica del solicitante.
   */
  actividadEconomica: string;

  /**
   * Correo electrónico del solicitante.
   */
  correoElectronico: string;
}

/**
 * Representa los datos de modificación de un trámite.
 */
export interface DatosModificacion {
  /**
   * RFC del solicitante.
   */
  rfc: string;

  /**
   * Información federal del solicitante.
   */
  federal: string;

  /**
   * Tipo de trámite.
   */
  tipo: string;

  /**
   * Programa seleccionado.
   */
  programa: string;

  /**
   * Actividad actual del solicitante.
   */
  actividadActual: string;

  /**
   * Actividad productiva seleccionada.
   */
  actividadProductiva: string | null;
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
  actividades: Actividad[];
  representantes_legales: string;
}
/**
 * Representa una actividad productiva.
 */
export interface Actividad {
  c_actividad:string;
  d_actividad: string;
}
/**
 * Representa los datos de una modificación para mostrar en una tabla.
 */
export interface DatosDelModificacion {
  id?: number;
  calle?: string;
  numeroExterior?: number;
  numeroInterior?: number;
  codigoPosta?: number;
  colonia?: string;
  municipioOAlcaldia?: string;
  entidadFederativa?: string;
  pais?: string;
  rfc?: string;
  domicilioFiscal?: string;
  razonSocial?: string;
  desEstatus?: string;
}

/**
 * Representa los datos complementarios de un trámite.
 */
export interface Complimentaria {
  /**
   * RFC del accionista.
   */
  rfc?: string;

  /**
   * Nombre del accionista.
   */
  nombre?: string;

  /**
   * Primer apellido del accionista.
   */
  apellidoPrimer?: string;

  /**
   * Segundo apellido del accionista.
   */
  apellidoSegundo?: string;
}

/**
 * Representa los datos de un federatario.
 */
export interface Federetarios {
  /**
   * Nombre del federatario.
   */
  nombreNotario?: string;

  /**
   * Apellido paterno del federatario.
   */
  apellidoPaterno?: string;

  /**
   * Apellido materno del federatario.
   */
  apellidoMaterno?: string;

  /**
   * Número del acta asociada al federatario.
   */
  numeroActa?: string;
  /**
   * Fecha del acta asociada al federatario.
   */
  fechaActa?: string;

  /**
   * Número de la notaría asociada al federatario.
   */
  numeroNotaria?: string;
  /**
   * Delegación o municipio asociado al federatario.
   */
  delegacionMunicipio?: string;

  /**
   * Entidad federativa asociada al federatario.
   */
  entidadFederativa?: string;
}

/**
 * Representa los datos de una operación.
 */
export interface Operacions {
  id?: number;
  calle?: string; // Calle de la dirección
  numeroExterior?: string; // Número exterior de la dirección
  numeroInterior?: string; // Número interior de la dirección
  codigoPostal?: string; // Código postal
  localidad?: string; // Localidad
  colonia?: string; // Colonia
  delegacionMunicipio?: string; // Delegación o municipio
  entidadFederativa?: string; // Entidad federativa
  pais?: string; // País
  rfc?: string; // RFC del solicitante
  domicilioFiscal?: string; // Domicilio fiscal del solicitante
  razonSocial?: string; // Razón Social
  estatus?: string; // Estatus del solicitante
}

/**
 * Representa los datos de una bitácora.
 */
export interface Bitacora {
  /**
   * Tipo de modificación registrada en la bitácora.
   */
  tipoModificacion: string;

  /**
   * Fecha de la modificación registrada.
   */
  fechaModificacion: string;

  /**
   * Valores anteriores antes de la modificación.
   */
  valoresAnteriores: string;

  /**
   * Valores nuevos después de la modificación.
   */
  valoresNuevos: string;
}

/**
 * Representa los datos de una empresa.
 */
export interface Empresas {
  id?: number;
  rfc?: string;
  razonSocial?: string;
  calle?: string;
  numeroExterior?: string;
  numeroInterior?: string;
  codigoPostal?: string;
  colonia?: string;
  delegacionMunicipio?: string;
  entidadFederativa?: string;
  pais?: string;
  telefono?: string;
  estatus?: boolean;
}

/**
 * Representa los datos de una planta.
 */
export interface Plantas {
  calle?: string;
  numeroExterior?: string;
  numeroInterior?: string;
  codigoPostal?: string;
  colonia?: string;
  delegacionMunicipio?: string;
  entidadFederativa?: string; // Entidad federativa
  pais?: string; // País
  rfc?: string; // Registro Federal de Contribuyentes
  domicilioFiscal?: string; // Domicilio fiscal del solicitante
  estatus?: string; // Estatus del solicitante
}

/**
 * Representa los datos de un servicio.
 */
export interface Servicios {
  id?: number;
  descripcion?: string;
  tipoServicio?: string;
  testado?: string;
  estatus?: string;
}

/**
 * Representa los datos de una fracción sensible.
 */
export interface FraccionSensible {
  id?: number;
  fraccionArancelariaExportacion?: number;
  cantidad?: number;
  valor?: number;
  unidadMedidaTarifaria?: string;
}

/**
 * Representa los datos de un anexo.
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
 * Representa los datos de una tabla.
 */
// export interface DatosDeLaTabla {
//   id: string;
//   folioDePrograma: string;
//   tipoDePrograma: string;
// }
/**
 * Representa los datos de una tabla.
 */
export interface DatosDeLaTabla {
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
   * Carga los datos de certificación desde el servicio y actualiza el formulario reactivo con los valores obtenidos.
   */
export interface DatosCertificacion {
  certificion: string;
  fechaInicio: string;
  fechaVigencia: string;
}

/**
 * Representa la respuesta de una consulta de datos.
 */
export interface RespuestaConsulta {
  success: boolean;
  datos: ConsultaDatos;
  message: string;
}

/**
 * Representa los datos obtenidos de una consulta.
 */
export interface ConsultaDatos {
  /**
   * Lista de actividades productivas asociadas a la consulta.
   */
  actividadProductiva: Catalogo[] | null;
}
