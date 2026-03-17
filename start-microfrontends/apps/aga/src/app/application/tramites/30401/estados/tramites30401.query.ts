import { Tramite30401Store, Tramites30401State } from './tramites30401.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @clase
 * @nombre Tramite30401Query
 * @descripción
 * Clase que extiende de `Query` de Akita para gestionar las consultas relacionadas con el estado de `Tramites30401State`.
 * Proporciona un flujo observable para seleccionar el estado completo del trámite 30401.
 * 
 * @decorador @Injectable
 * @decorador @providedIn: 'root'
 * 
 * @ejemplo
 * this.tramite30401Query.selectTramite30401$.subscribe((state) => {
 *   console.log(state);
 * });
 */
@Injectable({ providedIn: 'root' })
export class Tramite30401Query extends Query<Tramites30401State> {
    /**
   * @propiedad
   * @nombre selectTramite30401$
   * @tipo {Observable<Tramites30401State>}
   * @descripción
   * Observable que emite el estado completo de `Tramites30401State`.
   * 
   * @ejemplo
   * this.tramite30401Query.selectTramite30401$.subscribe((state) => {
   *   console.log(state);
   * });
   */
  selectTramite30401$= this.select((state) => {
    return state;
  });

   /**
   * @constructor
   * @descripción
   * Constructor que inicializa la clase `Tramite30401Query` con la tienda `Tramite30401Store`.
   * 
   * @param {Tramite30401Store} store - La tienda de Akita que contiene el estado de `Tramites30401State`.
   */
  constructor(
    protected override store: Tramite30401Store) {
    super(store);
  }
}