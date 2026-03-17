import {
    Sanitario260215State,
    Sanitario260215Store,
  } from '../tramites/sanitario.store';
  import { Injectable } from '@angular/core';
  import { Query } from '@datorama/akita';
  
  @Injectable({ providedIn: 'root' })
  export class Permiso260215Query extends Query<Sanitario260215State> {
    selectedEstado$ = this.select((state) => state.selectedEstado);
    selectedClave$ = this.select((state) => state.setClave);
    selectedDescripcion$ = this.select((state) => state.setDescripcion);
    selecteDespecificarClasificacion$ = this.select(
      (state) => state.setDespecificarClasificacion
    );
  
    /**
     * Observable que selecciona todos los terceros relacionados del estado.
     * Devuelve el estado completo.
     */
    selectTereceros$ = this.select((state) => {
      return state;
    });
    constructor(private sanitarioStore: Sanitario260215Store) {
      super(sanitarioStore);
    }
  }
  