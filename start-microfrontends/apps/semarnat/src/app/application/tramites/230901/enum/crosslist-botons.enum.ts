import { CrosslistComponent } from "@ng-mf/data-access-user";

/**
 * Interfaz que define la estructura de un botón utilizado en el componente Crosslist.
 * Cada botón tiene un nombre, una clase CSS y una función asociada.
 * 
 * @btnNombre Nombre del botón que se mostrará en la interfaz.
 * @class Clase CSS que define el estilo del botón.
 * @funcion Función que se ejecutará al hacer clic en el botón.
 */
export interface CrosslistBoton {
  btnNombre: string;
  class: string;
  funcion: () => void;
}

/**
 * Función que genera una lista de botones para el componente Crosslist.
 * Cada botón tiene una funcionalidad específica, como agregar o quitar elementos.
 * 
 * crosslistComponent Componente Crosslist al que se asocian las funciones de los botones.
 * Devuelve un arreglo de objetos `CrosslistBoton` con las configuraciones de los botones.
 */
export const CROSSLIST_BOTONS = (crosslistComponent: CrosslistComponent): CrosslistBoton[] => [
  {
    btnNombre: 'Agregar todos',
    class: 'btn-default',
    funcion: (): void => {
      if (crosslistComponent) {
        crosslistComponent.agregar('t');
      }
    },
  },
  {
    btnNombre: 'Agregar selección',
    class: 'btn-primary',
    funcion: (): void => {
      if (crosslistComponent) {
        crosslistComponent.agregar('');
      }
    },
  },
  {
    btnNombre: 'Restar selección',
    class: 'btn-primary',
    funcion: (): void => {
      if (crosslistComponent) {
        crosslistComponent.quitar('');
      }
    },
  },
  {
    btnNombre: 'Restar todos',
    class: 'btn-default',
    funcion: (): void => {
      if (crosslistComponent) {
        crosslistComponent.quitar('t');
      }
    },
  },
];

export const CROSLISTA_ENTRADA: string[] = [
  'ACAPULCO, PUERTO Y AEROPUERTO',
  'ADUANA DE PANTACO',
  'AEROPUERTO INT. DE LA CD DE MEXI',
  'AEROPUERTO INTERNACIONAL FELIF',
  'AGUA PRIETA',
  'AGUASCALIENTES, AGS.',
  'ALTAMIRA',
  'CANCUN, AEROPUERTO',
  'CD. CAMARGO, TAMPS.',
  'CD. DEL CARMEN',
  'CD. JUAREZ',
  'CHIHUAHUA, CHIH.'
];