import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite130401State } from '../tramites/tramite130401.store';
import { Tramite130401Store } from '../tramites/tramite130401.store';

/**
 * Servicio de consulta para el estado del trámite 130401.
 * 
 * Este servicio permite realizar consultas al estado del trámite 130401 utilizando Akita.
 */
@Injectable({ providedIn: 'root' })
export class Tramite130401Query extends Query<Tramite130401State> {

    /**
     * Observable que selecciona el estado completo del trámite.
     * 
     * Este observable emite el estado actual del trámite 130401.
     */
    selectSolicitud$ = this.select((state) => {
        return state;
    });

    /**
     * Constructor de la clase Tramite130401Query.
     * 
     * @param {Tramite130401Store} store - El store que contiene el estado del trámite 130401.
     */
    constructor(
        protected override store: Tramite130401Store) {
        super(store);
    }
}