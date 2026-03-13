import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define el estado de la solicitud para el trámite 220501.
 */
export interface Solicitud220501State {
    /**
   * Medio de transporte seleccionado.
   */
    medioDeTransporte: string|null;
}

/**
 * Función para crear el estado inicial de la solicitud para el trámite 220501.
 * 
 * @returns {Solicitud220501State} El estado inicial de la solicitud.
 */
export function createInitialState(): Solicitud220501State {
    return {
        medioDeTransporte: null
    }
}

/**
 * Decorador que marca una clase como disponible para ser inyectada como una dependencia.
 * 
 * @Injectable indica que la clase Tramite220501Store puede ser inyectada en otros componentes o servicios.
 * El parámetro providedIn: 'root' especifica que el servicio debe ser un singleton y estar disponible
 * en toda la aplicación.
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Decorador que configura el store de Akita.
 * 
 * @StoreConfig se utiliza para proporcionar configuraciones específicas para el store.
 * El parámetro name: 'tramite220501' establece el nombre del store.
 * El parámetro resettable: true permite que el estado del store pueda ser restablecido.
 */
@StoreConfig({ name: 'tramite220501', resettable: true })
export class Tramite220501Store extends Store<Solicitud220501State> {
    /**
   * Constructor de la clase Tramite220501Store.
   * Inicializa el estado del store con el estado inicial.
   */
    constructor() {
        super(createInitialState());
    }

    /**
   * Método para establecer el medio de transporte en el estado.
   * 
   * @param {string} medioDeTransporte - El medio de transporte seleccionado.
   */
    public setMedioDeTransporte(medioDeTransporte: string): void {
        this.update((state) => ({
            ...state,
            medioDeTransporte,
        }));
    }
}