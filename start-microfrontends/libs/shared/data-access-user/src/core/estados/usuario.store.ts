import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { PerfilUsuario } from '../models/usuario/perfilUsuario.model';
import { Rol } from '../models/usuario/rol.model';

/**
 * Estado para la información de usuario obtenida del inicio de sesión
 */
export interface UsuarioState {
    idUsuario: string;
    idOrganizacion: number;
    logueado: boolean;
    token: string;
    perfilUsuario?: PerfilUsuario;
    roles: Rol[];
}

/**
 * Creación del estado inicial para el usuario
 * @returns UsuarioState
 */
export function createInitialState(): UsuarioState {
  return {
    idUsuario: '',
    idOrganizacion: 0,
    logueado: false,
    token: '',
    perfilUsuario: undefined,
    roles: [],
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'usuario', resettable: true, })
export class UsuarioStore extends Store<UsuarioState> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda la información del usuario registrado en la sesión dentro del state
   *
   * @param logueado
   * @param token
   * @param nombre
   */
  public establecerUsuario(idUsuario: string, perfilUsuario: PerfilUsuario,
    roles: Rol[], jwt: string): void {
    this.update(state => ({
      ...state,
      idUsuario,
      logueado: true,
      token: jwt,
      perfilUsuario,
      roles,
    }));
  }

  /**
   * Limpia los datos del usuario al cerrar sesión
   */
  public limpiarUsuario(): void {
    this.reset();
  }
}
