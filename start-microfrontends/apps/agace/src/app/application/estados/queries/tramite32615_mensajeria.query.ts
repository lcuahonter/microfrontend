import { Solicitud32615MensajeriaState, Tramite32615MensajeriaStore } from '../../estados/tramites/tramite32615_mensajeria.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite32615MensajeriaQuery
 * @description
 * Servicio que permite consultar el estado de la solicitud 32615 en la sección de mensajería.
 * Utiliza Akita para acceder de forma reactiva al estado almacenado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32615MensajeriaQuery extends Query<Solicitud32615MensajeriaState> {

  /**
   * @property {Observable<Solicitud32615MensajeriaState>} selectSolicitud$
   * @description
   * Observable que emite el estado completo de la solicitud de mensajería del trámite 32615.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @description
   * Constructor que inicializa el servicio de consulta inyectando el store correspondiente.
   * @param {Tramite32615MensajeriaStore} store - Store que contiene el estado de la solicitud para la mensajería.
   */
  constructor(
    protected override store: Tramite32615MensajeriaStore
  ) {
    super(store);
  }
}
