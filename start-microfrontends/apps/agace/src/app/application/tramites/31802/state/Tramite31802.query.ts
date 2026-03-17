import { Solicitud31802State, Tramite31802Store } from './Tramite31802.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase que proporciona consultas reactivas para el estado del trámite 31803.
 * Permite seleccionar partes específicas del estado almacenado en la tienda.
 */
@Injectable({ providedIn: 'root' })
export class Tramite31802Query extends Query<Solicitud31802State> {
  /**
   * Constructor de la clase.
   * @param store Instancia de la tienda `Tramite31802Store` que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite31802Store) {
    super(store);
  }

  /**
   * Selecciona todo el estado de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

}