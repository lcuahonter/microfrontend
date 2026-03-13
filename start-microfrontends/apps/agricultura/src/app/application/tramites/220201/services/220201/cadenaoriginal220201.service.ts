
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map, throwError } from 'rxjs';
import { API_POST_CADENA_ORIGINAL } from '../../../../core/server/api-router';

@Injectable({
    providedIn: 'root'
})
export class CadenaOriginal220201Service {

    /**
       * URL del servidor donde se encuentra la API.
       */
    urlServer = ENVIRONMENT.API_HOST;

    constructor(private http: HttpClient) { }

    /**
     * Obtiene la cadena original del trámite 130118.
     * @param body Objeto que contiene los datos necesarios para generar la cadena original.
     * @returns Un observable que emite la respuesta del servidor con la cadena original.
     */
    obtenerCadenaOriginal<T>(idSolicitud: string, body: unknown): Observable<BaseResponse<T>> {
        const ENDPOINT = `${this.urlServer}/api/` + API_POST_CADENA_ORIGINAL('220201', idSolicitud);

        return this.http.post<BaseResponse<T>>(ENDPOINT, body).pipe(
            map((response) => response),
            catchError(() => {
                const ERROR = new Error(`Error al obtener la cadena original en ${ENDPOINT}`);
                return throwError(() => ERROR);
            })
        );
    }


}
