import { Observable, catchError, throwError } from "rxjs";
import { BodyConsultaTramite } from "../../core/models/tramites/se/request/bodyRequest";
import { BusquedaTramiteResponse } from "../../core/models/tramites/se/response/busquedaResponse";
import { ConsultaTramiteresponse } from "../../core/models/tramites/se/response/consultaTramiteRespose";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ConsultasSeService {
  /**
   * URL base del servidor configurado en los environments.
   * Se utiliza como prefijo para todas las peticiones del módulo.
   */
  private readonly host: string;
  /**
   * Constructor del servicio.
   *
   * @param http - Servicio HttpClient utilizado para realizar
   * peticiones HTTP.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api`;
  }

  obtenerTramites(): Observable<BusquedaTramiteResponse> {
    return this.http
      .get<BusquedaTramiteResponse>(
        `/assets/json/consultas/tramites/se/busqueda-consulta.json`
      )
  }

  obtenerDetallesTramite(body: BodyConsultaTramite): Observable<ConsultaTramiteresponse> {
    const URL = `${this.host}/bandeja-tarea/tramite/${body.folio}/consulta`;
    return this.http.post<ConsultaTramiteresponse>(URL, body).pipe(
      catchError(error => {
        const ERROR = {
          status: error.status,
          message: error.error?.message || error.message || 'Error desconocido',
          raw: error
        };
        return throwError(() => ERROR);
      })
    );
  }
}