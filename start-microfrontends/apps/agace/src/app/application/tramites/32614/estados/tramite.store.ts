import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado para el número de trámite
 */
export interface TramiteAgaceState {
  idTramite: string;
  firma: string;
}

/**
 * Creación del estado inicial para el trámite
 * @returns TramiteState
 */
export function createInitialState(): TramiteAgaceState {
  return {
    idTramite: '',
    firma: '',
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite', resettable: true })
export class TramiteAgaceStore extends Store<TramiteAgaceState> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda el número de trámite en el state
   *
   * @param idTramite
   */
  public establecerTramite(idTramite: string, firma: string): void {
    this.update((state) => ({
      ...state,
      idTramite,
      firma,
    }));
  }

  /**
   * Limpia el estado del trámite
   */

  public limpiarTramite(): void {
    this.reset();
  }
}
