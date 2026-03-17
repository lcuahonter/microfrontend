import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { Tramite319Store } from "./tramite319Store.store";

import { Solicitar } from "../models/personas";

import { FinalDataToSend } from "../models/tramite319-state.model";

/**
 * @descripcion
 * Servicio de consulta para el estado del formulario del trámite 319.
 * 
 * Este servicio extiende la clase `Query` de Akita y proporciona métodos
 * para acceder al estado actual de los datos del formulario.
 * 
 * @ejemplo
 * constructor(private tramite319Query: Tramite319Query) {}
 * 
 * const datos = this.tramite319Query.selectDatos$.subscribe(data => {
 *   console.log(data);
 * });
 */
@Injectable({
    providedIn: 'root',
})
export class Tramite319Query extends Query<FinalDataToSend> {

    /**
     * @descripcion
     * Constructor del servicio `Tramite319Query`.
     * 
     * @param {Tramite319Store} store - La tienda de estado asociada al trámite 319.
     */
    constructor(protected override store: Tramite319Store) {
        super(store);
    }

    /**
     * @descripcion
     * Observable para obtener la lista de datos (`Solicitar[]`).
     * 
     * @returns {Observable<Solicitar[]>}
     */
    selectDatos$ = this.select(estado => estado.lista_periodos_solicitud);

    /**
     * @descripcion
     * Observable para obtener la operación actual (`string`).
     * 
     * @returns {Observable<string>}
     */
    selectOperacion$ = this.select(estado => estado.numero_registro);

    /**
     * @descripcion
     * Getter síncrono para obtener directamente todos los datos (`Solicitar[]`) actuales del estado.
     * 
     * @returns {Solicitar[]}
     */
    get datos(): Solicitar[] {
        return this.getValue().lista_periodos_solicitud;
    }

    /**
     * @descripcion
     * Getter síncrono para obtener directamente la operación actual del estado.
     * 
     * @returns {string}
     */
    get operacion(): string {
        return this.getValue().numero_registro;
    }
}
