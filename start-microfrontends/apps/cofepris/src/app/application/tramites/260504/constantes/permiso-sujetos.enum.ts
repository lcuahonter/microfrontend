/**
 * TABLA_ORDEN: Constante que define el orden y visibilidad de los sujetos en la tabla.
 * Cada objeto dentro del arreglo representa un sujeto con su nombre, orden de aparición y si es visible o no.
 */
export const TABLA_ORDEN = [
  { nombre: 'Fabricante', orden: 2, esVisible: true },
  { nombre: 'Formulador', orden: 3, esVisible: true },
  { nombre: 'Proveedor', orden: 1, esVisible: true },
];

/** Mensaje HTML de advertencia que indica un error de registro por campos incompletos. */
export const TEXTO_DE_PELIGRO = '<strong>¡Error de registro!</strong> Faltan campos por capturar';
