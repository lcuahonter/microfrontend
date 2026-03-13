import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite40103State } from './tramite40103.store';
import { Tramite40103Store } from './tramite40103.store';
/**
* Servicio para realizar consultas relacionadas con el trámite 40103.
* 
* Este servicio utiliza Akita para gestionar el estado del trámite y proporciona
* métodos para seleccionar y observar cambios en el estado.
*/
@Injectable({ providedIn: 'root' })
export class Tramite40103Query extends Query<Tramite40103State> {
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
   * @param {Tramite40103Store} store - Store que contiene el estado del trámite 40103.
   */
  constructor(
    protected override store: Tramite40103Store
  ) {
    super(store);
  }
}