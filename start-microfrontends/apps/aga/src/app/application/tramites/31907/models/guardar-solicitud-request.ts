import { Solicitante } from "./cadena-original-request";

/**
 * Request para guardar una solicitud del trámite 231002.
 *
 * Contiene información del solicitante, empresa de reciclaje, destinatario,
 * transporte, aduana de salida y la lista de residuos asociados.
 */
export interface GuardarSolicitud31907Request {
  /** Identificador único de la solicitud. */
  id_solicitud: number | null;

  /** foltio del tramite original */
  numero_folio_tramite_original: string;

    /** Datos del solicitante que realiza la solicitud. */
  solicitante: Solicitante;
}
