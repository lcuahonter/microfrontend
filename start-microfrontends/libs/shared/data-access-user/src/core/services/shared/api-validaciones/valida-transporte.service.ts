import { BodyValidaAereo, BodyValidaAereoDos, BodyValidaFerro, ValidacionesTransporteResponse } from "../../../models/shared/validaciones-transporte.model";
import { Observable, catchError, map, throwError } from "rxjs";
import { API_CONSULTAR_VALIDACION } from "../../../servers/api-router";
import { ENVIRONMENT } from "../../../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
@Injectable({
    providedIn: 'root',
})

export class ValidaTransporteService {
    /**
     * Host de la API
     */
    private readonly host: string;

    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api`;
    }

    /**
     * Petición a la API para validar el número BL de transporte ferroviario.
     * @param numeroBL: BodyValidarFerro - Número BL a validar
     * @returns Observable con la respuesta de la API
     */
    getValidaTransporte(tipo: string, body: BodyValidaAereo | BodyValidaFerro | BodyValidaAereoDos): Observable<ValidacionesTransporteResponse> {
        const ENDPOINT = `${this.host}/${API_CONSULTAR_VALIDACION.replace('{tipoTransporte}', tipo)}`;

        return this.http.post<ValidacionesTransporteResponse>(ENDPOINT, body).pipe(
            map((response) => {
                return response;
            }),
            catchError(() => {
                const ERROR = new Error(`Ocurrió un error al devolver la información ${ENDPOINT} `);
                return throwError(() => ERROR);
            })
        );
    }
}