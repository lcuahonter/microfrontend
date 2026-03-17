import { Store, StoreConfig } from '@datorama/akita';
import { BaseResponse } from '../models/5701/base-response.model';
import { Injectable } from '@angular/core';

/**
 * Estado para la información de Solicitud
 * @interface SolicitudState
 */
export interface SolicitudState {
  solicitud?: BaseResponse<null>;
}

/**
 * Creación del estado inicial para Solicitud
 * @returns SolicitudState
 */
export function createSolicitudInitialState(): SolicitudState {
  return {
    solicitud: {} as BaseResponse<null>,
  };
}

/**
 * Servicio para gestionar el estado de Solicitud
 */
@Injectable({
  providedIn: 'root'
})

/**
 * Configuración del Store para el estado de Solicitud
 */
@StoreConfig({ name: 'solicitud', resettable: true, })
export class SolicitudStore extends Store<SolicitudState> {
  /**
   * Constructor de la clase SolicitudStore
   */
  constructor() {
    super(createSolicitudInitialState());
  }
  
  /**
   * Establece la información de la solicitud en el estado
   * @param solicitud - Respuesta base con la información de la solicitud
   */
  public establecerSolicitud(solicitud: BaseResponse<null>): void {
    this.update(state => ({
      ...state,
      solicitud
    }));
  }
}