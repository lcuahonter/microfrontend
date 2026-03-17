import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { API_GET_DESCARGAR_ACUSE, COMUN_URL, DOCUMENTOMINIO, TRAMITE } from '../../servers/api-router';
import { Observable, map } from 'rxjs';
import { BaseResponse } from '../../models/shared/base-response.model';
import { DocumentoResponse } from '../../models/shared/documentos-request.model';


@Injectable({
  providedIn: 'root'
})
export class AcuseDetalleService {

  /**
   * URL base del servicio
   */
  private readonly host: string;

  /**
   * Constructor del servicio AcuseDetalleService
   * @param http HttpClient para realizar peticiones HTTP
   */
  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Consulta para base64 de descarga
   * @param tramite Número identificador del trámite
   * @param documentoMinio  Valor de descarga
   * @returns Observable con la respuesta del servidor
 */
  getDescargarAcuse(tramite: number, documentoMinio : string): Observable<BaseResponse<DocumentoResponse>> {
    const ENDPOINT = `${this.host}${API_GET_DESCARGAR_ACUSE.replace(TRAMITE, tramite.toString()).replace(DOCUMENTOMINIO, documentoMinio)}`;
    return this.http.get<BaseResponse<DocumentoResponse>>(ENDPOINT);
  }

  /**
    * Obtiene el procedimiento hijo basado en el procedimiento proporcionado.
   * @param procedure 
   * @returns Observable<number>
   */
  getChildProcedure(procedure: number): Observable<number> {
    return this.http.get<Array<{id: number, procedure: number, childProcedure: number}>>('assets/json/dependienteProcedureLista.json')
      .pipe(
        map((data) => {
          const FOUND = data.find(item => item.procedure === procedure);
          return FOUND ? FOUND.childProcedure : 0;
        })
      );
  }

}