/**
 * Modelo de respuesta para el certificado de cupos
 */
export interface CertificadoCupo {
  folioSolicitud: string;
  rfc: string;
  nombreRazonSocial: string;
  documento: string;
  estatus: string;
}

/**
 * Modelo de respuesta para el catalogo mock
 */
export interface CatalogoMock {
  clave: string;
  descripcion: string;
}
