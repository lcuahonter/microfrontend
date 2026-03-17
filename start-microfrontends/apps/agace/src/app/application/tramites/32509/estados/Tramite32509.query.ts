import { DestruccionState, DestruccionStore } from "./Tramite32509.store";
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";

/**
 * Query service for DestruccionState using Akita.
 * 
 * @export
 * @class DestruccionQuery
 * @extends {Query<DestruccionState>}
 */
@Injectable({ providedIn: 'root' })
export class DestruccionQuery extends Query<DestruccionState> {

    /**
     * Observable of the entire DestruccionState.
     * @type {Observable<DestruccionState>}
     * @memberof DestruccionQuery
     */
    selectDestruccion$ = this.select((state) => {
        return state;
    });

    /**
     * Creates an instance of DestruccionQuery.
     * @param {DestruccionStore} store DestruccionStore instance
     * @memberof DestruccionQuery
     */
    constructor(protected override store: DestruccionStore) {
        super(store);
    }
}