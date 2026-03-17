import { Tramite420103State, Tramite420103Store } from './tramite420103.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio que permite consultar el estado del trámite 420103.
 * Utiliza Akita para gestionar el estado de la aplicación y proporciona métodos para seleccionar datos específicos del estado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite420103Query extends Query<Tramite420103State> {
  /**
   * Constructor del servicio.
   * Inicializa el servicio con el store correspondiente.
   *
   * @param store - Store que contiene el estado del trámite 420103.
   */
  constructor(protected override store: Tramite420103Store) {
    super(store);
  }

  /**
   * Observable que selecciona el estado completo de la sección.
   * Permite suscribirse a los cambios en el estado del trámite 420103.
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });
}