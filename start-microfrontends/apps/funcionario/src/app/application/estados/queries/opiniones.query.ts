import { OpinionesStates, SolicitudOpinionesState } from '../evaluacion-solicitud/opiniones.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class SolicitudOpinionesQuery extends Query<SolicitudOpinionesState> {

  selectSolicitud$ = this.select((state) => {
    return state;
  });

  constructor(
    protected override store: OpinionesStates) {
    super(store);
  }
}