import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite40101State } from './tramite40101.store';
import { Tramite40101Store } from './tramite40101.store';
/**
* Servicio para realizar consultas relacionadas con el trámite 40101.
* 
* Este servicio utiliza Akita para gestionar el estado del trámite y proporciona
* métodos para seleccionar y observar cambios en el estado.
*/
@Injectable({ providedIn: 'root' })
export class Tramite40101Query extends Query<Tramite40101State> {
  /**
   * Observable que selecciona el estado completo del trámite.
   * 
   * Este observable emite el estado actual del trámite cada vez que se produce un cambio.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  solicitanteData$ = this.select(state => state.solicitanteDatas);

  /**
   * Constructor del servicio.
   * 
   * @param {Tramite40101Store} store - Store que contiene el estado del trámite 40101.
   */
  constructor(
    protected override store: Tramite40101Store
  ) {
    super(store);
  }
}