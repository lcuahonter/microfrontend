import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite40102State } from './tramite40102.store';
import { Tramite40102Store } from './tramite40102.store';
/**
* Servicio para realizar consultas relacionadas con el trámite 40102.
* 
* Este servicio utiliza Akita para gestionar el estado del trámite y proporciona
* métodos para seleccionar y observar cambios en el estado.
*/
@Injectable({ providedIn: 'root' })
export class Tramite40102Query extends Query<Tramite40102State> {
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
   * @param {Tramite40102Store} store - Store que contiene el estado del trámite 40102.
   */
  constructor(
    protected override store: Tramite40102Store
  ) {
    super(store);
  }
}