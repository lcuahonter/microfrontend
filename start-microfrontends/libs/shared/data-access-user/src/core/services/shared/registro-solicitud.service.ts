
import { API_MOSTRAR_SOLICITUD, API_POST_PARCHE_PRELLENADAS, API_POST_SOLICITUD_GUARDAR, COMUN_URL, OPCIONES_PRELLENADO_SOLICITUD } from '../../servers/api-router';
import { BaseResponse } from '../../models/shared/base-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '../../models/shared/catalogos.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroSolicitudService {
  
  host: string;

  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }


  /*
   * Guarda los datos de la solicitud.
   * @param {number} tramite - El ID del trámite.
   * @param {any} payload - Los datos a guardar.
   * @returns {Observable<BaseResponse<any>>} - Observable con la respuesta del servidor.
   */

  postGuardarDatos<T>(tramite: string, payload: T): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.host}${API_POST_SOLICITUD_GUARDAR(tramite)}`;
    return this.http.post<BaseResponse<T>>(ENDPOINT, payload);
  }

  cargarOpcionesPrellenadoSolicitud<T>(tramite: number, rfc:string):Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.host}${OPCIONES_PRELLENADO_SOLICITUD(tramite, rfc)}`;
    return this.http.get<BaseResponse<T>>(ENDPOINT)
  }

  parcheOpcionesPrellenadas(tramite: number, idSolicitud: number): Observable<JSONResponse> {
    const ENDPOINT = `${this.host}${API_POST_PARCHE_PRELLENADAS(tramite, idSolicitud)}`;
    //const ENDPOINT = '/assets/json/260210/prellenadasDatos.json';
    return this.http.get<JSONResponse>(ENDPOINT);
  }

  mostarDatosSolicitud(tramite: number, idSolicitud: string): Observable<JSONResponse> {
    const ENDPOINT = `${this.host}${API_MOSTRAR_SOLICITUD(tramite, idSolicitud)}`;
    return this.http.get<JSONResponse>(ENDPOINT);
  }
  
}