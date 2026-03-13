import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map} from 'rxjs';
import { throwError, catchError } from 'rxjs';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';
import { Solicitud32502State } from '../../../estados/tramites/tramite32502.store';
import { Tramite32502Store } from '../../../estados/tramites/tramite32502.store';
import {
  CATALOGO_FRACCIONES_ARANCELARIAS,
  API_FRACCION_REGLA,
  API_TRAMITE_DECLARACION,
  CATALOGO_ADUANAS_ACTIVAS
} from '../../../core/server/api-router';

import { CATALOGO_ENTIDADES_FEDERATIVAS,
  CATALOGO_MUNICIPIOS_DELEGACIONES, CATALOGO_COLONIAS  } from '@libs/shared/data-access-user/src';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { JsonResponseCatalogo, GUARDAR_SOLICITUD } from '@libs/shared/data-access-user/src';
import { GuardaSolicitud32502Request } from '../../../core/models/32502/solicitud-request.model'
import { GuardaSolicitud32502Response } from '../../../core/models/32502/solicitud-response.model'
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio para obtener catálogos utilizados en el trámite 32502.
 */
export class AvisoService {

  /** URL base host api */
  private readonly host: string;

  /** Identificador del trámite */
  tramite: string;

  /**
   * Constructor del servicio AvisoService.
   * 
   * @param http - Cliente HTTP para realizar peticiones
   */
  constructor(
    private http: HttpClient, public tramite32502Store: Tramite32502Store,
  ) {
    // Constructor del servicio AvisoService
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
    this.tramite = '32502';
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias.
   *
   * @returns Observable con la respuesta del catálogo de fracción arancelaria
   */
  getFraccionArancelariaCatalogo(): Observable<JsonResponseCatalogo> {
    
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
   * Obtiene el catálogo de reglas asociadas a fracciones arancelarias.
   * @returns Observable con la respuesta del catálogo de reglas
   */
  getFraccionReglaCatalogo(): Observable<JsonResponseCatalogo> {

    const ENDPOINT = `${this.host}` + API_FRACCION_REGLA(this.tramite);
  
      return this.http.get<JsonResponseCatalogo>(ENDPOINT)
        .pipe(
          map((response) => {
            return response;
          }),
          catchError(() => {
            const ERROR = new Error(
              `Ocurrió un error al devolver la información del reglas de fraccion`
            );
            return throwError(() => ERROR);
          })
        );
  }

  /**
   * Obtiene el catálogo de declaraciones del trámite.
   * @returns Observable con la respuesta del catálogo de declaraciones
   */
  getDeclaracionTramite(): Observable<JsonResponseCatalogo> {

    const ENDPOINT = `${this.host}` + API_TRAMITE_DECLARACION(this.tramite);
  
      return this.http.get<JsonResponseCatalogo>(ENDPOINT)
        .pipe(
          map((response) => {
            return response;
          }),
          catchError(() => {
            const ERROR = new Error(
              `Ocurrió un error al devolver la información de las declaraciones`
            );
            return throwError(() => ERROR);
          })
        );
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
   * Guarda la solicitud para generar folio.
   * @returns Observable con los datos del folio generado.
   */
  postGuardarSolicitud(solicitudRequest: GuardaSolicitud32502Request): Observable<BaseResponse<GuardaSolicitud32502Response>> {
console.log('**** GUARDANDO ..');

console.log(solicitudRequest);
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
          this.tramite32502Store.establecerDatos({ idSolicitud: response.datos?.id_solicitud });
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
   * Obtiene el catálogo de tipos de documento.
   *
   * @param _catalogo - Parámetro no utilizado (por compatibilidad futura)
   * @returns Observable con la respuesta del catálogo de tipo de documento
   */
  getTipoDocumento(_catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/32502/tipoDocumento.json');
  }

    /**
     * Obtiene los datos del estado de la solicitud desde un archivo JSON.
     * @returns Observable con el estado de la solicitud.
     */
    obtenerDatosEstado(): Observable<Solicitud32502State> {
      return this.http.get<Solicitud32502State>('assets/json/32502/datos.json');
    }
    /**
     * Establece los datos del estado de la solicitud en el store.
     * @param datos Datos del estado de la solicitud.
     */
    establecerDatosEstado(datos: Solicitud32502State): void {
      this.tramite32502Store.establecerDatos({ ...datos });
    }

}
