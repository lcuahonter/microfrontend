/**
 * @description
 * Consulta (Query) de Akita para acceder al estado del store `CambioModalidadStore`.
 * Permite seleccionar y obtener datos relacionados con `CambioModalidadState` en la aplicación.
 *
 * @author [Tu Nombre]
 * @date [Fecha de Creación]
 *
 * @see Akita Query Documentation](https://datorama.github.io/akita/docs/query/)
 *
 * @example
 * ```typescript
 * constructor(private cambioModalidadQuery: CambioModalidadQuery) {}
 * ngOnInit() {
 *   this.cambioModalidadQuery.selectCambioModalidad$.subscribe(state => {
 *     // manejar el estado
 *   });
 * }
 * ```
 *
 * @class CambioModalidadQuery
 * @extends {Query<CambioModalidadState>}
 * @injectable
 */
/**
 * @nombre CambioModalidadQuery
 * @descripción Esta clase es una consulta (Query) de Akita que permite obtener el estado del store `CambioModalidadStore`.
 * Se utiliza para seleccionar y acceder a los datos del estado de la aplicación relacionados con `CambioModalidadState`.
 * 
 * @autor [Tu Nombre]
 * @fecha [Fecha de Creación]
 */

import { CambioModalidadState, CambioModalidadStore } from './tramite80208.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


@Injectable({ providedIn: 'root' })
export class CambioModalidadQuery extends Query<CambioModalidadState> {

    /**
     * @constructor
     * @descripción Constructor que inicializa la consulta con el store correspondiente.
     * @param {CambioModalidadStore} store - Inyección del store que maneja el estado de `CambioModalidadState`.
     */
    constructor(protected override store: CambioModalidadStore) {
        super(store);
    }

    /**
     * @propiedad selectCambioModalidad$
     * @tipo Observable<CambioModalidadState>
     * @descripción Selector que permite obtener el estado completo de `CambioModalidadState`.
     */
    selectCambioModalidad$ = this.select((state) => {
        return state;
    });

    /**
     * Observable selector for retrieving the entire state.
     */
    allStoreData$ = this.select((state) => state);
}
