/**
 * Clase Query de Akita para el trámite 290101 que proporciona selectores y consultas para acceder al estado del store.
 *
 * Esta clase extiende la funcionalidad base de Query de Akita para proporcionar métodos específicos
 * que permiten acceder y seleccionar datos del estado relacionados con el trámite 290101.
 * Se utiliza como capa de acceso a datos entre los componentes y el store de estado.
 *
 * @fileoverview Query class para el manejo del estado del trámite 290101
 * @author [Tu Nombre]
 * @since 1.0.0
 * @version 1.0.0
 */

import { TramiteState, TramiteStore } from '../estados/tramite290101.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase Query de Akita para el trámite 290101.
 *
 * Proporciona métodos de consulta y selectores para acceder al estado del trámite 290101.
 * Esta clase actúa como intermediario entre los componentes de la aplicación y el store de estado,
 * ofreciendo una API reactiva para consultar y observar cambios en el estado.
 *
 * @class TramiteStoreQuery
 * @extends {Query<TramiteState>}
 * @injectable
 */
@Injectable({ providedIn: 'root' })
export class TramiteStoreQuery extends Query<TramiteState> {

    /**
     * Constructor de la clase TramiteStoreQuery.
     *
     * Inicializa la instancia de la consulta con el store proporcionado.
     * El store se inyecta automáticamente a través del sistema de inyección de dependencias de Angular.
     *
     * @constructor
     * @param {TramiteStore} store - Instancia del store que maneja el estado de TramiteState
     * @protected
     * @override
     */
    constructor(protected override store: TramiteStore) {
        super(store);
    }

    /**
     * Selector que proporciona acceso reactivo al estado completo del trámite.
     *
     * Este observable emite el estado completo de TramiteState cada vez que hay cambios en el store.
     * Los componentes pueden suscribirse a este selector para recibir actualizaciones automáticas
     * del estado del trámite 290101.
     *
     * @property {Observable<TramiteState>} selectSolicitudTramite$
     * @readonly
     * @returns {Observable<TramiteState>} Observable que emite el estado completo del trámite
     * @example
     * ```typescript
     * this.tramiteQuery.selectSolicitudTramite$.subscribe(state => {
     *   console.log('Estado actual del trámite:', state);
     * });
     * ```
     */
    selectSolicitudTramite$ = this.select((state) => {
        return state;
    });
}
