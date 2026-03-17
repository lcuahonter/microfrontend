import { API_POST_FIRMA, NUMFOLIOTRAMITE } from '../../../constantes/confirmar-notificacion/api-constantes';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { FirmaConfirmarResponse } from '../../models/confirmar-notificacion/response/confirmar-notificacion-response.model';
import { FirmaRequest } from '../../models/confirmar-notificacion/request/firma-request.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirmaService {

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
   * Envía una solicitud de firma electrónica al servidor
   * 
   * @param numFolio - Número de folio único asociado al trámite
   * @param PAYLOAD - Datos requeridos para generar la firma electrónica
   * @returns Observable que emite la respuesta del servidor con el resultado de la firma
   */
  postFirma(tramite: string, numFolio: string, PAYLOAD: FirmaRequest):
    Observable<BaseResponse<FirmaConfirmarResponse>> {
    const ENDPOINT = `${this.host}${API_POST_FIRMA(tramite, numFolio)}`;

    return this.http.post<BaseResponse<FirmaConfirmarResponse>>(ENDPOINT, PAYLOAD);
  }
}
