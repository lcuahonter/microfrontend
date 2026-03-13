import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de la solicitud 11106 (Cancelación de Donaciones).
 */
export interface Solicitud11106State {
  /**
   * Campo checkbox: La autorización es nula
   */
  laAutorizacionEsNula: boolean;
}

/**
 * Crea el estado inicial para la solicitud 11106.
 *
 * @returns {Solicitud11106State} El estado inicial con los valores predeterminados.
 */
export function createInitialState(): Solicitud11106State {
  return {
    laAutorizacionEsNula: false, // Valor inicial del checkbox
  };
}

/**
 * Clase `Solicitud11106Store` que extiende de `Store<Solicitud11106State>`.
 * 
 * Esta clase representa una tienda de estado para manejar la información
 * relacionada con la solicitud 11106 (Cancelación de Donaciones). 
 * Maneja únicamente el campo checkbox "laAutorizacionEsNula".
 * 
 * @example
 * ```typescript
 * const store = new Solicitud11106Store();
 * store.setLaAutorizacionEsNula(true);
 * store.limpiarSolicitud();
 * ```
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud11106', resettable: true })
export class Solicitud11106Store extends Store<Solicitud11106State> {
  /**
   * Constructor de la clase.
   * Inicializa el estado inicial llamando al método `createInitialState`.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el valor del checkbox "laAutorizacionEsNula" en el estado.
   * Este es el único campo del formulario de cancelación de donaciones.
   * 
   * @param laAutorizacionEsNula - El valor booleano del checkbox.
   */
  public setLaAutorizacionEsNula(laAutorizacionEsNula: boolean): void {
    this.update((state) => ({ ...state, laAutorizacionEsNula }));
  }

  /**
   * Restablece el estado de la solicitud a su configuración inicial.
   * 
   * @method limpiarSolicitud
   * @memberof Solicitud11106Store
   * @returns {void}
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}