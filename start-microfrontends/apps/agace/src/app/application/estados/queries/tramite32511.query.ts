import { Avisos32511State, Tramite32511Store } from '../tramites/tramite32511.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el trámite 32511.
 * 
 * @extends Query<Avisos32511State>
 * 
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 32511.
 * 
 * @property {Observable<Avisos32511State>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 * 
 * @constructor
 * @param {Tramite32511Store} store - El almacén que contiene el estado del trámite 32511.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32511Query extends Query<Avisos32511State> {

    /**
     * Selecciona el estado completo de la solicitud
     */
    selectSeccionState$ = this.select((state) => {
        return state;
    });

    /**Guarda el estado completo del formulario de la solicitud */
    constructor(
        protected override store: Tramite32511Store) {
        super(store);
    }
}