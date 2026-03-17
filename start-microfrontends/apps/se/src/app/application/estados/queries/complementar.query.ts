import { ComplementarState, ComplementarStore } from '../tramites/complementar.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Clase que extiende de Query para manejar el estado de Complementar.
 * Proporciona métodos para seleccionar y observar cambios en el estado.
 */

@Injectable({ providedIn: 'root' })
export class ComplementarQuery extends Query<ComplementarState> {
  /**
   * Selecciona el estado completo de la solicitud Store
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: ComplementarStore) {
    super(store);
  }
}