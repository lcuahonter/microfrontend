import { API_GET_COMERCIALIZADORES_PRODUCTOS, API_POST_SOLICITUD_TRATADOS_CONFIGURACION } from "../server/api-router";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { ComercializadoresProductosResponse } from "../models/response/comercializadores-productos-response.model";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { HttpClient, HttpParams } from "@angular/common/http";
import { CriterioConfiguracionRequest } from "../models/request/tratado-configuracion-request.model";
import { CriterioConfiguracionResponse } from "../models/response/tratado-configuracion-response.model";

@Injectable({
    providedIn: 'root'
})

export class DatosMercanciaService {
    /**
       * URL base del servidor al que se realizarán las solicitudes relacionadas con el tramite 110102.
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
     * Busca productos de comercializadores elegibles.
     * @param cveRegistroProductor - Clave registro del productor.
     * @param rfcComercializador - RFC del comercializador.
     * @returns Observable con la respuesta del servidor que contiene los datos de la fracción o partida arancelaria
    */
    getComercializadoresProductos(cveRegistroProductor: string, rfcComercializador: string): Observable<BaseResponse<ComercializadoresProductosResponse>> {
        const ENDPOINT = `${this.host}${API_GET_COMERCIALIZADORES_PRODUCTOS}`;
        let PARAMS = new HttpParams();
        if (cveRegistroProductor !== null && cveRegistroProductor !== '') {
            PARAMS = PARAMS.set('cveRegistroProductor', String(cveRegistroProductor));
        }
        if (rfcComercializador !== null && rfcComercializador !== '') {
            PARAMS = PARAMS.set('rfcComercializador', String(rfcComercializador));
        }
        return this.http.get<BaseResponse<ComercializadoresProductosResponse>>(ENDPOINT, { params: PARAMS });
    }

    /**
      * Valida las configuraciones de acuerdo a los criterios y tratados.
      * 
      * @param PAYLOAD - Datos de validación de configuracion de criterios de tratado
      * @returns Observable con la respuesta de validación del servidor
    */
    postTratadoConfiguracion(PAYLOAD: CriterioConfiguracionRequest[]): Observable<BaseResponse<CriterioConfiguracionResponse>> {
        const ENDPOINT = `${this.host}${API_POST_SOLICITUD_TRATADOS_CONFIGURACION}`;
        return this.http.post<BaseResponse<CriterioConfiguracionResponse>>(ENDPOINT, PAYLOAD);
    }
}