import { Query } from '@datorama/akita';

import { Injectable } from '@angular/core';

import { DesistimientoDePermisoState, DesistimientoStore } from '../estados/desistimiento-de-permiso.store';

/**
 * Consulta para el estado de desistimiento de permiso.
 * Proporciona selectores para acceder a los datos del estado.
 */
@Injectable({
    providedIn: 'root',
})
export class DesistimientoQuery extends Query<DesistimientoDePermisoState> {
    // Constructor que inyecta el store correspondiente.
    constructor(protected override store: DesistimientoStore) {
        super(store);
    }

    
    /**
     * Selector para obtener el trámite completo del estado.
     */
    selectTramite$ = this.select((state) => {
        return state;
    });

  
    /**
     * Selector para obtener el motivo de cancelación del estado.
     */
    selectMotivoCancelacion$ = this.select((state) => {
        return state.motivoCancelacion;
    });
    selectTramite140105$= this.select((state) => state);
}
