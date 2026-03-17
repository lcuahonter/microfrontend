import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, map } from 'rxjs';
import { CadenaOriginalRequest } from '@libs/shared/data-access-user/src/core/models/shared/cadena-original-request.model';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CatalogoDocumentosResponse } from "@libs/shared/data-access-user/src/core/models/shared/anexar-documentos.model";
import { DocumentosResponse } from "../../../shared/models/documentos-tramite.model";
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import {
  API_GET_DOCUMENTOS_OBLIGATORIOS,
  API_POST_CADENA_ORIGINAL,
  API_POST_FIRMA,
  API_GET_DETALLE_DOCUMENTOS
} from '../../../core/server/api-router';

@Injectable({
  providedIn: 'root',
})
export class DocumentosTramiteService {

      /** URL base host api */
      private readonly host: string;
    
      tramite: string;
    
      /**
       * Constructor del servicio.
       * @param http Cliente HTTP para realizar peticiones a archivos JSON.
       */
      constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api/`;
        this.tramite = '32501';
      }

      /**
       * Obtiene datos obligatorios del trámite
       * @param tramite 32501
       * @param params 
       * @returns 
       */  
      getDocumentosObligatorios(tramite: string, especifico: boolean): Observable<CatalogoDocumentosResponse> {
        
        const ENDPOINT = `${this.host}` + API_GET_DOCUMENTOS_OBLIGATORIOS(this.tramite);

        return this.http.get<CatalogoDocumentosResponse>(ENDPOINT, {
            params: {
                especifico: especifico,
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
   * Obtiene detalles de los documentos registrados.
   * @param idSolicitud Id de la solicitud
   * @returns Detalle de documentos
   */
  detalleDocumentos(idSolicitud: string): Observable<DocumentosResponse> {

    const ENDPOINT = `${this.host}` + API_GET_DETALLE_DOCUMENTOS(idSolicitud);
    
    return this.http.get<DocumentosResponse>(ENDPOINT)
        .pipe(
          map((response) => {          
            return response;
          }),
          catchError(() => {
            const ERROR = new Error(
              `Ocurrió un error al devolver la información de documentos cargados`
            );
            return throwError(() => ERROR);
          })
        );
    }


  /**
 * Obtiene la cadena original del trámite 32501.
 * @param body Objeto que contiene los datos necesarios para generar la cadena original.
 * @returns Un observable que emite la respuesta del servidor con la cadena original.
 */
  obtenerCadenaOriginal<T>(idSolicitud: string, body: CadenaOriginalRequest, procedure: number): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.host}` + API_POST_CADENA_ORIGINAL(idSolicitud, procedure);

    return this.http.post<BaseResponse<T>>(ENDPOINT, body).pipe(
      map((response) => response),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la cadena original en ${ENDPOINT}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
 * Envía una solicitud de firma electrónica.
 * @param idSolicitud - ID de la solicitud a firmar.
 * @param body - Cuerpo de la solicitud de firma.
 * @returns Observable con la respuesta del servidor.
 */
  enviarFirma<T>(idSolicitud: string | number, body: FirmarRequest, procedure: number): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.host}` + API_POST_FIRMA(String(idSolicitud,), procedure);
    return this.http.post<BaseResponse<T>>(ENDPOINT, body).pipe(
      map(response => response),
      catchError(() => {
        const ERROR = new Error(`Error al firmar solicitud con ID ${idSolicitud}`);
        return throwError(() => ERROR);
      })
    );
  }
}