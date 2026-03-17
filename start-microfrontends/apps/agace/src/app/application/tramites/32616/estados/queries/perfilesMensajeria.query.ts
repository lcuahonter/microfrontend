import { Solicitud32616PerfilesMensajeriaState, Tramite32616PerfilesMensajeriaStore } from '../tramites/tramite32616_perfilesMensajeria.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la solicitud 32616 en la sección de Perfiles de Mensajería.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32616PerfilesMensajeriaQuery extends Query<Solicitud32616PerfilesMensajeriaState> {

  /**
   * Observable que selecciona el estado completo de la solicitud en la sección de Perfiles de Mensajería.
   * @returns {Observable<Solicitud32616PerfilesMensajeriaState>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite32616PerfilesMensajeriaQuery.
   * @param {Tramite32616PerfilesMensajeriaStore} store - El store que contiene el estado de la solicitud 32616 en Perfiles de Mensajería.
   */
  constructor(
    protected override store: Tramite32616PerfilesMensajeriaStore) {
    super(store);
  }
}
