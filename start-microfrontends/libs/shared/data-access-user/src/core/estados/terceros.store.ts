import { Store, StoreConfig } from "@datorama/akita";
import { Injectable } from "@angular/core";
import { PersonaTerceros } from "../models/shared/datos-generales.model";
/**
 * Creacion del estado inicial para la interfaz de terceros
 * @returns Terceros
 */


export interface TercerosState {
    terceros: PersonaTerceros[]
}

export function createInitialStateTerceros(): TercerosState {
    return {
        terceros: []
    }
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'terceros', resettable: true })
export class TercerosStore extends Store<TercerosState> {
    constructor() {
        super(createInitialStateTerceros());
    }

    /**
     * Actualiza la lista de terceros
     * @param terceros 
     */
    public setTerceros(terceros: PersonaTerceros[]): void {
        this.update((state) => ({
            ...state,
            terceros
        }));
    }

    /**
     * Limpia los datos de la solicitud
     */
    public limpiarTerceros(): void {
        this.reset();
    }
}



