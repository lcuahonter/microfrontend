import { Solicitud120702State, Tramite120702Store } from "./tramite120702.store";
import { Injectable } from "@angular/core"; 
import { Query } from "@datorama/akita";

/**
 * Query de Akita para consultar el estado del trámite 120702.
 * 
 * Permite seleccionar y observar los cambios del estado definido en `Tramite120702Store`.
 */
@Injectable({ providedIn: 'root' })
export class Tramite120702Query extends Query<Solicitud120702State> {

  /**
   * Observable que emite el estado completo del store `Tramite120702Store`.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Crea una instancia de `Tramite120702Query`.
   *
   * @param store - Instancia del store que contiene el estado del trámite 120702.
   */
  constructor(protected override store: Tramite120702Store) {
    super(store);
  }
}
