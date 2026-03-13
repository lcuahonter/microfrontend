/* eslint-disable no-empty-function */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista para el select de punto de inspección.
   * @returns {Observable<RespuestaCatalogos>}
   */
  obtenerPuntoInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('/assets/json/220701/punto.json');
  }

  /**
   * Obtiene la lista para el select de sanidad agropecuaria.
   * @returns {Observable<RespuestaCatalogos>}
   */
  obtenerSanidadAgropecuaria(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('/assets/json/220701/oficina_de_inspeccion.json');
  }

  /**
   * Obtiene la lista para el select de aduana de ingreso.
   * @returns {Observable<RespuestaCatalogos>}
   */
  obtenerAduanaDeIngreso(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('/assets/json/220701/aduana_de_ingreso.json');
  }

  /**
   * Obtiene la lista para el select de establecimiento.
   * @returns {Observable<RespuestaCatalogos>}
   */
  obtenerEstablecimiento(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('/assets/json/220701/establecimiento.json');
  }

  /**
   * Obtiene la lista para el select de veterinario.
   * @returns {Observable<RespuestaCatalogos>}
   */
  obtenerVeterinario(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('/assets/json/220701/nombre.json');
  }

  /**
   * Obtiene la lista para el select de régimen.
   * @returns {Observable<RespuestaCatalogos>}
   */
  obtenerRegimen(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('/assets/json/220701/regimen.json');
  }
}
