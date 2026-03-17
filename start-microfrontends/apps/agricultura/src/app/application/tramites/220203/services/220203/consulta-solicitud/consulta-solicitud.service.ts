import {
  API_GET_CONSULTA_MOVILIZACION_NACIONAL,
  API_GET_CONSULTA_PAGO_DERECHOS,
  API_GET_CONSULTA_SOLICITUD,
  API_GET_CONSULTA_TERCEROS_RELACIONADOS,
} from '../../../../220203/server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ConsultaSolicitudResponse } from '../../../models/220203/response/consultar-solicitud-response.model';
import { ConsultarMovilizacionResponse } from '../../../models/220203/response/consultar-movilizacion-response.model';
import { ConsultarPagoDerechosResponse } from '../../../models/220203/response/consultar-pago-derechos-response.model';
import {
  ConsultarTercerosRelacionadosResponse
} from '../../../models/220203/response/consultar-terceros-relacionados-response.model';
import { ENVIRONMENT } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaSolicitudService {

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
    this.host = `${ENVIRONMENT.API_HOST}/api/`
  }

  /**
   * Método para consultar el detalle de la pestaña datos de la solicitud mediante un numero de folio.
   * @param tramite - Identificador del trámite asociado al requerimiento.
   * @param numFolio Número de folio del trámite a consultar.
   * @returns Observable que emite la respuesta de la consulta.
   */
  getDetalleSolicitud(tramite: number,numFolio: string): Observable<BaseResponse<ConsultaSolicitudResponse>> {
    const ENDPOINT = `${this.host}${API_GET_CONSULTA_SOLICITUD(tramite.toString(), numFolio)}`;
    return this.http.get<BaseResponse<ConsultaSolicitudResponse>>(ENDPOINT);
  }

  /**
   * Método para consultar el detalle de la pestaña movilizacion navional mediante un numero de folio.
   * @param tramite - Identificador del trámite asociado al requerimiento.
   * @param numFolio Número de folio del trámite a consultar.
   * @returns Observable que emite la respuesta de la consulta.
   */
  getDetalleMovilizacion(tramite: number,numFolio: string): Observable<BaseResponse<ConsultarMovilizacionResponse>> {
    const ENDPOINT = `${this.host}${API_GET_CONSULTA_MOVILIZACION_NACIONAL(tramite.toString(), numFolio)}`;
    return this.http.get<BaseResponse<ConsultarMovilizacionResponse>>(ENDPOINT);
  }

  /**
   * Método para consultar el detalle de la pestaña terceros relacionados mediante un numero de folio.
   * @param tramite - Identificador del trámite asociado al requerimiento.
   * @param numFolio Número de folio del trámite a consultar.
   * @returns Observable que emite la respuesta de la consulta.
   */
  getDetalleTercerosRelacionados(tramite: number,numFolio: string): Observable<BaseResponse<ConsultarTercerosRelacionadosResponse>> {
    const ENDPOINT = `${this.host}${API_GET_CONSULTA_TERCEROS_RELACIONADOS(tramite.toString(), numFolio)}`;
    return this.http.get<BaseResponse<ConsultarTercerosRelacionadosResponse>>(ENDPOINT);
  }

  /**
   * Método para consultar el detalle de la pestaña pago de derechos mediante un numero de folio.
   * @param tramite - Identificador del trámite asociado al requerimiento.
   * @param numFolio Número de folio del trámite a consultar.
   * @returns Observable que emite la respuesta de la consulta.
   */
  getDetallePagoDerechos(tramite: number,numFolio: string): Observable<BaseResponse<ConsultarPagoDerechosResponse>> {
    const ENDPOINT = `${this.host}${API_GET_CONSULTA_PAGO_DERECHOS(tramite.toString(), numFolio)}`;
    return this.http.get<BaseResponse<ConsultarPagoDerechosResponse>>(ENDPOINT);
  }
}
