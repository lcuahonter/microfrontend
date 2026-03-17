export interface CertificadoPayload {
  solicitud: {
    solicitante: {
      rfc: string;
      razonSocial: string;
      descripcionGiro: string;
      correoElectronico: string;
      telefono: string;
      cveUsuario: string;
      domicilio: {
        pais: {
          clave: string;
          nombre: string;
        };
        entidadFederativa: {
          clave: string;
          nombre: string;
        };
        delegacionMunicipio: {
          clave: string;
          nombre: string;
        };
        localidad: {
          clave: string;
          nombre: string;
        };
        colonia: {
          clave: string;
          nombre: string;
        };
        calle: string;
        numeroExterior: string;
        numeroInterior: string;
        codigoPostal: string;
      };
    };
    cveRolCapturista: string;
    cveUsuarioCapturista: string;
    clavePaisSeleccionado: string;
    idTratadoAcuerdoSeleccionado: string;
    discriminatorValue: string;
    tramite: {
      numFolioTramite: string;
    };
    idSolicitud: string;
  };
  puedeCapturarRepresentanteLegalCG: boolean;
  datosMercancia: {
    numeroCertificado: string;
  };
  buscarCertificadosPorNumero: string;
  buscarListaCertificados: string;
}

export interface Certificadoes {
  idCertificado: string;
  numeroCertificado: string;
  fechaVencimiento: string;
  fechaExpedicion: string;
}

/**
 * Payload para la operación de guardar una solicitud de trámite.
 */
export interface GuardarPayload {
  idSolicitud?: number;
  discriminatorValue?: string;
  numCertificadoSeleccionado?: string | null;
  puedeCapturarRepresentanteLegalCG?: boolean;
  solicitud?: Solicitud;
  mercancias?: MercanciaExportacion[];
}

/** Payload para la generación de la cadena original.
 */
export interface Solicitud {
  cveRolCapturista?: string;
  cveUsuarioCapturista?: string;
  cveUsuario?: string;
  clavePaisSeleccionado?: string;
  idTratadoAcuerdoSeleccionado?: string;
  solicitante?: Solicitante;
  certificadoOrigen?: CertificadoOrigen;
}

/** Modelo de datos para el solicitante en la solicitud de trámite.
 */
export interface Solicitante {
  rfc?: string;
  rolCapturista?: string;
  razonSocial?: string;
  descripcionGiro?: string;
  correoElectronico?: string;
  domicilio?: Domicilio;
}

/** Modelo de datos para el domicilio del solicitante.
 */
export interface Domicilio {
  pais?: Catalogo;
  entidadFederativa?: Catalogo;
  delegacionMunicipio?: Catalogo;
  colonia?: Catalogo;
  localidad?: Catalogo;
  codigoPostal?: string | null;
  calle?: string;
  numeroExterior?: string;
  numeroInterior?: string | null;
  telefono?: string;
}

/** Modelo de datos para la respuesta del certificado de origen.
 */

export interface Catalogo {
  clave?: string;
  nombre?: string;
}

/** Modelo de datos para el certificado de origen en la solicitud de trámite.
 */
export interface CertificadoOrigen {
  idSolicitud?: number;
  numeroCertificado?: string;
  observaciones?: string | null;
}


/** Payload para la generación de la cadena original.
 */
export interface GeneraCadenaPayload {
  num_folio_tramite: string | null;
  boolean_extranjero: boolean;
  solicitante: {
    rfc: string;
    nombre: string;
    es_persona_moral: boolean;
    certificado_serial_number: string;
  };
  cve_rol_capturista: string;
  cve_usuario_capturista: string;
  fecha_firma: string;
}

export interface CertificadoOrigenPayload {
  solicitud: {
    solicitante: {
      rfc: string;
      razonSocial: string;
      descripcionGiro: string;
      correoElectronico: string;
      telefono: string;
      cveUsuario: string;
    };
    cveRolCapturista: string;
    cveUsuarioCapturista: string;
    discriminatorValue: string;
    idSolicitud: string | null;
    clavePaisSeleccionado: string | null;
    idTratadoAcuerdoSeleccionado: string | null;
    tramite: {
      numFolioTramite: string | null;
    };
  };
  puedeCapturarRepresentanteLegalCG: boolean;
  numCertificadoSeleccionado: string | null;
  datosMercancia: {
    numeroCertificado: string | null;
  };
  parametrosBP: {
    idSolicitud: string | null;
    servicio: string | null;
    mensaje: string | null;
    idTramite: string;
  };
}

export interface CertificadoOrigenResponse {
  numeroCertificadoOrigen: string | null;
  fechaExpedicion: string | null;
  fechaVencimiento: string | null;
  tratadoAcuerdo: string | null;
  paisBloque: string | null;
  nombre: string | null;
  primerApellido: string | null;
  segundoApellido: string | null;
  numeroRegistroFiscal: string | null;
  razonSocial: string | null;
  ciudad: string | null;
  calle: string | null;
  numeroLetra: string | null;
  telefono: string | null;
  fax: string | null;
  correoElectronico: string | null;
  observaciones: string | null;
  mercancias: unknown[];
}

export interface Params{
  /** 
   * Identificador único de la solicitud
   * @type {string}
   * @description ID de la solicitud como cadena de texto (puede ser indefinido)
   */
  idSolicitud?: string;
  /** 
   * Identificador del programa IMMEX
   * @type {string}
   * @description ID del programa de la Industria Manufacturera, Maquiladora y de Servicios
   * de Exportación (puede ser indefinido)
   */
  idPrograma?: string;
  /** 
   * RFC del contribuyente
   * @type {string}
   * @description Registro Federal de Contribuyentes del solicitante (puede ser indefinido)
   */
  rfc?: string;
}

/** Modelo de datos para la mercancía de exportación en el certificado de origen.
 */
export interface MercanciaExportacion {
  numeroOrden?: number;
  fraccionArancelaria?: string | null;
  nombreTecnico?: string | null;
  nombreComercial?: string | null;
  nombreEnIngles?: string | null;
  marca?: string | null;
  complementoDescripcion?: string | null;
  cantidadExportar?: number | null;
  unidadMedidaComercializacion?: string | null;
  valorMercancia?: number | null;
  numeroFactura?: string | null;
  fechaFactura?: string | null;
  notas?: string | null;
}

