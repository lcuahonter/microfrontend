import { Tramite303Store, Tramite303StoreService } from "../estados/tramites/tramite303.store";
import { Injectable } from "@angular/core";
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite303Query extends Query<Tramite303Store> {

    /**
     * Selecciona el estado del trámite 303.
     */
    selectSolicitud$ = this.select((state) => {
        return state;
    });

    /**
     * Constructor de la clase Tramite303Query.
     * @param store Servicio de estado del trámite 303.
     */
    constructor(
        protected override store: Tramite303StoreService) {
        super(store);
    }
}