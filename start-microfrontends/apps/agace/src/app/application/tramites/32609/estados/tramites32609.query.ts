import { Tramite32609Store, Tramites32609State } from './tramites32609.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @clase
 * @nombre Tramite32609Query
 * @descripción
 * Clase que extiende de `Query` de Akita para gestionar las consultas relacionadas con el estado de `Tramites32609State`.
 * Proporciona un flujo observable para seleccionar el estado completo del trámite 32609.
 * 
 * @decorador @Injectable
 * @decorador @providedIn: 'root'
 * 
 * @ejemplo
 * this.tramite32609Query.selectTramite32609$.subscribe((state) => {
 *   console.log(state);
 * });
 */
@Injectable({ providedIn: 'root' })
export class Tramite32609Query extends Query<Tramites32609State> {
    /**
   * @propiedad
   * @nombre selectTramite32609$
   * @tipo {Observable<Tramites32609State>}
   * @descripción
   * Observable que emite el estado completo de `Tramites32609State`.
   * 
   * @ejemplo
   * this.tramite32609Query.selectTramite32609$.subscribe((state) => {
   *   console.log(state);
   * });
   */
  selectTramite32609$= this.select((state) => {
    return state;
  });

   /**
   * @constructor
   * @descripción
   * Constructor que inicializa la clase `Tramite32609Query` con la tienda `Tramite32609Store`.
   * 
   * @param {Tramite32609Store} store - La tienda de Akita que contiene el estado de `Tramites32609State`.
   */
  constructor(
    protected override store: Tramite32609Store) {
    super(store);
  }
}