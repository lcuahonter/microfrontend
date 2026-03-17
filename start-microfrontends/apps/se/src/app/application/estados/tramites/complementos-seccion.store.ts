import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * @interface ComplementosSeccionState
 * Representa el estado de la sección de complementos.
 * Es un objeto dinámico que puede contener cualquier clave y valor.
 */
export interface ComplementosSeccionState {
  [key: string]: unknown; // Claves dinámicas con valores de cualquier tipo
}

/**
 * @function createInitialState
 * @description Función que crea el estado inicial del store.
 * @returns {ComplementosSeccionState} Un objeto vacío que representa el estado inicial.
 */
export function createInitialState(): ComplementosSeccionState {
  return {};
}

/**
 * @class ComplementosSeccionStore
 * @description Clase que extiende de Akita Store para manejar el estado de la sección de complementos.
 * Proporciona métodos para actualizar dinámicamente el estado.
 */
@Injectable({
  providedIn: 'root', // Proporciona el store a toda la aplicación
})
@StoreConfig({ name: 'complemetos', resettable: true }) // Configuración del store
export class ComplementosSeccionStore extends Store<ComplementosSeccionState> {
  
  /**
   * compodoc
   * @constructor
   * @description Constructor que inicializa el estado del store utilizando la función `createInitialState`.
   */
  constructor() {
     super(createInitialState()); // Inicializa el store con el estado inicial
   }

  /**
   * compodoc
   * @method setDynamicFieldValue
   * @description Establece un valor dinámicamente en el store basado en el nombre del campo.
   * @param {string} fieldName - El nombre del campo que se desea actualizar.
   * @param {any} value - El valor que se desea asignar al campo.
   */
  public setDynamicFieldValue(fieldName: string, value: unknown): void {
    this.update((state) => ({
      ...state, // Mantiene el estado actual
      [fieldName]: value, // Actualiza el campo especificado con el nuevo valor
    }));
  }
}