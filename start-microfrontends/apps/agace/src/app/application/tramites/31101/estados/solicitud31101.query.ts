import { Solicitud31101State, Solicitud31101Store } from './solicitud31101.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para la solicitud 31101.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud31101Query extends Query<Solicitud31101State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 31101.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud31101Store) {
    super(store);
  }
}
