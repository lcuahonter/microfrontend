import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado para almacenar la información de cada sección contenida dentro de un paso
 */
export interface CondicionesUsoState {
    /** Indica si el usuario ha aceptado las condiciones de uso */
    aceptaCondiciones: boolean;
}

/**
 * Crea el estado inicial para las condiciones de uso.
 * @returns Estado inicial con aceptaCondiciones en false.
 */
export function createInitialState(): CondicionesUsoState {
    return {
        aceptaCondiciones: false
    };
}

@Injectable({
    providedIn: 'root'
})
@StoreConfig({ name: 'CondicionesUsoStore', resettable: true })
export class CondicionesUsoService extends Store<CondicionesUsoState> {

    /** Estado local de condiciones de uso */
    private state: CondicionesUsoState = createInitialState();

    /**
     * Inicializa el store con el estado inicial.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Obtiene el estado actual de condiciones de uso.
     * @returns Estado actual.
     */
    getState(): CondicionesUsoState {
        return this.state;
    }

    /**
     * Actualiza el estado local con nuevos valores.
     * @param newState Estado parcial a actualizar.
     */
    setState(newState: Partial<CondicionesUsoState>): void {
        this.state = { ...this.state, ...newState };
    }

    /**
     * Limpia los datos de la sección, reseteando el estado.
     */
    public limpiarSeccion() {
        this.reset();
    }

    /**
     * Registra la aceptación o rechazo de las condiciones de uso.
     * @param aceptaCondiciones Valor booleano de aceptación.
     */
    public registroCondicionesUso(aceptaCondiciones: boolean): void {
        this.update((state) => ({
            ...state,
            aceptaCondiciones,
        }));
    }
}