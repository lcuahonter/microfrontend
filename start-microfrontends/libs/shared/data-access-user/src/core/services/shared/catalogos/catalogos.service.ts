import {
  CatalogoPaises,
  CatalogoResponse,
  JSONResponse,
  RespuestaCatalogos,
} from '../../../models/shared/catalogos.model';
import { ENVIRONMENT } from '../../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  urlServer = ENVIRONMENT.URL_SERVER;
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(private http: HttpClient) 
  { }

  /**
   * Obtiene un catálogo desde el servidor.
   * @param catalogo - Nombre del catálogo a obtener.
   * @returns Observable con la lista de respuestas del catálogo.
   */
  getCatalogo(catalogo: string): Observable<CatalogoResponse[]> {
    const URL = `${this.urlServer}/${catalogo}`;
    return this.http.get<CatalogoResponse[]>(URL);
  }

  /**
   * Obtiene los datos de un catálogo específico desde el servidor.
   * @param catalogo - Nombre del catálogo a consultar.
   * @returns Observable que emite la respuesta del catálogo solicitado.
   */
  getCatalogos(catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.urlServer}/${catalogo}`);
  }

  /**
   * Obtiene un catálogo de países desde el servidor.
   * @param catalogo - Nombre del catálogo de países a obtener.
   * @returns Observable con la lista de países del catálogo.
   */
  getCatalogoPaises(catalogo: string): Observable<CatalogoPaises[]> {
    return this.http.get<CatalogoPaises[]>(`${this.urlServer}/${catalogo}`);
  }

  /**
   * Obtiene un catálogo específico por su ID desde el servidor.
   * @param id - ID del catálogo a obtener.
   * @returns Observable con la respuesta del catálogo solicitado.
   */
  getCatalogoById(id: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${this.urlServerCatalogos}/${id}`);
  }

}
