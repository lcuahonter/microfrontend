import { AvisoCatalogo } from '../models/aviso-catalogo.model';
import { AvisoOpcionesDeRadio } from '../models/aviso-catalogo.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput } from 'rxjs';
import { OperacionDeImportacion, JsonResponseString } from '../models/aviso-catalogo.model';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { map } from 'rxjs';

import { Solicitud32501State, Solicitud32501Store } from '../estados/solicitud32501.store';
import { GuardaSolicitud32501Request } from '../models/solicitud-request.model'
import { GuardaSolicitud32501Response } from '../models/solicitud-response.model'
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import {
  CATALOGO_FRACCIONES_ARANCELARIAS,
  CATALOGO_COLONIAS,
  CATALOGO_ADUANAS_ACTIVAS, API_ESTATUS_TRAMITE
} from '../../../core/server/api-router';

import { CATALOGO_ENTIDADES_FEDERATIVAS, CATALOGO_MUNICIPIOS_DELEGACIONES, GUARDAR_SOLICITUD, JsonResponseCatalogo } from '@libs/shared/data-access-user/src';

/**
 * Servicio para gestionar la obtención de datos relacionados con
 * el aviso del catálogo, la operación de importación y los requisitos obligatorios.
 */
@Injectable({
  providedIn: 'root',
})
export class MercanciasDesmontadasOSinMontarService {
  /** URL base host api */
  private readonly host: string;

  tramite: string;

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar peticiones a archivos JSON.
   */
  constructor(private http: HttpClient, private tramite32501Store: Solicitud32501Store) {
    // El constructor está intencionalmente vacío para la inyección de dependencias
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
    this.tramite = '32501';
  }

  /**
   * Obtiene las fracciones arancelarias activas.
   * @returns Observable con los datos del catálogo.
   */
  obtenerFraccionesArancelarias(): Observable<JsonResponseCatalogo> {

    const ENDPOINT = `${this.host}` + CATALOGO_FRACCIONES_ARANCELARIAS(this.tramite);

    return this.http.get<JsonResponseCatalogo>(ENDPOINT)
      .pipe(
        map((response) => {
          response.datos.forEach(datoFA => {
            datoFA.clave = datoFA.clave;
            datoFA.descripcion = datoFA.clave + ' - ' + datoFA.descripcion;
          });
          return response;
        }),
        catchError(() => {
          const ERROR = new Error(
            `Ocurrió un error al devolver la información del catalogo Fracciones Arancelarias`
          );
          return throwError(() => ERROR);
        })
      );
  }

  /**
   * Obtiene las Entidades Federativas.
   * @returns Observable con los datos del catálogo.
   */
  obtenerEntidadesFederativas(): Observable<JsonResponseCatalogo> {

    const ENDPOINT = `${this.host}` + CATALOGO_ENTIDADES_FEDERATIVAS(this.tramite);

    return this.http.get<JsonResponseCatalogo>(ENDPOINT)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(() => {
          const ERROR = new Error(
            `Ocurrió un error al devolver la información del catalogo Entidades Federativas`
          );
          return throwError(() => ERROR);
        })
      );
  }

  /**
   * Obtiene los municipios por clave de entidad federativa.
   * @returns Observable con los datos del catálogo.
   */
  obtenerMunicipios(clave: string): Observable<JsonResponseCatalogo> {

    const ENDPOINT = `${this.host}` + CATALOGO_MUNICIPIOS_DELEGACIONES(this.tramite, clave);

    return this.http.get<JsonResponseCatalogo>(ENDPOINT)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(() => {
          const ERROR = new Error(
            `Ocurrió un error al devolver la información del catalogo de Municipios`
          );
          return throwError(() => ERROR);
        })
      );
  }

  /**
   * Obtiene las colonias por clave de municipio.
   * @returns Observable con los datos del catálogo.
   */
  obtenerColonias(clave: string): Observable<JsonResponseCatalogo> {

    const ENDPOINT = `${this.host}` + CATALOGO_COLONIAS(this.tramite, clave);

    return this.http.get<JsonResponseCatalogo>(ENDPOINT)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(() => {
          const ERROR = new Error(
            `Ocurrió un error al devolver la información del catalogo Colonias`
          );
          return throwError(() => ERROR);
        })
      );
  }

   /**
   * Guarda la solicitud para generar folio.
   * @returns Observable con los datos del folio generado.
   */
  postGuardarSolicitud(solicitudRequest: GuardaSolicitud32501Request): Observable<BaseResponse<GuardaSolicitud32501Response>> {
     
    const ENDPOINT = `${this.host}` + GUARDAR_SOLICITUD(this.tramite);
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http
      .post<any>(ENDPOINT, solicitudRequest, httpOptions)
      .pipe(
        map((response) => {
          this.tramite32501Store.establecerDatos({ idSolicitud: response.datos?.id_solicitud });
          return response;
        }),
        catchError((httpError) => {
          if (httpError instanceof HttpErrorResponse) {
            return throwError(() => ({
              success: false,
              error: httpError.error,
            }));
          }
          const ERROR = new Error(
            `Ocurrió un error al guardar la información ${ENDPOINT} `
          );
          return throwError(() => ERROR);
        })
      );
  }

  /**
   * Obtiene los datos de las opciones de radio desde un archivo JSON.
   * @return Observable con los datos de las opciones de radio.
   * 
   */
  obtenerAvisoOpcionesDeRadio(): Observable<AvisoOpcionesDeRadio> {
    return this.http
      .get<AvisoOpcionesDeRadio>(
        'assets/json/32501/aviso-opciones-de-radio.json'
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Establece los datos del estado de la solicitud en el store.
   * @param datos Datos del estado de la solicitud.
   */
  establecerDatosEstado(datos: Solicitud32501State): void {
    this.tramite32501Store.establecerDatos({ ...datos });
  }

  /**
   * Obtiene las aduanas activas.
   * @returns Observable con los datos del catálogo.
   */
  obtenerAduanas(): Observable<JsonResponseCatalogo> {

    const ENDPOINT = `${this.host}` + CATALOGO_ADUANAS_ACTIVAS(this.tramite);

    return this.http.get<JsonResponseCatalogo>(ENDPOINT)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(() => {
          const ERROR = new Error(
            `Ocurrió un error al devolver la información del catalogo Aduanas`
          );
          return throwError(() => ERROR);
        })
      );
  }

  /**
   * Obtiene estatus tramite.
   * @returns Observable con los datos del estatus.
   */
  estatusTramiteMontaje(numTramite: string): ObservableInput<any> {

    const ENDPOINT = `${this.host}` + API_ESTATUS_TRAMITE(this.tramite, numTramite);

    return this.http.get<JsonResponseString>(ENDPOINT)
      .pipe(
        map((response) => {
          return response.datos;
        }),
        catchError(() => {
          const ERROR = new Error(
            `Ocurrió un error al devolver la información de la consulta de estatus`
          );
          return throwError(() => ERROR);
        })
      );
  }
}
