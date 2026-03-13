/**
 * @nombre TramiteStoreQuery
 * @descripción Esta clase es una consulta (Query) de Akita que permite obtener el estado del store `TramiteStore`.
 * Se utiliza para seleccionar y acceder a los datos del estado de la aplicación relacionados con `TramiteState`.
 * 
 * @autor [Tu Nombre]
 * @fecha [Fecha de Creación]
 */

import { TramiteState, TramiteStore } from '../estados/tramite220701.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class TramiteStoreQuery extends Query<TramiteState> {

    /**
     * @constructor
     * @param {TramiteStore} store - Inyección del store que maneja el estado de `TramiteState`.
     */
    constructor(protected override store: TramiteStore) {
        super(store);
    }

    /**
     * @propiedad selectCambioModalidad$
     * @tipo Observable<TramiteState>
     * @descripción Selector que permite obtener el estado completo de `TramiteState`.
     */
    selectSolicitudTramite$ = this.select((state) => {
        return state;
    });
}
