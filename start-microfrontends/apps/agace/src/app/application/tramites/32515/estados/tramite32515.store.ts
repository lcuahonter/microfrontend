import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de InformationGeneralSolicitanteState.
 * Es un objeto dinámico donde las claves son cadenas y los valores pueden ser de cualquier tipo.
 * 
 * @interface InformationGeneralSolicitanteState
 * @property {string} [key] - Las claves son cadenas que representan los nombres de los campos.
 * @property {unknown} [value] - Los valores pueden ser de cualquier tipo, dependiendo del campo.
 */
export interface InformationGeneralSolicitanteState {
    [key: string]: unknown;
}

/**
 * Crea el estado inicial para InformationGeneralSolicitanteState.
 * @returns {InformationGeneralSolicitanteState} Un objeto vacío que representa el estado inicial del estado de CancelacionPeticion302.
 */
export function createInitialState(): InformationGeneralSolicitanteState {
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
 * Configuración del store para Tramite32515.
 * 
 * @decorator StoreConfig
 * @property {string} name - Nombre del store, utilizado para identificarlo.
 * @property {boolean} resettable - Indica si el estado del store puede ser reiniciado.
 */
@StoreConfig({ name: 'tramite32515', resettable: true })

export class Tramite32515Store extends Store<InformationGeneralSolicitanteState> {

    /**
     * Constructor de la clase Tramite32515Store.
     * 
     * Este constructor inicializa el estado del store utilizando la función `createInitialState`.
     * La función `createInitialState` devuelve un objeto vacío que representa el estado inicial.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Método para establecer datos en el store.
     * 
     * Este método toma un campo y un valor, y actualiza el estado del store con el nuevo valor.
     * Utiliza la función `update` del store para modificar el estado.
     * 
     * @param {string} campo - El nombre del campo que se va a actualizar en el estado.
     * @param {any} value - El nuevo valor que se asignará al campo especificado.
     * 
     * @example
     * Establecer un valor de campo: 
     * this.establecerDatos('nombre', 'Juan Pérez');
     */
    public establecerDatos(campo: string, value: unknown): void {
        this.update((state) => ({
            ...state,
            [campo]: value,
        }));
    }
   /**
   * Actualiza el estado del trámite 32515 con los valores proporcionados.
   * 
   * @param valores - Valores parciales para actualizar el estado.
   */
  setTramite32515State(fieldName: string, valores:unknown): void {
    this.update((state => ({
      ...state,
      [fieldName]: valores,
    })));
  }
  
}
