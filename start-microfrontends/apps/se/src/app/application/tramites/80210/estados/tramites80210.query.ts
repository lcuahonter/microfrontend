import { Tramite80210Store, Tramites80210State } from './tramites80210.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @clase
 * @nombre Tramite80210Query
 * @descripción
 * Clase que extiende de `Query` de Akita para gestionar las consultas relacionadas con el estado de `Tramites80210State`.
 * Proporciona un flujo observable para seleccionar el estado completo del trámite 80210.
 * 
 * @decorador @Injectable
 * @decorador @providedIn: 'root'
 * 
 * @ejemplo
 * this.tramite80210Query.selectTramite80210$.subscribe((state) => {
 *   console.log(state);
 * });
 */
@Injectable({ providedIn: 'root' })
export class Tramite80210Query extends Query<Tramites80210State> {
    /**
   * @propiedad
   * @nombre selectTramite80210$
   * @tipo {Observable<Tramites80210State>}
   * @descripción
   * Observable que emite el estado completo de `Tramites80210State`.
   * 
   * @ejemplo
   * this.tramite80210Query.selectTramite80210$.subscribe((state) => {
   *   console.log(state);
   * });
   */
  selectTramite80210$= this.select((state) => {
    return state;
  });

   /**
   * @constructor
   * @descripción
   * Constructor que inicializa la clase `Tramite80210Query` con la tienda `Tramite80210Store`.
   * 
   * @param {Tramite80210Store} store - La tienda de Akita que contiene el estado de `Tramites80210State`.
   */
  constructor(
    protected override store: Tramite80210Store) {
    super(store);
  }
}