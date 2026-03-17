import { Store, StoreConfig } from '@datorama/akita';

import { Injectable } from '@angular/core';

/**
 * Representa el estado de TercerosRelacionadosState.
 * Es un objeto dinámico donde las claves son cadenas y los valores pueden ser de cualquier tipo.
 * 
 */
export interface TercerosRelacionadosState {
    [key: string]: string | number | boolean;
}

/**
 * Crea el estado inicial para TercerosRelacionadosState.
 */
export function createInitialState(): TercerosRelacionadosState {
    return {};
}

/**
 * Marca esta clase como un servicio inyectable en Angular.
 * 
 * @decorator Injectable
 * @property {string} providedIn - Define el alcance del servicio. 
 * En este caso, el servicio está disponible en toda la aplicación ('root').
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Configuración del store para Tramite130103.
 * 
 * @decorator StoreConfig
 * @property {string} name - Nombre del store, utilizado para identificarlo.
 * @property {boolean} resettable - Indica si el estado del store puede ser reiniciado.
 */
@StoreConfig({ name: 'tercerosRelacionados', resettable: true })

export class TercerosRelacionadosStore extends Store<TercerosRelacionadosState> {

    /**
     * Constructor de la clase TercerosRelacionadosStore.
     * 
     * Este constructor inicializa el estado del store utilizando la función `createInitialState`.
     * La función `createInitialState` devuelve un objeto vacío que representa el estado inicial.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Establece un valor dinámicamente en el store por nombre de campo.
     * @param fieldName El nombre del campo a actualizar.
     * @param value El valor a establecer.
     */
  public setDynamicFieldValue(fieldName: string, value: string | number | boolean): void {
    this.update((state) => ({
      ...state,
      [fieldName]: value,
    }));
  }
}