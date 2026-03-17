import { Injectable } from '@angular/core';
import { MateriaPrima231001 } from '../../models/datos.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Creacion del estado inicial para la interfaz de tramite 5701
 */
export interface Solicitud231001State {
  rfc_solicitante: string;
  lectura: boolean;
  idSolicitud?: number | null;
  numeroRegistroAmbiental: string;
  descripcionGenerica1: string;
  numeroProgramaImmex: string;
  aduana: string;
  mercancias: MateriaPrima231001[];
}

export function createInitialState(): Solicitud231001State {
  return {
    rfc_solicitante:'',
    lectura: false,
    numeroRegistroAmbiental: '',
    descripcionGenerica1: '',
    numeroProgramaImmex: '',
    aduana: '',
    mercancias: [],
    idSolicitud: null,
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite231001', resettable: true })
export class Tramite231001Store extends Store<Solicitud231001State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores parciales para actualizar el estado.
   */
  public actualizarEstado(valores: Partial<Solicitud231001State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }

  /**
   * Guarda el ID de la solicitud en el estado.
   *
   * @param idSolicitud - El ID de la solicitud que se va a guardar.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
}
