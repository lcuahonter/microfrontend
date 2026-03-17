// Importaciones necesarias para el estado y la funcionalidad de consultas
import { Tramite130104State, Tramite130104Store } from '../tramites/tramite130104.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

// Decorador que define esta clase como un servicio inyectable
@Injectable({ providedIn: 'root' })
export class Tramite130104Query extends Query<Tramite130104State> {
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

  // Constructor que inicializa la consulta con el store correspondiente
  constructor(
    protected override store: Tramite130104Store) {
    super(store);
  }
}