import { API_POST_GUARDAR_ACUSE, API_POST_VISTA_PREVIA, COMUN_URL } from '../../servers/api-router';
import { Observable, catchError, throwError } from 'rxjs';
import { BaseResponse } from '../../models/shared/base-response.model';
import { DocumentoResponse } from '../../models/shared/documentos-request.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AcusesService {

  /**
    * URL base del servicio
    */
   private readonly host: string;
 
   /**
    * Constructor del servicio DocumentosService
    * @param http HttpClient para realizar peticiones HTTP
    */
   constructor(private http: HttpClient) {
     this.host = `${COMUN_URL.BASE_URL}`;
   }
 
   /**
    * Guarda el acuse de la solicitud
    * @param idSolicitud Identificador de la solicitud
    * @returns Observable con la respuesta del servidor
    */
   guardarAcuse(idSolicitud: string, procedure: number): Observable<BaseResponse<null>> {
     const ENDPOINT = `${this.host}` + API_POST_GUARDAR_ACUSE(idSolicitud, procedure);
 
     return this.http.post<BaseResponse<null>>(ENDPOINT, null).pipe(
       catchError(() => {
         const ERROR = new Error(`Error al obtener la cadena original en ${ENDPOINT}`);
         return throwError(() => ERROR);
       })
     );
   }
 
   /**
    * Obtiene la vista previa del documento asociado a la solicitud
    * @param idSolicitud Identificador de la solicitud
    * @returns Observable con la respuesta del servidor que contiene el documento
    */
   vistaPrevia(idSolicitud: string, procedure: number): Observable<BaseResponse<DocumentoResponse>> {
     const ENDPOINT = `${this.host}` + API_POST_VISTA_PREVIA(idSolicitud, procedure);
 
     return this.http.post<BaseResponse<DocumentoResponse>>(ENDPOINT, null).pipe(
       catchError(() => {
         const ERROR = new Error(`Error al obtener la cadena original en ${ENDPOINT}`);
         return throwError(() => ERROR);
       })
     );
   }

}
