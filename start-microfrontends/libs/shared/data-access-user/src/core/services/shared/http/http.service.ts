/* eslint-disable class-methods-use-this */
/* eslint-disable no-prototype-builtins */
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable,catchError, filter, map, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { esUndefined } from '../../../utils/utilerias';


interface RequestOptions {
  params?: { [key: string]: any };
  body?: { [key: string]: any };
}

/**
 * This service is used to make http requests & handle the response.
 */
@Injectable({
  providedIn: 'root'
})

export class HttpCoreService {
  /**
   * Constructor de la clase
   * @param http: Constructor de HttpClient
   */
  constructor(private http: HttpClient) {
    
  }
  /**
   * Este método se utiliza para realizar una solicitud POST y manejar la respuesta.
   * @param apiRoute: Ruta del API
   * @param body: Cuerpo de la solicitud
   * @returns respuesta
   * @example post('/save', {name: 'John'})
   */
  post<T>(apiRoute: string, options?: RequestOptions, requiresAuthentication: boolean = true): Observable<T> {
    return this.request<T>('POST', apiRoute, options, requiresAuthentication);
  }
  /**
   * Este método se utiliza para realizar una solicitud GET y manejar la respuesta.
   * @param apiRoute: Ruta del API
   * @returns respuesta
   * @example get('/get')
   * @example get('/get/1')
   */
  get<T>(apiRoute: string, options?: RequestOptions, requiresAuthentication: boolean = true): Observable<T> {
    return this.request<T>('GET', apiRoute, options, requiresAuthentication);
  }
  /**
   * Este método se utiliza para realizar una solicitud PUT y manejar la respuesta.
   * @param apiRoute: Ruta del API
   * @param body: Cuerpo de la solicitud
   * @returns respuesta
   * @example put('/update', {name: 'John'})
   */
  put<T>(endpoint: string, options?: RequestOptions, requiresAuthentication: boolean = true): Observable<T> {
    return this.request<T>('PUT', endpoint, options, requiresAuthentication);
  }
  /**
   * Este método se utiliza para realizar una solicitud DELETE y manejar la respuesta.
   * @param apiRoute: Ruta del API
   * @returns respuesta
   * @example delete('/delete')
   */
  delete<T>(endpoint: string, options?: RequestOptions, requiresAuthentication: boolean = true): Observable<T> {
    return this.request<T>('DELETE', endpoint, options, requiresAuthentication);
  }
  /**
   * Este método se utiliza para obtener los encabezados http.
   * @returns HttpHeaders
   * @example getHttpHeaders()
   * @example getHttpHeaders().set('Content-Type', 'application/json')
   */
  getHttpHeaders(): HttpHeaders {
    const AUTHORIZATION_TOKEN: string = localStorage.getItem('AccessToken') || '';
    const HEADERS: { [key: string]: string } = {
      'x-access-token': AUTHORIZATION_TOKEN,
      'Content-Type': 'application/json'
    };
    let httpHeaders = new HttpHeaders();
    if (HEADERS) {
      for (const KEY in HEADERS) {
        if (HEADERS.hasOwnProperty(KEY)) {
          httpHeaders = httpHeaders.set(KEY, HEADERS[KEY]);
        }
      }
    }
    return httpHeaders;
  }

  /**
   * Este método se utiliza para crear parámetros http.
   * @param params: Parámetros de la solicitud
   * @returns HttpParams
   * @example createParams({name: 'John', age: 30})
   */
  static createParams(params?: { [key: string]: any }): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      for (const KEY in params) {
        if (params.hasOwnProperty(KEY)) {
          httpParams = httpParams.set(KEY, params[KEY]);
        }
      }
    }
    return httpParams;
  }

  /**
   * Este método se utiliza para manejar errores de HTTP.
   * @param error: Error de la respuesta HTTP
   * @returns Observable con el mensaje de error
   */
   handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else if (esUndefined(error.error.data) || error.error.data.length === 0) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error.message;
    }
    return throwError(errorMessage);
  }

  /**
   * Este método se utiliza para reemplazar la información de la ruta.
   * @param route: Ruta a modificar
   * @param pathInfo: Información de la ruta a reemplazar
   * @returns Ruta modificada
   */
  replacePathInfo(route: string, pathInfo?: { [key: string]: any }): string {
    let modifiedRoute = route;
    if (pathInfo) {
      const REPLACEABLE_KEYS = Object.keys(pathInfo);
      for (const KEY of REPLACEABLE_KEYS) {
        const STR = '{' + KEY + '}';
        modifiedRoute = modifiedRoute.replace(STR, pathInfo[KEY]);
      }
    }
    return modifiedRoute;
  }

  /**
   * Este método se utiliza para realizar una solicitud HTTP.
   * @param method: Método HTTP (GET, POST, PUT, DELETE)
   * @param endpoint: Ruta del API
   * @param options: Opciones de la solicitud
   * @param requiresAuthentication: Indica si se requiere autenticación
   * @returns Observable con la respuesta
   */
  request<T>(
    method: string,
    endpoint: string,
    options?: RequestOptions,
    requiresAuthentication?: boolean
  ): Observable<T> {
    const HTTP_OPTIONS = {
      body: options?.body,
      params: HttpCoreService.createParams(options?.params),
      headers: requiresAuthentication ? this.getHttpHeaders() : undefined
    };

    const REQ = new HttpRequest(
      method,
      endpoint,
      HTTP_OPTIONS.body !== undefined ? HTTP_OPTIONS.body : null,
      {
        headers: HTTP_OPTIONS.headers,
        params: HTTP_OPTIONS.params,
      }
    );

    return this.http.request<T>(REQ).pipe(
      filter(
        (event): event is HttpResponse<T> => event instanceof HttpResponse
      ),
      map((response: HttpResponse<T>) => response.body as T),
      catchError(this.handleError)
    );
  }

}