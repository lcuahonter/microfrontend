import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { FirmarRequerimientoRequest } from '../../models/evaluar/request/firmar-requerimiento-request.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_POST_FIRMAR_REQUERIMIENTO, API_POST_OFICIO_REQUERIMIENTO, ENVIRONMENT } from '@libs/shared/data-access-user/src';

@Injectable({
  providedIn: 'root'
})
export class FirmarRequermientoService {

  /**
    * URL base del servidor al que se realizarán las solicitudes relacionadas con aduanas.
    * Esta variable almacena la dirección del host para los servicios compartidos de catálogos.
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
 * Envía la solicitud para firmar un requerimiento específico.
 *
 * @param tramite - Identificador del trámite asociado al requerimiento.
 * @param numFolio - Número de folio del trámite.
 * @param PAYLOAD - Objeto con la información de la firma digital y metadatos del usuario.
 * @returns Observable que emite la respuesta del servicio, sin datos adicionales (null) en el body.
 */
  postFirmarRequerimiento(tramite: number, numFolio: string, PAYLOAD: FirmarRequerimientoRequest):
    Observable<BaseResponse<null>> {
    const ENDPOINT = `${this.host}${API_POST_FIRMAR_REQUERIMIENTO(tramite.toString(), numFolio)}`;
    return this.http.post<BaseResponse<null>>(ENDPOINT, PAYLOAD);
  }

  /**
   * Guarda el oficio de un requerimiento específico.
   *
   * @param tramite - Identificador del trámite asociado al requerimiento.
   * @param idSolicitud - Identificador de la solicitud a guardar.
   * @returns Observable que emite la respuesta del servicio, sin datos adicionales (null) en el body.
   */
  postGuardarOficioRequerimiento(tramite: number, idSolicitud: string, ):
    Observable<BaseResponse<null>> {
    const ENDPOINT = `${this.host}${API_POST_OFICIO_REQUERIMIENTO(tramite.toString(), idSolicitud)}`;
    return this.http.post<BaseResponse<null>>(ENDPOINT, null);
  }
}
