import { SubsecuenteIoState, SubsecuenteIoStore } from '../estados/subsecuentes.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'any' })
export class SubsecuenteIoQuery extends Query<SubsecuenteIoState> {
    /**
     * Selecciona el estado completo del subsecuente
     */
    selectSubsecuenteState$ = this.select(state => {
        return state;
    })

    constructor(
        protected override store: SubsecuenteIoStore
    ) {
        super(store);
    }
}