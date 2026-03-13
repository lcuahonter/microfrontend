import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite6402State } from '../estados/tramite6402.store';
import { Tramite6402Store } from '../estados/tramite6402.store';
/**
* Servicio para realizar consultas relacionadas con el trámite 6402.
* 
* Este servicio utiliza Akita para gestionar el estado del trámite y proporciona
* métodos para seleccionar y observar cambios en el estado.
*/
@Injectable({ providedIn: 'root' })
export class Tramite6402Query extends Query<Tramite6402State> {
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
   * @param {Tramite6402Store} store - Store que contiene el estado del trámite 6402.
   */
  constructor(
    protected override store: Tramite6402Store
  ) {
    super(store);
  }
}