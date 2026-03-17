/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store, StoreConfig } from '@datorama/akita';

import { Injectable } from '@angular/core';

/**
 * Representa el estado de Solicitud260515State.
 * Es un objeto dinámico donde las claves son cadenas y los valores pueden ser de cualquier tipo.
 * 
 * @interface Solicitud260515State
 * @property {string} [key] - Las claves son cadenas que representan los nombres de los campos.
 * @property {any} [value] - Los valores pueden ser de cualquier tipo, dependiendo del campo.
 */
export interface Solicitud260515State {
    [key: string]: any;
    idSolicitud: number;
    formValidity?: {
    datosEstablecimiento?: boolean;
    domicilioEstablecimiento?: boolean;
    manifiestos?: boolean;
    representanteLegal?: boolean;
    terceros?: boolean;
    pagoDeDerechos?: boolean;
  };
}

/**
 * Crea el estado inicial para Solicitud260515State.
 * @returns {Solicitud260515State} Un objeto vacío que representa el estado inicial del estado de Solicitud260515State.
 */
export function createInitialState(): Solicitud260515State {
    return {
        idSolicitud: 0,
        formValidity: {},
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
@StoreConfig({ name: 'tramite260515', resettable: true })

export class Tramite260515Store extends Store<Solicitud260515State> {

    /**
     * Constructor de la clase Tramite260515Store.
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
 * Actualiza el estado de validez de un formulario específico dentro del trámite.
 * @param formName Nombre del formulario a actualizar.
 * @param isValid Indica si el formulario es válido o no.
 */
  setFormValidity(formName: string, isValid: boolean): void {
    this.update((state) => ({
      ...state,
      formValidity: {
        ...state.formValidity,
        [formName]: isValid,
      },
    }));
  }

  /** Establece el ID de la solicitud en el estado actual. */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({ ...state, idSolicitud }));
  }

   /**
 * Establece el estado del botón continuar para activar o desactivar las validaciones del formulario.
 * @param continuarTriggered Indica si el botón continuar ha sido activado.
 */
  public setContinuarTriggered(continuarTriggered: boolean): void {
    this.update((state) => ({ ...state, continuarTriggered }));
  }

    /**
   * Actualiza el índice en el estado del store.
   * 
   * Este método permite modificar el valor del índice en el estado actual del store,
   * lo que puede ser útil para identificar o rastrear elementos específicos dentro
   * de la aplicación.
   * 
   * @param indice - Nuevo valor del índice a establecer en el estado.
   */
  public setIndice(indice: number): void {
    this.update((state) => ({
      ...state,
      indice
    }))
  }

  /**
   * @method updateTabSeleccionado
   * @description Actualiza el índice de la pestaña seleccionada.
   * @param {number} tabSeleccionado - Nuevo índice de la pestaña.
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado: tabSeleccionado,
    }));
  }


}