import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * @interface CancelarSolicitudState
 * @description
 * Representa el estado de la modalidad de cambio.
 */
export interface CancelarSolicitudState {
    folioSVEX: string;
    folioVUCEM: string;
    tipoDeCancelacion: string;
    horaInicio: string;
    horaFin: string;
    descripcion: string;
    fechasSeleccionadas: { selectedFechas: string[] }
}

/**
 * @function createInitialState
 * @description
 * Inicializa el estado con valores predeterminados.
 * @returns {CancelarSolicitudState} Estado inicial.
 */
export function createInitialState(): CancelarSolicitudState {
    return {
        folioSVEX: "",
        folioVUCEM: "",
        tipoDeCancelacion: "",
        horaInicio: "",
        horaFin: "",
        descripcion: "",
        fechasSeleccionadas: {
            selectedFechas: [] 
        }
    };
}

/**
 * @class CancelarSolicitudStore
 * @description
 * Administra el estado de la modalidad de cambio utilizando Akita.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'cancelar-solicitud', resettable: true })
export class CancelarSolicitudStore extends Store<CancelarSolicitudState> {
    constructor() {
        super(createInitialState());
    }

    /**
     * @method setTipoSolicitudSeleccion
     * @description
     * Actualiza el estado de `tipoSolicitudSeleccion` con nuevos valores.
     * @param {string} tipoSolicitudSeleccion - Datos seleccionados para el tipo de solicitud.
     */
    public setTipoDeCancelacion(state: CancelarSolicitudState, tipoDeCancelacion: string): void {
        const UPDATED_STATE = { ...state, tipoDeCancelacion };
        this.update((state) => ({
            ...state,
            ...UPDATED_STATE
        }));    
    }

    /**
     * @method setFechasSeleccionadas
     * @description
     * Actualiza el estado de `selectedFechas` con las fechas seleccionadas.
     * @param {string[]} selectedFechas - Lista de fechas seleccionadas.
     */
    public setFechasSeleccionadas(state: CancelarSolicitudState, selectedFechas: string[]): void {
        const FECHAS_SELECCIONADAS = {
            selectedFechas : selectedFechas
        }
        const UPDATED_STATE = { ...state, fechasSeleccionadas: FECHAS_SELECCIONADAS};
        this.update((state) => ({
            ...state,
            ...UPDATED_STATE,
        }));
    }

    /**
     * @method setDescripcion
     * @description
     * Actualiza el estado de `descripcion` con la nueva descripción ingresada.
     * @param {string} descripcion - Texto de la descripción.
     */
    public setDescripcion(state:CancelarSolicitudState, descripcion: string): void {
        const UPDATED_STATE = { ...state, descripcion };
        this.update((state) => ({
            ...state,
            ...UPDATED_STATE,
        }));
    }
      /**
     * Restablece el estado a su estado inicial.
     */
      public limpiarFormulario(): void {
        this.reset();
    }

}