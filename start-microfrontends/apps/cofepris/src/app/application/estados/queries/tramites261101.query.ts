import { DatosProcedureState } from '../../estados/tramites/tramites261101.store';
import { DatosProcedureStore } from '../../estados/tramites/tramites261101.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class DatosProcedureQuery extends Query<DatosProcedureState> {

  /**
   * Observable to select the desistimiento property from the state.
   */
  selectProrroga$ = this.select((state) => {
    return state;
  }); 
  constructor(
    protected override store: DatosProcedureStore) {
    super(store);
  }
  
  /**
   * Observable que selecciona el estado completo de la sección.
   * Permite suscribirse a los cambios en el estado del trámite 420103.
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });
}