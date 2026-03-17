import { Empresas } from "../../../shared/models/complementaria.model";

/**
 * Representa la información del domicilio de una planta, bodega o almacén.
 */
export interface DomicilioInfo {
  /** ID único del domicilio (opcional) */
  id?: number;
  /** Calle de la dirección */
  calle?: string;
  /** Número exterior del domicilio */
  numeroExterior?: string;
  /** Número interior del domicilio (si aplica) */
  numeroInterior?: string;
  /** Código postal del domicilio */
  codigoPostal?: string;
  /** Localidad o zona geográfica */
  localidad?: string;
  /** Colonia o fraccionamiento */
  colonia?: string;
  /** Delegación o municipio */
  delegacionMunicipio?: string;
  /** Entidad federativa (estado) */
  entidadFederativa?: string;
  /** País del domicilio */
  pais?: string;
  /** Teléfono de contacto del domicilio */
  telefono?: string;
  /** ID de la planta asociada */
  idPlanta?: string;
  /** ID de la solicitud asociada (opcional) */
  idSolicitud?: string;
  /** Razón social de la empresa asociada */
  razonSocial?: string;
  /** Estatus booleano (true para activo, false para inactivo) */
  estatus?: boolean;
  /** Registro Federal de Contribuyentes (RFC) */
  rfc?: string;
}

/**
 * Información complementaria de personas físicas o morales.
 */
export interface Complimentaria {
  /** RFC de la persona o empresa */
  rfc?: string;
  /** Nombre(s) del accionista o representante */
  nombre?: string;
  /** Primer apellido */
  apellidoPaterno?: string;
  /** Segundo apellido */
  apellidoMaterno?: string;
}

/**
 * Representa los datos de un fedatario público.
 */
export interface Federetarios {
  /** ID único del fedatario (opcional) */
  id?: number;
  /** Nombre del fedatario */
  nombreNotario?: string;
  /** Primer apellido del fedatario */
  apellidoPaterno?: string;
  /** Segundo apellido del fedatario */
  apellidoMaterno?: string;
  /** Número de acta notarial */
  numeroActa?: string;
  /** Fecha del acta (puede contener error de tipografía: "fetchActa") */
  fechaActa?: string;
  /** Número de la notaría */
  numeroNotaria?: string;
  /** Municipio o delegación donde se emitió el acta */
  delegacionMunicipio?: string;
  /** Estado o entidad federativa correspondiente */
  entidadFederativa?: string;
}

/**
 * Representa los datos relacionados con una operación registrada dentro del trámite IMMEX.
 *
 * Esta interfaz extiende de:
 * - `Complimentaria`: para incluir información del contribuyente o persona.
 * - `Federetarios`: para incluir información notarial relacionada.
 * - `DomicilioInfo`: para incluir los datos de ubicación del establecimiento.
 */
export interface Operacions
  extends Complimentaria,
    Federetarios,
    DomicilioInfo {
  /** Razón social del establecimiento u operación */
  razonSocial?: string;

  /** Domicilio fiscal del solicitante que presenta la operación */
  domicilioFiscal?: string;

  /** Tipo de operación que se realiza en la planta (por ejemplo: almacenaje, maquila, transformación) */
  operacion?: string;

  // ──────────── Campos heredados y redefinidos para asegurar su presencia ────────────

  /** Registro Federal de Contribuyentes (RFC) del solicitante o empresa */
  rfc?: string;

  /** Nombre(s) del representante o persona asociada a la operación */
  nombre?: string;

  /** Primer apellido del representante */
  apellidoPrimer?: string;

  /** Segundo apellido del representante */
  apellidoSegundo?: string;

  /** Número del acta notarial asociada */
  numeroActa?: string;

  /** Fecha del acta notarial */
  fetchActa?: string;

  /** Número de la notaría donde se registró el acta */
  numeroNotaria?: string;

  /** Municipio o delegación en la que se ubica la operación */
  municipioDelegacion?: string;

  /** Estado o entidad federativa correspondiente */
  estado?: string;

  /** Identificador único de la operación */
  id?: number;

  /** Calle en la que se encuentra ubicada la planta o almacén */
  calle?: string;

  /** Número exterior del domicilio */
  numeroExterior?: string;

  /** Número interior del domicilio (si aplica) */
  numeroInterior?: string;

  /** Código postal del domicilio */
  codigoPostal?: string;

  /** Localidad correspondiente al domicilio */
  localidad?: string;

  /** Colonia del domicilio */
  colonia?: string;

  /** Delegación o municipio del domicilio */
  delegacionMunicipio?: string;

  /** Entidad federativa donde se localiza la operación */
  entidadFederativa?: string;

  /** País donde se encuentra la planta o almacén */
  pais?: string;

  /** Teléfono de contacto del establecimiento */
  telefono?: string;

  /** ID asignado a la planta dentro del sistema */
  idPlanta?: string;

  /** ID de la solicitud asociada a esta operación */
  idSolicitud?: string;

  /** Estado descriptivo del registro: 'Baja' o 'Activada' */
  desEstatus?: string;

  /** Indicador booleano del estatus (true = activa, false = baja) */
  estatus?: boolean;
}

/**
 * Representa un registro en la bitácora de modificaciones.
 */
export interface Bitacora {
  /** Tipo de modificación realizada (ej. "Alta", "Baja", "Cambio") */
  tipoModificion: string;
  /** Fecha en que se realizó la modificación (puede tener error de escritura: "fetchModificion") */
  fetchModificion: string;
  /** Valores antes de la modificación (como string serializado) */
  valoresAnteriores: string;
  /** Valores después de la modificación */
  valoresNuevos: string;
}

/**
 * Información asociada a fracciones arancelarias y anexos de importación/exportación.
 */
export interface Anexo {
  /** Tipo de fracción (importación/exportación) */
  tipoFraccion?: string;
  /** Fracción arancelaria para exportación */
  fraccionArancelariaExportacion?: string;
  /** Fracción arancelaria para importación */
  fraccionArancelariaImportacion?: string;
  /** Descripción del producto o mercancía */
  descripcion?: string;
  /** Valores anteriores, si aplica para trazabilidad o auditoría */
  valoresAnteriores?: string;
  /** Fracción arancelaria */
  fraccionArancelaria?: {
    descripcion: string;
  };
  /** Complemento */
  complemento?: {
    descripcion: string;
  };
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
  delegacionMunicipio?: string;

  /**
   * Estado de la planta
   */
  entidadFederativa?: string;

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
  domicilioFiscal?: string;

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
}

/**
 * Representa los datos de una Empresa Submanufacturera.
 */
export interface EmpresasSubmanufactureras extends Empresas {
  /**
   * Registro Federal de Contribuyentes (RFC) de la empresa.
   */
  rfc?: string;
  /**
   * Razón social de la empresa.
   */
  razonSocial?: string;
  /**
   * Información del domicilio de la solicitud de la empresa.
   */
  domicilioSolicitud?: {
    /**
     * Calle del domicilio.
     */
    calle?: string;
    /**
     * Número exterior del domicilio.
     */
    numExterior?: string;
    /**
     * Número interior del domicilio.
     */
    numInterior?: string;
    /**
     * Código postal del domicilio.
     */
    codigoPostal?: string;
    /**
     * Colonia del domicilio.
     */
    coloniaEntity?: string;
    /**
     * Delegación o municipio del domicilio.
     */ 
    delegacionMunicipio?: string;
    /** 
     * Entidad federativa del domicilio.
     */
    entidadFederativa?: string;
    /** 
     * País del domicilio.
     */
    cvePais?: string;
    /** 
     * Teléfono de contacto del domicilio.
     */
    telefono?: string;
  },
  /** 
   * Estatus de la empresa.
   */
  desEstatus?: string;
}