/**
 * ERROR_FORMA_ALERT
 * 
 * Constante que contiene el mensaje de error en formato HTML para mostrar una alerta
 * cuando faltan campos por capturar en un formulario.
 *
 * @example
 * // Uso típico:
 * mostrarAlerta(ERROR_FORMA_ALERT);
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`

/**
 * ERROR_FORMA_ALERT
 * 
 * Constante que contiene el mensaje de error en formato HTML para mostrar una alerta
 * cuando faltan campos por capturar en un formulario.
 *
 * @example
 * // Uso típico:
 * mostrarAlerta(ERROR_FORMA_ALERT);
 */
export const ERROR_FORMA_ALERT_CONSULTA =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`

/** Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? '12345'}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;