import { Solicitud32614PerfilesMensajeriaState, Tramite32614PerfilesMensajeriaStore } from '../tramites/tramite32614_perfilesMensajeria.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la solicitud 32614 en la sección de Perfiles de Mensajería.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32614PerfilesMensajeriaQuery extends Query<Solicitud32614PerfilesMensajeriaState> {

  /**
   * Observable que selecciona el estado completo de la solicitud en la sección de Perfiles de Mensajería.
   * @returns {Observable<Solicitud32614PerfilesMensajeriaState>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite32614PerfilesMensajeriaQuery.
   * @param {Tramite32614PerfilesMensajeriaStore} store - El store que contiene el estado de la solicitud 32614 en Perfiles de Mensajería.
   */
  constructor(
    protected override store: Tramite32614PerfilesMensajeriaStore) {
    super(store);
  }
}
