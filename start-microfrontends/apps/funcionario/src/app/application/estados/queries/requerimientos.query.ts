import { RequerimientosStates, SolicitudRequerimientosState } from "../evaluacion-solicitud/requerimientos.store";
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class SolicitudRequerimientoQuery extends Query<SolicitudRequerimientosState> {

  selectSolicitud$ = this.select((state) => {
    return state;
  }); 

  constructor(
     protected override store: RequerimientosStates) {
    super(store);
  }
}