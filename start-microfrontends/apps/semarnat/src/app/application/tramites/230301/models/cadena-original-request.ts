export interface CadenaOriginalRequest {
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
