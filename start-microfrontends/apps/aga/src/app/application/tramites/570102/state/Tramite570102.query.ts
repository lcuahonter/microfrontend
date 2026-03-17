import { Solicitud570102State, Tramite570102Store } from './Tramite570102.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase que proporciona consultas reactivas para el estado del trámite 31803.
 * Permite seleccionar partes específicas del estado almacenado en la tienda.
 */
@Injectable({ providedIn: 'root' })
export class Tramite570102Query extends Query<Solicitud570102State> {
  /**
   * Constructor de la clase.
   * @param store Instancia de la tienda `Tramite570102Store` que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite570102Store) {
    super(store);
  }

  /**
   * Selecciona todo el estado de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

}