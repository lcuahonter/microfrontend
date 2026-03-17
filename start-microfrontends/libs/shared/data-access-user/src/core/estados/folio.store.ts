import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define el estado del folio.
 */
export interface FolioState {
  folio: string | null;
}

/**
 * Crea el estado inicial para el folio.
 * @returns {FolioState} Estado inicial del folio.
 */
export function createInitialState(): FolioState {
  return {
    folio: null, // Valor inicial del folio
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'folio' })
export class FolioStore extends Store<FolioState> {
  /**
   * Constructor de la clase FolioStore.
   * Inicializa el estado del folio con el valor inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Método para actualizar el valor del folio en el store.
   * @param folio El nuevo valor del folio.
   */
  updateFolio(folio: string | null): void {
    this.update({ folio });
  }
}