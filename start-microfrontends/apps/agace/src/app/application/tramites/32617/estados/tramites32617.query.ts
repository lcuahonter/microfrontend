import { Tramite32617Store, Tramites32617State } from './tramites32617.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @clase
 * @nombre Tramite32617Query
 * @descripción
 * Clase que extiende de `Query` de Akita para gestionar las consultas relacionadas con el estado de `Tramites32617State`.
 * Proporciona un flujo observable para seleccionar el estado completo del trámite 32617.
 * 
 * @decorador @Injectable
 * @decorador @providedIn: 'root'
 * 
 * @ejemplo
 * this.tramite32617Query.selectTramite32617$.subscribe((state) => {
 *   console.log(state);
 * });
 */
@Injectable({ providedIn: 'root' })
export class Tramite32617Query extends Query<Tramites32617State> {
    /**
   * @propiedad
   * @nombre selectTramite32617$
   * @tipo {Observable<Tramites32617State>}
   * @descripción
   * Observable que emite el estado completo de `Tramites32617State`.
   * 
   * @ejemplo
   * this.tramite32617Query.selectTramite32617$.subscribe((state) => {
   *   console.log(state);
   * });
   */
  selectTramite32617$= this.select((state) => {
    return state;
  });

   /**
   * @constructor
   * @descripción
   * Constructor que inicializa la clase `Tramite32617Query` con la tienda `Tramite32617Store`.
   * 
   * @param {Tramite32617Store} store - La tienda de Akita que contiene el estado de `Tramites32617State`.
   */
  constructor(
    protected override store: Tramite32617Store) {
    super(store);
  }
}