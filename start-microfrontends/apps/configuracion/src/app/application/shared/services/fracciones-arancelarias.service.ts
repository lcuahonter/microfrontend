import { FraccionArancelaria, FraccionesResponse } from "../models/fracciones-response.model";
import { Observable, map } from "rxjs";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class FraccionesArancelariasService {
    /**
     * URL base del servidor configurado en los environments.
     * Se utiliza como prefijo para todas las peticiones del módulo.
     */
    private readonly host: string;
    /**
     * Constructor del servicio.
     *
     * @param http - Servicio HttpClient utilizado para realizar
     * peticiones HTTP.
     */
    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api`;
    }

    public obtenerFracciones(parentId: string | null = null): Observable<FraccionArancelaria[]> {
        const URL = parentId ? `assets/json/fracciones-arancelarias/fracciones-${parentId}.json` : `assets/json/fracciones-arancelarias/fracciones-base.json`
        return this.http.get<FraccionesResponse>(URL)
            .pipe(
                map(response => response.data.items.map(item => ({
                    ...item,
                    hasChildren: item.state === 'closed',
                    isExpanded: false,
                    isLoading: false,
                    children: []
                })))
            );
    }
}
