import { OpinionesStates, SolicitudOpinionesState } from '../estados/opiniones.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Consulta de estado para las solicitudes de opiniones.
 * 
 * Esta clase permite seleccionar y observar el estado de las solicitudes de opiniones
 * utilizando Akita para la gestión de estado.
 */
@Injectable({ providedIn: 'root' })
export class SolicitudOpinionesQuery extends Query<SolicitudOpinionesState> {

  /**
   * Observable que emite el estado completo de la solicitud de opiniones.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor que recibe el store de opiniones.
   * @param store Instancia del store de opiniones.
   */
  constructor(
    protected override store: OpinionesStates) {
    super(store);
  }
}