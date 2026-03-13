import { API_GET_DOCUMENTOS_OBLIGATORIOS, API_GET_DOCUMENTOS_SOLICITUD, API_GET_LLENADO_DOCUMENTOS, API_POST_PRE_LLENADO_DOCUMENTOS, TRAMITE } from "../../../servers/api-router";
import { CatalogoDocumentosResponse, DocumentosLista, ParametrosGetDocumentos, PayloadConsultaDocumentosSolicitud } from "../../../models/shared/anexar-documentos.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, catchError, map, of, throwError } from "rxjs";
import { ENVIRONMENT } from "../../../../enviroments/enviroment";
import { Injectable } from "@angular/core";

import { BaseResponse } from "../../../models/5701/base-response.model";

@Injectable({
    providedIn: 'root',
})
export class CatalogoDocumentosService {
    private readonly host: string;
    constructor(
        private http: HttpClient,
    ) {
        this.host = `${ENVIRONMENT.API_HOST}/api`;
    }

    getDocumentosObligatorios(tramite: string, params: ParametrosGetDocumentos): Observable<CatalogoDocumentosResponse> {
        const ENDPOINT = `${this.host}/${API_GET_DOCUMENTOS_OBLIGATORIOS.replace(TRAMITE, tramite)}`;

        return this.http.get<CatalogoDocumentosResponse>(ENDPOINT, {
            params: {
                especifico: params.especifico,
            }
        }).pipe(
            map((response) => {
                return response;
            }),
            catchError(() => {
                const ERROR = new Error(`Ocurrió un error al devolver la información ${ENDPOINT} `);
                return throwError(() => ERROR);
            })
        )
    }

    /**
     * Obtiene los documentos de la solicitud 130118.
     * @param especifico Indica si se deben obtener documentos específicos.
     * @param idSolicitud ID de la solicitud (opcional).
     * @returns Observable con la respuesta del catálogo de documentos.
     */
    getDocumentosSolicitud(tramite: number, especifico: boolean, idSolicitud?: number): Observable<CatalogoDocumentosResponse> {
        let params = new HttpParams().set('especifico', String(especifico));

        if (idSolicitud) {
            params = params.set('idSolicitud', idSolicitud);
        }
        const ENDPOINT = `${this.host}/${API_GET_DOCUMENTOS_SOLICITUD(tramite.toString())}`;

        return this.http.get<CatalogoDocumentosResponse>(ENDPOINT, { params }).pipe(
            map((response) => response),
            catchError((error) => {
                console.error('Error en getDocumentosSolicitud:', error);
                return throwError(() => new Error('Error al obtener documentos'));
            })
        );
    }


    /**
     * Carga documentos prellenados para una solicitud específica.
     *
     * @param tramite - Identificador del trámite.
     * @param idsolicitud - ID de la solicitud.
     * @param payload - Datos para consulta de documentos.
     * @returns Observable con la respuesta de guardado.
     */
    recuperaDocumentosPrellenado(tramite: number, idsolicitud: string, especifico: boolean, payload: PayloadConsultaDocumentosSolicitud): Observable<BaseResponse<DocumentosLista>> {
        const ENDPOINT = `${this.host}/${API_POST_PRE_LLENADO_DOCUMENTOS(tramite.toString(), idsolicitud, especifico)}`;
        return this.http.post<BaseResponse<DocumentosLista>>(ENDPOINT, payload);
    }


    /**
     * Obtiene los documentos guardados asociados a un trámite y solicitud específicos.
     *
     * @param tramite - Identificador del trámite.
     * @param idSolicitud - Identificador de la solicitud.
     * @param especifico - Indica si se deben obtener documentos específicos.
     * @returns Un observable que emite una respuesta con la lista de documentos obtenidos.
     */
    obtenerDocumentosGuardados(tramite: number, idSolicitud: number, especifico: boolean): Observable<BaseResponse<DocumentosLista>> {
        const ENDPOINT = `${this.host}/${API_GET_LLENADO_DOCUMENTOS(tramite.toString(), idSolicitud.toString(), especifico)}`;
        return this.http.get<BaseResponse<DocumentosLista>>(ENDPOINT);
    }
}
