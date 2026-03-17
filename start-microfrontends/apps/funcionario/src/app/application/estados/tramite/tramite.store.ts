import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from "@angular/core";

export interface TramiteState {
    /**
     * Parametro de tramite
     */
    idTramite: string;
}
export function createInitialState(): TramiteState {
    return {
        idTramite: ''
    };
}
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'TramitesStates', resettable: true })
export class TramitesStates extends Store<TramiteState> {
    constructor() {
        super(createInitialState());
    }
    /**
     * Método para resetear valores
     */
    resetStore() {
        this.reset();
    }
    /**
     * Guarda el id de tramite seleccionado
     * @param idTramite parametro del id de tramite
     */
    settramiteValue(idTramite: string) {
        this.update(state => ({ ...state, idTramite }));
    }
}
