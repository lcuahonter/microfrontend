import { Tramite250103State, Tramite250103Store } from "./tramite250103.store";
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";

@Injectable({
    providedIn: 'root',
})
export class Tramite250103Query extends Query<Tramite250103State>{

    public selectTramiteState$ = this.select((state) => state);
    public selectTipoMovimiento$ = this.select((state) => state.tipoMovimiento);
    public selectDestinatarioRowData$ = this.select((state) => state.destinatarioRowData);
    public selectAgenteAduanalRowData$ = this.select((state) => state.agenteAduanalRowData);
  
    constructor(private tramiteStore: Tramite250103Store){
        super(tramiteStore);
    }
  
}