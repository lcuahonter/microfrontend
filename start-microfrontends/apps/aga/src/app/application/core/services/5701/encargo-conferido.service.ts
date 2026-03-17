import {
  BodyValidarEncargoConferido,
  EncargoConferidoResponse,
} from '../../models/5701/encargo-conferido.models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncargoConferidoService {
  /**
   * URL base para las peticiones del servicio de encargo conferido.
   */
  private readonly host: string;

  /**
   * Constructor del servicio EncargoConferidoService.
   */
  constructor(private http: HttpClient) {
    this.host = 'assets/json/5701/';
  }

  /**
   * Método para verificar si el RFC tiene un encargo conferido.
   * @returns Observable<boolean> Respuesta del servicio indicando si hay encargo conferido.
   */
  getEncargoConferido(
    body: BodyValidarEncargoConferido
  ): Observable<EncargoConferidoResponse> {
    const ENDPOINT = 'assets/json/5701/encargo-conferido.json';
    return this.http.get<EncargoConferidoResponse>(ENDPOINT).pipe(
      map((response) => response),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }
}
