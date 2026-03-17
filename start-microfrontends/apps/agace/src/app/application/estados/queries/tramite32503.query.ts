import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite32503State } from '../tramites/tramite32503.store';
import { Tramite32503Store } from '../tramites/tramite32503.store';
/**
* Servicio para realizar consultas relacionadas con el trámite 32503.
* 
* Este servicio utiliza Akita para gestionar el estado del trámite y proporciona
* métodos para seleccionar y observar cambios en el estado.
*/
@Injectable({ providedIn: 'root' })
export class Tramite32503Query extends Query<Tramite32503State> {
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
   * @param {Tramite32503Store} store - Store que contiene el estado del trámite 32503.
   */
  constructor(
    protected override store: Tramite32503Store
  ) {
    super(store);
  }
}