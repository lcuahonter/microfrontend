import { Solicitud230902State, Tramite230902Store } from './tramite230902.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


@Injectable({ providedIn: 'root' })
export class Tramite230902Query extends Query<Solicitud230902State> {

  selectSolicitud$ = this.select((state) => {
    return state;
  });
 
  selectIsPopupOpen$ = this.select((state) => state.popupAbierto);
  selectIsPopupClose$ = this.select((state) => state.popupCerrado);

  constructor(
    protected override store: Tramite230902Store) {
    super(store);
  }
}