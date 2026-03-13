import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define el estado del usuario.
 */
export interface UsuarioState {
  nacionalidad: string | null; // 'si' o 'no'
  tipoIdentificacion: string | null; // 'RFC' o 'CURP'
  usuario: string | null; // Valor del RFC o CURP
}

/**
 * Estado inicial del store.
 */
export function createInitialState(): UsuarioState {
  return {
    nacionalidad: null,
    tipoIdentificacion: null,
    usuario: null,
  };
}

/**
 * Store para manejar el estado del usuario.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'usuario' })
export class UsuarioStore extends Store<UsuarioState> {
  constructor() {
    super(createInitialState());
  }
  /**
   * Actualiza los datos del usuario en el store.
   * @param {Partial<UsuarioState>} datos - Datos a actualizar en el estado del usuario.
   * @returns {void}
   */
  actualizarDatos(datos: Partial<UsuarioState>): void {
    this.update(datos);
  }
}
