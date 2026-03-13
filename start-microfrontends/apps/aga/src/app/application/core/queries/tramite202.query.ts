import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { ManiobrasMercancias202State, Tramite202Store } from '../estados/tramites/tramite202.store';

/**
 * Servicio de consulta para el trámite 202.
 * 
 * @extends Query<ManiobrasMercancias202State>
 * 
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 202.
 * 
 * @property {Observable<ManiobrasMercancias202State>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 * 
 * @constructor
 * @param {Tramite202Store} store - El almacén que contiene el estado del trámite 202.
 */
@Injectable({ providedIn: 'root' })
export class Tramite202Query extends Query<ManiobrasMercancias202State> {

    /**
     * Selecciona el estado completo de la solicitud
     */
    selectSeccionState$ = this.select((state) => {
        return state;
    });

    /**Guarda el estado completo del formulario de la solicitud */
    constructor(
        protected override store: Tramite202Store) {
        super(store);
    }
}