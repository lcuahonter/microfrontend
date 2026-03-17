/**
 * TABLA_ORDEN: Constante que define el orden y visibilidad de los sujetos en la tabla.
 * Cada objeto dentro del arreglo representa un sujeto con su nombre, orden de aparición y si es visible o no.
 */
export const TABLA_ORDEN = [
  { nombre: 'Fabricante', orden: 3, esVisible: true },
  { nombre: 'Formulador', orden: 2, esVisible: true },
  { nombre: 'Proveedor', orden: 1, esVisible: true },
];

export const TEXTO_DE_PELIGRO = '<strong>¡Error de registro!</strong> Faltan campos por capturar';

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos. 
 */
export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';
