
import { CondicionesUsoService, CondicionesUsoState } from '../estados/condiciones-uso.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Query para consultar el estado de aceptación de condiciones de uso.
 * 
 * Proporciona un observable para suscribirse a los cambios en el estado.
 */
@Injectable({ providedIn: 'root' })
export class CondicionesUsoQuery extends Query<CondicionesUsoState> {

    /**
     * Observable que emite el estado actual de condiciones de uso.
     */
    selectSolicitud$ = this.select((state) => {
        return state;
    });

    /**
     * Constructor que recibe el store de condiciones de uso.
     * @param store Instancia del store de condiciones de uso.
     */
    constructor(
        protected override store: CondicionesUsoService) {
        super(store);
    }
}