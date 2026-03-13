import { API_GET_DATOS_SOLICITANTE, API_GET_IDC_CONTRIBUYENTE, COMUN_URL } from '../../../servers/api-router';
import { Observable, catchError, throwError } from 'rxjs';
import { DatosGeneralesModel } from '../../../models/datos-generales.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '../../../models/shared/catalogos.model';
import { RFC_GENERICO } from '../../../constants/constantes-generales';
import { SolicitanteEvaluarResponse } from '../../../models/datos-solicitante-evaluar.model';

import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

import { BaseResponse } from '../../../models/shared/base-response.model';
@Injectable({
  providedIn: 'root',
})
export class SolicitanteService {
  host: string;
  /**
   * Almacena el estado seleccionado del solicitante.
   * Se utiliza para validar que el estado corresponda a una planta registrada o domicilio fiscal.
   */
  public estado: any;
  /**
   * Almacena el catálogo de entidades federativas seleccionadas o disponibles para el solicitante.
   * Se utiliza para validar o mostrar las opciones de entidad federativa en el formulario.
   */
  public catalogoEntidad: any;
  constructor(private http: HttpClient) {
    // Lógica de inicialización si es necesario
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  urlServer = 'https://dev.v30.ultrasist.net/api/json-auxiliar';
  urlServerTest = ENVIRONMENT.API_HOST;
  
  /**
   * Obtiene los datos generales de un contribuyente desde la API.
   * @param {string} rfc - RFC del contribuyente para realizar la consulta.
   * @returns {Observable<DatosGeneralesModel>} - Observable con la respuesta de la API.
   */
  getDatosGeneralesAPI(rfc: string): Observable<DatosGeneralesModel> {
    const ENDPOINT =
      `${this.host}` + API_GET_IDC_CONTRIBUYENTE.replace(RFC_GENERICO, rfc);
    return this.http.get<DatosGeneralesModel>(`${ENDPOINT}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los datos Generales del Usuario de una API
   * @param {id} - Id del json auxiliar que trae los datos generales del usuario
   * @returns {Observable<JSONResponse>} - Respuesta de la API de tipo observable de tipo JSONResponse.
   */
  getDatosGenerales(id: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${this.urlServer}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Consulta los datos del solicitante y la información relacionada con un trámite.
   *
   * @param idSolicitud Identificador único de la solicitud a consultar.
   * @returns Observable que emite un objeto `BaseResponse<SolicitanteEvaluarResponse>`
   *          con los datos del solicitante, del trámite, domicilio y personas de notificación.
   */
  getSolicitanteEvaluar(tramite: string,idSolicitud: string): Observable<BaseResponse<SolicitanteEvaluarResponse>> {
    const ENDPOINT = `${this.host}${API_GET_DATOS_SOLICITANTE(tramite,idSolicitud)}`;
    return this.http.get<BaseResponse<SolicitanteEvaluarResponse>>(ENDPOINT);
  }

}
