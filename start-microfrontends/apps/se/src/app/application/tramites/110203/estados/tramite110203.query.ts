
import { Solicitud110203State, Tramite110203Store } from './tramite110203.store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Query } from '@datorama/akita';



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

  /**
  * Observable que emite los valores del formulario de datos del destinatario
  * @returns Observable<FormValues> con los valores actuales del formulario
  */
  selectFormDatosDelDestinatario$ = this.select((state) => {
    return state.formDatosDelDestinatario;
  });

  FormaValida$ = this.select((state) => {
    return Object.values(state.formaValida).every(value => value === true);
  });


  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite110203Store) {
    super(store);
  }
}
