/**
 * TABLA_ORDEN: Constante que define el orden y visibilidad de los sujetos en la tabla.
 * Cada objeto dentro del arreglo representa un sujeto con su nombre, orden de aparición y si es visible o no.
 */
export const TABLA_ORDEN = [
  { nombre: 'Fabricante', orden: 2, esVisible: true },
  { nombre: 'Formulador', orden: 3, esVisible: true },
  { nombre: 'Proveedor', orden: 1, esVisible: true },
];
export const TEXTO_DE_PELIGRO = '<strong>¡Error de registro!</strong> Faltan campos por capturar';

/**
 * Mensaje HTML que se muestra cuando hay un error de validación
 * debido a que faltan campos por capturar en el formulario de registro.
 * 
 * @constant
 */
export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

/**
 * Genera un mensaje HTML indicando que la solicitud ha sido registrada exitosamente con un número temporal.
 *
 * @param numeroSolicitud - El número temporal asignado a la solicitud. Si no se proporciona, se mostrará vacío.
 * @returns Un string con el mensaje HTML que informa al usuario sobre el registro exitoso y la validez del número temporal.
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p style="text-align: center;">
    La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
    Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
    Un folio oficial le será asignado al momento en que ésta sea firmada.
  </p>`;
