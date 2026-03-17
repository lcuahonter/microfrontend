import {
  API_ELIMINAR_TRAMITE,
  API_GET_SOLICITUD,
  API_POST_ACTUALIZAR_SOLICITUD,
  API_POST_SOLICITUD,
  ENVIRONMENT,
} from '@libs/shared/data-access-user/src';
import {
  EliminaSolicitudResponse,
  SolicitudResult,
} from '../../../models/5701/solicitud-result.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { SolicitudPayload } from '../../../models/5701/solicitud-payload.model';
import { BaseResponse } from '../../../models/5701/base-response.model';
import { SolicitudDetalleModel } from '../../../../tramites/5701/models/response/solicitud-detalle.model';
import { SolicitudActualizarRequestModel } from '../../../../tramites/5701/models/request/solicitud-actualizar-request.model';

@Injectable({
  providedIn: 'root',
})

/**
 * Servicio para manejar las solicitudes del trámite 5701.
 */
export class GuardaSolicitudService {
  /**
   * URL base del API para las solicitudes.
   */
  private readonly host: string;

  /**
   * Constructor del servicio GuardaSolicitudService.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Método para guardar la solicitud a la base de datos.
   */
  postSolicitud(solicitud: SolicitudPayload): Observable<SolicitudResult> {
    const ENDPOINT = `${this.host}` + API_POST_SOLICITUD;

    return this.http.post<SolicitudResult>(ENDPOINT, solicitud).pipe(
      map((response) => {
        return response;
      }),
      catchError((httpError) => {
        if (httpError instanceof HttpErrorResponse) {
          return throwError(() => ({
            success: false,
            error: httpError.error,
          }));
        }
        const ERROR = new Error(
          `Ocurrió un error al guardar la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Método para obtener la solicitud de la base de datos.
   */
  getSolicitud(tramite: string, idSolicitud: string): Observable<BaseResponse<SolicitudDetalleModel>> {
    const ENDPOINT = `${this.host}` + API_GET_SOLICITUD(tramite, idSolicitud);

    return this.http.get<BaseResponse<SolicitudDetalleModel>>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError((httpError) => {
        if (httpError instanceof HttpErrorResponse) {
          return throwError(() => ({
            success: false,
            error: httpError.error,
          }));
        }
        const ERROR = new Error(
          `Ocurrió un error al guardar la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Método para actualizar la solicitud a la base de datos.
   */
  postActualizarSolicitud(tramite: string, idSolicitud: string, solicitud: SolicitudActualizarRequestModel ): Observable<any> {
    const ENDPOINT = `${this.host}` + API_POST_ACTUALIZAR_SOLICITUD(tramite, idSolicitud);
    return this.http.post<any>(ENDPOINT, solicitud).pipe(
      map((response) => {
        return response;
      }),
      catchError((httpError) => {
        if (httpError instanceof HttpErrorResponse) {
          return throwError(() => ({
            success: false,
            error: httpError.error,
          }));
        }
        const ERROR = new Error(
          `Ocurrió un error al guardar la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Método para eliminar la solicitud a la base de datos.
   */
  deleteSolicitud(id: number): Observable<EliminaSolicitudResponse> {
    const ENDPOINT = `${this.host}${API_ELIMINAR_TRAMITE.replace(
      '{idTramite}',
      id.toString()
    )}`;

    return this.http.delete<EliminaSolicitudResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError((httpError) => {
        if (httpError instanceof HttpErrorResponse) {
          return throwError(() => ({
            success: false,
            error: httpError.error,
          }));
        }
        const ERROR = new Error(
          `Ocurrió un error al eliminar la solicitud ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }
}
