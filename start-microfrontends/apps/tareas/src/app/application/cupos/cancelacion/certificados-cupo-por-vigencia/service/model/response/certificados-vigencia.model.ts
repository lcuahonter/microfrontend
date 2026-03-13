/**
 * Interfaz para los datos generales del solicitante.
 */
export interface DatosSolicitante {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  actividadEconomica: string;
  rfc: string;
  curp: string;
  email: string;
}

/**
 * Interfaz para el domicilio fiscal del solicitante.
 */
export interface DomicilioFiscal {
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  codigoPostal: string;
  colonia: string;
  pais: string;
  estado: string;
  localidad: string;
  municipioAlcaldia: string;
  telefono: string;
}

/**
 * Interfaz para los certificados cancelados.
 */
export interface CertificadoCancelado {
  folioOficio: string;
  rfc: string;
  nombreRazonSocial: string;
  representacionFederal: string;
}

/**
 * Respuesta completa de la consulta por RFC.
 */
export interface ConsultaRfcResponse {
  datosSolicitante: DatosSolicitante;
  domicilioFiscal: DomicilioFiscal;
}
