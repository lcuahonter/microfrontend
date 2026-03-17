import {
  AtencionRenovacion40403State,
  Tramite40403Store
} from './tramite40403.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase de consulta para gestionar el estado de la sección de atención a la renovación del trámite 40403.
 */
@Injectable({ providedIn: 'root' })
export class Tramite40403Query extends Query<AtencionRenovacion40403State> {
  /**
   * Constructor de la clase Tramite40403Query.
   * @param store Almacén para gestionar el estado del trámite.
   */
  constructor(protected override store: Tramite40403Store) {
    super(store);
  }

  /**
   * Observable que selecciona el estado completo de la sección.
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });
}
