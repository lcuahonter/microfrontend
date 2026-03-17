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
      /**
     * Parametro area solicitante
     */
    areaSolicitante: string;
    /**
     * Parametro area solicitante
     */
    areasSolicitantes: string[];
    /**
     * Parametro activa pestaña
     */
    activarTabSolicitarDocumentos: boolean;
}
export function createInitialRequerimientosStates(): SolicitudRequerimientosState {
    return {
        idTipoRequerimiento: "",
        justificacionRequerimiento: '',
        areaSolicitante: '',
        areasSolicitantes: [],
        activarTabSolicitarDocumentos: false
    };
}
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'RequerimientosStates', resettable: true })
export class RequerimientosStates extends Store<SolicitudRequerimientosState> {
    constructor() {
        super(createInitialRequerimientosStates());
    }
    /**
     * Devuelve el idTipoRequerimiento actual del store
     */
    getIdTipoRequerimiento(): string {
        return this.getValue().idTipoRequerimiento;
    }
    /**
     * Método para resetear valores
     */
    resetStore(): void {
        this.reset();
    }
    /**
     * Guarda el tipo de requerimiento seleccionado 
     * @param idTipoRequerimiento parametro del tipo de requerimieto
     */
    settipoRequerimientoValue(idTipoRequerimiento: string): void {
        this.update(state => ({ ...state, idTipoRequerimiento }));
    }
    /**
     * Guardar la justificación de a evaluación 
     * @param justificacionRequerimiento parametro 
     */
    setjustificacionRequerimientoValue(justificacionRequerimiento: string): void {
        this.update(state => ({ ...state, justificacionRequerimiento }));
    }
    /**
         * Guardar el area de solicitud de 
         * @param justificacionRequerimiento parametro 
         */
    setareaSolicitanteValue(areaSolicitante: string): void {
        this.update(state => ({ ...state, areaSolicitante }));
    }
    /**
         * Guardar el area de solicitud de
         * @param justificacionRequerimiento parametro
         */
    setareasSolicitantesValue(areasSolicitantes: string[]): void {
        console.log("ARRAY REAL:", areasSolicitantes, Array.isArray(areasSolicitantes));
        this.update(state => ({ ...state, areasSolicitantes }));
    }
    /**
         * Guardar el valor de la pestaña
         * @param justificacionRequerimiento parametro 
         */
    setPestaniaSolicitudDocumento(activarTabSolicitarDocumentos: boolean): void {
        this.update(state => ({ ...state, activarTabSolicitarDocumentos }));
    }

}
