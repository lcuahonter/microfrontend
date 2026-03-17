
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { Solicitud110203State,Tramite110203Store } from '../tramites/tramite110203.store';
import { Observable } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class Tramite110203Query extends Query<Solicitud110203State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
    /**
   * Obtiene el valor seleccionado de la radio
   * @returns Observable<string | number>
   */
    public get valorSeleccionado$(): Observable<string | number> {
      return this.select('valorSeleccionado');
    }  

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite110203Store) {
    super(store);
  }
  
}