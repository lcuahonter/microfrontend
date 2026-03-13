import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { BusquedaPermisos140216State, Tramite140216Store } from '../tramites/tramite140216.store';

/**
 * Query para gestionar el estado de la sección de búsqueda de permisos.
 * @class Tramite140216Query
 */
@Injectable({ providedIn: 'root' })
export class Tramite140216Query extends Query<BusquedaPermisos140216State> {

    /**
     * Selecciona el estado completo de la solicitud
     */
    selectSeccionState$ = this.select((state) => {
        return state;
    });

    /**Guarda el estado completo del formulario de la solicitud */
    constructor(
        protected override store: Tramite140216Store) {
        super(store);
    }
}