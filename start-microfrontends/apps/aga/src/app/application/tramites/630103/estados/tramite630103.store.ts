
import { Store, StoreConfig } from '@datorama/akita';

import { Injectable } from '@angular/core';


/**
 * Interfaz que define el estado del trámite 630103.
 * Contiene las propiedades necesarias para gestionar el estado del trámite.
 */
export interface Tramite630103State {
  [key: string]: unknown; // Permite propiedades adicionales
}

/**
 * Función que crea el estado inicial del trámite 630103.
 * 
 * @returns Estado inicial del trámite 630103.
 */
export function createInitialState(): Tramite630103State {
  return {
  };
}

/**
 * Clase que representa el store del trámite 630103.
 * Extiende la clase `Store` de Akita para gestionar el estado del trámite.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite630103', resettable: true })
export class Tramite630103Store extends Store<Tramite630103State> {
  /**
   * Constructor del store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado del trámite 630103 con los valores proporcionados.
   * 
   * @param valores - Valores parciales para actualizar el estado.
   */
  setTramite630103State(fieldName: string, valores:unknown): void {
    this.update((state => ({
      ...state,
      [fieldName]: valores,
    })));
  }
}