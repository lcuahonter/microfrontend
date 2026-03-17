import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 140111
 * @returns Tramite140111
 */
export interface Tramite140111State {
  /** Motivo de la renuncia de derechos */
  motivoRenunciaDeDerechos: string;
  /** Control de la mercancía en la solicitud */
  mercacniaSolicitudControlar:boolean;
}
/**
 * Función createInitialState
 * Inicializa el estado del trámite con valores predeterminados.
 * 
 * @returns {Tramite140111State} - Estado inicial del trámite 140111.
*/
export function createInitialState(): Tramite140111State {
  return {
    motivoRenunciaDeDerechos: '',
    mercacniaSolicitudControlar:false
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite140111', resettable: true })
export class Tramite140111Store extends Store<Tramite140111State> {
  constructor() {
    super(createInitialState());
  }
  /**
   * Método establecerDatos
   * Actualiza el estado del trámite con los nuevos datos proporcionados.
   * 
   * @param {Partial<Tramite140111State>} Datos - Datos parciales para actualizar el estado.
  */
  public establecerDatos(Datos:Partial<Tramite140111State>): void {
    this.update((state) => ({
      ...state,
      ...Datos
    }));
  }
}
