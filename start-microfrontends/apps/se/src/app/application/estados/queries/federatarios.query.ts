import { FederatoriosState, FederatoriosStore} from '../tramites/federatarios.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Clase que extiende de Query para manejar el estado de Federatorios.
 * Proporciona métodos para seleccionar y observar cambios en el estado.
 */
@Injectable({ providedIn: 'root' })
export class FederatoriosQuery extends Query<FederatoriosState> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: FederatoriosStore) {
    super(store);
  }
}