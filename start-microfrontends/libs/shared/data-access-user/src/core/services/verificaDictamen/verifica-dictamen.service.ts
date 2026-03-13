import { VerificarDictamenModel } from '../../models/shared/verificar-dictamen.models';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VerificaDictamenService {
    constructor(private http: HttpClient) {
    }
/**
 * Servicio para obtener los datos generales del trámite.
 * @param numeroDeTramite 
 * @returns 
 */
obtenerDictamen(numeroDeTramite: string): Observable<VerificarDictamenModel> {
let params = new HttpParams();
    params = params.set('numeroDeTramite', numeroDeTramite);
        return this.http.get<VerificarDictamenModel>(`/assets/json/shared/datos-verificar-dictamen.json`, { params }).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }
}