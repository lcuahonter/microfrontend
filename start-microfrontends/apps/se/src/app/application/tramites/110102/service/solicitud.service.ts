import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {Observable, catchError, map, throwError,} from "rxjs";

import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { FirmarRequest } from "@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model";

import { API_POST_FIRMA, API_POST_GENERAR_CADENA_ORIGINAL, API_POST_GUARDAR_SOLICITUD, API_POST_VALIDAR_SOLICITUD_COMPLETA } from "../server/api-router";
import { GenerarCadenaOrigRequest } from "../models/request/generar-cadena-original-request.model";
import { SolicitudCompletaRequest } from "../models/request/guardado-solicitud-request.model";

import { FirmaResponse } from "../models/response/firma-response.model";
import { ValidarRequest } from "../models/request/validar-solicitud-request.model";
import { ValidarSolicitudResponse } from "../models/response/validar-solicitud-response.model";



@Injectable({
    providedIn: 'root'
})

export class SolicitudService {


    /**
       * URL base del servidor al que se realizarán las solicitudes relacionadas con el tramite 110102.
       * Esta variable almacena la dirección del host para los servicios datos adicionales.
       * Es de solo lectura y se inicializa en el constructor del servicio.
       */
    private readonly host: string;

    /**
      * Constructor del servicio que inicializa la URL base del host.
      * @param http Instancia de HttpClient para realizar solicitudes HTTP.
      */
    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api/`;
    }

    /**
     * Registro de una solicitud.
     * @returns Observable con la respuesta del servidor
     */
    postSolicitudGuardar(PAYLOAD: SolicitudCompletaRequest): Observable<BaseResponse<number>> {
        const ENDPOINT = `${this.host}${API_POST_GUARDAR_SOLICITUD}`;
        return this.http.post<BaseResponse<number>>(ENDPOINT, PAYLOAD);
    }

    /**
     * Genera la cadena original para la solicitud.
     */
    postGenerarCadenaOriginal(idSolicitud: number, PAYLOAD: GenerarCadenaOrigRequest): Observable<BaseResponse<string>> {
        const ENDPOINT = `${this.host}${API_POST_GENERAR_CADENA_ORIGINAL(idSolicitud.toString())}`;
        return this.http.post<BaseResponse<string>>(ENDPOINT, PAYLOAD);
    }

    /**
      * Envía una solicitud de firma electrónica.
      * @param idSolicitud - ID de la solicitud a firmar.
      * @param body - Cuerpo de la solicitud de firma.
      * @returns Observable con la respuesta del servidor.
    */
    enviarFirma<T>(idSolicitud: string | number, body: FirmarRequest): Observable<BaseResponse<FirmaResponse>> {
        const ENDPOINT = `${this.host}` + API_POST_FIRMA(String(idSolicitud));
        return this.http.post<BaseResponse<FirmaResponse>>(ENDPOINT, body).pipe(
            map(response => response),
            catchError(() => {
                const ERROR = new Error(`Error al firmar solicitud con ID ${idSolicitud}`);
                return throwError(() => ERROR);
            })
        );
    }

    /**
     * Valida la solicitud completa previo al guardado.
     * @returns Observable con la respuesta del servidor.
     */
    postValidarSolicitudCompleta(PAYLOAD: ValidarRequest): Observable<BaseResponse<ValidarSolicitudResponse>> {
        const ENDPOINT = `${this.host}${API_POST_VALIDAR_SOLICITUD_COMPLETA}`;
        return this.http.post<BaseResponse<ValidarSolicitudResponse>>(ENDPOINT, PAYLOAD);
    }
}