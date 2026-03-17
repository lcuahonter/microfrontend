import { Observable, map } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { API_GET_CATALOGO_AREAS_SOLICITANTES, API_GET_CATALOGO_TIPOS_REQUERIMIENTO, Catalogo } from '@ng-mf/data-access-user';
import { ENVIRONMENT } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_GET_CATALOGO_ADUANAS } from '../../server/api-router';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  /**
   * URL base del servidor al que se realizarán las solicitudes relacionadas con aduanas.
   * Esta variable almacena la dirección del host para los servicios compartidos de catálogos.
   * Es de solo lectura y se inicializa en el constructor del servicio.
   */
  host: string;

  /**
   * Constructor del servicio que inicializa la URL base del host.
   * @param http Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Obtiene el catálogo de tipos requerimiento correspondiente a un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de aduanas.
   * @returns Un observable que emite la respuesta base con el arreglo de catálogos de aduanas.
   */
  obtieneCatalogoTiposRequerimiento(tramite: number):Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_TIPOS_REQUERIMIENTO(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

    /**
   * Obtiene el catálogo de aduanas correspondiente a un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de aduanas.
   * @returns Un observable que emite la respuesta base con el arreglo de catálogos de aduanas.
   */
  obtieneCatalogoAreasSolicitantes(tramite: number, folioTramite: string):Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_AREAS_SOLICITANTES(tramite.toString(), folioTramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }
  
}
