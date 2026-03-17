import { Solicitud11106State, Solicitud11106Store } from './solicitud11106.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio `Solicitud11106Query` que extiende de `Query` para exponer el estado reactivo de `Solicitud11106Store`.
 * Se utiliza para consultar (leer) el estado de la solicitud 11106 (Cancelación de Donaciones).
 * Maneja únicamente el campo checkbox "laAutorizacionEsNula".
 */
@Injectable({ providedIn: 'root' })
export class Solicitud11106Query extends Query<Solicitud11106State> {

    /**
     * @description Constructor que inyecta el store asociado a la solicitud 11106.
     * Se pasa al constructor de la clase padre `Query`.
     * @param store Instancia del store `Solicitud11106Store` que contiene el estado de la solicitud.
     */
    constructor(
        protected override store: Solicitud11106Store
    ) {
        super(store);
    }

    /**
     * @description
     * Observable que permite seleccionar y observar el estado completo de la solicitud 11106.
     * @type {Observable<Solicitud11106State>}
     * @memberof Solicitud11106Query
     */
    seleccionarAutorizacionEsNula$ = this.select((state) => {
        return state;
    });
}