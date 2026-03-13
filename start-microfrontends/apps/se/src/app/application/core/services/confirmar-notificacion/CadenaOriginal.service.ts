import { API_POST_CADENA_ORIGINAL, NUMFOLIOTRAMITE } from '../../../constantes/confirmar-notificacion/api-constantes';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { CadenaOriginalRequest } from '../../models/confirmar-notificacion/request/generar-cadena-original-request.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadenaOriginalService {

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
   * Envía una solicitud para generar la cadena original de un documento
   * @param numFolio - Número de folio asociado al trámite/documento
   * @param PAYLOAD - Datos requeridos para la generación de la cadena original
   * @returns Observable con la respuesta del servidor que incluye la cadena original generada
   */
  postCadenaOriginal(tramite: string, numFolio: string, PAYLOAD: CadenaOriginalRequest):
    Observable<BaseResponse<string>> {
    const ENDPOINT = `${this.host}${API_POST_CADENA_ORIGINAL(tramite, numFolio)}`;

    return this.http.post<BaseResponse<string>>(ENDPOINT, PAYLOAD);
  }
}
