import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable } from 'rxjs';
import { PROC_260603 } from '../servers/api-route';
import { Tramite260603Query } from '../estados/tramite260603Query.query';
import { Tramite260603State } from '../estados/tramite260603Store.store';

/**
 * @Service AvisoImportacionService
 * @description
 * Servicio encargado de manejar las operaciones relacionadas con el aviso de importación
 * para el trámite 260603, incluyendo la obtención y almacenamiento de datos del trámite.
 */
@Injectable({
  /**
   * @property {string} providedIn
   * @description
   * Indica que el servicio está disponible en el inyector raíz de la aplicación.
   */
  providedIn: 'root'
})
/**
 * @Service AvisoImportacionService
 * @description
 * Servicio encargado de manejar las operaciones relacionadas con el aviso de importación
 * para el trámite 260603, incluyendo la obtención y almacenamiento de datos del trámite.
 */
export class AvisoImportacionService {
  /**
   * @constructor
   * @param {Tramite260603Query} tramite260603Query - Servicio para consultar el estado del trámite 260603.
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes al servidor.
   */
  constructor(
    /**
     * @property {Tramite260603Query} tramite260603Query
     * @description
     * Servicio para consultar el estado del trámite 260603.
     */
    private tramite260603Query: Tramite260603Query,
    /**
     * @property {HttpClient} http
     * @description
     * Cliente HTTP para realizar solicitudes al servidor.
     */
    private http: HttpClient
  ) { }

  /**
   * @property getAllState
   * @description
   * Obtiene todos los datos del estado almacenado en el store.
   * 
   * @returns Observable<Tramite260603State> Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite260603State> {
    return this.tramite260603Query.selectTramiteState$;
  }

  /**
   * Guarda los datos del trámite en el servidor.
   * @param body - Objeto con los datos a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  guardarDatos(body: Record<string, unknown>): Observable<JSONResponse> {
      return this.http.post<JSONResponse>(PROC_260603.GUARDAR, body);
  }
}
