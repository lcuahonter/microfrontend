import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado para la información de Consultaio obtenida del inicio de sesión
 */
export interface TareaState {
  rfc: string;
  currentUser: string;
  folioTramite: string;
  idSolicitud: string;
  idTarea: string;
  roleTarea: string;
  tareasUsuario: string;
}

/**
 * Creación del estado inicial para el Consultaio
 * @returns TareaState
 */
export function createTareaInitialState(): TareaState {
  return {
    rfc: '',
    currentUser: '',
    folioTramite: '',
    idSolicitud: '',
    idTarea: '',
    roleTarea: '',
    tareasUsuario: ''
  };
}

/**
 * Servicio para gestionar el estado de Tarea
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Configuración del Store para el estado de Tarea
 */
@StoreConfig({ name: 'Tarea', resettable: true, })

export class TareaStore extends Store<TareaState> {
  constructor() {
    super(createTareaInitialState());
  }

  /**
   * Guarda la información del Login registrado en la sesión dentro del state
   *
   * @param logueado
   * @param token
   * @param nombre
   */
  public establecerTarea(rfc: string, currentUser: string, folioTramite: string, idSolicitud: string, idTarea: string, roleTarea: string, tareasUsuario: string): void {
    this.update(state => ({
      ...state,
      rfc,
      currentUser,
      folioTramite,
      idSolicitud,
      idTarea,
      roleTarea,
      tareasUsuario
    }));
  }
}