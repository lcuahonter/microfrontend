import { API_POST_FILTRAR_TERRESTRE } from './api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { BodyTerrestre } from './model/resquest/body-request';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TerrestreService {
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  private readonly host: string;

  /**
   * Obtiene los registros de CAAT terrestre basados en los filtros proporcionados.
   * ENDPOINT
   * retorna un observable con la respuesta del servidor.
   * @param pag 
   * @param elementosPagina 
   * @returns 
   */
  getRegistrosByFiltros<T>(pag: number, elementosPagina: number, body: BodyTerrestre): Observable<BaseResponse<T>> {
    const ENDPOINT = API_POST_FILTRAR_TERRESTRE(pag, elementosPagina);
    return this.http.post<BaseResponse<T>>(`${this.host}${ENDPOINT}`, body);
  }
}