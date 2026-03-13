import { DatosGeneralesDelTramite } from '../models/datos-generales-del-tramite.model';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TramiteService {
  constructor(private http: HttpClient) {
  }
/**
 * Servisio para obtener los datos generales del tramite
 * @param numeroDeTramite 
 * @returns 
 */
  obtenerDatosTramite(numeroDeTramite: string): Observable<DatosGeneralesDelTramite> {
    let params = new HttpParams();
    params = params.set('numeroDeTramite', numeroDeTramite);
    return this.http.get<DatosGeneralesDelTramite>(`/assets/json/funcionario/datos-tramite.json`, { params }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}