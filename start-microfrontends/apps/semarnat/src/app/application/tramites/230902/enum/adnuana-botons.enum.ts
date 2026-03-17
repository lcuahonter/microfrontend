import { CONTINUAR } from "./permiso-cites.enum";

export const AQUANDAS_LABEL = {
    tituluDeLaIzquierda: 'Aduanas disponibles:',
    derecha: 'Aduanas seleccionadas*:',
};
 
export const ADUANA_BOTONS= [
    {
      btnNombre: 'Agregar selección',
      class: 'btn-default fixed-width-button',
      funcion: (): void => agregar(CONTINUAR),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-danger fixed-width-button',
      funcion: (): void => quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default fixed-width-button',
      funcion: (): void => quitar(CONTINUAR),
    },
  ];
 
 
    function agregar(tipo: string): void {
      if (tipo === CONTINUAR) {
        // do nothing.
      }
    }
 
    function quitar(tipo: string = ''): void {
      if (tipo === CONTINUAR) {
        // do nothing.
      }
    }