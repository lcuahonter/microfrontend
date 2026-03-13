import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de SolicitudDeRegistroTpl120101State.
 * Es un objeto dinámico donde las claves son cadenas y los valores pueden ser de cualquier tipo.
 * 
 * @interface SolicitudDeRegistroTpl120101State
 * @property {string} [key] - Las claves son cadenas que representan los nombres de los campos.
 * @property {unknown} [value] - Los valores pueden ser de cualquier tipo, dependiendo del campo.
 */
export interface SolicitudDeRegistroTpl120101State {
    [key: string]: unknown;
}

/**
 * Crea el estado inicial para SolicitudDeRegistroTpl120101State.
 * @returns {SolicitudDeRegistroTpl120101State} Un objeto vacío que representa el estado inicial del estado de SolicitudDeRegistroTpl120101.
 */
export function createInitialState(): SolicitudDeRegistroTpl120101State {
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
@StoreConfig({ name: 'tramite120101', resettable: true })

export class Tramite120101Store extends Store<SolicitudDeRegistroTpl120101State> {

    /**
     * Constructor de la clase Tramite120101Store.
     * 
     * Este constructor inicializa el estado del store utilizando la función `createInitialState`.
     * La función `createInitialState` devuelve un objeto vacío que representa el estado inicial.
     */
    constructor() {
        super(createInitialState());
    }

    /**
   * Set a value dynamically in the store by field name.
   * @param fieldName The name of the field to update.
   * @param value The value to set.
   */
  public setDynamicFieldValue(fieldName: string, value: unknown): void {
    this.update((state) => ({
      ...state,
      [fieldName]: value,
    }));
  }
  }