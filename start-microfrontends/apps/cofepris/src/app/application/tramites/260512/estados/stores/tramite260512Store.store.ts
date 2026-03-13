import { Store, StoreConfig } from "@datorama/akita";
import { Injectable } from "@angular/core";

/**
 * Representa el estado de la aplicación para el trámite 260512.
 */
export interface Tramite260512State {
    /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
  idSolicitud: number;
   /**
  * Optional index of the currently selected tab
  * @type {number | undefined}
  */
  tabSeleccionado?: number;
}

export function createInitialState(): Tramite260512State {
  return {
    idSolicitud: 0,
    tabSeleccionado: 1,
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260512', resettable: true })
export class Tramite260512Store extends Store<Tramite260512State> {
  constructor() {
    super(createInitialState());
  }
   /**
   * Actualiza el estado con el nuevo valor de `idSolicitud`.
   */
  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
   /**
   * @method updateTabSeleccionado
   * @description Actualiza el índice de la pestaña seleccionada.
   * @param {number} tabSeleccionado - Nuevo índice de la pestaña.
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado
    }));
  }
}
