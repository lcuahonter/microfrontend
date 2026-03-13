import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado para el número de trámite
 */
export interface TramiteCofeprisState {
  idTramite: string;
  firma: string;
}

/**
 * Creación del estado inicial para el trámite
 * @returns TramiteState
 */
export function createInitialState(): TramiteCofeprisState {
  return {
    idTramite: '',
    firma: '',
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramiteCofeprisStore', resettable: true })
export class TramiteCofeprisStore extends Store<TramiteCofeprisState> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda el número de trámite en el state
   *
   * @param idTramite
   */
  public establecerTramite(idTramite: string, firma: string) {
    this.update((state) => ({
      ...state,
      idTramite,
      firma,
    }));
  }

  /**
   * Limpia el estado del trámite
   */

  public limpiarTramite() {
    this.reset();
  }
}
