import { CrosslistComponent } from "@libs/shared/data-access-user/src";
export interface CrosslistBoton {
  /**
   * Nombre del botón.
   */
  btnNombre: string;

  /**
   * Clase CSS aplicada al botón.
   */
  class: string;

  /**
   * Función que se ejecuta al hacer clic en el botón.
   */
  funcion: () => void;
}


export const CROSSLIST_BOTONS = (component: CrosslistComponent): CrosslistBoton[] => [
  {
    btnNombre: 'Agregar todos',
    class: 'btn-default',
    funcion: (): void => {
      if (component) {
        component.agregar('t');
      }
    },
  },
  {
    btnNombre: 'Agregar selección',
    class: 'btn-primary',
    funcion: (): void => {
      if (component) {
        component.agregar('');
      }
    },
  },
  {
    btnNombre: 'Restar selección',
    class: 'btn-primary',
    funcion: (): void => {
      if (component) {
        component.quitar('');
      }
    },
  },
  {
    btnNombre: 'Restar todos',
    class: 'btn-default',
    funcion: (): void => {
      if (component) {
        component.quitar('t');
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