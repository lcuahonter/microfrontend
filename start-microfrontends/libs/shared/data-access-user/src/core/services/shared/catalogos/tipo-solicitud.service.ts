import { Observable, catchError, map, throwError } from 'rxjs';
import { CatalogoLista } from '../../../models/shared/tipo-solicitud.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TipoSolicitudService {

  constructor(private http: HttpClient) 
  { }

  /**
   * Obtiene el listado de tipos de documentos 
   * @param catalogo - Nombre del catálogo a obtener.
   * @returns Observable con la lista de respuestas del catálogo.
   */
  getListaTipoSolicitud(): Observable<CatalogoLista> {
    const ENDPOINT = 'assets/json/5701/cat-tipo-solicitud.json';
    return this.http.get<CatalogoLista>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }), 
      catchError(() => {
        const ERROR = new Error(`Ocurrió un error al devolver la información ${ENDPOINT} `); 
        return throwError(() => ERROR);
      })
    );
  }
}
