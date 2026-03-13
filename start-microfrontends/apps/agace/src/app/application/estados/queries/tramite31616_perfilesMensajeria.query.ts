import { Solicitud31616PerfilesMensajeriaState, Tramite31616PerfilesMensajeriaStore } from '../../estados/tramites/tramite31616_perfilesMensajeria.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la solicitud 31616 en la sección de Perfiles de Mensajería.
 */
@Injectable({ providedIn: 'root' })
export class Tramite31616PerfilesMensajeriaQuery extends Query<Solicitud31616PerfilesMensajeriaState> {

  /**
   * Observable que selecciona el estado completo de la solicitud en la sección de Perfiles de Mensajería.
   * @returns {Observable<Solicitud31616PerfilesMensajeriaState>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite31616PerfilesMensajeriaQuery.
   * @param {Tramite31616PerfilesMensajeriaStore} store - El store que contiene el estado de la solicitud 31616 en Perfiles de Mensajería.
   */
  constructor(
    protected override store: Tramite31616PerfilesMensajeriaStore) {
    super(store);
  }
}
