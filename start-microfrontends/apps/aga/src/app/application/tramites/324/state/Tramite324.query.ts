import { Solicitud324State, Tramite324Store } from './Tramite324.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase que proporciona consultas reactivas para el estado del trámite 324.
 * Permite seleccionar partes específicas del estado almacenado en la tienda.
 */
@Injectable({ providedIn: 'root' })
export class Tramite324Query extends Query<Solicitud324State> {
  /**
   * Constructor de la clase.
   * @param store Instancia de la tienda `Tramite324Store` que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite324Store) {
    super(store);
  }

  /**
   * Selecciona todo el estado de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

}