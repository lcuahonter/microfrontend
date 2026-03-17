import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado para el número de trámite
 */
export interface TramiteFolioState {
  idTramite: string | null;
  firma: string | null;
  idSolicitud: number | null; 
  procedure: number | null;
}

/**
 * Creación del estado inicial para el trámite
 * @returns TramiteFolioState
 */
export function createInitialFolioTramiteState(): TramiteFolioState {
  return {
    idTramite: null,
    firma: null,
    idSolicitud: null,
    procedure: null,
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite', resettable: true })
export class TramiteFolioStore extends Store<TramiteFolioState> {
  constructor() {
    super(createInitialFolioTramiteState());
  }

  /**
   * Guarda el número de trámite en el state
   *
   * @param idTramite
   */
 public establecerTramite(idTramite: string, firma: string, idSolicitud?: number,procedure?: number): void {
  this.update((state) => ({
    ...state,
    idTramite,
    firma,
    idSolicitud,
    procedure
  }));
}

  /**
   * Limpia el estado del trámite
   */

  public limpiarTramite(): void {
    this.reset();
  }
}
