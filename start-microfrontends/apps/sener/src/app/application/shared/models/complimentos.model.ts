

export interface SociaoAccionistas {
  id?: string;
  rfc?: string;
  taxId?: string;
  razonSocial?: string;
  pais?: string;
  codigoPostal?: string;
  estado?: string;
  correoElectronico?: string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  cp?: string;
}

export interface DatosComplimentos {
  modalidad: string;
  programaPreOperativo: string;
  datosGeneralis: {
    paginaWWeb: string;
    localizacion: string;
  };
  obligacionesFiscales: {
    opinionPositiva: string;
    fechaExpedicion: string;
    aceptarObligacionFiscal: string;
  };
  formaModificaciones: {
    nombreDelFederatario: string;
    nombreDeNotaria: string;
    estado: string;
    nombreDeActa: string;
    fechaDeActa: string;
    rfc: string;
    nombreDeRepresentante: string;
  };
  formaCertificacion: {
    certificada: string;
    fechaInicio: string;
    fechaVigencia: string;
  };
  formaSocioAccionistas: {
    nationalidadMaxicana: string;
    tipoDePersona: string;
    formaDatos: { [key: string]: string };
  };
}

export interface CatalogoSener {
  /** Identificador único del catálogo. */
  id: number;
  /** Descripción del catálogo. */
  descripcion: string;
  /** Clave opcional del catálogo. */
  clave?: string;
  /** Tamaño opcional del catálogo. */
  relacionadaUmtId?: number;
  /** Identificador relacionado con acotación opcional. */
  relacionadaAcotacionId?: number;
  /** Decripcion del titulo del select, cuando se requiera. */
  title?: string;
  /** Decripcion del titulo del bloque, cuando se requiera. */
  bloque?: string;
  /** Acotación adicional, cuando se requiera. */
  acotacion?: string;
}


