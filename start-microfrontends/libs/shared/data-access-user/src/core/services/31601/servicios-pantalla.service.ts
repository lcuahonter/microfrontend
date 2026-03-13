/* eslint-disable sort-imports */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  JSONResponse,
  RespuestaCatalogos,
} from '../../models/shared/catalogos.model';
import { ENVIRONMENT } from '../../../enviroments/enviroment';
import { catchError, Observable, throwError } from 'rxjs';
import { Personas, Tipos } from '../../models/31601/servicios-pantallas.model';

@Injectable({
  providedIn: 'root',
})
export class ServiciosPantallaService {
  urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(private http: HttpClient) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Obtiene los datos del catálogo para el primer bimestre.
   * @param catalogo - El nombre del catálogo a obtener.
   * @returns Un observable de `RespuestaCatalogos` que contiene los datos del catálogo.
   */
  getBimestreUnoCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/31601/bimestre-catalog-one.json'
    );
  }

  /**
   * Obtiene los datos del catálogo para el segundo bimestre.
   * @param catalogo - El nombre del catálogo a obtener.
   * @returns Un observable de `RespuestaCatalogos` que contiene los datos del catálogo.
   */
  getBimestreDosCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/31601/bimestre-catalog-two.json'
    );
  }

  /**
   * Obtiene los datos del catálogo para el tercer bimestre.
   * @param catalogo - El nombre del catálogo a obtener.
   * @returns Un observable de `RespuestaCatalogos` que contiene los datos del catálogo.
   */
  getBimestreTresCatalogo(_catalogo: string):Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/31601/bimestre-catalog-three.json'
    );
  }
  getTipoCatalog(_catalogo: string):Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/31601/tipo-catalog.json'
    );
  }
  getPersonapara():Observable<Personas[]> {
    return this.http.get<Personas[]>('assets/json/31601/personapara.json');
  }
  getTiposCatalog():Observable<Tipos[]> {
    return this.http.get<Tipos[]>('assets/json/31601/tipo-di-document.json');
  }
  /**
   * @description Función para obtener el trámite
   * @param id
   * @returns JSONResponse
   */
  obtenerTramite(id: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${this.urlServer}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
