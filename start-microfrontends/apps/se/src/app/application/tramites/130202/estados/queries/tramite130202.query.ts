import { Tramite130202State, Tramite130202Store } from '../tramites/tramites130202.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Query para obtener datos del estado del trámite 130202.
 */
@Injectable({ providedIn: 'root' })
export class Tramite130202Query extends Query<Tramite130202State> {
  /**
   * Observable para seleccionar el estado completo del trámite.
   * Estado completo del trámite.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Observable para seleccionar el valor de `mostrarTabla` del estado.
   * Valor booleano de `mostrarTabla`.
   */
  mostrarTabla$ = this.select((state) => state.mostrarTabla);

  /**
   * Constructor que inicializa el query con el store correspondiente.
   * Instancia del store del trámite 130202.
   */
  constructor(protected override store: Tramite130202Store) {
    super(store);
  }
}