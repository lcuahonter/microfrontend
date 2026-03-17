/* eslint-disable sort-imports */
/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { DatosGenerales, RegistroDeSolicitudesTabla } from '../models/registro-cuentas-bancarias.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroCuentasBancariasService {

  /**
   * URL del servidor utilizado para servicios auxiliares JSON.
   * Esta URL se obtiene de la configuración del entorno.
   */
  urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Un BehaviorSubject que contiene la fuente del componente actual como una cadena.
   * Inicializado con el componente predeterminado 'DatosGenerales'.
   */
  private componentSource = new BehaviorSubject<string>('DatosGenerales'); // Default component

  /**
   * Un observable que emite el estado actual del componente.
   */
  componenteActual = this.componentSource.asObservable();


  /**
   * Construye una instancia de RegistroCuentasBancariasService.
   * 
   * @param http - La instancia de HttpClient utilizada para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) {
    //
   }

  /**
   * Recupera la lista de "Registro de Solicitudes" desde un archivo JSON.
   *
   * @returns {Observable<RegistroDeSolicitudesTabla[]>} Un observable que contiene un array de objetos RegistroDeSolicitudesTabla.
   *
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
   public getSolicitudesTabla():Observable<RegistroDeSolicitudesTabla[]> {
      return this.http.get<RegistroDeSolicitudesTabla[]>('assets/json/6001/registro-de-solicitudes-tabla.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
   }

  /**
   * Obtiene datos del formulario desde un archivo JSON local.
   *
   * Este método envía una solicitud HTTP GET para recuperar datos del archivo JSON especificado.
   * Se espera que los datos sean del tipo `DatosGenerales`.
   *
   * @returns Un `Observable` que emite los datos `DatosGenerales` obtenidos.
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
   public obtenerDatosDeFormularioDeAPI():Observable<DatosGenerales> {
      return this.http.get<DatosGenerales>('assets/json/6001/respuesta-de-la-api.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
   }

     /**
   * @description Función para obtener el trámite
   * @param id
   * @returns JSONResponse
   */
  public obtenerTramite(id: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${this.urlServer}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  /**
   * Cambia el componente actual emitiendo un nuevo valor a la fuente del componente.
   *
   * @param component - El nombre del componente al que se desea cambiar.
   */
  public cambiarComponente(component: string): void {
    this.componentSource.next(component);
  }

  /**
   * Obtiene los datos del tipo de persona desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON que contiene los datos del tipo de persona.
   *
   * @throws {Error} Si hay un error durante la solicitud HTTP.
   */
  public getTipoDePersonaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/6001/tipo-de-persona.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los datos del país donde reside el usuario desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON que contiene los datos del país.
   *
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
  public getPaisDondeRadicaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/6001/pais-donde-radica.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  /**
   * Obtiene los datos de la institución desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite los datos de la institución.
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
  public getInstitucionDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/6001/institucion.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  /**
   * Obtiene los datos del estado desde un archivo JSON.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON que contiene los datos del estado.
   *
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
  public getEstadoDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/6001/estado.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los datos de la tabla de sociedad desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON.
   *
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
  public getSociedadTablaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/6001/sociedad-tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
