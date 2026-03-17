import { Observable, map } from "rxjs";
import { AgenteAduanal } from "../../models/303/agente-aduanal.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TipoFiguraService {

    constructor(private http: HttpClient) {
    }

    /**
     * Método que consulta una figura aduanal por número de patente y RFC.
     * @param numeroPatente Número de patente del agente aduanal.
     * @param rfc RFC del agente aduanal.
     * @returns Observable que emite el agente aduanal encontrado o undefined si no se encuentra.
     */
    consultaAgenteAduanal(numeroPatente: string, rfc?: string): Observable<AgenteAduanal | undefined> {
        return this.http.get<AgenteAduanal[]>(`/assets/json/303/consulta-agentes-aduanales.json`).pipe(
            map((figura) => {
                return figura.find(c =>
                    (numeroPatente ? c.patente === numeroPatente : true) &&
                    (rfc ? c.rfcModal === rfc : true)
                );
            })
        );
    }

    /**
     * Método que consulta una figura aduanal por número de patente y RFC.
     * @param numeroPatente Número de patente del agente aduanal.
     * @param rfc RFC del agente aduanal.
     * @returns Observable que emite el agente aduanal encontrado o undefined si no se encuentra.
     */
    consultaApoderadoAduanal(numeroPatente: string, rfc?: string): Observable<AgenteAduanal | undefined> {
        return this.http.get<AgenteAduanal[]>(`/assets/json/303/consulta-apoderado-aduanal.json`).pipe(
            map((figura) => {
                return figura.find(c =>
                    (numeroPatente ? c.patente === numeroPatente : true) &&
                    (rfc ? c.rfcModal === rfc : true)
                );
            })
        );
    }

    /**
     * Método que consulta una figura aduanal por número de patente y RFC.
     * @param numeroPatente Número de patente del agente aduanal.
     * @param rfc RFC del agente aduanal.
     * @returns Observable que emite el agente aduanal encontrado o undefined si no se encuentra.
     */
    consultaAgeciaAduanal(numeroPatente: string, rfc?: string): Observable<AgenteAduanal | undefined> {
        return this.http.get<AgenteAduanal[]>(`/assets/json/303/consulta-agentes-aduanales.json`).pipe(
            map((figura) => {
                return figura.find(c =>
                    (numeroPatente ? c.patente === numeroPatente : true) &&
                    (rfc ? c.rfcModal === rfc : true)
                );
            })
        );
    }

}