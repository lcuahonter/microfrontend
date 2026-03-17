/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store, StoreConfig } from '@datorama/akita';

import { Injectable } from '@angular/core';

/**
 * Representa el estado de RetirosCofepris261702.
 * Es un objeto dinámico donde las claves son cadenas y los valores pueden ser de cualquier tipo.
 * 
 * @interface RetirosCofepris261702State
 * @property {string} [key] - Las claves son cadenas que representan los nombres de los campos.
 * @property {any} [value] - Los valores pueden ser de cualquier tipo, dependiendo del campo.
 */
export interface RetirosCofepris261702State {
    [key: string]: any;
          /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
  idSolicitud: number;
     /**
   * @property tabSeleccionado
   * @description Indica la pestaña seleccionada en la interfaz.
   * @type {number | undefined}
   */
  tabSeleccionado?: number;
}

/**
 * Crea el estado inicial para RetirosCofepris261702.
 * @returns {RetirosCofepris261702State} Un objeto vacío que representa el estado inicial del estado de RetirosCofepris302.
 */
export function createInitialState(): RetirosCofepris261702State {
    return {
      idSolicitud:0,
      tabSeleccionado: 1,
    };
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
 * Configuración del store para Tramite261702.
 * 
 * @decorator StoreConfig
 * @property {string} name - Nombre del store, utilizado para identificarlo.
 * @property {boolean} resettable - Indica si el estado del store puede ser reiniciado.
 */
@StoreConfig({ name: 'tramite261702', resettable: true })

export class Tramite261702Store extends Store<RetirosCofepris261702State> {

    /**
     * Constructor de la clase Tramite261702Store.
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
  public setDynamicFieldValue(fieldName: string, value: any): void {
    this.update((state) => ({
      ...state,
      [fieldName]: value,
    }));
  }
  /**
   * Actualiza el estado con el nuevo valor de `idSolicitud`.
   */
  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
      /**
   * @method updateTabSeleccionado
   * @description Actualiza la pestaña seleccionada en la interfaz.
   * @param {number} tabSeleccionado - Número de la pestaña seleccionada.
   * @returns {void}
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado: tabSeleccionado,
    }));
  }
  }