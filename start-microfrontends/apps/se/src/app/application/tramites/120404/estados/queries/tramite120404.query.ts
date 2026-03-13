import { Tramite120404State,Tramite120404Store } from "../store/tramite120404.store";
import { Injectable} from "@angular/core";
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el estado del trámite 120404.
 * Proporciona acceso a los datos almacenados en Tramite120404Store.
 */
@Injectable({ providedIn: 'root' })
export class Tramite120404Query extends Query <Tramite120404State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable que permite acceder al estado completo del trámite.
   * Se actualiza automáticamente cuando los valores cambian.
   */
  selectTramite120404$= this.select((state) => {
    return state;
  });

  /**
   * Constructor que inicializa la consulta con la tienda de Akita.
   * Permite recuperar datos y reaccionar a cambios en el estado.
   * 
   * @param store Instancia de Tramite120404Store utilizada para gestionar el estado.
   */
  constructor(
    protected override store: Tramite120404Store) {
    super(store);
  }
}