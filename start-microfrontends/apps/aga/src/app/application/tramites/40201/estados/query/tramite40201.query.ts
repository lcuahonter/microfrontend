import {
  Tramite40201Store,
  TransportacionMaritima40201State,
} from '../store/tramite40201.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Servicio de consulta para el trámite 40201.
 *
 * @extends Query<TransportacionMaritima40201State>
 *
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 40201.
 *
 * @property {Observable<TransportacionMaritima40201State>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 *
 * @constructor
 * @param {Tramite40201Store} store - El almacén que contiene el estado del trámite 40201.
 */
@Injectable({ providedIn: 'root' })
export class Tramite40201Query extends Query<TransportacionMaritima40201State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite40201Store) {
    super(store);
  }
}
