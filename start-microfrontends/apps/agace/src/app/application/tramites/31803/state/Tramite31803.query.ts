import { Solicitud31803State, Tramite31803Store } from './Tramite31803.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase que proporciona consultas reactivas para el estado del trámite 31803.
 * Permite seleccionar partes específicas del estado almacenado en la tienda.
 */
@Injectable({ providedIn: 'root' })
export class Tramite31803Query extends Query<Solicitud31803State> {
  /**
   * Constructor de la clase.
   * @param store Instancia de la tienda `Tramite31803Store` que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite31803Store) {
    super(store);
  }

  /**
   * Selecciona todo el estado de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

}