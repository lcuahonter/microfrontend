import { TercerosState, TercerosStore } from "../estados/terceros.store";
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";

@Injectable({ providedIn: 'root' })
export class TercerosQuery extends Query<TercerosState> {

    selectTerceros$ = this.select((state) => {
        return state;
    });
    constructor(
        protected override store: TercerosStore
    ) {
        super(store);
    }
}