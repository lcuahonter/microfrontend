import { ConsultaioState, ConsultaioStore } from '../estados/consulta.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'any' })
export class ConsultaioQuery extends Query<ConsultaioState> {
    /**
     * Selecciona el estatdo completo del consultaio
     */
    selectConsultaioState$ = this.select(state => state)

    constructor(
        protected override store: ConsultaioStore
    ) {
        super(store);
    }
}