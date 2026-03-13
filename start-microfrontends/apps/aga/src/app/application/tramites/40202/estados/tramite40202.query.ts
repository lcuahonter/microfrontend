import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { Tramite40202Store, TransportacionMaritima40202State } from './tramite40202.store';

/**
 * Servicio de consulta para el trámite 40202.
 * 
 * @extends Query<TransportacionMaritima40202State>
 * 
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 40202.
 * 
 * @property {Observable<TransportacionMaritima40202State>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 * 
 * @constructor
 * @param {Tramite40202Store} store - El almacén que contiene el estado del trámite 40202.
 */
@Injectable({ providedIn: 'root' })
export class Tramite40202Query extends Query<TransportacionMaritima40202State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite40202Store) {
    super(store);
  }
}