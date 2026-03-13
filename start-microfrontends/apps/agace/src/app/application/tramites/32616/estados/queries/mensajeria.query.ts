import { Solicitud32616MensajeriaState, Tramite32616MensajeriaStore } from '../../estados/tramites/tramite32616_mensajeria.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite32616MensajeriaQuery
 * @description
 * Servicio que permite consultar el estado de la solicitud 32616 en la sección de mensajería.
 * Utiliza Akita para acceder de forma reactiva al estado almacenado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32616MensajeriaQuery extends Query<Solicitud32616MensajeriaState> {

  /**
   * @property {Observable<Solicitud32616MensajeriaState>} selectSolicitud$
   * @description
   * Observable que emite el estado completo de la solicitud de mensajería del trámite 32616.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @description
   * Constructor que inicializa el servicio de consulta inyectando el store correspondiente.
   * @param {Tramite32616MensajeriaStore} store - Store que contiene el estado de la solicitud para la mensajería.
   */
  constructor(
    protected override store: Tramite32616MensajeriaStore
  ) {
    super(store);
  }
}
