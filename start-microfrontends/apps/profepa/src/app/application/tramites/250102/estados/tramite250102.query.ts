import { Tramite250102State, Tramite250102Store } from "./tramite250102.store";
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";

/**
 * Query de Akita para consultar el estado del trámite 250102.
 * Proporciona selectores reactivos para acceder a diferentes partes del estado global del trámite.
 * 
 * @export
 * @class Tramite250102Query
 * @extends {Query<Tramite250102State>}
 */
@Injectable({
    providedIn: 'root',
})
export class Tramite250102Query extends Query<Tramite250102State>{

    /**
     * Observable que emite el estado completo del trámite.
     * @type {Observable<Tramite250102State>}
     */
    public selectTramiteState$ = this.select((state) => state);

    /**
     * Observable que emite el tipo de movimiento seleccionado.
     * @type {Observable<string>}
     */
    public selectTipoMovimiento$ = this.select((state) => state.tipoMovimiento);

    /**
     * Observable que emite los datos de destinatarios en tabla.
     * @type {Observable<any[]>}
     */
    public selectDestinatarioRowData$ = this.select((state) => state.destinatarioRowData);

    /**
     * Observable que emite los datos de agentes aduanales en tabla.
     * @type {Observable<any[]>}
     */
    public selectAgenteAduanalRowData$ = this.select((state) => state.agenteAduanalRowData);
  
    /**
     * Constructor que inyecta el store del trámite.
     * @param {Tramite250102Store} tramiteStore - Instancia del store del trámite 250102.
     */
    constructor(private tramiteStore: Tramite250102Store){
        super(tramiteStore);
    }
  
}