import { TareaState, TareaStore } from '../estados/tarea.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'any' })
export class TareaQuery extends Query<TareaState> {
    /**
     * Selecciona el estatdo completo del login
     */
    selectState$ = this.select(state => {
        return state;
    });

    /**
     * Constructor de la clase TareaQuery.
     * @param store - Instancia del store de tarea.
     */
    constructor(
        protected override store: TareaStore
    ) {
        super(store);
    }
}