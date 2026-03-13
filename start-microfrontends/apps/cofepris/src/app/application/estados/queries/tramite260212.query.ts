
/**
 * Importaciones necesarias para el funcionamiento de la consulta del trámite.
 */
import { Shared260212Store, TercerosRelacionadas260212State } from "../tramites/tramite260212.store";
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";

/**
 * Clase que gestiona las consultas al estado del trámite 260212.
 * Proporciona observables para seleccionar datos del estado.
 */
@Injectable({
  providedIn: 'root'
})
export class Tramite260212Query extends Query<TercerosRelacionadas260212State> {

  /**
   * Observable que selecciona todos los terceros relacionados del estado.
   * Devuelve el estado completo.
   */
  selectTereceros$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta.
   * Inyecta el store del trámite 260212.
   * 
   * @param store Store del trámite 260212.
   */
  constructor(
    protected override store: Shared260212Store
  ) {
    super(store);
  }
}
