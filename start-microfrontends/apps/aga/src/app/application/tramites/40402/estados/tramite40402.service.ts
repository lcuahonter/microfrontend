import { CAATSolicitud } from '../models/transportacion-maritima.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite40402Store } from './tramite40402.store';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Injectable({
  providedIn: 'root',
})
export class Tramite40402Service {
  /**
   * Ruta base para acceder a los archivos JSON locales relacionados con el trámite.
   */
  baseUrl = '../../../../../assets/json/40402/';

  /**
   * Constructor del servicio.
   * @param tramite40402Store - Almacén de estado para gestionar datos relacionados con el trámite.
   * @param http - Cliente HTTP para realizar solicitudes a la API o cargar recursos.
   */
  constructor(
    private tramite40402Store: Tramite40402Store,
    private http: HttpClient
  ) {}

  /**
   * Obtiene el catálogo de tipos de CAAT aéreo desde un archivo JSON local.
   * @returns Un observable que emite una lista de objetos de tipo `Catalogo`.
   */
  getTipoDeCaatAerea(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40402/tipo-CAAT-aéreo.json');
  }

  /**
   * Obtiene el catálogo de códigos de transportación aérea desde un archivo JSON local.
   * @returns Un observable que emite una lista de objetos de tipo `Catalogo`.
   */
  geTideCodTransportacionAerea(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40402/codigo.json');
  }

  /**
   * Busca una solicitud utilizando el valor de `claveFolioCAAT` proporcionado.
   * @param claveFolioCAAT - Clave única del folio CAAT para realizar la búsqueda.
   * @returns Un observable que emite los datos de la solicitud encontrada o un error en caso de fallo.
   */
  buscarSolicitudPorCAATe(claveFolioCAAT: string): Observable<CAATSolicitud> {
    const BASE_URL = `/api/solicitud/buscarPorCAAT?claveFolioCAAT=${claveFolioCAAT}`;
    return this.http.get<CAATSolicitud>(BASE_URL).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
