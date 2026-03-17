import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite32507State } from '../tramites/tramite32507.store';
import { Tramite32507Store } from '../tramites/tramite32507.store';
/**
* Servicio para realizar consultas relacionadas con el trámite 32507.
* 
* Este servicio utiliza Akita para gestionar el estado del trámite y proporciona
* métodos para seleccionar y observar cambios en el estado.
*/
@Injectable({ providedIn: 'root' })
export class Tramite32507Query extends Query<Tramite32507State> {
  /**
   * Observable que selecciona el estado completo del trámite.
   * 
   * Este observable emite el estado actual del trámite cada vez que se produce un cambio.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio.
   * 
   * @param {Tramite32507Store} store - Store que contiene el estado del trámite 32507.
   */
  constructor(
    protected override store: Tramite32507Store
  ) {
    super(store);
  }
}