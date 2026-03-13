import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 31801
 * @interface Renovacion31801State
 * @returns {Renovacion31801State} Estado inicial de renovacion
 */
export interface Renovacion31801State {
    /**
     * Número de oficio.
     * @type {string}
     */
    numeroOficio?: string;

    /**
     * Fecha inicial.
     * @type {string}
     */
    fechaInicialInput?: string;

    /**
     * Fecha final.
     * @type {string}
     */
    fechaFinalInput?: string;

    /**
     * Fecha de pago.
     * @type {string}
     */
    fechaPago?: string;

    /**
     * Monto en moneda nacional.
     * @type {number}
     */
    monedaNacional?: number | null;

    /**
     * Número de operación.
     * @type {string}
     */
    numeroOperacion?: string;

    /**
     * Llave de pago.
     * @type {string}
     */
    llavePago?: string;

    /**
     * Selección de manifiesto.
     * @type {boolean[]}
     */
    seleccionadaManifiesto: boolean[];
}

/**
 * Crea el estado inicial para la interfaz de tramite 31801
 * @returns {Renovacion31801State} Estado inicial de renovacion
 */
export function createInitialState(): Renovacion31801State {
    return {
        numeroOficio: '',
        fechaInicialInput: '',
        fechaFinalInput: '',
        fechaPago: '',
        monedaNacional: null,
        numeroOperacion: '',
        llavePago: '',
        seleccionadaManifiesto: [false, false],
    };
}

/**
 * Clase que representa el almacén de estado para el trámite 31801.
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Clase que representa el almacén de estado para el trámite 31801.
 * @StoreConfig { name: 'tramite31801', resettable: true }
 * @class Tramite31801Store
 * @extends Store<Renovacion31801State>
 * @description Almacén de estado para el trámite 31801.
 */
@StoreConfig({ name: 'tramite31801', resettable: true })
export class Tramite31801Store extends Store<Renovacion31801State> {
    constructor() {
        super(createInitialState());
    }

    setTramite31801State(valores: Partial<Renovacion31801State>): void {
        this.update((state => ({
          ...state,
          ...valores,
        })));
      }

}