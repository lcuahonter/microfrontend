import { API_GET_PROTESTO_EVALUAR } from "../server/api-router";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { DeclaracionResponse } from "../models/response/protesto-evaluar-response.model";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ProtestoEvaluacionService {  
    /**
       * URL base del servidor al que se realizarán las solicitudes relacionadas con el tramite 110101.
       * Esta variable almacena la dirección del host para los servicios tratados solicitud.
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
     * Obtiene la declaración de protesta de decir la verdad para una solicitud específica.
     *
     * Construye la URL del endpoint usando el ID de la solicitud y realiza una solicitud GET
     * al servidor para obtener la información de la declaración.
     *
     * Se espera que el servidor devuelva un `Observable` con la respuesta envuelta en
     * `BaseResponse<DeclaracionResponse>`.
     *
     * @param idSolicitud - Identificador único de la solicitud.
     * @returns {Observable<BaseResponse<DeclaracionResponse>>} Observable con la declaración de protesta.
    */
    getProtestoEvaluacion(idSolicitud : string): Observable<BaseResponse<DeclaracionResponse[]>> {
        const ENDPOINT = `${this.host}${API_GET_PROTESTO_EVALUAR(idSolicitud)}`;
        return this.http.get<BaseResponse<DeclaracionResponse[]>>(ENDPOINT);
    }
    
}