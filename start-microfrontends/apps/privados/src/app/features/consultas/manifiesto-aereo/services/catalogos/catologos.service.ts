import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Custom,
  CustomResponse,
  StatusDocumentResponse,
} from '../../interfaces/catalogos.interface';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatologosService {
  private baseUrl = 'https://catalogos-frontend.v30.ultrasist.net/api/v1/catalogos-frontend';
  private http = inject(HttpClient);

  getAduanas(): Observable<Custom[]> {
    return this.http.get<CustomResponse>(`${this.baseUrl}/aduanas`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener aduanas'));
      }),
    );
  }

  getEstadoDocumentos() {
    return this.http.get<StatusDocumentResponse>(`${this.baseUrl}/estado-documentos`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener estados de documentos'));
      }),
    );
  }
}
