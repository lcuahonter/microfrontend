import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

import { ENVIRONMENT } from '../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class SubirDocumentoService {
  private urlServer = ENVIRONMENT.URL_SERVER_UPLOAD;

  constructor(private http: HttpClient) {
    // Lógica de inicialización si es necesario
  }

  subirDocumento(token: string, file: File): Observable<{ message: string }> {
    const HEADERS = new HttpHeaders({
      jwt: `${token}`,
      idUser: 1,
    });

    const FORM_DATA = new FormData();
    FORM_DATA.append('file', file, file.name);

    return this.http.put<{ message: string }>(this.urlServer, FORM_DATA, {
      headers: HEADERS
    });
  }

    /**
   * @description Función para generar el pdf  del acuse
   * @param id
   * @returns JSONResponse
   */
    generarAcuse(cuerpoAcuse: unknown): Observable<unknown> {
      return this.http
        .put<unknown>(`${this.urlServer}/create-pdf`, cuerpoAcuse)
        .pipe(
          catchError((error) => {
            return throwError(() => error);
          })
        );
    }
}
