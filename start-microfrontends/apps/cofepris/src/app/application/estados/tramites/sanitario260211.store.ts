import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
/**
 * @interface
 * @name Solicitud260211State
 * @description
 * Representa el estado de la solicitud en el sistema. Contiene todos los campos necesarios para gestionar los datos relacionados con la solicitud.
 */
export interface Solicitud260211State {
    /**
     * @property {string} referencia
     * @description Referencia de la solicitud.
     */
    referencia: string;
  
    /**
     * @property {string} cadenaDependencia
     * @description Cadena de dependencia asociada a la solicitud.
     */
    cadenaDependencia: string;
  
    /**
     * @property {string} banco
     * @description Información del banco relacionado.
     */
    banco: string;
  
    /**
     * @property {string} Llave
     * @description Llave única de la solicitud.
     */
    Llave: string;
  
    /**
     * @property {string} tipoFetch
     * @description Información de fetch.
     */
    tipoFetch: string;
  
    /**
     * @property {string} importe
     * @description Importe relacionado con la solicitud.
     */
    importe: string;
  
    
  }

/**
 * @function
 * @name createInitialState
 * @description
 * Crea el estado inicial de la solicitud. Esta función devuelve un objeto con todos los campos inicializados como cadenas vacías.
 * 
 * @returns {Solicitud260211State} El estado inicial de la solicitud.
 */
export function createInitialState(): Solicitud260211State {
    return {
        /**
         * @property {string} referencia
         * @description Referencia de la solicitud.
         */
        referencia: '',

        /**
         * @property {string} cadenaDependencia
         * @description Cadena de dependencia asociada a la solicitud.
         */
        cadenaDependencia: '',

        /**
         * @property {string} banco
         * @description Información del banco relacionado.
         */
        banco: '',

        /**
         * @property {string} Llave
         * @description Llave única de la solicitud.
         */
        Llave: '',

        /**
         * @property {string} tipoFetch
         * @description Información de fetch.
         */
        tipoFetch: '',

        /**
         * @property {string} importe
         * @description Importe relacionado con la solicitud.
         */
        importe: '',

       
    };
}

@Injectable({
    providedIn: 'root',
})    

@StoreConfig({ name: 'sanitario260211Store', resettable: true })

export class Sanitario260211Store extends Store<Solicitud260211State>{
     constructor() {
            super(createInitialState());
        }

        public setreferencia(referencia: string) {
            this.update((state) => ({
                ...state,
                referencia,
            }));
        }
        public setcadenaDependencia(cadenaDependencia: string) {
            this.update((state) => ({
                ...state,
                cadenaDependencia,
            }));
        }
        public setbanco(banco: string) {
            this.update((state) => ({
                ...state,
                banco,
            }));
        }
        public setLlave(Llave: string) {
            this.update((state) => ({
                ...state,
                Llave,
            }));
        }
        public settipoFetch(tipoFetch: string) {
            this.update((state) => ({
                ...state,
                tipoFetch,
            }));
        }
        public setimporte(importe: string) {
            this.update((state) => ({
                ...state,
                importe,
            }));
        }

}