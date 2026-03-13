import { API_MODIFICAR_PARTIDAS, API_TESTAR_PARTIDAS, API_UPDATE_PARTIDAS } from '../../core/server/api-router';
import { Observable, map } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModificarPartidasModelo } from '../models/modificar-partidas.model';

@Injectable({
  providedIn: 'root',
})
export class ModificarPartidasService {
  /**
   * URL del servidor donde se encuentra la API.
   */
  host: string;

  /**
   * Constructor del servicio IniciarService.
   * @param http - Cliente HTTP para realizar solicitudes al servidor.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }


  getModificarPartidasPex(tramite: number, solicitudId: string): Observable<ModificarPartidasModelo[]> {
    const ENDPOINT = `${this.host}${API_MODIFICAR_PARTIDAS(tramite, solicitudId)}`;
    return this.http
      .get<BaseResponse<ModificarPartidasModelo[]>>(ENDPOINT)
      .pipe(
        map(response => {
          if (response.codigo === '00') {
            return response.datos ?? [];
          }
          return [];
        })
      );
  }

  getTestarPartidasPex(tramite: number, solicitudId: number, idPartidaSol: number): Observable<ModificarPartidasModelo[]> {
    const ENDPOINT = `${this.host}${API_TESTAR_PARTIDAS(tramite)}`;
    const BODY = {
      idSolicitud: solicitudId,
      idPartidaSol: idPartidaSol
    }
    return this.http.post<BaseResponse<ModificarPartidasModelo[]>>(ENDPOINT, BODY)
      .pipe(
        map(response => {
          if (response.codigo === '00') {
            return response.datos ?? [];
          }
          return [];
        })
      );
  }

  setModificarPartidasPex(tramite: number, solicitudId: number, idPartidaSol: number, unidadesAutorizadas: number, descripcionAutorizada: string): Observable<ModificarPartidasModelo[]> {
    const ENDPOINT = `${this.host}${API_UPDATE_PARTIDAS(tramite)}`;
    const BODY = {
      idSolicitud: solicitudId,
      idPartidaSol: idPartidaSol,
      unidadesAutorizadas: unidadesAutorizadas,
      descripcionAutorizada: descripcionAutorizada
    }
    return this.http.post<BaseResponse<ModificarPartidasModelo[]>>(ENDPOINT, BODY)
      .pipe(
        map(response => {
          if (response.codigo === '00') {
            return response.datos ?? [];
          }
          return [];
        })
      );
  }



}
