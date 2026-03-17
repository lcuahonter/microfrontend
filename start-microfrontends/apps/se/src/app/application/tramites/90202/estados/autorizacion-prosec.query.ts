import { AutorizacionProsecStore, ProsecState } from "../estados/autorizacion-prosec.store";
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";


/**
 * Query to manage the state of Prosec authorization.
 */
@Injectable({ providedIn: 'root' })
export class AUtorizacionProsecQuery extends Query<ProsecState> {

    selectProsec$ = this.select((state) => {
        return state;
      });
    

    /**
     * Constructor to inject AutorizacionProsecStore.
     * @param store AutorizacionProsecStore instance
     */
    constructor(protected override store: AutorizacionProsecStore) {
        super(store);
    }
}