import {Observable, catchError, throwError } from 'rxjs';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
/**
 * Representa la estructura de una respuesta JSON.
 *
 * @interface JSONResponse
 *
 * @property {number} id - Identificador único de la respuesta.
 * @property {string} descripcion - Descripción asociada a la respuesta.
 * @property {string} codigo - Código relacionado con la respuesta.
 * @property {string} data - Información adicional en formato de cadena.
 */
export interface JSONResponse {
  id: number;
  descripcion: string;
  codigo: string;
  data: string;
}
 
@Injectable({
  providedIn: 'root',
})
 
export class TramiteFolioService {
  /**
   * La URL del servidor JSON auxiliar utilizado para manejar servicios extraordinarios.
   * Este valor se obtiene de la configuración del entorno.
   */
  urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;
 
  constructor(private http: HttpClient) {
    // El constructor está intencionalmente vacío para la inyección de dependencias
  }
 
  /**
   * @description Función para obtener el trámite
   * @param id
   * @returns JSONResponse
   */   
    public obtenerTramite(id: number): Observable<JSONResponse> {
      return this.http.get<JSONResponse>(`${this.urlServer}/${id}`).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }
}
 
 