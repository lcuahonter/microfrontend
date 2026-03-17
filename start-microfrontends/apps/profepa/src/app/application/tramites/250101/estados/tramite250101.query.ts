import { Tramite250101State, Tramite250101Store } from "./tramite250101.store";
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";

@Injectable({
    providedIn: 'root',
})
export class Tramite250101Query extends Query<Tramite250101State>{
    tipoAduana$ = this.select((state) => state.tipoAduana);
    tipoInspectoria$ = this.select((state) => state.tipoInspectoria);
    tipoMunicipio$ = this.select((state) => state.tipoMunicipio);
    destinatarioDenominacion$ = this.select((state) => state.destinatarioDenominacion);
    destinatarioPais$ = this.select((state) => state.destinatarioPais);
    destinatarioEstado$ = this.select((state) => state.destinatarioEstado);
    destinatarioCodigoPostal$ = this.select((state) => state.destinatarioCodigoPostal);
    destinatarioDomicilio$ = this.select((state) => state.destinatarioDomicilio);
    agenteAduanalNombre$ = this.select((state) => state.agenteAduanalNombre);
    agenteAduanalPrimerApellido$ = this.select((state) => state.agenteAduanalPrimerApellido);
    agenteAduanalSegundoApellido$ = this.select((state) => state.agenteAduanalSegundoApellido);
    agenteAduanalPatente$ = this.select((state) => state.agenteAduanalPatente);


    constructor(private tramiteStore: Tramite250101Store){
        super(tramiteStore);
    }
        /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
}