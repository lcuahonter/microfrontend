import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { Renovacion31801State, Tramite31801Store } from '../tramites/tramite31801.store';

/**
 * Servicio de consulta para el trámite 31801.
 * 
 * @extends Query<Renovacion31801State>
 * 
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 31801.
 * 
 * @property {Observable<Renovacion31801State>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 * 
 * @constructor
 * @param {Tramite31801Store} store - El almacén que contiene el estado del trámite 31801.
 */
@Injectable({ providedIn: 'root' })
export class Tramite31801Query extends Query<Renovacion31801State> {

    /**
     * Selecciona el estado completo de la solicitud
     */
    selectSeccionState$ = this.select((state) => {
        return state;
    });

    /**Guarda el estado completo del formulario de la solicitud */
    constructor(
        protected override store: Tramite31801Store) {
        super(store);
    }
}