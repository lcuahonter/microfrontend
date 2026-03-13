import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interface representing the state of Tramites140112.
 */
export interface Tramites140112State {
  /**
   * Object containing the desistimiento property.
   */
    /**
     * The desistimiento property.
     * @type {string}
     */
    descripcionClobGenerica1: string;
    declaracionBoolean:boolean;
  }

/**
 * Function to create the initial state for Tramites140112.
 * @returns {Tramites140112State} The initial state.
 */
export function createInitialState(): Tramites140112State {
  return {
    descripcionClobGenerica1: '',
    declaracionBoolean: false,
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramites140112', resettable: true })
/**
 * Store class for managing the state of Tramites140112.
 */
export class Tramite140112Store extends Store<Tramites140112State> {
  /**
   * Constructor for Tramite140112Store.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Method to set the data in the store.
   * @param {Partial<Tramites140112State>} Datos - The data to set in the store.
   */
  public establecerDatos(Datos:Partial<Tramites140112State>): void {
    this.update((state) => ({
      ...state,
      ...Datos,
    }));
  }
}