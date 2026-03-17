// Importaciones necesarias para la funcionalidad de consultas y el estado
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite130105State } from '../tramites/tramites130105.store';
import { Tramite130105Store } from '../tramites/tramites130105.store';

// Decorador que define esta clase como un servicio inyectable
@Injectable({ providedIn: 'root' })
export class Tramite130105Query extends Query<Tramite130105State> {
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
  constructor(protected override store: Tramite130105Store) {
    super(store);
  }
}