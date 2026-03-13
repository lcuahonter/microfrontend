
import { ComplementarQuery } from '../../estados/queries/complementar.query';
import { ComplementarState } from '../../estados/tramites/complementar.store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class ComplementarService {
	constructor(private complementarQuery: ComplementarQuery) {}

	// Example method to get complementar data
	getComplementarData(): Observable<ComplementarState> {
		return this.complementarQuery.selectSolicitud$;
	}

        // Synchronous getter for current state
    getComplementarDataSync(): ComplementarState {
        return this.complementarQuery.getValue();
    }
}
