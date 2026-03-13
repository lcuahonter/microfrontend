/**
 * @nombre ImmexRegistroQuery
 * @descripción Esta clase es una consulta (Query) de Akita que permite obtener el estado del store `ImmexRegistroStore`.
 * Se utiliza para seleccionar y acceder a los datos del estado de la aplicación relacionados con `ImmexRegistroState`.
 * 
 * @autor [Tu Nombre]
 * @fecha [Fecha de Creación]
 */

import { ImmexRegistroState, ImmexRegistroStore } from '../tramites/tramite80203.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class ImmexRegistroQuery extends Query<ImmexRegistroState> {

    /**
     * @constructor
     * @descripción Constructor que inicializa la consulta con el store correspondiente.
     * @param {ImmexRegistroStore} store - Inyección del store que maneja el estado de `ImmexRegistroState`.
     */
    constructor(protected override store: ImmexRegistroStore) {
        super(store);
    }

    /**
     * @propiedad selectImmexRegistro$
     * @tipo Observable<ImmexRegistroState>
     * @descripción Selector que permite obtener el estado completo de `ImmexRegistroState`.
     */
    selectImmexRegistro$ = this.select((state) => {
        return state;
    });
}
