import { Solicitud31301State, Solicitud31301Store } from './solicitud31301.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para la solicitud 31301.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud31301Query extends Query<Solicitud31301State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 31301.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud31301Store) {
    super(store);
  }
}
