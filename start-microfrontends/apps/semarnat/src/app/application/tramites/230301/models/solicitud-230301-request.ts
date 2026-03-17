/**
 * Request para guardar una solicitud del trámite 230301.
 *
 * Contiene los datos del solicitante.
 */
export interface Solicitud230301Request {

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
   * Motivo del desistimiento
   * Campo libre para información adicional.
   */
  motivo_desistimiento: string;

  /**
   * Identificador de la solicitud anterior.
   */
  id_solicitud_anterior: number;

  /**
   * Folio del trámite anterior.
   */
  id_folio_anterior: string;
}
