import { Solicitud701State, Tramite701Store } from '../tramite/tramite701.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el trámite 701.
 * 
 * @extends Query<Solicitud701State>
 * 
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 701.
 * 
 * @property {Observable<Solicitud701State>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 * 
 * @constructor
 * @param {Tramite701Store} store - El almacén que contiene el estado del trámite 701.
 */
@Injectable({ providedIn: 'root' })
export class Tramite701Query extends Query<Solicitud701State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite701Store) {
    super(store);
  }
}