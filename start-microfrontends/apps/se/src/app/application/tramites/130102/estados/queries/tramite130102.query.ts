import { Solicitud130102State, Tramite130102Store } from '../tramites/tramite130102.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el trámite 130102.
 * 
 * @extends Query<Solicitud130102State>
 * 
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 130102.
 * 
 * @property {Observable<Solicitud130102State>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 * 
 * @constructor
 * @param {Tramite130102Store} store - El almacén que contiene el estado del trámite 130102.
 */
@Injectable({ providedIn: 'root' })
export class Tramite130102Query extends Query<Solicitud130102State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite130102Store) {
    super(store);
  }
}