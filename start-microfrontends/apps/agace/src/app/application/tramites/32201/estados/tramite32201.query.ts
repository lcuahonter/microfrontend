import { Solicitud32201State, Tramite32201Store } from './tramite32201.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de Solicitud32201.
 * Este servicio permite acceder al estado almacenado en el store y observar cambios en el mismo.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32201Query extends Query<Solicitud32201State> {
  /**
   * Observable para seleccionar el estado completo de la solicitud.
   * Permite observar los cambios en el estado de la solicitud.
   *
   * @returns {Observable<Solicitud32201State>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de Tramite32201Query.
   * Inicializa el servicio con el store que contiene el estado de Solicitud32201.
   *
   * @param {Tramite32201Store} store - El store que contiene el estado de Solicitud32201.
   */
  constructor(protected override store: Tramite32201Store) {
    super(store);
  }
}
