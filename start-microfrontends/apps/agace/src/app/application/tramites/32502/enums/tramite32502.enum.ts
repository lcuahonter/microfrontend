/**
 * Mensaje general.
 */
export const TODOS_PASOS = {
  Importante: `<p>Se sugiere verificar todos los datos capturados y documentos adjuntos antes de culminar el trámite, ya que, en caso de existir algún error, no se podrá modificar o eliminar la información posterior a su firma.</p>`
};

/**
 * Mensaje exitoso
 * @param numeroSolicitud folio temporal
 * @returns mensaje
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p>La solicitud ha quedado registrada con el número temporal ${
    numeroSolicitud ?? ''
  }. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>`;

