export interface GuardarT31910Request {
  solicitante: {
    /**
     * RFC del solicitante (persona física o moral).
     * Ejemplo: 'XAXX010101000'
     */
    rfc: string;
    /**
     * Nombre completo o razón social del solicitante.
     */
    nombre: string;
    /**
     * Indicador si el solicitante es persona moral (true) o física (false).
     */
    es_persona_moral: boolean;
    /**
     * Número de serie del certificado del solicitante.
     * Usado para validación/autenticación digital.
     */
    certificado_serial_number: string;
  };

  /**
    * Justificación técnica para desistir la solicitud de información histórica.
   */
  justificacion_tecnica: string;

/**
 * Número de folio del trámite original que se desea desistir.
 */
  numero_folio_tramite_original: string;
}
