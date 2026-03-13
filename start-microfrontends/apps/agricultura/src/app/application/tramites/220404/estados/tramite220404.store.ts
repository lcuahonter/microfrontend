/**
 * @fileoverview
 * Este archivo define el store `DesistimientoStore`, que administra el estado relacionado con la modalidad de cambio
 * en el trámite 220404. Utiliza Akita para gestionar el estado de manera reactiva y proporciona métodos para actualizar
 * y restablecer el estado.
 * 
 * @module Tramite220404Store
 * @description
 * Este archivo contiene la implementación del store `DesistimientoStore`, que incluye la definición del estado inicial,
 * la interfaz del estado, y métodos para actualizar y limpiar el estado.
 */

import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * @interface DesistimientoState
 * @description
 * Representa el estado de la modalidad de cambio en el trámite 220404.
 */
export interface DesistimientoState {
  /**
   * Folio del trámite.
   * @type {string}
   */
  folio: string;

  /**
   * Tipo de solicitud asociada al trámite.
   * @type {string}
   */
  tipoDeSolicitud: string;

  /**
   * Descripción del trámite.
   * @type {string}
   */
  descripcion: string;
}

/**
 * @function createInitialState
 * @description
 * Inicializa el estado con valores predeterminados.
 * 
 * @returns {DesistimientoState} Estado inicial del trámite.
 * 
 * @example
 * const initialState = createInitialState();
 * console.log(initialState.folio); // ''
 */
export function createInitialState(): DesistimientoState {
  return {
    folio: '',
    tipoDeSolicitud: '',
    descripcion: '',
  };
}

/**
 * @class DesistimientoStore
 * @description
 * Administra el estado de la modalidad de cambio utilizando Akita.
 * Proporciona métodos para actualizar y restablecer el estado.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'desistimiento', resettable: true })
export class DesistimientoStore extends Store<DesistimientoState> {
  /**
   * Constructor de la clase.
   * Llama al constructor de la clase base y establece el estado inicial.
   * 
   * El estado inicial se crea utilizando la función `createInitialState`,
   * que define la configuración predeterminada para esta clase.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method setDescripcion
   * @description
   * Actualiza el estado de `descripcion` con la nueva descripción ingresada.
   * 
   * @param {DesistimientoState} state - Estado actual del store.
   * @param {string} descripcion - Nueva descripción a establecer.
   * 
   * @example
   * this.desistimientoStore.setDescripcion(currentState, 'Nueva descripción');
   */
  public setDescripcion(state: DesistimientoState, descripcion: string): void {
    const UPDATED_STATE = { ...state, descripcion };
    this.update((state) => ({
      ...state,
      ...UPDATED_STATE,
    }));
  }

  /**
   * @method limpiarFormulario
   * @description
   * Restablece el estado a su estado inicial.
   * 
   * @example
   * this.desistimientoStore.limpiarFormulario();
   */
  public limpiarFormulario(): void {
    this.reset();
  }
}