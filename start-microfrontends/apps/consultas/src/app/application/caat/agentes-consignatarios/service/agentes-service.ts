import { API_POST_FILTRAR_AGENTES } from './api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { BodyTerrestre } from '../../terrestre/service/model/resquest/body-request';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

/**
*  Servicio para la consulta de CAAT agentes consignatarios.
*  Proporciona métodos para recuperar y filtrar registros.
*  Actualmente utiliza datos dummy para fines de simulación.
 * @class A
 * @injectable
 */

/**
 * Recupera registros paginados
*  Devuelve una BaseResponse que contiene los resultados filtrados con información de paginación.
 * 
 * @template 
 * @param {number} pag - El número de página a recuperar (1-indexado)
 * @param {number} itemsPerPage - El número de elementos a mostrar por página
 * @param {FiltrosAgentesRequest} body - Los criterios de filtrado para la búsqueda
 * @returns {Observable<BaseResponse<T>>} - contiene los resultados de búsqueda paginados

/**
 * Simula una respuesta de API con datos dummy
 * Genera registros simulados según el número de página solicitado y los elementos por página.
 * 
 * @param {number} pag - l número de página a recuperar (1-indexado)
 * @param {number} itemsPerPage - Numero de elementos por pagina
 * @returns {BaseResponse<BusquedaAgentesResponse>} Una respuesta de servidor simulada que contiene registros dummy
 */
@Injectable({
  providedIn: 'root'
})
export class AgentesService {

  /**
   * Es la URL base del servidor API, obtenida de la configuración del entorno de la aplicación.
   * Se utiliza como punto final raíz para todas las solicitudes de API de servicios de aereos
   * @type {string}
   */
  urlServer = ENVIRONMENT.API_HOST;

   constructor(private http: HttpClient) {
      this.host = `${ENVIRONMENT.API_HOST}/api/`;
    }
  
    private readonly host: string;
  

   getRegistrosByFiltros<T>(pag: number, elementosPagina: number, body: BodyTerrestre): Observable<BaseResponse<T>> {
      const ENDPOINT = API_POST_FILTRAR_AGENTES(pag, elementosPagina);
      return this.http.post<BaseResponse<T>>(`${this.host}${ENDPOINT}`, body);
    }
  
  

}