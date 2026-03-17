/**
 * @constant {string} TITULOMENSAJE
 * Título del mensaje que describe la solicitud de modificación de permiso ordinario
 * para la importación de artificios pirotécnicos.
 */
export const TITULOMENSAJE =
  'Solicitud de Modificación de Permiso ordinario para la importación de artificios pirotécnicos';

/**
 * @constant {string} TEXTOS_REQUISITOS
 * Texto que informa al usuario sobre el registro temporal de la solicitud,
 * indicando que no tiene validez legal hasta que sea firmada y se le asigne un folio oficial.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [ID_SOLICITUD]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * @constant {number} ID_PROCEDIMIENTO
 * Identificador numérico único del procedimiento asociado a la solicitud.
 */
export const ID_PROCEDIMIENTO = 240308;

/**
 * @interface CrossList
 * Interfaz que define las funciones para agregar o quitar elementos en una lista cruzada.
 *
 * @method agregar
 * @param {string} type - Tipo de acción para agregar elementos.
 * @returns {void}
 *
 * @method quitar
 * @param {string} type - Tipo de acción para quitar elementos.
 * @returns {void}
 */
interface CrossList {
  agregar: (type: string) => void;
  quitar: (type: string) => void;
}

/**
* @interface Contexto
* Interfaz que define el contexto que contiene una instancia opcional de `CrossList`.
*
* @property {CrossList} [crossList] - Instancia de `CrossList` para manejar las acciones de la lista cruzada.
*/
interface Contexto {
  crossList?: CrossList;
}

/**
* @function construirAduanasBotones
* @description Construye un arreglo de botones configurados para manejar las acciones relacionadas con las aduanas.
* Cada botón incluye un nombre, una clase CSS para su estilo y una función asociada.
*
* @param {Contexto} ctx - Contexto que contiene la instancia de `CrossList` para ejecutar las acciones.
* @returns {Array<{ btnNombre: string; class: string; funcion: () => void }>} Lista de botones configurados.
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