/**
 * Constante que contiene el título del mensaje para la solicitud de modificación de permiso ordinario para la importación de artificios pirotécnicos.
 * @type {string}
 */
export const TITULOMENSAJE =
  'Solicitud de Modificación de Permiso ordinario para la importación de artificios pirotécnicos';

/**
 * Constante que contiene el texto de requisitos para la solicitud.
 * @type {string}
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [ID_SOLICITUD]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * Constante que representa el identificador del procedimiento.
 * @type {number}
 */
export const ID_PROCEDIMIENTO = 240311;

/**
 * @interface CrossList
 * Interfaz que define las funciones para agregar o quitar elementos en una lista cruzada.
 */
interface CrossList {
  /**
   * Agrega elementos a la lista cruzada según el tipo especificado.
   * @param type Tipo de acción para agregar elementos a la lista cruzada.
   */
  agregar: (type: string) => void;
  /**
   * Quita elementos de la lista cruzada según el tipo especificado.
   * @param type Tipo de acción para quitar elementos de la lista cruzada.
   */
  quitar: (type: string) => void;
}

/**
 * @interface Contexto
 * Interfaz que define el contexto que contiene una instancia opcional de `CrossList`.
 * @property {CrossList} [crossList] - Instancia de `CrossList` para manejar las acciones de la lista cruzada.
 */
interface Contexto {
  /**
   * Instancia de `CrossList` para manejar las acciones de la lista cruzada.
   */
  crossList?: CrossList;
}

/**
 * Construye un conjunto de botones para manejar acciones en una lista cruzada de aduanas.
 * Cada botón tiene un nombre, una clase CSS y una función asociada que se ejecuta al hacer clic.
 *
 * @function construirAduanasBotones
 * @param {Contexto} ctx - Contexto que contiene la instancia de `CrossList`.
 * @returns {Array<{ btnNombre: string; class: string; funcion: () => void }>} Arreglo de objetos que representan los botones de acción para la lista cruzada de aduanas.
 *
 * @example
 * const botones = construirAduanasBotones({ crossList: miCrossList });
 * botones[0].funcion(); // Llama a crossList.agregar('t')
 */
export function construirAduanasBotones(ctx: Contexto): Array<{ btnNombre: string; class: string; funcion: () => void }> {
  return [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-primary',
      funcion: (): void => ctx.crossList?.agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-default',
      funcion: (): void => ctx.crossList?.agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-danger',
      funcion: (): void => ctx.crossList?.quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => ctx.crossList?.quitar('t'),
    },
  ];
}