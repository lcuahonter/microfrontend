/**
 * @enum {string} TITULO_MENSAJE
 * @description Título del mensaje para el trámite de aviso de importación de precursores químicos o productos químicos esenciales.
 */
export const TITULO_MENSAJE =
  'Aviso de importación de precursores químicos o productos químicos esenciales';

/**
 * Lista de elementos requeridos para completar el formulario o proceso.
 * @constant
 * @type {string[]}
 */
export const ERROR_ALERTA =
 `
<div class="d-flex justify-content-center text-center">
    <div>
    <div class="col-md-12 campos-requeridos">
        <p><strong>¡Error de registro!</strong> Faltan campos por capturar.</p>
    </div>
    </div>
</div>
`;

/**
 * Genera una plantilla HTML con un mensaje de error personalizado relacionado
 * con el proceso de cálculo.
 * @param mensajeDeError Mensaje de error a incluir en la plantilla
 * @returns Plantilla HTML formateada con el mensaje de error
 */
export const MENSAJE_CORREGIR_ERRORES = (mensajeDeError: string): string => `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
     <p style="color: #000000;">Corrija los siguientes errores:</p>
     <ol><li style="color: #b72222;"> ${mensajeDeError} </li></ol>
    </div>
  </div>
</div>
`

/**
 * Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;

/**
 * Identificador del procedimiento administrativo correspondiente al trámite.
 *
 * @constant
 * @type {number}
 */
export const ID_PROCEDIMIENTO = 260603;