import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de Solicitude32612State.
 * Es un objeto dinámico donde las claves son cadenas y los valores pueden ser de cualquier tipo.
 *
 * @interface Solicitude32612State
 * @property {string} [key] - Las claves son cadenas que representan los nombres de los campos.
 * @property {unknown} [value] - Los valores pueden ser de cualquier tipo, dependiendo del campo.
 */
export interface Solicitude32612State {
  [key: string]: unknown;
}

/**
 * Crea el estado inicial para ExportarIlustraciones270101.
 * @returns {Solicitude32612State} Un objeto vacío que representa el estado inicial del estado de Solicitude32612State.
 */
export function createInitialState(): Solicitude32612State {
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
 * Configuración del store para Tramite31401.
 *
 * @decorator StoreConfig
 * @property {string} name - Nombre del store, utilizado para identificarlo.
 * @property {boolean} resettable - Indica si el estado del store puede ser reiniciado.
 */
@StoreConfig({ name: 'tramite32612', resettable: true })
export class Tramite32612Store extends Store<Solicitude32612State> {
  /**
   * Constructor de la clase Tramite32612Store.
   *
   * Este constructor inicializa el estado del store utilizando la función `createInitialState`.
   * La función `createInitialState` devuelve un objeto vacío que representa el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method setDynamicFieldValue
   * @description
   * Método que establece dinámicamente un valor en el store utilizando el nombre del campo.
   *
   * Detalles:
   * - Actualiza el estado del store añadiendo o modificando el valor de un campo específico.
   * - Utiliza el método `update` para realizar la actualización del estado.
   *
   * @param {string} fieldName - Nombre del campo que se desea actualizar.
   * @param {unknown} value - Valor que se asignará al campo especificado.
   *
   * @example
   * this.setDynamicFieldValue('nombreCampo', 'nuevoValor');
   * // Actualiza el campo `nombreCampo` con el valor `nuevoValor` en el store.
   */
  public setDynamicFieldValue(fieldName: string, value: unknown): void {
    this.update((state) => ({
      ...state,
      [fieldName]: value,
    }));
  }
}
