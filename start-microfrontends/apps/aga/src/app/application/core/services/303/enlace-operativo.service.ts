import { Observable, map } from "rxjs";
import { EnlaceOperativo } from "../../models/303/enlace-operativo.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class EnlaceOperativoService {

    constructor(private http: HttpClient) {
    }

    /**
     * Busca un enlace operativo por su RFC.
     * @param rfc RFC del enlace operativo a buscar.
     * @returns Observable con el enlace operativo encontrado o undefined.
     */
    buscarEnlacePorRFC(rfc: string): Observable<EnlaceOperativo | undefined> {
        return this.http
            .get<EnlaceOperativo[]>(`/assets/json/303/enlace-operativo.json`)
            .pipe(map(list => list.find(t => t.rfc === rfc)));
    }
}