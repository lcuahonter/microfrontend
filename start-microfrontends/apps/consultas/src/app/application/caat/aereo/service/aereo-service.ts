import {
  BusquedaAereoResponse,
  DatosAereoResponse, PaginacionResponse
} from './model/response/busqueda-response';
import { Observable, of } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
*  Servicio para la consulta de CAAT aereos
*  Proporciona métodos para recuperar y filtrar registros.
*  Actualmente utiliza datos dummy para fines de simulación.
 * @class AereoService
 * @injectable
 */

/**
 * Recupera registros paginados
*  Devuelve una BaseResponse que contiene los resultados filtrados con información de paginación.
 * 
 * @template 
 * @param {number} pag - El número de página a recuperar (1-indexado)
 * @param {number} itemsPerPage - El número de elementos a mostrar por página
 * @param {FiltrosAereoRequest} body - Los criterios de filtrado para la búsqueda
 * @returns {Observable<BaseResponse<T>>} - contiene los resultados de búsqueda paginados

/**
 * Simula una respuesta de API con datos dummy
 * Genera registros simulados según el número de página solicitado y los elementos por página.
 * 
 * @param {number} pag - l número de página a recuperar (1-indexado)
 * @param {number} itemsPerPage - Numero de elementos por pagina
 * @returns {BaseResponse<BusquedaAereoResponse>} Una respuesta de servidor simulada que contiene registros dummy
 */
@Injectable({
  providedIn: 'root'
})
export class AereoService {

/**
 * URL del servidor API
 */
  urlServer = ENVIRONMENT.API_HOST;

  constructor(private http: HttpClient) {
  }
  getRegistrosByFiltros<T>(pag: number, itemsPerPage: number): Observable<BaseResponse<T>> {
    return of(this.dummyFiltros(pag, itemsPerPage) as unknown as BaseResponse<T>);
  }

  /**
   * Genera datos dummy para simular la respuesta de los filtros, cuando se tenga el servicio se debera de quitar.
   * @returns Retorna la respuesta del servidor simulando la respuesta
   */
  dummyFiltros(pag: number, itemsPerPage: number): BaseResponse<BusquedaAereoResponse> {
    const REGISTROS: DatosAereoResponse[] = [];

    const TAM_PAG = itemsPerPage;
    const BASE_INDEX = (pag - 1) * TAM_PAG;

    for (let i = 0; i < TAM_PAG; i++) {
      const INDEX = BASE_INDEX + i + 1;
      REGISTROS.push({
        denominacion: `Empresa ${String.fromCharCode(64 + INDEX)}`,
        rfc: `RFC${String(INDEX).padStart(9, '0')}`,
        caat: `CAAT${String(INDEX).padStart(3, '0')}`,
        perfil_caat: `Perfil${INDEX}`,
        fecha_inicial: new Date(2020 + (INDEX % 5), (INDEX % 12), (INDEX % 28) + 1),
        fecha_final: new Date(2021 + (INDEX % 5), (INDEX % 12), (INDEX % 28) + 1),
        director_general: `Director ${INDEX}`
      });

    }

    const TOTAL_ELEMENTOS = 100;
    const TOTAL_PAGINAS = Math.ceil(TOTAL_ELEMENTOS / TAM_PAG);
    const PAGINACION: PaginacionResponse = {
      num_pag: pag,
      tam_pag: TAM_PAG,
      total_elementos: TOTAL_ELEMENTOS,
      total_paginas: TOTAL_PAGINAS,
      es_ultima_pag: pag >= TOTAL_PAGINAS
    };

    const DATOS: BusquedaAereoResponse = {
      registros: REGISTROS,
      paginacion: PAGINACION
    };

    return {
      codigo: '00',
      mensaje: 'Operacion exitosa.',
      path: '/api/consultas/maritimo',
      timestamp: new Date().toISOString(),
      datos: DATOS
    };
  }

}