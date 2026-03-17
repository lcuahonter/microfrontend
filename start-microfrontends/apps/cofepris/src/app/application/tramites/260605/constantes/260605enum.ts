/**
 * @description Mensaje del registro exitoso de la solicitud
 *@param {string} numeroSolicitud - El número de la solicitud registrada.
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: number) =>
  `<p>La solicitud ha quedado regitrada con el número temporal ${numeroSolicitud ?? ''}. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>`;

/**
 * @description Textos utilizados en el componente de carga de documentos.
 */
export const TEXTOS = {
  INSTRUCCIONES: `<h5 style="text-align: center;">Instrucciones: </h5>
  <ul style="text-align: center; list-style-position: inside; padding: 0;">
    <li>De acuerdo al caso particular, algunos documentos podrían ser obligatorios</li>
    <li>En caso de que no requieras algún documento, selecciónalo y elimínalo</li>
    <li>Si necesitas anexar más de un documento del mismo tipo, da clic en el botón <i class="bi bi-plus-circle-fill"></i> para agregar cuantos necesites.</li>
  </ul>`,
};