/**
 * Consulta (Query) de Akita para el manejo del estado del trámite 32516.
 *
 * Esta clase proporciona una interfaz para acceder y seleccionar datos del estado de la aplicación
 * relacionados con el trámite 32516. Utiliza el patrón Query de Akita para permitir el acceso
 * reactivo al estado del store `TramiteStore`.
 *
 * @fileoverview Query class para el trámite 32516 que extiende Akita Query
 * @author [Tu Nombre]
 * @version 1.0.0
 * @since 2025-07-01
 */

import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { TramiteState } from '../estados/tramite32516Store.store';
import { TramiteStore } from '../estados/tramite32516Store.store';

/**
 * Clase Query de Akita para el manejo del estado del trámite 32516.
 *
 * Esta clase extiende la funcionalidad base de Akita Query para proporcionar acceso
 * reactivo al estado del trámite. Permite la selección y observación de cambios
 * en el estado de la aplicación de manera eficiente y reactiva.
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
     * Inicializa la consulta con el store inyectado, estableciendo la conexión
     * entre la query y el store que maneja el estado del trámite 32516.
     *
     * @constructor
     * @param {TramiteStore} store - Instancia del store que maneja el estado de TramiteState
     * @memberof TramiteStoreQuery
     */
    constructor(protected override store: TramiteStore) {
        super(store);
    }

    /**
     * Selector reactivo para obtener el estado completo del trámite.
     *
     * Este observable proporciona acceso reactivo al estado completo de TramiteState,
     * emitiendo automáticamente cada vez que el estado cambia en el store.
     * Permite a los componentes suscribirse y reaccionar a los cambios de estado
     * de manera eficiente y declarativa.
     *
     * @property {Observable<TramiteState>} selectSolicitudTramite$
     * @readonly
     * @returns {Observable<TramiteState>} Observable que emite el estado completo del trámite
     * @memberof TramiteStoreQuery
     * @example
     * ```typescript
     * // Suscribirse al estado del trámite
     * this.tramiteQuery.selectSolicitudTramite$.subscribe(state => {
     *   console.log('Estado actual del trámite:', state);
     * });
     * ```
     */
    selectSolicitudTramite$ = this.select((state) => {
        return state;
    });

}
