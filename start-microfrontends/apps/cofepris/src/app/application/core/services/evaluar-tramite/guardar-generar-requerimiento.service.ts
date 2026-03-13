import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Observable } from 'rxjs';

import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';


import { API_POST_GUARDAR_REQUERIMIENTO, API_POST_GUARDAR_REQUERIMIENTO_MOSTRAR_FIRMA } from '@libs/shared/data-access-user/src';
import { GuardarGenerarRequerimientoRequest } from '../../models/evaluar/request/guardar-generar-requerimiento-request.model';
import { GuardarGenerarRequerimientoResponse } from '../../models/evaluar/response/guardar-generar-requerimiento-response-model';

import { MostrarFirmaGenerarRequerimiento } from '../../models/evaluar/request/mostrar-firmar-generar-requerimiento-request.model';
import { MostrarFirmarGenerarRequerimientoResponse } from '../../models/evaluar/response/mostrar-firmar-generar-requerimiento-response.model';

@Injectable({
    providedIn: 'root'
})
/**
 * Servicio encargado de guardar, generar y firmar requerimientos
 * asociados a un trámite específico dentro del sistema.
 */
export class GuardarGenerarRequerimientoService {

    /** URL base del API construida a partir del host configurado en el entorno. */
    private readonly host: string;

    /**
     * Inyecta el cliente HTTP para realizar solicitudes al backend y
     * construye la ruta base del servicio utilizando el ambiente configurado.
     * @param http Cliente HTTP de Angular para realizar peticiones a la API.
     */
    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api/`;
    }

    /**
     * Realiza la petición para guardar o generar un requerimiento.
     *
     * @param tramite ID del trámite al que pertenece el requerimiento.
     * @param numFolio Folio único del trámite.
     * @param PAYLOAD Objeto con los datos necesarios para generar el requerimiento.
     * @returns Observable con la respuesta del backend, incluyendo el ID del requerimiento creado.
     */
    postGuardarGenerarRequerimiento(
        tramite: number,
        numFolio: string,
        PAYLOAD: GuardarGenerarRequerimientoRequest
    ): Observable<BaseResponse<GuardarGenerarRequerimientoResponse>> {
        const ENDPOINT = `${this.host}${API_POST_GUARDAR_REQUERIMIENTO(tramite.toString(), numFolio)}`;
        return this.http.post<BaseResponse<GuardarGenerarRequerimientoResponse>>(ENDPOINT, PAYLOAD);
    }

    /**
     * Realiza la petición para mostrar y firmar el requerimiento generado.
     * Esta operación normalmente devuelve la información necesaria
     * para el proceso de firma digital.
     *
     * @param tramite ID del trámite al que está asociado el requerimiento.
     * @param numFolio Folio único del trámite.
     * @param PAYLOAD Datos necesarios para procesar la firma del requerimiento.
     * @returns Observable con la respuesta del backend que contiene datos de firma.
     */
    postFirmarMostrarGenerarRequerimiento(
        tramite: number,
        numFolio: string,
        PAYLOAD: MostrarFirmaGenerarRequerimiento
    ): Observable<BaseResponse<MostrarFirmarGenerarRequerimientoResponse>> {

        const ENDPOINT = `${this.host}${API_POST_GUARDAR_REQUERIMIENTO_MOSTRAR_FIRMA(tramite.toString(), numFolio)}`;

        return this.http.post<BaseResponse<MostrarFirmarGenerarRequerimientoResponse>>(ENDPOINT, PAYLOAD);
    }
}
