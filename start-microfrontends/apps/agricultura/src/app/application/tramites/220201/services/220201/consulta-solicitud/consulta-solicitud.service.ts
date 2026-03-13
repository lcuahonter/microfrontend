import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ENVIRONMENT } from "@libs/shared/data-access-user/src";

import { PrellenadoMovilizacion, PrellenadoPagoDerechos, PrellenadoSolicitud, PrellenadoTercerosRelacionados } from "../../../models/220201/prellenado-solicitud.model";

import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";

import { Observable } from "rxjs";

import {
    API_GET_CONSULTA_TRAMITE_DATOS_SOLICITUD,
    API_GET_CONSULTA_TRAMITE_MOVILIZACION,
    API_GET_CONSULTA_TRAMITE_PAGO_DERECHOS,
    API_GET_CONSULTA_TRAMITE_TERCEROS
} from '../../../../../core/server/api-router';
import { DatosParaMovilizacionNacional, PagoDeDerechos } from "../../../models/220201/capturar-solicitud.model";

@Injectable({
    providedIn: 'root'
})

export class ConsultaSolicitudService {
    /**
         * URL base del servidor al que se realizarán las solicitudes relacionadas con aduanas.
         * Esta variable almacena la dirección del host para los servicios compartidos de catálogos.
         * Es de solo lectura y se inicializa en el constructor del servicio.
         */
    host: string;

    constructor(
        private http: HttpClient
    ) {
        this.host = `${ENVIRONMENT.API_HOST}/api/`;
    }

    /**
     * Obtiene los datos de una solicitud específica para un trámite dado.
     *
     * @param tramite - Identificador numérico del trámite.
     * @param folio - Folio único de la solicitud.
     * @returns Un observable que emite la respuesta con los datos prellenados de la solicitud.
     */
    obtenTramiteDatosSolicitud(tramite: number, folio: string): Observable<BaseResponse<PrellenadoSolicitud>> {
        const ENDPOINT = `${this.host}${API_GET_CONSULTA_TRAMITE_DATOS_SOLICITUD(tramite.toString(), folio)}`;
        return this.http.get<BaseResponse<PrellenadoSolicitud>>(ENDPOINT);
    }

    /**
     * Obtiene los datos de un trámite de movilización basado en el número de trámite y el folio.
     * @param tramite - Número identificador del trámite.
     * @param folio - Folio asociado al trámite.
     * @returns Un observable con la respuesta que contiene los datos prellenados de la solicitud.
     */
    obtenTramiteMovilizacion(tramite: number, folio: string): Observable<BaseResponse<PrellenadoMovilizacion>> {
        const ENDPOINT = `${this.host}${API_GET_CONSULTA_TRAMITE_MOVILIZACION(tramite.toString(), folio)}`;
        return this.http.get<BaseResponse<PrellenadoMovilizacion>>(ENDPOINT);
    }

    /**
     * Obtiene los datos de terceros asociados a un trámite específico.
     * 
     * @param tramite - Identificador numérico del trámite.
     * @param folio - Folio único del trámite.
     * @returns Un observable con la respuesta que incluye los datos prellenados de la solicitud.
     */
    obtenTramiteDatosTerceros(tramite: number, folio: string): Observable<BaseResponse<PrellenadoTercerosRelacionados>> {
        const ENDPOINT = `${this.host}${API_GET_CONSULTA_TRAMITE_TERCEROS(tramite.toString(), folio)}`;
        return this.http.get<BaseResponse<PrellenadoTercerosRelacionados>>(ENDPOINT);
    }

    /**
     * Obtiene los datos de pago de derechos de un trámite específico.
     * 
     * @param tramite - Identificador numérico del trámite.
     * @param folio - Folio asociado al trámite.
     * @returns Un observable con la respuesta que contiene los datos prellenados de la solicitud.
     */
    obtenTramiteDatosPagoDerechos(tramite: number, folio: string): Observable<BaseResponse<PrellenadoPagoDerechos>> {
        const ENDPOINT = `${this.host}${API_GET_CONSULTA_TRAMITE_PAGO_DERECHOS(tramite.toString(), folio)}`;
        return this.http.get<BaseResponse<PrellenadoPagoDerechos>>(ENDPOINT);
    }    
}