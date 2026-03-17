/**
 * @constant {Array<Object>} OCTA_TEMPO
 * @description Constante que define los pasos del proceso de solicitud.
 * Cada paso incluye un índice, título, estado de actividad y si está completado.
 */
export const OCTA_TEMPO = [
  {
      indice: 1,
      titulo: 'Capturar solicitud',
      activo: true,
      completado: false,
  },
  {
      indice: 2,
      titulo: 'Firmar solicitud',
      activo: false,
      completado: false,
  }
];

/**
* @constant {Array<Object>} TIPO_PERSONA_RADIO_OPTIONS
* @description Opciones para el tipo de persona en formato de radio buttons.
* Incluye etiquetas y valores para las opciones "Física" y "Moral".
*/
export const TIPO_PERSONA_RADIO_OPTIONS = [
{ label: 'Física', value: 'fisica' },
{ label: 'Moral', value: 'moral' },
];