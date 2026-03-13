import {
  Tramite80211Store,
  Tramites80211State,
} from '../estados/tramites80211.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @clase
 * @nombre Tramite80211Query
 * @descripción
 * Clase que extiende de `Query` de Akita para gestionar las consultas relacionadas con el estado de `Tramites80211State`.
 * Proporciona un flujo observable para seleccionar el estado completo del trámite 80211.
 *
 * @decorador @Injectable
 * @decorador @providedIn: 'root'
 *
 * @ejemplo
 * this.tramite80211Query.selectTramite80211$.subscribe((state) => {
 *   console.log(state);
 * });
 */
@Injectable({ providedIn: 'root' })
export class Tramite80211Query extends Query<Tramites80211State> {
  /**
   * @propiedad
   * @nombre selectTramite80211$
   * @tipo {Observable<Tramites80211State>}
   * @descripción
   * Observable que emite el estado completo de `Tramites80211State`.
   *
   * @ejemplo
   * this.tramite80211Query.selectTramite80211$.subscribe((state) => {
   *   console.log(state);
   * });
   */
  selectTramite80211$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @descripción
   * Constructor que inicializa la clase `Tramite80211Query` con la tienda `Tramite80211Store`.
   *
   * @param {Tramite80211Store} store - La tienda de Akita que contiene el estado de `Tramites80211State`.
   */
  constructor(protected override store: Tramite80211Store) {
    super(store);
  }
}
