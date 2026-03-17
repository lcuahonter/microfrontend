/**
 * Modelo para el payload de guardado (Request Body).
 * Usa snake_case para coincidir con el Backend Java.
 * * NOTA: No incluir 'tipo_de_caat_aereo' aquí, ese dato viaja 
 * dentro de 'solicitante.ide_generica_1'.
 */
export interface GuardarSolicitudRequest {
  id_solicitud: number | null;
  cod_iata_icao: string;
  ide_cod_transportacion_aerea: string;
  solicitante: SolicitanteRequest;
}

export interface SolicitanteRequest {
  rfc: string;
  nombre: string;
  es_persona_moral: boolean;
  ide_generica_1: string; // Aquí viaja el Tipo de CAAT (TAGA)
  certificado_serial_number: string | null;
}