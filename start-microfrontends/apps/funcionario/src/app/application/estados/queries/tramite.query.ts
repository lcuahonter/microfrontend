
import { TramitesStates, TramiteState } from '../tramite/tramite.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class SolicitudTramiteQuery extends Query<TramiteState> {

  selectSolicitud$ = this.select((state) => {
    return state;
  }); 

  constructor(
     protected override store: TramitesStates) {
    super(store);
  }
}