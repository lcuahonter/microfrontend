import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**
 * Interfaz que representa el estado de Solicitud32614.
 */
export interface Solicitud32614TercerosState {
    /**
     * El valor de resigtro.
     */
    resigtro: string;
    
    /**
     * El valor de telefono.
     */
    telefono: string;
    
    /**
     * El valor de correo.
     */
    correo: string;
    /**
     * El valor de resigtroFedral.
     */
    resigtroFedral: string;
    /**
     * El valor de cargo.
     */
    cargo: string;
    /**
     * El valor de telefonoEnlace.
     */
    telefonoEnlace: string;
    /**
     * El valor de correoEnlace.
     */
    correoEnlace: string;
    /**
     * El valor de suplente.
     */
    suplente: string;
    
   
}
/**
 * Función para crear el estado inicial de Solicitud32614Terceros.
 * @returns {Solicitud32614TercerosState} El estado inicial de Solicitud32614Terceros.
 */
export function createInitialState(): Solicitud32614TercerosState {
    return {
        /**
         * El valor de resigtro.
         */
        resigtro: '',
        
        /**
         * El valor de telefono.
         */
        telefono: '',
        
        /**
         * El valor de correo.
         */
        correo: '',
        /**
         * El valor de resigtroFedral.
         */
        resigtroFedral: '',
        /**
         * El valor de cargo.
         */
        cargo: '',
        /**
         * El valor de telefonoEnlace.
         */
        telefonoEnlace: '',
        /**
         * El valor de correoEnlace.
         */
        correoEnlace: '',
        /**
         * El valor de suplente.
         */
        suplente: '',
        
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
@StoreConfig({ name: 'tramite32614Terceros', resettable: true })

export class Tramite32614TercerosStore extends Store<Solicitud32614TercerosState>{
    /**
     * Crea una instancia de Tramite32614Store.
     * Inicializa la tienda con el estado inicial.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Establece el estado de resigtro.
     * @param resigtro - El valor de resigtro.
     */
    public setResigtro(resigtro: string): void {
        this.update((state) => ({
            ...state,
            resigtro,
        }));
    }

    /**
     * Establece el estado de telefono.
     * @param telefono - El valor de telefono.
     */
    public setTelefono(telefono: string): void {
        this.update((state) => ({
            ...state,
            telefono,
        }));
    }

    /**
     * Establece el estado de correo.
     * @param correo - El valor de correo.
     */
    public setCorreo(correo: string): void {
        this.update((state) => ({
            ...state,
            correo,
        }));
    }
    /**
     * Establece el estado de resigtroFedral.
     * @param resigtroFedral - El valor de resigtroFedral.
     */
    public setResigtroFedral(resigtroFedral: string): void {
        this.update((state) => ({
            ...state,
            resigtroFedral,
        }));
    }
    /**
     * Establece el estado de cargo.
     * @param cargo - El valor de cargo.
     */
    public setCargo(cargo: string): void {
        this.update((state) => ({
            ...state,
            cargo,
        }));
    }
    /**
     * Establece el estado de telefonoEnlace.
     * @param telefonoEnlace - El valor de telefonoEnlace.
     */
    public setTelefonoEnlace(telefonoEnlace: string): void {
        this.update((state) => ({
            ...state,
            telefonoEnlace,
        }));
    }
    /**
     * Establece el estado de correoEnlace.
     * @param correoEnlace - El valor de correoEnlace.
     */
    public setCorreoEnlace(correoEnlace: string): void {
        this.update((state) => ({
            ...state,
            correoEnlace,
        }));
    }
    /**
     * Establece el estado de suplente.
     * @param suplente - El valor de suplente.
     */
    public setSuplente(suplente: string): void {
        this.update((state) => ({
            ...state,
            suplente,
        }));
    }


} 
  