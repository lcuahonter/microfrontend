import { BodyEstadoPedimento, EstadoPedimentoResponse } from "../../../models/5701/pedimento.model";
import { Observable, catchError, map, throwError } from "rxjs";
import { API_VALIDAR_PEDIMENTO } from "../../../../constantes/5701/api-constants";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class EstadoPedimentoService {
    private readonly host: string;

    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api`; // Cambia esto por la URL de tu API
    }
    /**
     * @description Método para validar el pedimento.
     * @param datosValidarPedimento: Datos del pedimento a validar.
     */
    postEstadoPedimento(datosValidarPedimento: BodyEstadoPedimento): Observable<EstadoPedimentoResponse> {
        const ENDPOINT = `${this.host}/${API_VALIDAR_PEDIMENTO}`;
        
        return this.http.post<EstadoPedimentoResponse>(ENDPOINT, datosValidarPedimento).pipe(
            map((response) => {
                return response;
            }),
            catchError(() => {
                const ERROR = new Error(`Ocurrió un error al devolver la información ${ENDPOINT} `);
                return throwError(() => ERROR);
            })
        );
    }}