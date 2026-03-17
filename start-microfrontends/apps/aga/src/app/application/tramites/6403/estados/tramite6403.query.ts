import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite6403State } from './tramite6403.store';
import { Tramite6403Store } from './tramite6403.store';
/**
* Servicio para realizar consultas relacionadas con el trámite 6403.
* 
* Este servicio utiliza Akita para gestionar el estado del trámite y proporciona
* métodos para seleccionar y observar cambios en el estado.
*/
@Injectable({ providedIn: 'root' })
export class Tramite6403Query extends Query<Tramite6403State> {
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
   * @param {Tramite6403Store} store - Store que contiene el estado del trámite 6403.
   */
  constructor(
    protected override store: Tramite6403Store
  ) {
    super(store);
  }
}