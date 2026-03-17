import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado para el número de trámite
 */
export interface TramiteState {
  idTramite: string | null;
  firma: string | null;
  fechaExpedicion?: string;
  fechaDeActa?: string;
}

/**
 * Creación del estado inicial para el trámite
 * @returns TramiteState
 */
/**
 * @description
 * Crea y retorna el estado inicial para la entidad Tramite.
 * 
 * @returns {TramiteState} El estado inicial con valores predeterminados para idTramite, firma, fechaExpedicion y fechaDeActa.
 */
export function createInitialState(): TramiteState {
  return {
    idTramite: null,
    firma: null,
    fechaExpedicion: '',
    fechaDeActa: '',
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite', resettable: true })
export class TramiteStore extends Store<TramiteState> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda el número de trámite en el state
   *
   * @param idTramite
   */
  public establecerTramite(idTramite: string, firma: string):void {
    this.update((state) => ({
      ...state,
      idTramite,
      firma,
    }));
  }

  /**
   * Limpia el estado del trámite
   */

  public limpiarTramite():void {
    this.reset();
  }

   /**
   * Actualiza el estado con la fecha proporcionada.
   * @param {string} fecha La fecha a establecer.
   */
  public setfechaExpedicion(fechaExpedicion: string): void {
    this.update((state) => ({
      ...state,
      fechaExpedicion,
    }));
  }

  /**
   * Actualiza el estado con la fecha de acta proporcionada.
   * @param {string} fechaDeActa La fecha de acta a establecer.
   */
  public setfechaDeActa(fechaDeActa: string): void {
    this.update((state) => ({
      ...state,
      fechaDeActa,
    }));
  }

}
