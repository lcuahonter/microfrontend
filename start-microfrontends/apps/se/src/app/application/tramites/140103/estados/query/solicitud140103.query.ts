import { Solicitud140103State, Solicitud140103Store} from '../store/solicitud140103.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Solicitud140103Query extends Query<Solicitud140103State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Solicitud140103Store) {
    super(store);
  }
}
