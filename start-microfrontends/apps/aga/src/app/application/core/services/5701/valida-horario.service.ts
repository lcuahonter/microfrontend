import { BodyValidaHorario, ValidaHorario } from '../../models/5701/ValidaHorario.model';
import { Observable, catchError, throwError } from 'rxjs';
import { API_VALIDA_HORARIO } from '../../../constantes/5701/api-constants';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidaHorarioService {

  private readonly host: string;

  constructor(
    private http: HttpClient
  ) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Este servicio se utiliza para verificar si un horario específico es válido
   * para una operación de comercio exterior en una aduana y sección específicas.
   * 
   * Devuelve un false si el horario es válido y un true si no lo es.
   *
   * @param {bodyValidaHorario}.
   * @returns Observable {ValidaHOrario}.
   */
  postValidaHorario(bodyValidaHorario: BodyValidaHorario): Observable<ValidaHorario> {
    const ENDPOINT = `${this.host}` + API_VALIDA_HORARIO;

    return this.http.post<ValidaHorario>(ENDPOINT, bodyValidaHorario).pipe(
      catchError(() => {
        const ERROR = new Error(`Ocurrió un error al devolver la información ${ENDPOINT} `);
        return throwError(() => ERROR);
      })
    );
  }
}
