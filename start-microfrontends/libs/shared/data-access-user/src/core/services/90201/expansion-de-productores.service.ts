import { JSONResponse, RespuestaCatalogos } from '../../models/shared/catalogos.model';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ENVIRONMENT } from '../../../enviroments/enviroment';

/**
 * Servicio para gestionar la expansión de productores en el trámite 90201.
 *
 * Este servicio proporciona métodos para obtener catálogos, datos de expansión de productores
 * y detalles de trámites, utilizando archivos JSON locales y servicios auxiliares.
 *
 * @remarks
 * - Utiliza la URL base definida en la variable de entorno `URL_SERVER_JSON_AUXILIAR`.
 * - Proporciona métodos para interactuar con archivos JSON locales y servicios HTTP externos.
 *
 * @example
 * ```typescript
 * constructor(private expansionService: ExpansionDeProductoresService) {}
 * ```
 */
@Injectable({
  providedIn: 'root'
})

/**
 * Este servicio se utiliza para almacenar los datos del formulario del trámite 90201.
 */

export class ExpansionDeProductoresService {

  urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;
   /**
  * constructor de la clase
  * @param http: constructor de HttpClient
  */
  constructor(private http: HttpClient) {
    // Lógica de inicialización si es necesario {
    // Lógica de inicialización si es necesario
   }


  /**
   * Obtiene el catálogo de sectores desde un archivo JSON local.
   *
   * @returns Un observable que emite la respuesta del catálogo de sectores.
   */
  getSectorCatalog(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/90201/sector.json');
  }

    /**
   * @description Función para obtener el trámite
   * @param id
   * @returns JSONResponse
   */
    obtenerTramite(id: number): Observable<JSONResponse> {
      return this.http.get<JSONResponse>(`${this.urlServer}/${id}`).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Obtiene los datos de expansión de productores desde un archivo JSON local.
     *
     * @returns Un observable que emite los datos obtenidos del archivo 'assets/json/90201/informica.json'.
     */
    getRegistroExpansionDeProductoresData(): Observable<{actividadProductiva:string,representacionFederal:string ,rfc:string,fraccion:string,sector:string}> {
    return this.http.get<{actividadProductiva:string,representacionFederal:string ,rfc:string,fraccion:string,sector:string}>('assets/json/90201/informica.json');
  }

}
