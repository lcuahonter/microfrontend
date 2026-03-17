import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite32506State } from '../estados/tramite32506.store';
import { Tramite32506Store } from '../estados/tramite32506.store';
/**
* Servicio para realizar consultas relacionadas con el trámite 32506.
* 
* Este servicio utiliza Akita para gestionar el estado del trámite y proporciona
* métodos para seleccionar y observar cambios en el estado.
*/
@Injectable({ providedIn: 'root' })
export class Tramite32506Query extends Query<Tramite32506State> {
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
   * @param {Tramite32506Store} store - Store que contiene el estado del trámite 32506.
   */
  constructor(
    protected override store: Tramite32506Store
  ) {
    super(store);
  }
}