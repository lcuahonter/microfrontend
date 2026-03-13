import { Tramite130115State, Tramite130115Store } from '../tramites/tramite130115.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite130115Query
 * Clase que extiende la funcionalidad de Akita Query para consultar el estado del trámite 130115.
 * Proporciona selectores para acceder a propiedades específicas del estado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite130115Query extends Query<Tramite130115State> {
  /**
   * Selector para obtener todo el estado del trámite.
   * Devuelve el estado completo como un observable.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Selector para obtener el valor de `mostrarTabla` del estado.
   * Indica si la tabla debe mostrarse o no.
   */
  mostrarTabla$ = this.select((state) => state.mostrarTabla);

  /**
   * Constructor de la clase Tramite130115Query.
   * Inicializa la consulta con el almacén proporcionado.
   * @param store - Instancia del Tramite130115Store.
   */
  constructor(protected override store: Tramite130115Store) {
    super(store);
  }
}