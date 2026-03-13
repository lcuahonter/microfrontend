

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
    aceptarObligacionFiscal?: string;
  };
  formaModificaciones: {
    nombreDelFederatario: string;
    nombreDeNotaria: string;
    estado: string;
    nombreDeActa: string;
    fechaDeActa: string;
    rfc?: string;
    nombreDeRepresentante?: string;
  };
  formaCertificacion?: {
    certificada: string;
    fechaInicio: string;
    fechaVigencia: string;
  };
  formaSocioAccionistas?: {
    nationalidadMaxicana?: string;
    tipoDePersona?: string;
    formaDatos?: { [key: string]: string };
  };
}

export interface RazonSocialResponse {
  codigo: string;
  datos: {
    razon_social: string;
  };
}


