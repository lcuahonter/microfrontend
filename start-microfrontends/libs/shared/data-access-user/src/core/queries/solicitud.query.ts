import { SolicitudState, SolicitudStore } from '../estados/solicitud.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'any' })
export class SolicitudQuery extends Query<SolicitudState> {
    /**
     * Selecciona el estatdo completo del solicitud
     */
    selectSolicitudState$ = this.select(state => {
        return state;
    });

    /**
     * Constructor de la clase SolicitudQuery.
     * @param store - Instancia del store de solicitud.
     */
    constructor(
        protected override store: SolicitudStore
    ) {
        super(store);
    }
}