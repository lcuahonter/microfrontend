import { Solicitud30506State, Tramite30506Store } from './tramite30506.store ';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Clase que proporciona consultas reactivas para el estado del trámite 30506.
 * Permite seleccionar partes específicas del estado almacenado en la tienda.
 */
@Injectable({ providedIn: 'root' })
export class Tramite30506Query extends Query<Solicitud30506State> {
  /**
   * Constructor de la clase.
   * @param store Instancia de la tienda `Tramite30506Store` que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite30506Store) {
    super(store);
  }

  /**
   * Selecciona todo el estado de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

}