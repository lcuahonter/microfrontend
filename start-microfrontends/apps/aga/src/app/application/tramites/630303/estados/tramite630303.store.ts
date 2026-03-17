
import { Store, StoreConfig } from '@datorama/akita';

import { Injectable } from '@angular/core';


/**
 * Interfaz que define el estado del trámite 630303.
 * Contiene las propiedades necesarias para gestionar el estado del trámite.
 */
export interface Tramite630303State {
  [key: string]: unknown; // Permite propiedades adicionales
}

/**
 * Función que crea el estado inicial del trámite 630303.
 * 
 * @returns Estado inicial del trámite 630303.
 */
export function createInitialState(): Tramite630303State {
  return {
  };
}

/**
 * Clase que representa el store del trámite 630303.
 * Extiende la clase `Store` de Akita para gestionar el estado del trámite.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite630303', resettable: true })
export class Tramite630303Store extends Store<Tramite630303State> {
  /**
   * Constructor del store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado del trámite 630303 con los valores proporcionados.
   * 
   * @param valores - Valores parciales para actualizar el estado.
   */
  setTramite630303State(fieldName: string, valores:unknown): void {
    this.update((state => ({
      ...state,
      [fieldName]: valores,
    })));
  }

  	/**
	   * Actualiza la pestaña activa en el flujo del trámite.
	   * 
	   * Este método permite establecer la pestaña activa en el flujo del trámite.
	   * 
	   * @param {number} pestanaActiva - El número de la pestaña activa a establecer.
	   */
	  public setPestanaActiva(pestanaActiva: number): void {
	    this.update((state) => ({
	      ...state,
	      pestanaActiva,
	    }));
	  }
    
	  /**
	   * Actualiza el paso activo en el flujo del trámite.
	   * Permite establecer el paso activo en el wizard o proceso.
	   * @param {number} pasoActivo - El número del paso activo a establecer.
	   */
	  public setPasoActivo(pasoActivo: number): void {
	    this.update((state) => ({
	      ...state,
	      pasoActivo,
	    }));
    }
}