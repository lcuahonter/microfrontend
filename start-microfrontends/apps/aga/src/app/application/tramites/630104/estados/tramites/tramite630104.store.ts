import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de Tramite630104.
 */
export interface Tramite630104State {
  /**
   * Propiedades dinámicas del estado.
   */
  [key: string]: unknown; 
}

/**
 * Crea el estado inicial para Tramite630104.
 * @returns El estado inicial vacío.
 */
export function createInitialState(): Tramite630104State {
  return {
    // Estado inicial vacío
  };
}

/**
 * Servicio de almacenamiento para gestionar el estado de Tramite630104.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite630104', resettable: true })
export class Tramite630104Store extends Store<Tramite630104State> {
  /**
   * Constructor de Tramite630104Store.
   * Inicializa el estado con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado de Tramite630104 con un nuevo valor para un campo específico.
   * @param fieldName El nombre del campo a actualizar.
   * @param valores El nuevo valor para el campo.
   */
  public setTramite630104State(fieldName: string, valores: unknown): void {
    this.update((state => ({
      ...state,
      [fieldName]: valores,
    })));
  }

  
  /**
   * Actualiza el estado de la solicitud con los valores proporcionados.
   * Param valores Objeto parcial con los valores a actualizar.
   */
  public actualizarEstado(valores: Partial<Tramite630104State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }
  
}