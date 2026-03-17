import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado para la información de Consultaio obtenida del inicio de sesión
 */
export interface LoginState {
  rfc: string;
  tieneLogin: boolean;
  rolCapturista: string;
}

/**
 * Creación del estado inicial para el Consultaio
 * @returns LoginState
 */
export function createLoginInitialState(): LoginState {
  return {
    rfc: 'AAL0409235E6',
    tieneLogin: false,
    rolCapturista: 'PersonaMoral'
  };
}

/**
 * Servicio para gestionar el estado de Login
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Configuración del Store para el estado de Login
 */
@StoreConfig({ name: 'Login', resettable: true, })
export class LoginStore extends Store<LoginState> {
  constructor() {
    super(createLoginInitialState());
  }

  /**
   * Guarda la información del Login registrado en la sesión dentro del state
   *
   * @param logueado
   * @param token
   * @param nombre
   */
  public establecerLogin(rfc: string, tieneLogin: boolean): void {
    this.update(state => ({
      ...state,
      rfc,
      tieneLogin
    }));
  }
}