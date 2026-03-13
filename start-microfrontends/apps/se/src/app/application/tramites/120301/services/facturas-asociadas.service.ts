import { API_DELETE_FACTURAS_TPL, API_DELETE_FACTURAS_TPL_ELIMINAR, API_GET_FACTURAS_TPL, API_GET_FACTURAS_TPL_ALL, API_GET_FACTURAS_TPL_ASOCIADAS, API_GET_FACTURAS_TPL_TOTAL_UNIDAD, API_POST_FACTURAS_TPL_AGREGAR, API_POST_FACTURAS_TPL_ASOCIAR, IDEXPEDICION } from '../server/api-router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { FacturaTotalUnidadResponse } from '../models/response/facturas-tpl-unidad-total-response.model';
import { FacturaTplAsociadaResponse } from '../models/response/facturas-tpl-asociada-response.model';
import { FacturaTplCapturaRequest } from '../models/request/facturas-tpl-captura-requet.model';
import { FacturasTplAsociadasRequest } from '../models/request/facturas-tpl-asociadas-request.model';
import { FacturasTplCapturaResponse } from '../models/response/facturas-tpl-captura-response.model';
import { FacturasTplEliminarRequest } from '../models/request/facturas-tpl-eliminar-request.model';
import { FacturasTplResponse } from '../models/response/facturas-tpl-response.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FacturasAsociadasService {

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
    * Obtiene las facturas TPL.
    * 
    * @param rfc RFC del contribuyente.
    * @param idExpedicion ID de la expedición.
    * @param tipoRegimen Tipo de régimen (ej. "REG.02").
    * @param page Número de página (por defecto 0).
    * @param size Tamaño de página (por defecto 1).
    * @param sort Criterio de ordenamiento.
    * @returns Observable con la respuesta del servidor.
   */
  getFacturasTpl(
    rfc: string,
    idExpedicion: number,
    tipoRegimen: string,
    page: number = 0,
    size: number = 10,
    sort: string = 'asc'
  ): Observable<BaseResponse<FacturasTplResponse>> {
    const ENDPOINT = `${this.host}${API_GET_FACTURAS_TPL}`;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const params = new HttpParams()
      .set('rfc', rfc)
      .set('idExpedicion', idExpedicion.toString())
      .set('tipoRegimen', tipoRegimen)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<BaseResponse<FacturasTplResponse>>(ENDPOINT, { params });
  }

  /**
   * Asocia facturas TPL.
   *
   * @param PAYLOAD Objeto que contiene los datos necesarios para asociar facturas TPL.
   * @returns Observable que emite la respuesta del servidor con el resultado de la operación.
   */
  postFacturasAsociar(PAYLOAD: FacturasTplAsociadasRequest): Observable<BaseResponse<null>> {
    const ENDPOINT = `${this.host}` + API_POST_FACTURAS_TPL_ASOCIAR;
    return this.http.post<BaseResponse<null>>(ENDPOINT, PAYLOAD);
  }

  /**
   * Consulta de facturas TPL asociadas a una expedición del trámite 120301.
   * 
   * @param idExpedicion Id de expedicion.
   * @param page Número de página para paginación (por defecto 0).
   * @param size Cantidad de elementos por página (por defecto 10).
   * @returns Observable con la respuesta del servidor.
   */
  getFacturasTplAsociadas(
    idExpedicion: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'asc'): Observable<BaseResponse<FacturaTplAsociadaResponse>> {
    const ENDPOINT = `${this.host}${API_GET_FACTURAS_TPL_ASOCIADAS.replace(IDEXPEDICION, idExpedicion.toString())}`;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get<BaseResponse<FacturaTplAsociadaResponse>>(ENDPOINT, { params });
  }

  /**
   * Obtiene el total de unidades por factura TPL para una expedición.
   * 
   * @param idExpedicion Identificador único de la expedición.
   * @returns Observable con la respuesta del servidor que incluye 
   *          el total de unidades agrupadas por factura.
   */
  getFacturaTplTotalUnida(idExpedicion: number): Observable<BaseResponse<FacturaTotalUnidadResponse>> {
    const ENDPOINT = `${this.host}${API_GET_FACTURAS_TPL_TOTAL_UNIDAD.replace(IDEXPEDICION, idExpedicion.toString())}`;
    return this.http.get<BaseResponse<FacturaTotalUnidadResponse>>(ENDPOINT);
  }

  /**
   * Elimina una o más facturas TPL asociadas a una expedición.
   * 
   * @param PAYLOAD Arreglo de objetos con los identificadores de las facturas a eliminar.
   * @returns Observable con la respuesta del servidor que incluye 
   *          el resultado de la operación de eliminación.
 */
  deleteFacturaTpl(PAYLOAD: FacturasTplEliminarRequest[]): Observable<BaseResponse<FacturaTplAsociadaResponse>> {
    const ENDPOINT = `${this.host}` + API_DELETE_FACTURAS_TPL_ELIMINAR;
    return this.http.request<BaseResponse<FacturaTplAsociadaResponse>>('delete', ENDPOINT, {
      body: PAYLOAD
    });
  }

  /**
   * Obtiene todas las facturas TPL para una expedición específica.
   * 
   * @param rfc rfc del contribuyente.
   * @param idExpedicion id de la expedición.
   * @param tipoRegimen tipo de régimen fiscal.
   * @returns Observable con la respuesta del servidor.
   */
  getFacturasTplAll(
    rfc: string,
    idExpedicion: number = 341489,
    tipoRegimen: string = 'REG.02'
  ): Observable<BaseResponse<FacturasTplCapturaResponse[]>> {
    const ENDPOINT = `${this.host}${API_GET_FACTURAS_TPL_ALL}`;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const params = new HttpParams()
      .set('rfc', rfc)
      .set('idExpedicion', idExpedicion.toString())
      .set('tipoRegimen', tipoRegimen);
    return this.http.get<BaseResponse<FacturasTplCapturaResponse[]>>(ENDPOINT, { params }).pipe(
      map((resp: BaseResponse<FacturasTplCapturaResponse[]>) => {
        const RAW_DATA = Array.isArray(resp.datos) ? resp.datos : [];
        const FACTURAS: FacturasTplCapturaResponse[] = (RAW_DATA ?? []).map((item: FacturasTplCapturaResponse) => ({
          cantidad: item.cantidad,
          cantidad_devolucion: item.cantidad_devolucion,
          cantidad_disponible: item.cantidad_disponible,
          cantidad_total: item.cantidad_total,
          descripcion: item.descripcion,
          direccion_consig_emisor: item.direccion_consig_emisor,
          fecha_expedicion: item.fecha_expedicion,
          id_factura_expedicion: item.id_factura_expedicion,
          imp_dls: item.imp_dls,
          num_factura: item.num_factura,
          razon_social_consig_emisor: item.razon_social_consig_emisor,
          suma_cantidad_devolucion: item.suma_cantidad_devolucion,
          pais_consig_emisor: item.pais_consig_emisor,
          cp_consig_emisor: item.cp_consig_emisor,
          ciudad_consig_emisor: item.ciudad_consig_emisor,
          tax_id_consig_emisor: item.tax_id_consig_emisor
        }));
        const BASERESPONSE: BaseResponse<FacturasTplCapturaResponse[]> = {
          codigo: resp.codigo ?? '200',
          mensaje: resp.mensaje ?? 'Consulta exitosa',
          path: resp.path ?? ENDPOINT,
          timestamp: resp.timestamp ?? new Date().toISOString(),
          datos: FACTURAS,
          error: resp.error,
          causa: resp.causa,
          detalle_errores: resp.detalle_errores,
          errores_modelo: resp.errores_modelo
        };
        return BASERESPONSE;
      })
    );
  }

  /**
   * Agrega una factura TPL a una solicitud específica.
   * 
   * @param idSolicitud Identificador único de la solicitud.
   * @param body Objeto que contiene los datos de la factura a agregar.
   * @returns Observable con la respuesta del servidor que indica el resultado de la operación.
   */
  postFacturasTplAgregar(idSolicitud: number, body: FacturaTplCapturaRequest): Observable<BaseResponse<null>> {
    const ENDPOINT = `${this.host}` + API_POST_FACTURAS_TPL_AGREGAR(idSolicitud.toString());
    return this.http.post<BaseResponse<null>>(ENDPOINT, body);
  }

  /**
   * Elimina una factura TPL específica.
   * 
   * @param id_factura Identificador único de la factura a eliminar.
   * @returns Observable con la respuesta del servidor que indica el resultado de la operación.
   */
  deleteFactura(id_factura: number): Observable<BaseResponse<void>> {
    const ENDPOINT = `${this.host}${API_DELETE_FACTURAS_TPL(id_factura.toString())}`;
    return this.http.delete<BaseResponse<void>>(ENDPOINT);
  }

}

