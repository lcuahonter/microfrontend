import { API_GET_SECTOR_CATALOGO } from './model/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SectorCatalog } from './model/common.model';

@Injectable({
  providedIn: 'root'
})
export class SectorCatalogoService {
  /**
   * URL del servidor donde se encuentra la API.
   */
  urlServer = ENVIRONMENT.API_HOST;

  constructor(private http: HttpClient) {}
  /**
   * Obtiene el catálogo de sectores.
   * @returns Observable con el catálogo de sectores.
   */
  getCatalogo(): Observable<BaseResponse<SectorCatalog[]>> {
    const URL = `${this.urlServer}${API_GET_SECTOR_CATALOGO}`;
    return this.http.get<BaseResponse<SectorCatalog[]>>(URL);
  }
}
