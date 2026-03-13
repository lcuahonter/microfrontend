/**
 * Interfaz que representa la información fiscal disponible de una empresa.
 */
export interface DisponsibleFiscal {
    /** Nombre de la calle. */
    calle: string;
    /** Número exterior. */
    numeroExterior: string;
    /** Número interior. */
    numeroInterior?: string;
    /** Código postal. */
    codigoPostal: string;
    /** Nombre de la colonia. */
    colonia: string;
    /** Municipio o delegación. */
    municipioDelegacion: string;
    /** Entidad federativa. */
    entidadFederativa: string |undefined;
    /** País. */
    pais: string;
    /** Registro Federal de Contribuyentes (RFC). */
    registroFederalContribuyentes: string;
    /** Domicilio fiscal del solicitante. */
    domicilioFiscalSolicitante: string;
    /** Razón social. */
    razonSocial: string;
  }
  /**
 * Representa una fracción arancelaria con su respectiva descripción.
 */
  export interface FraccionArancelariaDescripcion {
    fraccionArancelaria: number;
    descripcion: string;
  }