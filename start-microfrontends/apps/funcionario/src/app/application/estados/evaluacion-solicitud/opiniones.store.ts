import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from "@angular/core";
import { ListaOpiniones } from '../../core/models/lista-opiniones.model';

export interface SolicitudOpinionesState {
    /**
   * Parametro de la lista de opiniones seleccionados
   */
    listaOpciones: ListaOpiniones[];
    /**
     * Parametro para el desplegable de opiniones
     */
    parametroDesplegable: boolean;
}
/**
 * Creación del estado inicial para la interfaz de solicitud de opiniones
 * @returns SolicitudopinionesState
 */
export function createInitialState(): SolicitudOpinionesState {
    return {
        listaOpciones: [],
        parametroDesplegable: false,
    };
}
/**
 * Clase que maneja el estado de la solicitud de opiniones
 * @class OpinionesStates
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'OpinionesStates', resettable: true })
export class OpinionesStates extends Store<SolicitudOpinionesState> {
    constructor() {
        super(createInitialState());
    }
    /**
     * Resetear valores
     */
    resetStore() {
        this.reset();
    }
    /**
     * Guarda la lista de opiniones requeridos
     * @param opinionesSeleccionados 
     */
    setSolicitudOpiniones(listaOpciones: ListaOpiniones[]): void {
        this.update(state => ({ ...state, listaOpciones }));
    }
    /**
     * Método para guardar el valor del desplegable
     * @param parametroDesplegable 
     */
    public setValorDesplegableOpinion(parametroDesplegable: boolean): void {
        this.update((state) => ({
            ...state,
            parametroDesplegable,
        }));
    }
}
