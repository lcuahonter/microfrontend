import {Tramite33302State, Tramite33302Store} from './tramite33302.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


/**
 * Consulta del trámite 32301.
 * Esta clase maneja las consultas sobre el estado del store `Tramite32301Store`.
 * Utiliza Akita para gestionar el estado de forma reactiva.
 * 
 * @export
 * @class Tramite33302Query
 * @extends {Query<FormularioGrupo>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite33302Query extends Query<Tramite33302State> {
  
  selectTramite33302$= this.select((state) => {
    return state;
  });
 
  /**
   * Constructor de la clase Tramite32301Query.
   * @param store El store que maneja el estado de los datos del trámite.
   */
  constructor(protected override store: Tramite33302Store) {
    super(store);
  }
}
