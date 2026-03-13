import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CatalogosResponse, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';

import { API_GET_BLOQUE_PAISES, 
  API_GET_CLASIFICACION_REGIMEN, 
  API_GET_ENTIDADES_FEDERATIVAS, 
  API_GET_FRACCION_ARANCELARIA, 
  API_GET_FRACCION_SUBDIVISIONES, 
  API_GET_PAISES_BLOQUE, 
  API_GET_REGIMENES, 
  API_GET_UNIDADES_ADMINISTRATIVAS, 
  API_GET_UNIDADES_MEDIDA,
  API_GET_OCTAVA_TEMPORAL, 
  API_GET_INICIAR_NOTIFICACION,
  API_GET_TIGIE,
  API_POST_GUARDAR_SOLICITUD,
  API_GET_FRACCIONES_DIVISIONES} from '../server/api-router';
import { CatalogosBloquesResponse } from '../models/octava-temporal.model';
import { IniciarNotificacionResponse } from '../models/response/notificaciones-response.model';
import { CatalogosTigiesResponse } from '../models/response/catalogos-response.model';
import { ReglaOctacaResponse } from '../models/response/regla-octava-response.model';
import { SaveReglaOctavaRequest } from '../models/request/regla-octava-request.model';

@Injectable({
  providedIn: 'root'
})
export class CatOctavaTemporalService {

  /**
   * URL base del servidor 
    */
  private readonly host: string;

  /**
   * Constructor del servicio que inicializa la URL base del host.
   * @param http Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Obtiene los regímenes.
   * @returns Observable con la respuesta del servidor.
   */
  getRegimenes(): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}${API_GET_REGIMENES}`;

    return this.http.get<CatalogosResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene las clasificaciones de los regímenes.
   * @param cveRegimen Clave del régimen para filtrar las clasificaciones.
   * @returns 
   */
  getClasificacionRegimenes(cveRegimen?: string): Observable<CatalogosResponse> {
    const ENDPOINT = cveRegimen ? `${this.host}` + API_GET_CLASIFICACION_REGIMEN(cveRegimen) : `${this.host}${API_GET_CLASIFICACION_REGIMEN('')}`; 
    return this.http.get<CatalogosResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;      
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene las unidades de medida asociadas a una fracción arancelaria específica.
   * @param cveFraccion Clave de la fracción arancelaria.
   * @returns 
   */
  getUnidadesMedida(cveFraccion: string): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}` + API_GET_UNIDADES_MEDIDA(cveFraccion);
    return this.http.get<CatalogosResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;  
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }   


  /*
    * Obtiene los países por bloque.  
    * @returns Observable con la respuesta del servidor.
  */
  getPaisesBloque(): Observable<CatalogosBloquesResponse> {
    const ENDPOINT = `${this.host}${API_GET_BLOQUE_PAISES}`;
    return this.http.get<CatalogosBloquesResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }

  getPaisesBloqueEsp (cveTratado: string): Observable<CatalogosBloquesResponse> {
    const ENDPOINT = `${this.host}${API_GET_PAISES_BLOQUE(cveTratado)}`;
    return this.http.get<CatalogosBloquesResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }), 
      catchError(() => {
        const ERROR = new Error(    
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );  
  } 

  /*
    * Obtiene las entidades federativas.    
    * @returns Observable con la respuesta del servidor.
  */  

  getEntidadesFederativas(): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}${API_GET_ENTIDADES_FEDERATIVAS}`;
    return this.http.get<CatalogosResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );  
  }

  /**
   * Obtiene las unidades administrativas basadas en la entidad seleccionada.
   * @param cveEntidad Clave de la entidad para obtener las unidades administrativas.
   * @returns 
   */

  getUnidadesAdministrativas(cveEntidad: string): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}` + API_GET_UNIDADES_ADMINISTRATIVAS(cveEntidad); 
    return this.http.get<CatalogosResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;      
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }


  /**
   * Obtiene las fracciones arancelarias.
   * @returns Observable con la respuesta del servidor.
   * 
   */

  getFraccionArancelaria(): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}${API_GET_FRACCION_ARANCELARIA}`;
    return this.http.get<CatalogosResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );    
  }

  /**
   * Obtiene las subdivisiones de una fracción arancelaria específica.
   * @param cveFraccion Clave de la fracción arancelaria para obtener las subdivisiones correspondientes.
   * @returns 
   */
  getDivisionesFraccionArancelaria(): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}` + API_GET_FRACCIONES_DIVISIONES;
    return this.http.get<CatalogosResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );    
  }

  /**
   * Obtiene las reglas de octava temporal basadas en el esquema proporcionado.
   * @param cveEsquema Clave del esquema para obtener las reglas de octava temporal.
   * @returns 
   */
  getEsquemaReglaOctava(cveFraccion: string, cveRegimen: string, cveClasificacion: string): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}` +  API_GET_OCTAVA_TEMPORAL(cveFraccion, cveRegimen, cveClasificacion);
    return this.http.get<CatalogosResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;        
      }),
      catchError(() => {    
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );    
  } 


  /**
   * Método para iniciar una notificación basada en el número de folio del trámite.
   * @param numFolioTramite Número de folio del trámite para iniciar la notificación.
   * @returns 
   */

  getIniciarNotificacion(numFolioTramite: string): Observable<any> {
    const ENDPOINT = `${this.host}` +  API_GET_INICIAR_NOTIFICACION(numFolioTramite); 
    return this.http.get<IniciarNotificacionResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;        
      }       
      ),
      catchError(() => {    
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );  
  }

  /**
   * Obtiene los datos relacionados con una fracción arancelaria específica del TIGIE.
   * @param cveFraccion Clave de la fracción para obtener los datos relacionados con TIGIE.
   * @returns 
   */

  getTigieFraccion(cveFraccion: string): Observable<CatalogosTigiesResponse> {
    const ENDPOINT = `${this.host}` + API_GET_TIGIE(cveFraccion);
    return this.http.get<CatalogosTigiesResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;      
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    ); 
  } 

  /**
   * Guarda los datos de la solicitud de regla de octava temporal.
   * @param dataRequest Datos de la solicitud a guardar.
   * @returns 
   */
  saveDataRequest(dataRequest:SaveReglaOctavaRequest): Observable<ReglaOctacaResponse> {
    const ENDPOINT = `${this.host}` + API_POST_GUARDAR_SOLICITUD;
    return this.http.post<ReglaOctacaResponse>(ENDPOINT, dataRequest).pipe(
      map((response) => {
        return response;      
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );

  }

}
