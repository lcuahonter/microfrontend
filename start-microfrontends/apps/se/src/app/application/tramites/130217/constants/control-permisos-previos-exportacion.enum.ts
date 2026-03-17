export const PASOS_EXPORTACION = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: true,
    },
    {
        indice: 2,
        titulo: 'Anexar requisitos',
        activo: false,
        completado: false,
    },
    {
        indice: 3,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
    }
];

/**
 * Mensaje de éxito que se muestra cuando la solicitud ha sido registrada exitosamente.
 * @param numeroSolicitud - Número temporal de la solicitud registrada
 * @returns Mensaje HTML formateado con el número de solicitud
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;

/**
 * Plantilla HTML utilizada para mostrar un mensaje de error personalizado en el formulario.
 * @param mensajeDeError - Mensaje de error específico a mostrar
 * @returns Mensaje HTML formateado con el error
 */
export const CALCULATE_ALERT_ERROR = (mensajeDeError: string): string => `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
     <p style="color: #000000;">Corrija los siguientes errores:</p>
     <ol><li style="color: #b72222;"> ${mensajeDeError} </li></ol>
    </div>
  </div>
</div>
`