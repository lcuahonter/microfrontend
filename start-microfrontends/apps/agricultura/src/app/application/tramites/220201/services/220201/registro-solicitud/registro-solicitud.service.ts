import {
    API_GET_SOLICITUDES_FRACCION_ARANCELARIA_DESCRIPCION,
    API_GET_SOLICITUDES_GUARDADO_PARCIAL,
    API_GET_SOLICITUDES_NICO_DESCRIPCION,
    API_GET_SOLICITUDES_RECENTES,
    API_GET_SOLICITUDES_UNIDAD_MEDIDA,
    API_POST_GUARDAR,
} from '../../../../../core/server/api-router';
import { Catalogo, ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { FraccionArancelariaDecripcionModel, SolicitudData } from '../../../models/220201/capturar-solicitud.model';
import { GuardaSolicitud, RespuestaGuardarSolicitud } from '../../../models/220201/guardar-solicitud.model';
import { Observable, map } from "rxjs";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})

export class RegistroSolicitudService {
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
     * Obtiene los datos de la solicitud para un trámite específico y un RFC dado.
     *
     * @param tramite - El identificador numérico del trámite.
     * @param rfc - El RFC asociado a la solicitud.
     * @returns Un observable que emite la respuesta base con un arreglo de catálogos relacionados a la solicitud.
     */
    obtieneDatosDeLaSolicitud(tramite: number, rfc: string): Observable<BaseResponse<SolicitudData[]>> {
        const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_RECENTES(tramite.toString(), rfc)}`;
        return this.http.get<BaseResponse<SolicitudData[]>>(ENDPOINT).pipe(
            // Transformar la respuesta para formatear la fechaCreacion
            map(response => {
                if (response.datos) {
                    response.datos = response.datos.map(item => ({
                        ...item
                    }));
                }
                return response;
            })
        );
    }

    /**
     * Obtiene la descripción de la fracción arancelaria para un trámite y clave de fracción dados.
     *
     * @param tramite - El identificador numérico del trámite.
     * @param cveFraccion - La clave de la fracción arancelaria.
     * @returns Un observable con la respuesta base que contiene un arreglo de catálogos.
     */
    obtieneFraccionArancelariaDescripcion(tramite: number, cveFraccion: string): Observable<BaseResponse<FraccionArancelariaDecripcionModel>> {
        const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_FRACCION_ARANCELARIA_DESCRIPCION(tramite.toString(), cveFraccion)}`;
        return this.http.get<BaseResponse<FraccionArancelariaDecripcionModel>>(ENDPOINT);
    }


    /**
     * Obtiene la descripción del NICO (Número de Identificación Comercial) para un trámite y clave de fracción dados.
     *
     * @param tramite - El identificador numérico del trámite.
     * @param cveFraccion - La clave de la fracción arancelaria.
     * @returns Un observable con la respuesta base que contiene la descripción del NICO.
     */
    obtieneNicoDescripcion(tramite: number, cveFraccion: string, cveNico: string): Observable<BaseResponse<Catalogo>> {
        const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_NICO_DESCRIPCION(tramite.toString(), cveFraccion, cveNico)}`;
        return this.http.get<BaseResponse<Catalogo>>(ENDPOINT);
    }

    /**
     * Obtiene la unidad de medida asociada a un trámite y fracción específica.
     *
     * @param tramite - El identificador numérico del trámite.
     * @param cveFraccion - La clave de la fracción para la cual se solicita la unidad de medida.
     * @returns Un observable que emite la respuesta base con el catálogo de unidades de medida.
     */
    obtieneUnidadMedida(tramite: number, cveFraccion: string): Observable<BaseResponse<Catalogo>> {
        const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_UNIDAD_MEDIDA(tramite.toString(), cveFraccion)}`;
        return this.http.get<BaseResponse<Catalogo>>(ENDPOINT);
    }

    /**
     * Guarda una solicitud parcial para el trámite especificado.
     *
     * @param tramite - El identificador del trámite para el cual se guarda la solicitud.
     * @param solicitud - Los datos de la solicitud que se guardarán.
     * @returns Un observable que emite la respuesta que contiene los datos de la solicitud guardada.
     */
    guardaSolicitudParcial(tramite: number, solicitud: GuardaSolicitud): Observable<BaseResponse<SolicitudData>> {
        const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_GUARDADO_PARCIAL(tramite.toString())}`;
        return this.http.post<BaseResponse<SolicitudData>>(ENDPOINT, solicitud);
    }

    /**
     * Guarda una solicitud en el sistema.
     *
     * @param tramite - Identificador numérico del trámite.
     * @param payload - Datos de la solicitud a guardar.
     * @returns Un observable que emite la respuesta base con los datos de la solicitud.
     */
    guardarSolicitud(tramite: number, payload: GuardaSolicitud): Observable<BaseResponse<RespuestaGuardarSolicitud>> {
        const ENDPOINT = `${this.host}${API_POST_GUARDAR(tramite.toString())}`;
        return this.http.post<BaseResponse<RespuestaGuardarSolicitud>>(ENDPOINT, payload);
    }
    
    }