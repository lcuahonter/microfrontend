import { Solicitud31616MensajeriaState, Tramite31616MensajeriaStore } from '../../estados/tramites/tramite31616_mensajeria.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite31616MensajeriaQuery
 * @description
 * Servicio que permite consultar el estado de la solicitud 31616 en la sección de mensajería.
 * Utiliza Akita para acceder de forma reactiva al estado almacenado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite31616MensajeriaQuery extends Query<Solicitud31616MensajeriaState> {

  /**
   * @property {Observable<Solicitud31616MensajeriaState>} selectSolicitud$
   * @description
   * Observable que emite el estado completo de la solicitud de mensajería del trámite 31616.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @description
   * Constructor que inicializa el servicio de consulta inyectando el store correspondiente.
   * @param {Tramite31616MensajeriaStore} store - Store que contiene el estado de la solicitud para la mensajería.
   */
  constructor(
    protected override store: Tramite31616MensajeriaStore
  ) {
    super(store);
  }
}
