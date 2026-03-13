import { Solicitud32615PerfilesMensajeriaState, Tramite32615PerfilesMensajeriaStore } from '../../estados/tramites/tramite32615_perfilesMensajeria.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la solicitud 32615 en la sección de Perfiles de Mensajería.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32615PerfilesMensajeriaQuery extends Query<Solicitud32615PerfilesMensajeriaState> {

  /**
   * Observable que selecciona el estado completo de la solicitud en la sección de Perfiles de Mensajería.
   * @returns {Observable<Solicitud32615PerfilesMensajeriaState>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite32615PerfilesMensajeriaQuery.
   * @param {Tramite32615PerfilesMensajeriaStore} store - El store que contiene el estado de la solicitud 32615 en Perfiles de Mensajería.
   */
  constructor(
    protected override store: Tramite32615PerfilesMensajeriaStore) {
    super(store);
  }
}
