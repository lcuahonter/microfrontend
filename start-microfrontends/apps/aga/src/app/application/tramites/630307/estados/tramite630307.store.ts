
import { Store, StoreConfig } from '@datorama/akita';

import { Injectable } from '@angular/core';


/**
 * Interfaz que define el estado del trámite 630307.
 * Contiene las propiedades necesarias para gestionar el estado del trámite.
 */
export interface Tramite630307State {
  [key: string]: unknown; // Permite propiedades adicionales
}

/**
 * Función que crea el estado inicial del trámite 630307.
 * 
 * @returns Estado inicial del trámite 630307.
 */
export function createInitialState(): Tramite630307State {
  return {
  };
}

/**
 * Clase que representa el store del trámite 630307.
 * Extiende la clase `Store` de Akita para gestionar el estado del trámite.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite630307', resettable: true })
export class Tramite630307Store extends Store<Tramite630307State> {
  /**
   * Constructor del store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
     * Actualiza el estado de la solicitud con los valores proporcionados.
     * Param valores Objeto parcial con los valores a actualizar.
     */
    public actualizarEstado(valores: Partial<Tramite630307State>): void {
      this.update((state) => ({
        ...state,
        ...valores,
      }));
    }

  /**
   * Actualiza el estado del trámite 630307 con los valores proporcionados.
   * 
   * @param valores - Valores parciales para actualizar el estado.
   */
  setTramite630307State(fieldName: string, valores:unknown): void {
    this.update((state => ({
      ...state,
      [fieldName]: valores,
    })));
  }
}