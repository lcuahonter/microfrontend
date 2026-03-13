/**
 * Título del mensaje que describe la Solicitud de Prorroga de Aviso de importación de sustancias químicas
 */
export const TITULOMENSAJE =
  'Solicitud de Prorroga de Aviso de importación de sustancias químicas.';

/**
 * Texto que informa al usuario sobre el registro temporal de la solicitud,
 * indicando que no tiene validez legal hasta que sea firmada y se le asigne un folio oficial.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * Identificador numérico único del procedimiento asociado a la solicitud.
 */
export const ID_PROCEDIMIENTO = 240407;

/**
 * Interfaz que define las funciones para agregar o quitar elementos en una lista cruzada.
 */
interface CrossList {
  /**
   * Método para agregar elementos a la lista cruzada.
   */
  agregar: (type: string) => void;
  /**
   * Método para quitar elementos de la lista cruzada.
   */
  quitar: (type: string) => void;
}

/**
* Interfaz que define el contexto que contiene una instancia opcional de `CrossList`.
*/
interface Contexto {
  /**
   * Instancia de `CrossList` para manejar las acciones de la lista cruzada.
   */
  crossList?: CrossList;
}

/**
* description Construye un arreglo de botones configurados para manejar las acciones relacionadas con las aduanas.
* Cada botón incluye un nombre, una clase CSS para su estilo y una función asociada.
*
* param Contexto que contiene la instancia de `CrossList` para ejecutar las acciones.
* returns Lista de botones configurados.
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