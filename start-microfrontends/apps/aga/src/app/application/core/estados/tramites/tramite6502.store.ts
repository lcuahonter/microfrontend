import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**
 * Interfaz que representa el estado de Solicitud6502.
 */
export interface Solicitud6502State {
    /**
     * El valor de curpActualizada.
     */
    curpActualizada: string;
    /**
     * El valor de confirmacioCurpActualizada.
     */
    confirmacioCurpActualizada: string;
  
   
}
/**
 * Función para crear el estado inicial de Solicitud6502.
 * @returns {Solicitud6502State} El estado inicial de Solicitud6502.
 */
export function createInitialState(): Solicitud6502State {
    return {
        /**
         * El valor de curpActualizada.
         */
        curpActualizada: '',
        /**
         * El valor de confirmacioCurpActualizada.
         */
        confirmacioCurpActualizada: '',
        
    };
}

 /**
 * Decorador Injectable para hacer que la tienda esté disponible a nivel raíz.
 */
@Injectable({
    providedIn: 'root',
})
/**
 * Decorador StoreConfig para configurar la tienda con un nombre y una opción de restablecimiento.
 * @param {Object} config - El objeto de configuración.
 * @param {string} config.name - El nombre de la tienda.
 * @param {boolean} config.resettable - Indica si la tienda es restablecible.
 */
@StoreConfig({ name: 'tramite6502', resettable: true })

export class Tramite6502Store extends Store<Solicitud6502State>{
    /**
     * Crea una instancia de Tramite6502Store.
     * Inicializa la tienda con el estado inicial.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Establece el estado de curpActualizada.
     * @param curpActualizada - El valor de curpActualizada.
     */
    public setCurpActualizada(curpActualizada: string): void {
        this.update((state) => ({
            ...state,
            curpActualizada,
        }));
    }
    /**
     * Establece el estado de confirmacioCurpActualizada.
     * @param confirmacioCurpActualizada - El valor de confirmacioCurpActualizada.
     */
    public setConfirmacioCurpActualizada(confirmacioCurpActualizada: string): void {
        this.update((state) => ({
            ...state,
            confirmacioCurpActualizada,
        }));
    }


} 
  