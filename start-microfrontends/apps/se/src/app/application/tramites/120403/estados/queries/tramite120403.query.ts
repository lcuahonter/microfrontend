import { Tramite120403State,Tramite120403Store } from "../store/tramite120403.store";
import { Injectable} from "@angular/core";
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el estado del trámite 120403.
 * Proporciona acceso a los datos almacenados en Tramite120403Store.
 */
@Injectable({ providedIn: 'root' })
export class Tramite120403Query extends Query <Tramite120403State> {
  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable que permite acceder al estado completo del trámite.
   * Se actualiza automáticamente cuando los valores cambian.
   */
  selectTramite120403$= this.select((state) => {
    return state;
  });

  /**
   * Constructor que inicializa la consulta con la tienda de Akita.
   * Permite recuperar datos y reaccionar a cambios en el estado.
   * 
   * @param store Instancia de Tramite120404Store utilizada para gestionar el estado.
   */
  constructor(
    protected override store: Tramite120403Store) {
    super(store);
  }
}