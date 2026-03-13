import { SeccionState, SeccionStore } from '../seccion.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({providedIn: 'root'})
export class SeccionQuery extends Query<SeccionState> {

    /**
     * Selecciona el estatdo completo de la sección
     */
    selectSeccionState$ = this.select(state => {
        return state;
    })

    constructor(
        protected override store: SeccionStore
    ) {
        super(store);
    }

}
