import { API_POST_GUARDAR_TRAMITE } from '../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { GuardarSolicitudRequest } from '../models/guardar-solicitud-request.model';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ParcialResponse } from '../models/parcial-response.model';

@Injectable({
    providedIn: 'root'
})
export class GuardadoService {
    /**
       * URL del servidor donde se encuentra la API.
     */
    private readonly host: string;

    /**
     * Constructor del servicio IniciarService.
     * @param http - Cliente HTTP para realizar solicitudes al servidor.
     */
    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api/`;
    }

    // Observable<BaseResponse<ParcialResponse>> {
    postGuardadoCompleto(PAYLOAD: GuardarSolicitudRequest): Observable<BaseResponse<ParcialResponse>> {
        const ENDPOINT = `${this.host}` + API_POST_GUARDAR_TRAMITE;
        return this.http.post<BaseResponse<ParcialResponse>>(ENDPOINT, PAYLOAD);
    }

}