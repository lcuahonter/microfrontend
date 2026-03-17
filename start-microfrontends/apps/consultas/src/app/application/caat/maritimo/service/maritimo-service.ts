import { API_POST_FILTRAR_MARITIMO } from './api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MaritimoBody } from './model/resquest/bodyMaritimo';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MaritimoService {
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  private readonly host: string;

  /**
   * Recupera registros marítimos según los filtros y parámetros de paginación proporcionados.
   *
   * @template T - El tipo de registros que se devolverán.
   * @param pag - El número de página actual para la paginación.
   * @param itemsPerPage - El número de elementos a mostrar por página.
   * @param body - Los criterios de filtro para consultar registros marítimos.
   * @returns Un Observable que emite una BaseResponse que contiene los registros filtrados de tipo T.
   */
  getRegistrosByFiltros<T>(pag: number, itemsPerPage: number, body?: MaritimoBody): Observable<BaseResponse<T>> {
    const ENDPOINT = API_POST_FILTRAR_MARITIMO(pag, itemsPerPage);
    return this.http.post<BaseResponse<T>>(`${this.host}${ENDPOINT}`, body ?? {});

  }

}