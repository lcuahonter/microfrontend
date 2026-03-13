import { Solicitud32614MensajeriaState, Tramite32614MensajeriaStore } from '../tramites/tramite32614_mensajeria.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite32614MensajeriaQuery
 * @description
 * Servicio que permite consultar el estado de la solicitud 32614 en la sección de mensajería.
 * Utiliza Akita para acceder de forma reactiva al estado almacenado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32614MensajeriaQuery extends Query<Solicitud32614MensajeriaState> {

  /**
   * @property {Observable<Solicitud32614MensajeriaState>} selectSolicitud$
   * @description
   * Observable que emite el estado completo de la solicitud de mensajería del trámite 32614.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @description
   * Constructor que inicializa el servicio de consulta inyectando el store correspondiente.
   * @param {Tramite32614MensajeriaStore} store - Store que contiene el estado de la solicitud para la mensajería.
   */
  constructor(
    protected override store: Tramite32614MensajeriaStore
  ) {
    super(store);
  }
}
