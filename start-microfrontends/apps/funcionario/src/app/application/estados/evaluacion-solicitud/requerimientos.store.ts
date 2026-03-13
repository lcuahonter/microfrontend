import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from "@angular/core";

export interface SolicitudRequerimientosState {
    /**
     * Parametro del tipo de requerimieto
     */
    idTipoRequerimiento: string;
    /**
     * Parametro justificación de evaluación
     */
    justificacionRequerimiento: string;
}
export function createInitialState(): SolicitudRequerimientosState {
    return {
        idTipoRequerimiento: '',
        justificacionRequerimiento: ''
    };
}
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'RequerimientosStates', resettable: true })
export class RequerimientosStates extends Store<SolicitudRequerimientosState> {
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
     * Guarda el tipo de requerimiento seleccionado 
     * @param idTipoRequerimiento parametro del tipo de requerimieto
     */
    settipoRequerimientoValue(idTipoRequerimiento: string) {
        this.update(state => ({ ...state, idTipoRequerimiento }));
    }
    /**
     * Guardar la justificación de a evaluación 
     * @param justificacionRequerimiento parametro 
     */
    setjustificacionRequerimientoValue(justificacionRequerimiento: string) {
        this.update(state => ({ ...state, justificacionRequerimiento }));
    }
}
