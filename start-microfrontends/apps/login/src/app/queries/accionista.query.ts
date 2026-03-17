
import { AccionistaStore, AccionistaStoreService } from '../estados/accionista.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase de consulta para obtener el estado de accionistas desde el store.
 * Permite suscribirse y obtener los valores actuales del estado de accionistas,
 * facilitando la reactividad en los componentes que requieren esta información.
 */
@Injectable({ providedIn: 'root' })
export class AccionistaDatosQuery extends Query<AccionistaStore> {
    /** * Clase de consulta para obtener el estado de accionistas desde el store.
     * Permite suscribirse y obtener los valores actuales del estado de accionistas,
     * facilitando la reactividad en los componentes que requieren esta información.
     * */
    selectSolicitud$ = this.select((state) => {
        return state;
    });
    /** * Clase de consulta para obtener el estado de accionistas desde el store.
     * Permite suscribirse y obtener los valores actuales del estado de accionistas,
     * facilitando la reactividad en los componentes que requieren esta información.
     * */
    constructor(
        protected override store: AccionistaStoreService) {
        super(store);
    }
}

