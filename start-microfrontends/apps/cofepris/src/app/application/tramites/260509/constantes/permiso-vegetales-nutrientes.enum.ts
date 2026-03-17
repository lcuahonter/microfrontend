/**
 * TABLA_ORDEN: Constante que define el orden y visibilidad de los sujetos en la tabla.
 * Cada objeto dentro del arreglo representa un sujeto con su nombre, orden de aparición y si es visible o no.
 */
export const TABLA_ORDEN = [
  { nombre: 'Fabricante', orden: 3, esVisible: true },
  { nombre: 'Formulador', orden: 2, esVisible: true },
  { nombre: 'Proveedor', orden: 1, esVisible: true },
];

/** Mensaje HTML de advertencia que indica un error de registro por campos incompletos. */
export const TEXTO_DE_PELIGRO = '<strong>¡Error de registro!</strong> Faltan campos por capturar';

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';

/**
 * Mensaje HTML que se muestra cuando hay un error de registro debido a campos faltantes por capturar.
 * 
 * @remarks
 * Este mensaje se utiliza para validar formularios y notificar al usuario que debe completar todos los campos requeridos.
 */
export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

/**
 * Genera un mensaje HTML indicando que la solicitud ha sido registrada exitosamente con un número temporal.
 *
 * @param numeroSolicitud - El número temporal asignado a la solicitud.
 * @returns Un string con el mensaje HTML que informa sobre el registro exitoso y la validez del número temporal.
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p style="text-align: center;">
    La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
    Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
    Un folio oficial le será asignado al momento en que ésta sea firmada.
  </p>`;
