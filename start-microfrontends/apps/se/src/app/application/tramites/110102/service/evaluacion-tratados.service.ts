import { API_GET_TRATADOS_EVALUAR} from "../server/api-router";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { EvaluarTratadosResponse } from "../models/response/tratados-evaluar-response.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class EvaluacionTratadosService {

  
  /**
     * URL base del servidor al que se realizarán las solicitudes relacionadas con el tramite 110102.
     * Esta variable almacena la dirección del host para los servicios tratados solicitud.
     * Es de solo lectura y se inicializa en el constructor del servicio.
     */
  private readonly host: string;

  /**
    * Constructor del servicio que inicializa la URL base del host.
    * @param http Instancia de HttpClient para realizar solicitudes HTTP.
    */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

/**
 * Obtiene la evaluación de tratados para una solicitud específica.
 *
 * Este método realiza una solicitud HTTP GET al endpoint correspondiente
 * y devuelve un observable con la respuesta de tipo `BaseResponse<EvaluarTratadosResponse[]>`.
 *
 * @param idSolicitud - Identificador de la solicitud para la cual se desea obtener la evaluación de tratados.
 * @returns Observable que emite la respuesta del servidor con los datos de evaluación de tratados.
 */
  getEvaluarTratados(idSolicitud: string): Observable<BaseResponse<EvaluarTratadosResponse[]>> {
    const ENDPOINT = `${this.host}${API_GET_TRATADOS_EVALUAR(idSolicitud)}`;
    return this.http.get<BaseResponse<EvaluarTratadosResponse[]>>(ENDPOINT);
  }
}