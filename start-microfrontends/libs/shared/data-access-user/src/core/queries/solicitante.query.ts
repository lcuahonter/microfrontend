import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { SolicitanteState, SolicitanteStore } from '../estados/solicitante.store';



/**
 * Servicio de consulta para el solicitante.
 * 
 * @extends Query<SolicitanteState>
 * 
 * @description
 * 
 * Este servicio proporciona métodos para seleccionar y observar el estado del solicitante
 * 
 * @property {Observable<SolicitanteState>} selectSeccionState$
 * 
 * @constructor
 * @param {Tramite120301Store} store 
 */
@Injectable({ providedIn: 'root' })
export class SolicitanteQuery extends Query<SolicitanteState> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: SolicitanteStore) {
    super(store);
  }
}