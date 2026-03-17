/**
 * Mensaje de advertencia si no se capturan localidad y colonia.
 */
export const LOCALIDAD_COLONIA = {
  mensaje: `<p>¡Precaución! Debes capturar localidad y colonia</p>`,
};

/**
 * Configuración para la fecha de caducidad.
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de caducidad', 
  required: false, 
  habilitado: false,
};

/**
 * Declaración de cumplimiento de requisitos y notificación por Ventanilla Única.
 */
export const MANIFIESTOS_DECLARACION = {
  MANIFIESTOS:
    'Cumplo con los requisitos y normatividad aplicable, sin que me eximan de que la autoridad sanitaria verifique su cumplimiento, esto sin perjuicio de las sanciones en que puedo incurrir por falsedad de declaraciones dadas a una autoridad. Asimismo acepto que la notificación de este trámite, sea a través de la Ventanilla Única de Comercio Exterior por los mecanismos de la misma.',
};

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p style="text-align: center;">
    La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
    Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
    Un folio oficial le será asignado al momento en que ésta sea firmada.
  </p>`;