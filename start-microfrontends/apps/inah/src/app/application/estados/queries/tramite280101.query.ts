import { Solicitud280101State, Tramite280101Store } from '../tramite/tramite280101.store'; // Importa el estado y el store del trámite.
import { Injectable } from '@angular/core'; // Importa el decorador Injectable para inyección de dependencias.
import { Query } from '@datorama/akita'; // Importa la clase Query de Akita para manejar consultas al estado.


/**
 * Clase que extiende de Query para manejar el estado de la solicitud 280101.
 * Proporciona métodos y observables para interactuar con el estado del trámite.
 */
@Injectable({ providedIn: 'root' })
export class Tramite280101Query extends Query<Solicitud280101State> {


  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   * 
   * @returns Un observable que emite el estado actual de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
  
  /**
   * Constructor de la clase Tramite280101Query.
   * Inicializa la clase base Query con la instancia del store proporcionada.
   * 
   * @param store - Instancia del store que contiene el estado del trámite 280101.
   */
  constructor(protected override store: Tramite280101Store) {
    super(store);
  }

  
}
