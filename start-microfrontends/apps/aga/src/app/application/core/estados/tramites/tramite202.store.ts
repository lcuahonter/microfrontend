import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 202
 * @interface ManiobrasMercancias202State
 * @returns {ManiobrasMercancias202State} Estado inicial de maniobras y mercancías
 */
export interface ManiobrasMercancias202State {
    /**
     * Arreglo de booleanos que indica si un manifiesto está seleccionado o no.
     * @type {boolean[]}
     */
    seleccionadaManifiesto: boolean[];

    /**
     * Cadena que representa la aduana.
     * @type {string}
     */
    aduana: string;
}

/**
 * Crea el estado inicial para la interfaz de tramite 202
 * @returns {ManiobrasMercancias202State} Estado inicial de maniobras y mercancías
 */
export function createInitialState(): ManiobrasMercancias202State {
    return {
        seleccionadaManifiesto: [false, false, false, false, false],
        aduana: '',
    };
}

/**
 * Clase que representa el almacén de estado para el trámite 202.
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Clase que representa el almacén de estado para el trámite 202.
 * @StoreConfig { name: 'tramite202', resettable: true }
 * @class Tramite202Store
 * @extends Store<ManiobrasMercancias202State>
 * @description Almacén de estado para el trámite 202.
 */
@StoreConfig({ name: 'tramite202', resettable: true })
export class Tramite202Store extends Store<ManiobrasMercancias202State> {
    constructor() {
        super(createInitialState());
    }

    /**
     * Actualiza el estado de la propiedad 'seleccionadaManifiesto'.
     * @param seleccionadaManifiesto - Nuevo valor para 'seleccionadaManifiesto'.
     * @returns {void}
     */
    public setSeleccionadaManifiesto(seleccionadaManifiesto: []): void {
        this.update((state) => ({
            ...state,
            seleccionadaManifiesto
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'aduana'.
     * @param aduana - Nuevo valor para 'aduana'.
     * @returns {void}
     */
    public setAduana(aduana: string): void {
        this.update((state) => ({
            ...state,
            aduana,
        }));
    }

    /**
     * Actualiza el estado completo del almacén con nuevos datos.
     * @param nuevoDatos - Nuevo estado para el almacén.
     * @returns {void}
     */
    public setPrestadoresServicioState(nuevoDatos: ManiobrasMercancias202State): void {
        this.update(nuevoDatos);
    }
}